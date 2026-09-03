import { apiClient } from '../../../shared/api/client';
import type { CreateGuideEntryPayload, GuideEntry, SupportedLanguage, UpdateGuideEntryPayload } from '../types';

export async function fetchGuideEntries(): Promise<GuideEntry[]> {
  const { data } = await apiClient.get<GuideEntry[]>('/international/first-visit-guide');
  return data;
}

export async function createGuideEntry(payload: CreateGuideEntryPayload) {
  const { data } = await apiClient.post('/international/first-visit-guide', payload);
  return data;
}

export async function updateGuideEntry(id: string, payload: UpdateGuideEntryPayload) {
  const { data } = await apiClient.patch(`/international/first-visit-guide/${id}`, payload);
  return data;
}

export async function deleteGuideEntry(id: string) {
  await apiClient.delete(`/international/first-visit-guide/${id}`);
}

export async function fetchSupportedLanguages(): Promise<SupportedLanguage[]> {
  const { data } = await apiClient.get<SupportedLanguage[]>('/international/languages');
  return data;
}

export async function setLanguageActive(code: string, isActive: boolean) {
  const { data } = await apiClient.patch(`/international/languages/${code}`, null, { params: { is_active: isActive } });
  return data;
}
