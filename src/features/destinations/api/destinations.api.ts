import { apiClient } from '../../../shared/api/client';
import type { PaginatedResponse } from '../../../shared/api/types';
import type {
  CreateDestinationPayload,
  DestinationDetail,
  DestinationSummary,
  UpdateDestinationPayload,
} from '../types';

export async function fetchDestinations(params: { page?: number; page_size?: number } = {}): Promise<
  PaginatedResponse<DestinationSummary>
> {
  const { data } = await apiClient.get<PaginatedResponse<DestinationSummary>>('/destinations', { params });
  return data;
}

export async function fetchDestination(id: string): Promise<DestinationDetail> {
  const { data } = await apiClient.get<DestinationDetail>(`/destinations/${id}`);
  return data;
}

export async function createDestination(payload: CreateDestinationPayload) {
  const { data } = await apiClient.post('/destinations', payload);
  return data;
}

export async function updateDestination(id: string, payload: UpdateDestinationPayload) {
  const { data } = await apiClient.patch(`/destinations/${id}`, payload);
  return data;
}

export async function deleteDestination(id: string) {
  await apiClient.delete(`/destinations/${id}`);
}
