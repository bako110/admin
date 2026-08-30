import { apiClient } from '../../../shared/api/client';
import type { PendingAccountSummary, ReviewAccountPayload } from '../types';

export async function fetchPendingVerifications(): Promise<PendingAccountSummary[]> {
  const { data } = await apiClient.get<PendingAccountSummary[]>('/verified/verification-requests');
  return data;
}

export async function reviewAccount(
  userId: string,
  payload: ReviewAccountPayload,
): Promise<PendingAccountSummary> {
  const { data } = await apiClient.patch<PendingAccountSummary>(`/verified/accounts/${userId}/review`, payload);
  return data;
}
