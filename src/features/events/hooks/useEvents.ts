import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { fetchEvents, fetchEvent, createEvent, updateEvent, deleteEvent } from '../api/events.api';
import type { UpdateEventPayload } from '../types';

export function useEvents(page = 1, pageSize = 20) {
  return useQuery({
    queryKey: ['admin-events', page, pageSize],
    queryFn: () => fetchEvents({ page, page_size: pageSize }),
  });
}

export function useEvent(id: string | null) {
  return useQuery({
    queryKey: ['admin-event', id],
    queryFn: () => fetchEvent(id as string),
    enabled: !!id,
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEvent,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-events'] }),
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateEventPayload }) => updateEvent(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-events'] }),
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-events'] }),
  });
}
