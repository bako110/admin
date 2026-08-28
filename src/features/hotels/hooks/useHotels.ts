import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { fetchHotels, fetchHotel, createHotel, updateHotel, deleteHotel } from '../api/hotels.api';
import type { UpdateHotelPayload } from '../types';

export function useHotels(page = 1, pageSize = 20) {
  return useQuery({
    queryKey: ['admin-hotels', page, pageSize],
    queryFn: () => fetchHotels({ page, page_size: pageSize }),
  });
}

export function useHotel(id: string | null) {
  return useQuery({
    queryKey: ['admin-hotel', id],
    queryFn: () => fetchHotel(id as string),
    enabled: !!id,
  });
}

export function useCreateHotel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createHotel,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-hotels'] }),
  });
}

export function useUpdateHotel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateHotelPayload }) => updateHotel(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-hotels'] }),
  });
}

export function useDeleteHotel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteHotel,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-hotels'] }),
  });
}
