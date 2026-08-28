import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  fetchTransportProviders,
  fetchTransportProvider,
  createTransportProvider,
  updateTransportProvider,
  deleteTransportProvider,
} from '../api/mobility.api';
import type { UpdateTransportProviderPayload } from '../types';

export function useTransportProviders(page = 1, pageSize = 20) {
  return useQuery({
    queryKey: ['admin-transport-providers', page, pageSize],
    queryFn: () => fetchTransportProviders({ page, page_size: pageSize }),
  });
}

export function useTransportProvider(id: string | null) {
  return useQuery({
    queryKey: ['admin-transport-provider', id],
    queryFn: () => fetchTransportProvider(id as string),
    enabled: !!id,
  });
}

export function useCreateTransportProvider() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTransportProvider,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-transport-providers'] }),
  });
}

export function useUpdateTransportProvider() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateTransportProviderPayload }) =>
      updateTransportProvider(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-transport-providers'] }),
  });
}

export function useDeleteTransportProvider() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTransportProvider,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-transport-providers'] }),
  });
}
