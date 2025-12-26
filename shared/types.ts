export interface Facility {
  id: number;
  // Which SAMHSA directory this record came from.
  // Used by the UI to show the correct category buckets (e.g., Detoxification for substance).
  directory_type?: "mental" | "substance";
  name1: string;
  name2: string | null;
  street1: string;
  street2: string | null;
  city: string;
  state: string;
  // Keep as string so leading zeros are preserved (e.g., 02108)
  zip: string;
  phone: string;
  intake1: string | null;
  intake2: string | null;
  intake1a: string | null;
  intake2a: string | null;
  service_code_info: string | null;
  services: string[];
}

export interface FacilitySearchParams {
  state?: string;
  city?: string;
  searchQuery?: string;
  services?: string[];
  directory?: "mental" | "substance";
  limit?: number;
  offset?: number;
}

export interface FacilitySearchResult {
  facilities: Facility[];
  total: number;
}
