import { apiClient } from '../../../shared/api/client';
import type { PaginatedResponse } from '../../../shared/api/types';
import type {
  CreateHealthFacilityPayload,
  HealthFacilityDetail,
  HealthFacilitySummary,
  UpdateHealthFacilityPayload,
} from '../types';

export async function fetchHealthFacilities(params: { page?: number; page_size?: number } = {}): Promise<
  PaginatedResponse<HealthFacilitySummary>
> {
  const { data } = await apiClient.get<PaginatedResponse<HealthFacilitySummary>>('/health-facilities', { params });
  return data;
}

export async function fetchHealthFacility(id: string): Promise<HealthFacilityDetail> {
  const { data } = await apiClient.get<HealthFacilityDetail>(`/health-facilities/${id}`);
  return data;
}

export async function createHealthFacility(payload: CreateHealthFacilityPayload) {
  const { data } = await apiClient.post('/health-facilities', payload);
  return data;
}

export async function updateHealthFacility(id: string, payload: UpdateHealthFacilityPayload) {
  const { data } = await apiClient.patch(`/health-facilities/${id}`, payload);
  return data;
}

export async function deleteHealthFacility(id: string) {
  await apiClient.delete(`/health-facilities/${id}`);
}
