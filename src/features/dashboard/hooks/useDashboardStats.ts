import { useQuery } from '@tanstack/react-query';

import { apiClient } from '../../../shared/api/client';
import type { PaginatedResponse } from '../../../shared/api/types';

export interface DashboardStat {
  key: string;
  label: string;
  to: string;
  total: number;
}

interface StatSource {
  key: string;
  label: string;
  to: string;
  path: string;
  params?: Record<string, unknown>;
}

const SOURCES: StatSource[] = [
  { key: 'destinations', label: 'Destinations', to: '/destinations', path: '/destinations' },
  { key: 'hotels', label: 'Hébergements', to: '/hotels', path: '/hotels' },
  { key: 'restaurants', label: 'Restaurants', to: '/restaurants', path: '/restaurants' },
  { key: 'guides', label: 'Guides', to: '/guides', path: '/guides', params: { include_all_statuses: true } },
  { key: 'events', label: 'Événements', to: '/events', path: '/events' },
  { key: 'culture', label: 'Culture', to: '/culture', path: '/culture/content' },
  { key: 'market', label: 'Produits Artisanat', to: '/market', path: '/market/products' },
  { key: 'mobility', label: 'Transport', to: '/mobility', path: '/mobility/providers', params: { include_all_statuses: true } },
  { key: 'health', label: 'Santé', to: '/health', path: '/health-facilities' },
  { key: 'finance', label: 'Banques & argent', to: '/finance', path: '/money-services' },
  { key: 'connectivity', label: 'Connectivité', to: '/connectivity', path: '/connectivity' },
];

async function fetchCount(source: StatSource): Promise<DashboardStat> {
  try {
    const { data } = await apiClient.get<PaginatedResponse<unknown>>(source.path, {
      params: { ...source.params, page: 1, page_size: 1 },
    });
    return { key: source.key, label: source.label, to: source.to, total: data.total };
  } catch {
    return { key: source.key, label: source.label, to: source.to, total: 0 };
  }
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: () => Promise.all(SOURCES.map(fetchCount)),
  });
}
