import { apiClient } from '../../../shared/api/client';
import type { PaginatedResponse } from '../../../shared/api/types';
import type {
  CreateCultureContentPayload,
  CultureContentDetail,
  CultureContentSummary,
  UpdateCultureContentPayload,
} from '../types';

export async function fetchCultureContent(params: { page?: number; page_size?: number } = {}): Promise<
  PaginatedResponse<CultureContentSummary>
> {
  const { data } = await apiClient.get<PaginatedResponse<CultureContentSummary>>('/culture/content', { params });
  return data;
}

export async function fetchCultureContentItem(id: string): Promise<CultureContentDetail> {
  const { data } = await apiClient.get<CultureContentDetail>(`/culture/content/${id}`);
  return data;
}

export async function createCultureContent(payload: CreateCultureContentPayload) {
  const { data } = await apiClient.post('/culture/content', payload);
  return data;
}

export async function updateCultureContent(id: string, payload: UpdateCultureContentPayload) {
  const { data } = await apiClient.patch(`/culture/content/${id}`, payload);
  return data;
}

export async function deleteCultureContent(id: string) {
  await apiClient.delete(`/culture/content/${id}`);
}
