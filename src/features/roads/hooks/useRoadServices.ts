import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { fetchRoadServices, fetchRoadService, createRoadService, updateRoadService, deleteRoadService } from '../api/roads.api';
import type { UpdateRoadServicePayload } from '../types';

export function useRoadServices(page = 1, pageSize = 20) {
  return useQuery({
    queryKey: ['admin-road-services', page, pageSize],
    queryFn: () => fetchRoadServices({ page, page_size: pageSize }),
  });
}

export function useRoadService(id: string | null) {
  return useQuery({
    queryKey: ['admin-road-service', id],
    queryFn: () => fetchRoadService(id as string),
    enabled: !!id,
  });
}

export function useCreateRoadService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createRoadService,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-road-services'] }),
  });
}

export function useUpdateRoadService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateRoadServicePayload }) => updateRoadService(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-road-services'] }),
  });
}

export function useDeleteRoadService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteRoadService,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-road-services'] }),
  });
}
