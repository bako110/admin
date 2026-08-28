import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { fetchGuides, fetchGuide, createGuide, updateGuide, deleteGuide, verifyGuide } from '../api/guides.api';
import type { UpdateGuidePayload } from '../types';

export function useGuides(page = 1, pageSize = 20) {
  return useQuery({
    queryKey: ['admin-guides', page, pageSize],
    queryFn: () => fetchGuides({ page, page_size: pageSize }),
  });
}

export function useGuide(id: string | null) {
  return useQuery({
    queryKey: ['admin-guide', id],
    queryFn: () => fetchGuide(id as string),
    enabled: !!id,
  });
}

export function useCreateGuide() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createGuide,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-guides'] }),
  });
}

export function useUpdateGuide() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateGuidePayload }) => updateGuide(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-guides'] }),
  });
}

export function useDeleteGuide() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteGuide,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-guides'] }),
  });
}

export function useVerifyGuide() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isVerified }: { id: string; isVerified: boolean }) => verifyGuide(id, isVerified),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-guides'] }),
  });
}
