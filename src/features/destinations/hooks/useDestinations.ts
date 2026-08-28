import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  fetchDestinations,
  fetchDestination,
  createDestination,
  updateDestination,
  deleteDestination,
} from '../api/destinations.api';
import type { UpdateDestinationPayload } from '../types';

export function useDestinations(page = 1, pageSize = 20) {
  return useQuery({
    queryKey: ['admin-destinations', page, pageSize],
    queryFn: () => fetchDestinations({ page, page_size: pageSize }),
  });
}

export function useDestination(id: string | null) {
  return useQuery({
    queryKey: ['admin-destination', id],
    queryFn: () => fetchDestination(id as string),
    enabled: !!id,
  });
}

export function useCreateDestination() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createDestination,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-destinations'] }),
  });
}

export function useUpdateDestination() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateDestinationPayload }) => updateDestination(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-destinations'] }),
  });
}

export function useDeleteDestination() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDestination,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-destinations'] }),
  });
}
