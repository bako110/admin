import { apiClient } from '../../../shared/api/client';
import type { PaginatedResponse } from '../../../shared/api/types';
import type { CreateRoadServicePayload, RoadServiceDetail, RoadServiceSummary, UpdateRoadServicePayload } from '../types';

export async function fetchRoadServices(params: { page?: number; page_size?: number } = {}): Promise<
  PaginatedResponse<RoadServiceSummary>
> {
  const { data } = await apiClient.get<PaginatedResponse<RoadServiceSummary>>('/roads', { params });
  return data;
}

export async function fetchRoadService(id: string): Promise<RoadServiceDetail> {
  const { data } = await apiClient.get<RoadServiceDetail>(`/roads/${id}`);
  return data;
}

export async function createRoadService(payload: CreateRoadServicePayload) {
  const { data } = await apiClient.post('/roads', payload);
  return data;
}

export async function updateRoadService(id: string, payload: UpdateRoadServicePayload) {
  const { data } = await apiClient.patch(`/roads/${id}`, payload);
  return data;
}

export async function deleteRoadService(id: string) {
  await apiClient.delete(`/roads/${id}`);
}
