import type {
  Facility,
  FacilitySearchParams,
  FacilitySearchResult,
} from "@shared/types";
import { query } from "./db";

export interface IStorage {
  searchFacilities(params: FacilitySearchParams): Promise<FacilitySearchResult>;
  getFacilityById(id: number): Promise<Facility | undefined>;
}

type DirectoryType = "mental" | "substance";

// Internal caches mapped once to map normalized PG schema back to the frontend dynamically
let facilityTypesCache: Map<number, DirectoryType> | null = null;
let servicesIdToCodeCache: Map<number, string> | null = null;
let servicesCodeToIdCache: Map<string, number> | null = null;

async function ensureCaches() {
  if (facilityTypesCache && servicesIdToCodeCache && servicesCodeToIdCache) return;

  facilityTypesCache = new Map();
  const typesRows = await query('SELECT id, code FROM facility_types');
  for (const row of typesRows) {
    const dirType = row.code === 'MH' ? 'mental' : (row.code === 'SA' ? 'substance' : row.code);
    facilityTypesCache.set(row.id, dirType as DirectoryType);
  }

  servicesIdToCodeCache = new Map();
  servicesCodeToIdCache = new Map();
  const servicesRows = await query('SELECT id, code FROM services');
  for (const row of servicesRows) {
    servicesIdToCodeCache.set(row.id, row.code);
    servicesCodeToIdCache.set(row.code, row.id);
  }
}

function cleanStr(v: unknown): string {
  if (v === null || v === undefined) return "";
  const s = String(v).trim();
  return s.replace(/^\uFEFF/, ""); 
}

function toNull(v: unknown): string | null {
  const s = cleanStr(v);
  return s.length ? s : null;
}

function transformRowToFacility(row: any): Facility {
  const services: string[] = [];
  const serviceIds = row.serviceIds || [];
  
  if (servicesIdToCodeCache && Array.isArray(serviceIds)) {
    for (const id of serviceIds) {
      const code = servicesIdToCodeCache.get(id);
      if (code) services.push(code);
    }
  }

  return {
    id: row.id,
    directory_type: facilityTypesCache && row.facilityTypeId 
      ? facilityTypesCache.get(row.facilityTypeId) 
      : undefined,
    name1: cleanStr(row.name1),
    name2: toNull(row.name2),
    street1: cleanStr(row.street1),
    street2: toNull(row.street2),
    city: cleanStr(row.city),
    state: cleanStr(row.state),
    zip: cleanStr(row.zip),
    phone: cleanStr(row.phone),
    intake1: toNull(row.intake1),
    intake2: toNull(row.intake2),
    intake1a: toNull(row.intake1a),
    intake2a: toNull(row.intake2a),
    service_code_info: toNull(row.service_code_info),
    services,
  };
}

class DatabaseStorage implements IStorage {
  async searchFacilities(params: FacilitySearchParams): Promise<FacilitySearchResult> {
    await ensureCaches();

    const conditions: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    // We join facility_types to filter by directory efficiently
    let fromClause = 'facilities f';
    
    if (params.directory) {
      fromClause += ' INNER JOIN facility_types ft ON f."facilityTypeId" = ft.id';
      const dirCode = params.directory === 'mental' ? 'MH' : (params.directory === 'substance' ? 'SA' : params.directory);
      conditions.push(`ft.code = $${paramIndex++}`);
      values.push(dirCode);
    }
    
    if (params.state) {
      conditions.push(`f.state = $${paramIndex++}`);
      values.push(params.state.toUpperCase());
    }
    
    if (params.city) {
      conditions.push(`f.city = $${paramIndex++}`);
      values.push(params.city.trim());
    }
    
    if (params.searchQuery) {
      const q = params.searchQuery.trim();
      conditions.push(`(LOWER(f.name1) LIKE $${paramIndex} OR LOWER(f.city) LIKE $${paramIndex++})`);
      values.push(`%${q.toLowerCase()}%`);
    }
    
    if (params.services && params.services.length > 0 && servicesCodeToIdCache) {
      // Find internal IDs for the requested string codes to leverage Postgres @> overlapping arrays
      const requestedIds = [];
      for (const code of params.services) {
        const id = servicesCodeToIdCache.get(code);
        if (id !== undefined) {
          requestedIds.push(id);
        }
      }
      
      if (requestedIds.length > 0) {
        conditions.push(`f."serviceIds" @> $${paramIndex++}::int[]`);
        values.push(requestedIds);
      }
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    
    // Fast total count query
    const countSql = `SELECT COUNT(f.id) as total FROM ${fromClause} ${whereClause}`;
    const countResult = await query(countSql, values);
    const total = countResult[0]?.total || 0;

    // Restrict bounds
    const limit = Math.max(1, Math.min(params.limit ?? 100, 500));
    const offset = Math.max(0, params.offset ?? 0);
    
    const selectFields = params.directory ? 'f.*' : '*';
    const sql = `SELECT ${selectFields} FROM ${fromClause} ${whereClause} LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    const resultsArgs = [...values, limit, offset];
    
    const rows = await query(sql, resultsArgs);
    const facilities = rows.map(transformRowToFacility);

    return {
      total: Number(total),
      facilities,
    };
  }

  async getFacilityById(id: number): Promise<Facility | undefined> {
    await ensureCaches();
    const rows = await query('SELECT * FROM facilities WHERE id = $1', [id]);
    if (!rows || rows.length === 0) {
      return undefined;
    }
    return transformRowToFacility(rows[0]);
  }
}

export const storage = new DatabaseStorage();
