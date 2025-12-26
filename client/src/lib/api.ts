import type { Facility } from "@shared/types";

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

export async function searchFacilities(params: FacilitySearchParams): Promise<FacilitySearchResult> {
  const queryParams = new URLSearchParams();
  
  if (params.state) queryParams.append('state', params.state);
  if (params.city) queryParams.append('city', params.city);
  if (params.searchQuery) queryParams.append('searchQuery', params.searchQuery);
  if (params.services && params.services.length > 0) {
    params.services.forEach(service => queryParams.append('services', service));
  }
  if (params.directory) queryParams.append('directory', params.directory);
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.offset) queryParams.append('offset', params.offset.toString());

  const response = await fetch(`/api/facilities?${queryParams.toString()}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch facilities: ${response.statusText}`);
  }
  
  return response.json();
}

export async function getFacilityById(id: number): Promise<Facility> {
  const response = await fetch(`/api/facilities/${id}`);
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Facility not found');
    }
    throw new Error(`Failed to fetch facility: ${response.statusText}`);
  }
  
  return response.json();
}
