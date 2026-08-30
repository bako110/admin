import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { fetchPendingVerifications, reviewVerification } from '../api/verification.api';
import type { ReviewVerificationPayload } from '../types';

export function usePendingVerifications() {
  return useQuery({
    queryKey: ['admin-pending-verifications'],
    queryFn: fetchPendingVerifications,
  });
}

export function useReviewVerification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ requestId, payload }: { requestId: string; payload: ReviewVerificationPayload }) =>
      reviewVerification(requestId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-pending-verifications'] }),
  });
}
