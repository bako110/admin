import { apiClient } from '../../../shared/api/client';
import type { PaginatedResponse } from '../../../shared/api/types';
import type { CreateHotelPayload, HotelDetail, HotelSummary, UpdateHotelPayload } from '../types';

export async function fetchHotels(params: { page?: number; page_size?: number } = {}): Promise<
  PaginatedResponse<HotelSummary>
> {
  const { data } = await apiClient.get<PaginatedResponse<HotelSummary>>('/hotels', { params });
  return data;
}

export async function fetchHotel(id: string): Promise<HotelDetail> {
  const { data } = await apiClient.get<HotelDetail>(`/hotels/${id}`);
  return data;
}

export async function createHotel(payload: CreateHotelPayload) {
  const { data } = await apiClient.post('/hotels', payload);
  return data;
}

export async function updateHotel(id: string, payload: UpdateHotelPayload) {
  const { data } = await apiClient.patch(`/hotels/${id}`, payload);
  return data;
}

export async function deleteHotel(id: string) {
  await apiClient.delete(`/hotels/${id}`);
}
