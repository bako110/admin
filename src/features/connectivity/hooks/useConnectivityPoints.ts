import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  fetchConnectivityPoints,
  fetchConnectivityPoint,
  createConnectivityPoint,
  updateConnectivityPoint,
  deleteConnectivityPoint,
} from '../api/connectivity.api';
import type { UpdateConnectivityPointPayload } from '../types';

export function useConnectivityPoints(page = 1, pageSize = 20) {
  return useQuery({
    queryKey: ['admin-connectivity-points', page, pageSize],
    queryFn: () => fetchConnectivityPoints({ page, page_size: pageSize }),
  });
}

export function useConnectivityPoint(id: string | null) {
  return useQuery({
    queryKey: ['admin-connectivity-point', id],
    queryFn: () => fetchConnectivityPoint(id as string),
    enabled: !!id,
  });
}

export function useCreateConnectivityPoint() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createConnectivityPoint,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-connectivity-points'] }),
  });
}

export function useUpdateConnectivityPoint() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateConnectivityPointPayload }) =>
      updateConnectivityPoint(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-connectivity-points'] }),
  });
}

export function useDeleteConnectivityPoint() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteConnectivityPoint,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-connectivity-points'] }),
  });
}
