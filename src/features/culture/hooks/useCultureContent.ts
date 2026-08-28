import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  fetchCultureContent,
  fetchCultureContentItem,
  createCultureContent,
  updateCultureContent,
  deleteCultureContent,
} from '../api/culture.api';
import type { UpdateCultureContentPayload } from '../types';

export function useCultureContent(page = 1, pageSize = 20) {
  return useQuery({
    queryKey: ['admin-culture-content', page, pageSize],
    queryFn: () => fetchCultureContent({ page, page_size: pageSize }),
  });
}

export function useCultureContentItem(id: string | null) {
  return useQuery({
    queryKey: ['admin-culture-content-item', id],
    queryFn: () => fetchCultureContentItem(id as string),
    enabled: !!id,
  });
}

export function useCreateCultureContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCultureContent,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-culture-content'] }),
  });
}

export function useUpdateCultureContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateCultureContentPayload }) =>
      updateCultureContent(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-culture-content'] }),
  });
}

export function useDeleteCultureContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCultureContent,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-culture-content'] }),
  });
}
