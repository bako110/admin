import { apiClient } from '../../../shared/api/client';
import type { PaginatedResponse } from '../../../shared/api/types';
import type { CreateRestaurantPayload, RestaurantDetail, RestaurantSummary, UpdateRestaurantPayload } from '../types';

export async function fetchRestaurants(params: { page?: number; page_size?: number } = {}): Promise<
  PaginatedResponse<RestaurantSummary>
> {
  const { data } = await apiClient.get<PaginatedResponse<RestaurantSummary>>('/restaurants', { params });
  return data;
}

export async function fetchRestaurant(id: string): Promise<RestaurantDetail> {
  const { data } = await apiClient.get<RestaurantDetail>(`/restaurants/${id}`);
  return data;
}

export async function createRestaurant(payload: CreateRestaurantPayload) {
  const { data } = await apiClient.post('/restaurants', payload);
  return data;
}

export async function updateRestaurant(id: string, payload: UpdateRestaurantPayload) {
  const { data } = await apiClient.patch(`/restaurants/${id}`, payload);
  return data;
}

export async function deleteRestaurant(id: string) {
  await apiClient.delete(`/restaurants/${id}`);
}
