import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  fetchFamilyServices,
  fetchFamilyService,
  createFamilyService,
  updateFamilyService,
  deleteFamilyService,
} from '../api/family.api';
import type { UpdateFamilyServicePayload } from '../types';

export function useFamilyServices(page = 1, pageSize = 20) {
  return useQuery({
    queryKey: ['admin-family-services', page, pageSize],
    queryFn: () => fetchFamilyServices({ page, page_size: pageSize }),
  });
}

export function useFamilyService(id: string | null) {
  return useQuery({
    queryKey: ['admin-family-service', id],
    queryFn: () => fetchFamilyService(id as string),
    enabled: !!id,
  });
}

export function useCreateFamilyService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createFamilyService,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-family-services'] }),
  });
}

export function useUpdateFamilyService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateFamilyServicePayload }) => updateFamilyService(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-family-services'] }),
  });
}

export function useDeleteFamilyService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteFamilyService,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-family-services'] }),
  });
}
