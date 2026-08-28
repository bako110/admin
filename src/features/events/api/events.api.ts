import { apiClient } from '../../../shared/api/client';
import type { PaginatedResponse } from '../../../shared/api/types';
import type { CreateEventPayload, EventDetail, EventSummary, UpdateEventPayload } from '../types';

export async function fetchEvents(params: { page?: number; page_size?: number } = {}): Promise<
  PaginatedResponse<EventSummary>
> {
  const { data } = await apiClient.get<PaginatedResponse<EventSummary>>('/events', { params });
  return data;
}

export async function fetchEvent(id: string): Promise<EventDetail> {
  const { data } = await apiClient.get<EventDetail>(`/events/${id}`);
  return data;
}

export async function createEvent(payload: CreateEventPayload) {
  const { data } = await apiClient.post('/events', payload);
  return data;
}

export async function updateEvent(id: string, payload: UpdateEventPayload) {
  const { data } = await apiClient.patch(`/events/${id}`, payload);
  return data;
}

export async function deleteEvent(id: string) {
  await apiClient.delete(`/events/${id}`);
}
