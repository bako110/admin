import { apiClient } from '../../../shared/api/client';
import type { PaginatedResponse } from '../../../shared/api/types';
import type { CreateMoneyServicePayload, MoneyServiceDetail, MoneyServiceSummary, UpdateMoneyServicePayload } from '../types';

export async function fetchMoneyServices(params: { page?: number; page_size?: number } = {}): Promise<
  PaginatedResponse<MoneyServiceSummary>
> {
  const { data } = await apiClient.get<PaginatedResponse<MoneyServiceSummary>>('/money-services', { params });
  return data;
}

export async function fetchMoneyService(id: string): Promise<MoneyServiceDetail> {
  const { data } = await apiClient.get<MoneyServiceDetail>(`/money-services/${id}`);
  return data;
}

export async function createMoneyService(payload: CreateMoneyServicePayload) {
  const { data } = await apiClient.post('/money-services', payload);
  return data;
}

export async function updateMoneyService(id: string, payload: UpdateMoneyServicePayload) {
  const { data } = await apiClient.patch(`/money-services/${id}`, payload);
  return data;
}

export async function deleteMoneyService(id: string) {
  await apiClient.delete(`/money-services/${id}`);
}
