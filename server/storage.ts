import fs from "fs";
import path from "path";
import zlib from "zlib";
import { parse } from "csv-parse";
import type {
  Facility,
  FacilitySearchParams,
  FacilitySearchResult,
} from "@shared/types";

export interface IStorage {
  searchFacilities(params: FacilitySearchParams): Promise<FacilitySearchResult>;
  getFacilityById(id: number): Promise<Facility | undefined>;
}

type DirectoryType = "mental" | "substance";

type FacilityRow = {
  facility_id: string;
  directory_type: string;
  name1: string;
  name2: string;
  street1: string;
  street2: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  intake1: string;
  intake2: string;
  intake1a: string;
  intake2a: string;
  service_code_info: string;
};

type ServiceRow = {
  facility_id: string;
  directory_type: string;
  code: string;
  value: string;
};

function cleanStr(v: unknown): string {
  if (v === null || v === undefined) return "";
  const s = String(v).trim();
  // Common BOM issue in some exports: "\ufeffname1" etc.
  return s.replace(/^\uFEFF/, "");
}

function toNull(v: unknown): string | null {
  const s = cleanStr(v);
  return s.length ? s : null;
}

class CsvStorage implements IStorage {
  private loadPromise: Promise<void> | null = null;

  private facilities: Facility[] = [];
  private facilityById = new Map<number, Facility>();
  private directoryById = new Map<number, DirectoryType>();

  // Precomputed lowercased fields for fast searching
  private nameLowerById = new Map<number, string>();
  private cityLowerById = new Map<number, string>();

  // String interning to reduce memory for repeated codes
  private codePool = new Map<string, string>();

  private dataDir = path.join(process.cwd(), "server", "data");

  private ensureLoaded(): Promise<void> {
    if (!this.loadPromise) this.loadPromise = this.load();
    return this.loadPromise;
  }

  private async load(): Promise<void> {
    const facilitiesPath = path.join(this.dataDir, "facilities.csv.gz");
    const servicesPath = path.join(this.dataDir, "facility_services.csv.gz");

    if (!fs.existsSync(facilitiesPath) || !fs.existsSync(servicesPath)) {
      throw new Error(
        `CSV data files not found. Expected: ${facilitiesPath} and ${servicesPath}`,
      );
    }

    const keyToId = new Map<string, number>(); // facility_id -> numeric id

    // 1) Load facilities (small ~20k)
    await new Promise<void>((resolve, reject) => {
      let nextId = 1;
      fs.createReadStream(facilitiesPath)
        .pipe(zlib.createGunzip())
        .pipe(
          parse({
            columns: true,
            relax_column_count: true,
            trim: true,
          }),
        )
        .on("data", (row: FacilityRow) => {
          const facilityKey = cleanStr((row as any).facility_id);
          if (!facilityKey) return;

          const dirRaw = cleanStr((row as any).directory_type).toLowerCase();
          const directory: DirectoryType = dirRaw === "substance" ? "substance" : "mental";

          const id = nextId++;
          keyToId.set(facilityKey, id);

          const name1 = cleanStr((row as any).name1);
          const name2 = toNull((row as any).name2);

          const facility: Facility = {
            id,
            // Expose the directory on the API object so the client can render
            // the correct category buckets (e.g., Detoxification Services for substance).
            directory_type: directory,
            name1,
            name2,
            street1: cleanStr((row as any).street1),
            street2: toNull((row as any).street2),
            city: cleanStr((row as any).city),
            state: cleanStr((row as any).state),
            zip: cleanStr((row as any).zip),
            phone: cleanStr((row as any).phone),
            intake1: toNull((row as any).intake1),
            intake2: toNull((row as any).intake2),
            intake1a: toNull((row as any).intake1a),
            intake2a: toNull((row as any).intake2a),
            service_code_info: toNull((row as any).service_code_info),
            services: [],
          };

          this.facilities.push(facility);
          this.facilityById.set(id, facility);
          this.directoryById.set(id, directory);
          this.nameLowerById.set(id, (name1 + " " + (name2 ?? "")).toLowerCase());
          this.cityLowerById.set(id, facility.city.toLowerCase());
        })
        .on("error", reject)
        .on("end", () => resolve());
    });

    // 2) Load services (large ~1.4M) and attach codes to facilities
    await new Promise<void>((resolve, reject) => {
      fs.createReadStream(servicesPath)
        .pipe(zlib.createGunzip())
        .pipe(
          parse({
            columns: true,
            relax_column_count: true,
            trim: true,
          }),
        )
        .on("data", (row: ServiceRow) => {
          const facilityKey = cleanStr((row as any).facility_id);
          const id = keyToId.get(facilityKey);
          if (!id) return;

          const codeRaw = cleanStr((row as any).code);
          if (!codeRaw) return;

          // Intern repeated code strings to reduce memory
          let code = this.codePool.get(codeRaw);
          if (!code) {
            this.codePool.set(codeRaw, codeRaw);
            code = codeRaw;
          }

          const facility = this.facilityById.get(id);
          if (!facility) return;
          facility.services.push(code);
        })
        .on("error", reject)
        .on("end", () => resolve());
    });

    // 3) Deduplicate service codes per facility (keeps UI chips clean)
    for (const f of this.facilities) {
      if (f.services.length <= 1) continue;
      // Preserve a stable-ish order while removing duplicates
      const seen = new Set<string>();
      const out: string[] = [];
      for (const c of f.services) {
        if (!seen.has(c)) {
          seen.add(c);
          out.push(c);
        }
      }
      f.services = out;
    }

    // Helpful server-side log
    console.log(
      `[data] Loaded ${this.facilities.length.toLocaleString()} facilities and ${this.codePool.size} unique service codes`,
    );
  }

  async searchFacilities(params: FacilitySearchParams): Promise<FacilitySearchResult> {
    await this.ensureLoaded();

    const state = params.state ? params.state.toUpperCase() : undefined;
    const city = params.city ? params.city.trim() : undefined;
    const directory = params.directory;
    const selectedServices = params.services ?? [];
    const q = params.searchQuery ? params.searchQuery.trim().toLowerCase() : "";

    let matches = this.facilities;

    if (directory) {
      matches = matches.filter((f) => this.directoryById.get(f.id) === directory);
    }
    if (state) {
      matches = matches.filter((f) => f.state === state);
    }
    if (city) {
      matches = matches.filter((f) => f.city === city);
    }
    if (q) {
      matches = matches.filter((f) => {
        const nameLower = this.nameLowerById.get(f.id) || "";
        const cityLower = this.cityLowerById.get(f.id) || "";
        return nameLower.includes(q) || cityLower.includes(q);
      });
    }
    if (selectedServices.length > 0) {
      matches = matches.filter((f) => selectedServices.every((c) => f.services.includes(c)));
    }

    const total = matches.length;
    const limit = Math.max(1, Math.min(params.limit ?? 100, 500));
    const offset = Math.max(0, params.offset ?? 0);

    return {
      total,
      facilities: matches.slice(offset, offset + limit),
    };
  }

  async getFacilityById(id: number): Promise<Facility | undefined> {
    await this.ensureLoaded();
    return this.facilityById.get(id);
  }
}

export const storage = new CsvStorage();
