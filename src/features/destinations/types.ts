export type DestinationCategory =
  | 'site_naturel'
  | 'site_historique'
  | 'site_culturel'
  | 'site_religieux'
  | 'musee'
  | 'monument'
  | 'village_touristique'
  | 'marche_artisanal'
  | 'parc'
  | 'autre';

export const DESTINATION_CATEGORIES: DestinationCategory[] = [
  'site_naturel',
  'site_historique',
  'site_culturel',
  'site_religieux',
  'musee',
  'monument',
  'village_touristique',
  'marche_artisanal',
  'parc',
  'autre',
];

export const DESTINATION_CATEGORY_LABELS: Record<DestinationCategory, string> = {
  site_naturel: 'Site naturel',
  site_historique: 'Site historique',
  site_culturel: 'Site culturel',
  site_religieux: 'Site religieux',
  musee: 'Musée',
  monument: 'Monument',
  village_touristique: 'Village touristique',
  marche_artisanal: 'Marché artisanal',
  parc: 'Parc',
  autre: 'Autre',
};

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface DestinationSummary {
  id: string;
  name: string;
  slug: string;
  category: DestinationCategory;
  region: string;
  city?: string;
  location: GeoPoint;
  photo?: string;
  average_rating: number;
  review_count: number;
  price_info?: string;
}

export interface CreateDestinationPayload {
  name: string;
  description: string;
  category: DestinationCategory;
  region: string;
  province?: string;
  city?: string;
  location: GeoPoint;
  address?: string;
  photos?: string[];
  price_info?: string;
  contact_phone?: string;
  contact_email?: string;
}

export type UpdateDestinationPayload = Partial<CreateDestinationPayload>;

export interface DestinationDetail {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: DestinationCategory;
  region: string;
  province?: string;
  city?: string;
  location: GeoPoint;
  address?: string;
  photos: string[];
  price_info?: string;
  contact_phone?: string;
  contact_email?: string;
}
