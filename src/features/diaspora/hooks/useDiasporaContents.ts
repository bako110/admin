import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  fetchDiasporaContents,
  fetchDiasporaContent,
  createDiasporaContent,
  updateDiasporaContent,
  deleteDiasporaContent,
} from '../api/diaspora.api';
import type { UpdateDiasporaContentPayload } from '../types';

export function useDiasporaContents() {
  return useQuery({
    queryKey: ['admin-diaspora-contents'],
    queryFn: fetchDiasporaContents,
  });
}

export function useDiasporaContent(id: string | null) {
  return useQuery({
    queryKey: ['admin-diaspora-content', id],
    queryFn: () => fetchDiasporaContent(id as string),
    enabled: !!id,
  });
}

export function useCreateDiasporaContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createDiasporaContent,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-diaspora-contents'] }),
  });
}

export function useUpdateDiasporaContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateDiasporaContentPayload }) => updateDiasporaContent(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-diaspora-contents'] }),
  });
}

export function useDeleteDiasporaContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDiasporaContent,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-diaspora-contents'] }),
  });
}
