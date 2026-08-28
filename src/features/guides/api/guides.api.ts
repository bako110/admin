import { apiClient } from '../../../shared/api/client';
import type { PaginatedResponse } from '../../../shared/api/types';
import type { CreateGuidePayload, GuideDetail, GuideSummary, UpdateGuidePayload } from '../types';

export async function fetchGuides(params: { page?: number; page_size?: number } = {}): Promise<
  PaginatedResponse<GuideSummary>
> {
  const { data } = await apiClient.get<PaginatedResponse<GuideSummary>>('/guides', {
    params: { ...params, include_all_statuses: true },
  });
  return data;
}

export async function fetchGuide(id: string): Promise<GuideDetail> {
  const { data } = await apiClient.get<GuideDetail>(`/guides/${id}`);
  return data;
}

export async function createGuide(payload: CreateGuidePayload) {
  const { data } = await apiClient.post('/guides', payload);
  return data;
}

export async function updateGuide(id: string, payload: UpdateGuidePayload) {
  const { data } = await apiClient.patch(`/guides/${id}`, payload);
  return data;
}

export async function deleteGuide(id: string) {
  await apiClient.delete(`/guides/${id}`);
}

export async function verifyGuide(id: string, isVerified: boolean) {
  const { data } = await apiClient.post(`/guides/${id}/verify`, null, { params: { is_verified: isVerified } });
  return data;
}
