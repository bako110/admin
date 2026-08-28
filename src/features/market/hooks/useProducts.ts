import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { fetchProducts, fetchProduct, createProduct, updateProduct, deleteProduct } from '../api/market.api';
import type { UpdateProductPayload } from '../types';

export { useArtisans } from './useArtisans';

export function useProducts(page = 1, pageSize = 20) {
  return useQuery({
    queryKey: ['admin-products', page, pageSize],
    queryFn: () => fetchProducts({ page, page_size: pageSize }),
  });
}

export function useProduct(id: string | null) {
  return useQuery({
    queryKey: ['admin-product', id],
    queryFn: () => fetchProduct(id as string),
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-products'] }),
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateProductPayload }) => updateProduct(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-products'] }),
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-products'] }),
  });
}
