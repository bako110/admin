import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { fetchEduOutings, fetchEduOuting, createEduOuting, updateEduOuting, deleteEduOuting } from '../api/edu.api';
import type { UpdateEduOutingPayload } from '../types';

export function useEduOutings(page = 1, pageSize = 20) {
  return useQuery({
    queryKey: ['admin-edu-outings', page, pageSize],
    queryFn: () => fetchEduOutings({ page, page_size: pageSize }),
  });
}

export function useEduOuting(id: string | null) {
  return useQuery({
    queryKey: ['admin-edu-outing', id],
    queryFn: () => fetchEduOuting(id as string),
    enabled: !!id,
  });
}

export function useCreateEduOuting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEduOuting,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-edu-outings'] }),
  });
}

export function useUpdateEduOuting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateEduOutingPayload }) => updateEduOuting(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-edu-outings'] }),
  });
}

export function useDeleteEduOuting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteEduOuting,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-edu-outings'] }),
  });
}
