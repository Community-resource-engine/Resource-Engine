// Top-level attribute grouping for the Data Insights dashboard filter explorer.
//
// careconnectaz.com groups filter categories under three top-level "Attribute"
// buckets: Organizational, Program, and Client. The requirements doc moves
// a few categories between buckets:
//
//   Mental Health page:
//     - Language Services:  Organizational Attributes -> Client Attributes
//     - Service Setting:    Organizational Attributes -> Program Attributes
//
//   Substance Abuse page:
//     - Language Services:  Program Attributes -> Client Attributes
//
// All dropdowns / category lists must be alphabetical, both at the attribute
// level and within each category.

import type { FilterOption } from "./filter-data";

export type AttributeGroup =
  | "Client Attributes"
  | "Program Attributes"
  | "Organizational Attributes";

export type Directory = "mental" | "substance";

// Final mapping, with the sheet's moves already applied.
const MENTAL_HEALTH_MAP: Record<string, AttributeGroup> = {
  // Client
  "Age Groups": "Client Attributes",
  "Language Services": "Client Attributes",
  "Client Attributes": "Client Attributes",
  // Program
  "Type of Care": "Program Attributes",
  "Service Setting": "Program Attributes",
  "Facility Type": "Program Attributes",
  "Treatment Approaches": "Program Attributes",
  "Pharmacotherapies": "Program Attributes",
  "Emergency Services": "Program Attributes",
  "Special Programs": "Program Attributes",
  "Assessment": "Program Attributes",
  "Testing": "Program Attributes",
  "Ancillary Services": "Program Attributes",
  "Smoking Policy": "Program Attributes",
  "Payment Accepted": "Program Attributes",
  "Payment Assistance": "Program Attributes",
  // Organizational
  "Facility Operation": "Organizational Attributes",
  "Licenses/Certs": "Organizational Attributes",
};

const SUBSTANCE_ABUSE_MAP: Record<string, AttributeGroup> = {
  // Client
  "Age Groups": "Client Attributes",
  "Language Services": "Client Attributes",
  "Client Attributes": "Client Attributes",
  // Program
  "Type of Care": "Program Attributes",
  "Service Setting": "Program Attributes",
  "Hospitals": "Program Attributes",
  "Opioid Medications": "Program Attributes",
  "Treatment Approaches": "Program Attributes",
  "Pharmacotherapies": "Program Attributes",
  "Special Programs": "Program Attributes",
  "Assessment": "Program Attributes",
  "Testing": "Program Attributes",
  "Ancillary Services": "Program Attributes",
  "Smoking Policy": "Program Attributes",
  "Detoxification Services": "Program Attributes",
  "Education Services": "Program Attributes",
  "Payment Accepted": "Program Attributes",
  "Payment Assistance": "Program Attributes",
  // Organizational
  "Facility Operation": "Organizational Attributes",
  "Licenses/Certs": "Organizational Attributes",
};

const ATTRIBUTE_ORDER: AttributeGroup[] = [
  "Client Attributes",
  "Program Attributes",
  "Organizational Attributes",
];

export interface GroupedCategory {
  category: string;
  items: FilterOption[];
}

export interface AttributeBucket {
  group: AttributeGroup;
  categories: GroupedCategory[];
}

/**
 * Re-organize the flat per-directory filter dictionary into the three
 * top-level Attribute groups, with categories and items sorted
 * alphabetically. Categories not present in the directory's map fall back
 * to Program Attributes (safe default rather than dropping them).
 */
export function groupFiltersByAttribute(
  filters: Record<string, FilterOption[]>,
  directory: Directory,
): AttributeBucket[] {
  const map = directory === "mental" ? MENTAL_HEALTH_MAP : SUBSTANCE_ABUSE_MAP;
  const buckets: Record<AttributeGroup, GroupedCategory[]> = {
    "Client Attributes": [],
    "Program Attributes": [],
    "Organizational Attributes": [],
  };

  for (const [category, items] of Object.entries(filters)) {
    const group: AttributeGroup = map[category] ?? "Program Attributes";
    const sortedItems = [...items].sort((a, b) => a.name.localeCompare(b.name));
    buckets[group].push({ category, items: sortedItems });
  }

  for (const group of ATTRIBUTE_ORDER) {
    buckets[group].sort((a, b) => a.category.localeCompare(b.category));
  }

  return ATTRIBUTE_ORDER
    .map((group) => ({ group, categories: buckets[group] }))
    .filter((b) => b.categories.length > 0);
}
