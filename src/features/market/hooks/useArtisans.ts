import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  fetchArtisans,
  fetchArtisan,
  createArtisan,
  updateArtisan,
  deleteArtisan,
  verifyArtisan,
} from '../api/market.api';
import type { UpdateArtisanPayload } from '../types';

export function useArtisans() {
  return useQuery({
    queryKey: ['admin-artisans'],
    queryFn: fetchArtisans,
  });
}

export function useArtisan(id: string | null) {
  return useQuery({
    queryKey: ['admin-artisan', id],
    queryFn: () => fetchArtisan(id as string),
    enabled: !!id,
  });
}

export function useCreateArtisan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createArtisan,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-artisans'] }),
  });
}

export function useUpdateArtisan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateArtisanPayload }) => updateArtisan(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-artisans'] }),
  });
}

export function useDeleteArtisan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteArtisan,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-artisans'] }),
  });
}

export function useVerifyArtisan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isVerified }: { id: string; isVerified: boolean }) => verifyArtisan(id, isVerified),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-artisans'] }),
  });
}
