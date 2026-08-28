import { apiClient } from '../../../shared/api/client';
import type { PaginatedResponse } from '../../../shared/api/types';
import type {
  CreateConnectivityPointPayload,
  ConnectivityPointDetail,
  ConnectivityPointSummary,
  UpdateConnectivityPointPayload,
} from '../types';

export async function fetchConnectivityPoints(params: { page?: number; page_size?: number } = {}): Promise<
  PaginatedResponse<ConnectivityPointSummary>
> {
  const { data } = await apiClient.get<PaginatedResponse<ConnectivityPointSummary>>('/connectivity', { params });
  return data;
}

export async function fetchConnectivityPoint(id: string): Promise<ConnectivityPointDetail> {
  const { data } = await apiClient.get<ConnectivityPointDetail>(`/connectivity/${id}`);
  return data;
}

export async function createConnectivityPoint(payload: CreateConnectivityPointPayload) {
  const { data } = await apiClient.post('/connectivity', payload);
  return data;
}

export async function updateConnectivityPoint(id: string, payload: UpdateConnectivityPointPayload) {
  const { data } = await apiClient.patch(`/connectivity/${id}`, payload);
  return data;
}

export async function deleteConnectivityPoint(id: string) {
  await apiClient.delete(`/connectivity/${id}`);
}
