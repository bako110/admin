import { apiClient } from '../../../shared/api/client';
import type { PaginatedResponse } from '../../../shared/api/types';
import type {
  ArtisanDetail,
  ArtisanSummary,
  CreateArtisanPayload,
  CreateProductPayload,
  ProductDetail,
  ProductSummary,
  UpdateArtisanPayload,
  UpdateProductPayload,
} from '../types';

export async function fetchProducts(params: { page?: number; page_size?: number } = {}): Promise<
  PaginatedResponse<ProductSummary>
> {
  const { data } = await apiClient.get<PaginatedResponse<ProductSummary>>('/market/products', { params });
  return data;
}

export async function fetchProduct(id: string): Promise<ProductDetail> {
  const { data } = await apiClient.get<ProductDetail>(`/market/products/${id}`);
  return data;
}

export async function createProduct(payload: CreateProductPayload) {
  const { data } = await apiClient.post('/market/products', payload);
  return data;
}

export async function updateProduct(id: string, payload: UpdateProductPayload) {
  const { data } = await apiClient.patch(`/market/products/${id}`, payload);
  return data;
}

export async function deleteProduct(id: string) {
  await apiClient.delete(`/market/products/${id}`);
}

export async function fetchArtisans(): Promise<ArtisanSummary[]> {
  const { data } = await apiClient.get<ArtisanSummary[]>('/market/artisans', {
    params: { include_all_statuses: true },
  });
  return data;
}

export async function fetchArtisan(id: string): Promise<ArtisanDetail> {
  const { data } = await apiClient.get<ArtisanDetail>(`/market/artisans/${id}`);
  return data;
}

export async function createArtisan(payload: CreateArtisanPayload) {
  const { data } = await apiClient.post('/market/artisans', payload);
  return data;
}

export async function updateArtisan(id: string, payload: UpdateArtisanPayload) {
  const { data } = await apiClient.patch(`/market/artisans/${id}`, payload);
  return data;
}

export async function deleteArtisan(id: string) {
  await apiClient.delete(`/market/artisans/${id}`);
}

export async function verifyArtisan(id: string, isVerified: boolean) {
  const { data } = await apiClient.post(`/market/artisans/${id}/verify`, null, {
    params: { is_verified: isVerified },
  });
  return data;
}
