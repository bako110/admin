import { apiClient } from '../../../shared/api/client';
import type { PaginatedResponse } from '../../../shared/api/types';
import type { CreateEduOutingPayload, EduOutingDetail, EduOutingSummary, UpdateEduOutingPayload } from '../types';

export async function fetchEduOutings(params: { page?: number; page_size?: number } = {}): Promise<
  PaginatedResponse<EduOutingSummary>
> {
  const { data } = await apiClient.get<PaginatedResponse<EduOutingSummary>>('/edu/outings', { params });
  return data;
}

export async function fetchEduOuting(id: string): Promise<EduOutingDetail> {
  const { data } = await apiClient.get<EduOutingDetail>(`/edu/outings/${id}`);
  return data;
}

export async function createEduOuting(payload: CreateEduOutingPayload) {
  const { data } = await apiClient.post('/edu/outings', payload);
  return data;
}

export async function updateEduOuting(id: string, payload: UpdateEduOutingPayload) {
  const { data } = await apiClient.patch(`/edu/outings/${id}`, payload);
  return data;
}

export async function deleteEduOuting(id: string) {
  await apiClient.delete(`/edu/outings/${id}`);
}
