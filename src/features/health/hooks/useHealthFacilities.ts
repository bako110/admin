import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  fetchHealthFacilities,
  fetchHealthFacility,
  createHealthFacility,
  updateHealthFacility,
  deleteHealthFacility,
} from '../api/health.api';
import type { UpdateHealthFacilityPayload } from '../types';

export function useHealthFacilities(page = 1, pageSize = 20) {
  return useQuery({
    queryKey: ['admin-health-facilities', page, pageSize],
    queryFn: () => fetchHealthFacilities({ page, page_size: pageSize }),
  });
}

export function useHealthFacility(id: string | null) {
  return useQuery({
    queryKey: ['admin-health-facility', id],
    queryFn: () => fetchHealthFacility(id as string),
    enabled: !!id,
  });
}

export function useCreateHealthFacility() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createHealthFacility,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-health-facilities'] }),
  });
}

export function useUpdateHealthFacility() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateHealthFacilityPayload }) =>
      updateHealthFacility(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-health-facilities'] }),
  });
}

export function useDeleteHealthFacility() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteHealthFacility,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-health-facilities'] }),
  });
}
