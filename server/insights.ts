import { query } from "./db";

export interface InsightsData {
  // National totals (always present)
  totalFacilities: number;
  totalStates: number;
  mentalHealthCount: number;
  substanceAbuseCount: number;

  // State-specific totals (when state param is provided)
  stateTotal?: number;
  stateMentalHealth?: number;
  stateSubstanceAbuse?: number;
  stateName?: string;

  // Facilities by state breakdown
  facilitiesByState: { state: string; total: number; mental: number; substance: number }[];

  // Top services
  topServices: { code: string; name: string; count: number; category: string }[];

  // Facilities by type
  facilitiesByType: { type: string; count: number }[];

  // Services by category
  servicesByCategory: { category: string; count: number }[];
}

// Known service code → human-readable name mappings (subset for top display)
const SERVICE_NAMES: Record<string, string> = {
  SA: "Substance Abuse",
  MH: "Mental Health",
  SUMH: "Co-occurring SU + MH",
  OP: "Outpatient",
  HI: "Hospital Inpatient",
  RES: "Residential",
  CMHC: "Community MH Center",
  CBHC: "Community BH Clinic",
  OMH: "Outpatient MH Facility",
  PSY: "Psychiatric Hospital",
  TELE: "Telemedicine",
  CBT: "Cognitive Behavioral Therapy",
  DBT: "Dialectical Behavior Therapy",
  CFT: "Couples/Family Therapy",
  GT: "Group Therapy",
  IPT: "Individual Psychotherapy",
  IDD: "Integrated Dual Disorder",
  AT: "Activity Therapy",
  EMDR: "EMDR Therapy",
  CRT: "Cognitive Remediation",
  DT: "Detoxification",
  HH: "Transitional Housing",
  RTCA: "Residential Treatment (Adults)",
  RTCC: "Residential Treatment (Children)",
  MD: "Medicaid",
  MC: "Medicare",
  PI: "Private Insurance",
  SF: "Cash/Self-Payment",
  SS: "Sliding Fee Scale",
  PA: "Payment Assistance",
  SP: "Spanish",
  AH: "Sign Language",
  PEER: "Peer Support",
  CM: "Case Management",
  SPS: "Suicide Prevention",
};

const SERVICE_CATEGORIES: Record<string, string> = {
  SA: "Type of Care", MH: "Type of Care", SUMH: "Type of Care", DT: "Type of Care",
  OP: "Service Setting", HI: "Service Setting", RES: "Service Setting", HH: "Service Setting",
  CMHC: "Facility Type", CBHC: "Facility Type", OMH: "Facility Type", PSY: "Facility Type",
  RTCA: "Facility Type", RTCC: "Facility Type",
  TELE: "Treatment", CBT: "Treatment", DBT: "Treatment", CFT: "Treatment",
  GT: "Treatment", IPT: "Treatment", IDD: "Treatment", AT: "Treatment",
  EMDR: "Treatment", CRT: "Treatment",
  MD: "Payment", MC: "Payment", PI: "Payment", SF: "Payment", SS: "Payment", PA: "Payment",
  SP: "Language", AH: "Language",
  PEER: "Ancillary", CM: "Ancillary", SPS: "Ancillary",
};

// US State abbreviation → full name mapping
const STATE_NAMES: Record<string, string> = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California",
  CO: "Colorado", CT: "Connecticut", DE: "Delaware", FL: "Florida", GA: "Georgia",
  HI: "Hawaii", ID: "Idaho", IL: "Illinois", IN: "Indiana", IA: "Iowa",
  KS: "Kansas", KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland",
  MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi", MO: "Missouri",
  MT: "Montana", NE: "Nebraska", NV: "Nevada", NH: "New Hampshire", NJ: "New Jersey",
  NM: "New Mexico", NY: "New York", NC: "North Carolina", ND: "North Dakota", OH: "Ohio",
  OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island", SC: "South Carolina",
  SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah", VT: "Vermont",
  VA: "Virginia", WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming",
  DC: "District of Columbia", PR: "Puerto Rico", VI: "Virgin Islands", GU: "Guam",
  AS: "American Samoa", MP: "Northern Mariana Islands",
};

export async function getInsightsData(state?: string): Promise<InsightsData> {
  // 1. Total facility count (national)
  const totalRows = await query<{ count: string }>("SELECT COUNT(*) as count FROM facilities");
  const totalFacilities = parseInt(totalRows[0]?.count || "0", 10);

  // 2. Distinct states
  const stateCountRows = await query<{ count: string }>(
    "SELECT COUNT(DISTINCT state) as count FROM facilities WHERE state IS NOT NULL AND state != ''"
  );
  const totalStates = parseInt(stateCountRows[0]?.count || "0", 10);

  // 3. Mental health vs substance abuse counts (national)
  const typeRows = await query<{ code: string; count: string }>(
    `SELECT ft.code, COUNT(f.id) as count 
     FROM facilities f 
     INNER JOIN facility_types ft ON f."facilityTypeId" = ft.id 
     GROUP BY ft.code`
  );

  let mentalHealthCount = 0;
  let substanceAbuseCount = 0;
  for (const row of typeRows) {
    if (row.code === "MH") mentalHealthCount = parseInt(row.count, 10);
    else if (row.code === "SA") substanceAbuseCount = parseInt(row.count, 10);
  }

  // 4. State-specific counts (when state param is provided)
  let stateTotal: number | undefined;
  let stateMentalHealth: number | undefined;
  let stateSubstanceAbuse: number | undefined;
  let stateName: string | undefined;

  if (state) {
    stateName = STATE_NAMES[state] || state;

    const stateTypeRows = await query<{ code: string; count: string }>(
      `SELECT ft.code, COUNT(f.id) as count 
       FROM facilities f 
       INNER JOIN facility_types ft ON f."facilityTypeId" = ft.id 
       WHERE f.state = $1
       GROUP BY ft.code`,
      [state]
    );

    stateMentalHealth = 0;
    stateSubstanceAbuse = 0;
    stateTotal = 0;
    for (const row of stateTypeRows) {
      const c = parseInt(row.count, 10);
      stateTotal += c;
      if (row.code === "MH") stateMentalHealth = c;
      else if (row.code === "SA") stateSubstanceAbuse = c;
    }
  }

  // 5. Facilities by state with MH/SA breakdown
  const stateRows = await query<{ state: string; code: string; count: string }>(
    `SELECT f.state, ft.code, COUNT(f.id) as count
     FROM facilities f
     INNER JOIN facility_types ft ON f."facilityTypeId" = ft.id
     WHERE f.state IS NOT NULL AND f.state != ''
     GROUP BY f.state, ft.code
     ORDER BY f.state`
  );

  const stateMap = new Map<string, { total: number; mental: number; substance: number }>();
  for (const row of stateRows) {
    const current = stateMap.get(row.state) || { total: 0, mental: 0, substance: 0 };
    const count = parseInt(row.count, 10);
    current.total += count;
    if (row.code === "MH") current.mental = count;
    else if (row.code === "SA") current.substance = count;
    stateMap.set(row.state, current);
  }

  const facilitiesByState = Array.from(stateMap.entries())
    .map(([st, data]) => ({ state: st, ...data }))
    .sort((a, b) => b.total - a.total);

  // 6. Top services — unnest the serviceIds array and count occurrences
  const serviceQuery = state
    ? `SELECT unnest("serviceIds") as service_id, COUNT(*) as count
       FROM facilities WHERE state = $1
       GROUP BY service_id ORDER BY count DESC LIMIT 50`
    : `SELECT unnest("serviceIds") as service_id, COUNT(*) as count
       FROM facilities GROUP BY service_id ORDER BY count DESC LIMIT 50`;

  const serviceRows = await query<{ service_id: number; count: string }>(
    serviceQuery,
    state ? [state] : []
  );

  // Map service IDs to codes
  const serviceIdRows = await query<{ id: number; code: string }>("SELECT id, code FROM services");
  const idToCode = new Map<number, string>();
  for (const row of serviceIdRows) {
    idToCode.set(row.id, row.code);
  }

  const topServices = serviceRows
    .map((row) => {
      const code = idToCode.get(row.service_id) || `ID_${row.service_id}`;
      return {
        code,
        name: SERVICE_NAMES[code] || code,
        count: parseInt(row.count, 10),
        category: SERVICE_CATEGORIES[code] || "Other",
      };
    })
    .filter((s) => SERVICE_NAMES[s.code]); // Only known services for clean display

  // 7. Facilities by facility type label
  const facilityTypeQuery = state
    ? `SELECT ft.code, COUNT(f.id) as count
       FROM facilities f
       INNER JOIN facility_types ft ON f."facilityTypeId" = ft.id
       WHERE f.state = $1
       GROUP BY ft.code`
    : `SELECT ft.code, COUNT(f.id) as count
       FROM facilities f
       INNER JOIN facility_types ft ON f."facilityTypeId" = ft.id
       GROUP BY ft.code`;

  const facilityTypeRows = await query<{ code: string; count: string }>(
    facilityTypeQuery,
    state ? [state] : []
  );

  const facilityTypeLabels: Record<string, string> = {
    MH: "Mental Health",
    SA: "Substance Abuse",
  };

  const facilitiesByType = facilityTypeRows.map((row) => ({
    type: facilityTypeLabels[row.code] || row.code,
    count: parseInt(row.count, 10),
  }));

  // 8. Services aggregated by category
  const categoryMap = new Map<string, number>();
  for (const svc of topServices) {
    const current = categoryMap.get(svc.category) || 0;
    categoryMap.set(svc.category, current + svc.count);
  }

  const servicesByCategory = Array.from(categoryMap.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);

  return {
    totalFacilities,
    totalStates,
    mentalHealthCount,
    substanceAbuseCount,
    ...(state ? { stateTotal, stateMentalHealth, stateSubstanceAbuse, stateName } : {}),
    facilitiesByState,
    topServices: topServices.slice(0, 20),
    facilitiesByType,
    servicesByCategory,
  };
}
