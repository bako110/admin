import { apiClient } from '../../../shared/api/client';
import type { PaginatedResponse } from '../../../shared/api/types';
import type {
  CreateTransportProviderPayload,
  TransportProviderDetail,
  TransportProviderSummary,
  UpdateTransportProviderPayload,
} from '../types';

export async function fetchTransportProviders(params: { page?: number; page_size?: number } = {}): Promise<
  PaginatedResponse<TransportProviderSummary>
> {
  const { data } = await apiClient.get<PaginatedResponse<TransportProviderSummary>>('/mobility/providers', {
    params: { ...params, include_all_statuses: true },
  });
  return data;
}

export async function fetchTransportProvider(id: string): Promise<TransportProviderDetail> {
  const { data } = await apiClient.get<TransportProviderDetail>(`/mobility/providers/${id}`);
  return data;
}

export async function createTransportProvider(payload: CreateTransportProviderPayload) {
  const { data } = await apiClient.post('/mobility/providers', payload);
  return data;
}

export async function updateTransportProvider(id: string, payload: UpdateTransportProviderPayload) {
  const { data } = await apiClient.patch(`/mobility/providers/${id}`, payload);
  return data;
}

export async function deleteTransportProvider(id: string) {
  await apiClient.delete(`/mobility/providers/${id}`);
}
