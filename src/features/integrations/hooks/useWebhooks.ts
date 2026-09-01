import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createWebhook, deleteWebhook, fetchMyWebhooks } from '../api/integrations.api';

export function useMyWebhooks() {
  return useQuery({
    queryKey: ['admin-webhooks'],
    queryFn: fetchMyWebhooks,
  });
}

export function useCreateWebhook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createWebhook,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-webhooks'] }),
  });
}

export function useDeleteWebhook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteWebhook,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-webhooks'] }),
  });
}
