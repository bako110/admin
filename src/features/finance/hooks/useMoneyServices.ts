import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { fetchMoneyServices, fetchMoneyService, createMoneyService, updateMoneyService, deleteMoneyService } from '../api/finance.api';
import type { UpdateMoneyServicePayload } from '../types';

export function useMoneyServices(page = 1, pageSize = 20) {
  return useQuery({
    queryKey: ['admin-money-services', page, pageSize],
    queryFn: () => fetchMoneyServices({ page, page_size: pageSize }),
  });
}

export function useMoneyService(id: string | null) {
  return useQuery({
    queryKey: ['admin-money-service', id],
    queryFn: () => fetchMoneyService(id as string),
    enabled: !!id,
  });
}

export function useCreateMoneyService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMoneyService,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-money-services'] }),
  });
}

export function useUpdateMoneyService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateMoneyServicePayload }) => updateMoneyService(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-money-services'] }),
  });
}

export function useDeleteMoneyService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMoneyService,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-money-services'] }),
  });
}
