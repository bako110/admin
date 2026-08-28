import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { fetchRestaurants, fetchRestaurant, createRestaurant, updateRestaurant, deleteRestaurant } from '../api/restaurants.api';
import type { UpdateRestaurantPayload } from '../types';

export function useRestaurants(page = 1, pageSize = 20) {
  return useQuery({
    queryKey: ['admin-restaurants', page, pageSize],
    queryFn: () => fetchRestaurants({ page, page_size: pageSize }),
  });
}

export function useRestaurant(id: string | null) {
  return useQuery({
    queryKey: ['admin-restaurant', id],
    queryFn: () => fetchRestaurant(id as string),
    enabled: !!id,
  });
}

export function useCreateRestaurant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createRestaurant,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-restaurants'] }),
  });
}

export function useUpdateRestaurant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateRestaurantPayload }) => updateRestaurant(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-restaurants'] }),
  });
}

export function useDeleteRestaurant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteRestaurant,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-restaurants'] }),
  });
}
