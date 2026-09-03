import { apiClient } from '../../../shared/api/client';
import type { CreateDiasporaContentPayload, DiasporaContent, UpdateDiasporaContentPayload } from '../types';

export async function fetchDiasporaContents(): Promise<DiasporaContent[]> {
  const { data } = await apiClient.get<DiasporaContent[]>('/diaspora/content');
  return data;
}

export async function fetchDiasporaContent(id: string): Promise<DiasporaContent> {
  const { data } = await apiClient.get<DiasporaContent>(`/diaspora/content/${id}`);
  return data;
}

export async function createDiasporaContent(payload: CreateDiasporaContentPayload) {
  const { data } = await apiClient.post('/diaspora/content', payload);
  return data;
}

export async function updateDiasporaContent(id: string, payload: UpdateDiasporaContentPayload) {
  const { data } = await apiClient.patch(`/diaspora/content/${id}`, payload);
  return data;
}

export async function deleteDiasporaContent(id: string) {
  await apiClient.delete(`/diaspora/content/${id}`);
}
