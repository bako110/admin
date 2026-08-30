import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { fetchPendingVerifications, reviewAccount } from '../api/verification.api';
import type { ReviewAccountPayload } from '../types';

export function usePendingVerifications() {
  return useQuery({
    queryKey: ['admin-pending-verifications'],
    queryFn: fetchPendingVerifications,
  });
}

export function useReviewAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, payload }: { userId: string; payload: ReviewAccountPayload }) =>
      reviewAccount(userId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-pending-verifications'] }),
  });
}
