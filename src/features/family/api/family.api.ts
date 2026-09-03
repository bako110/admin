import { apiClient } from '../../../shared/api/client';
import type { PaginatedResponse } from '../../../shared/api/types';
import type {
  CreateFamilyServicePayload,
  FamilyServiceDetail,
  FamilyServiceSummary,
  UpdateFamilyServicePayload,
} from '../types';

export async function fetchFamilyServices(params: { page?: number; page_size?: number } = {}): Promise<
  PaginatedResponse<FamilyServiceSummary>
> {
  const { data } = await apiClient.get<PaginatedResponse<FamilyServiceSummary>>('/family-services', { params });
  return data;
}

export async function fetchFamilyService(id: string): Promise<FamilyServiceDetail> {
  const { data } = await apiClient.get<FamilyServiceDetail>(`/family-services/${id}`);
  return data;
}

export async function createFamilyService(payload: CreateFamilyServicePayload) {
  const { data } = await apiClient.post('/family-services', payload);
  return data;
}

export async function updateFamilyService(id: string, payload: UpdateFamilyServicePayload) {
  const { data } = await apiClient.patch(`/family-services/${id}`, payload);
  return data;
}

export async function deleteFamilyService(id: string) {
  await apiClient.delete(`/family-services/${id}`);
}
