import { apiClient } from '../../../shared/api/client';
import type { ReviewVerificationPayload, VerificationRequestAdminSummary } from '../types';

export async function fetchPendingVerifications(): Promise<VerificationRequestAdminSummary[]> {
  const { data } = await apiClient.get<VerificationRequestAdminSummary[]>('/verified/verification-requests');
  return data;
}

export async function reviewVerification(
  requestId: string,
  payload: ReviewVerificationPayload,
): Promise<VerificationRequestAdminSummary> {
  const { data } = await apiClient.patch<VerificationRequestAdminSummary>(
    `/verified/verification-requests/${requestId}`,
    payload,
  );
  return data;
}
