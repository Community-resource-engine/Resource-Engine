// Canonical service metadata used across the UI.
//
// Filters (and their labels) live in filter-data.ts.
// This module adds colors + convenience helpers so every page
// renders service codes consistently.

import { mentalHealthFilters, substanceAbuseFilters } from "./filter-data";

export type DirectoryType = "mental" | "substance";

export type ServiceInfo = {
  code: string;
  name: string;
  category: string;
  color: string;
};

// Category color palette (soft, readable).
// If a category isn't listed, it falls back to a neutral chip.
export const categoryColors: Record<string, string> = {
  "Type of Care": "bg-blue-100 text-blue-700",
  "Service Setting": "bg-amber-100 text-amber-700",
  "Facility Type": "bg-indigo-100 text-indigo-700",
  "Treatment Approaches": "bg-green-100 text-green-700",
  "Emergency Services": "bg-red-100 text-red-700",
  "Payment Accepted": "bg-purple-100 text-purple-700",
  "Special Programs": "bg-pink-100 text-pink-700",
  "Age Groups": "bg-orange-100 text-orange-700",
  "Language Services": "bg-yellow-100 text-yellow-800",
  "Ancillary Services": "bg-teal-100 text-teal-700",
  "Licenses/Certs": "bg-slate-100 text-slate-700",
  "Smoking Policy": "bg-zinc-100 text-zinc-800",
};

const NEUTRAL = "bg-muted text-muted-foreground";

export function getServiceCategoriesForDirectory(directory?: DirectoryType) {
  return directory === "substance" ? substanceAbuseFilters : mentalHealthFilters;
}

function buildServiceMap(filters: Record<string, { code: string; name: string }[]>) {
  const map = new Map<string, { name: string; category: string }>();
  for (const [category, options] of Object.entries(filters)) {
    for (const opt of options) {
      // First one wins (prevents overwriting when categories overlap).
      if (!map.has(opt.code)) map.set(opt.code, { name: opt.name, category });
    }
  }
  return map;
}

const mentalMap = buildServiceMap(mentalHealthFilters);
const substanceMap = buildServiceMap(substanceAbuseFilters);

/**
 * Lookup a service code and return its UI metadata.
 *
 * If you pass `directory`, we prioritize that directory's mapping first.
 */
export function getServiceInfo(code: string, directory?: DirectoryType): ServiceInfo | null {
  const primary = directory === "substance" ? substanceMap : mentalMap;
  const secondary = directory === "substance" ? mentalMap : substanceMap;

  const found = primary.get(code) ?? secondary.get(code);
  if (!found) return null;

  const color = categoryColors[found.category] ?? NEUTRAL;
  return { code, name: found.name, category: found.category, color };
}

/**
 * Filter a list of codes down to only the ones we can render (i.e. known codes).
 */
export function getRenderableServiceCodes(codes: string[], directory?: DirectoryType): string[] {
  return codes.filter((c) => !!getServiceInfo(c, directory));
}

/**
 * Return service names for a specific category (e.g. "Language Services").
 */
export function getCategoryServiceNames(
  codes: string[],
  category: string,
  directory?: DirectoryType
): string[] {
  const unique = new Set<string>();
  for (const c of codes) {
    const info = getServiceInfo(c, directory);
    if (info && info.category === category) unique.add(info.name);
  }
  return Array.from(unique);
}
