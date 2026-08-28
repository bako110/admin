export type EstablishmentType = 'restaurant' | 'maquis' | 'cafe' | 'street_food' | 'etablissement_touristique';

export const ESTABLISHMENT_TYPES: EstablishmentType[] = [
  'restaurant',
  'maquis',
  'cafe',
  'street_food',
  'etablissement_touristique',
];

export const ESTABLISHMENT_TYPE_LABELS: Record<EstablishmentType, string> = {
  restaurant: 'Restaurant',
  maquis: 'Maquis',
  cafe: 'Café',
  street_food: 'Street food',
  etablissement_touristique: 'Établissement touristique',
};

export type DietaryTag = 'famille' | 'vegetarien' | 'budget';

export const DIETARY_TAGS: DietaryTag[] = ['famille', 'vegetarien', 'budget'];

export const DIETARY_TAG_LABELS: Record<DietaryTag, string> = {
  famille: 'Famille',
  vegetarien: 'Végétarien',
  budget: 'Budget',
};

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface RestaurantSummary {
  id: string;
  name: string;
  type: EstablishmentType;
  cuisine_style?: string;
  region: string;
  city?: string;
  photo?: string;
  dietary_tags: DietaryTag[];
  average_rating: number;
  review_count: number;
}

export interface CreateRestaurantPayload {
  name: string;
  type: EstablishmentType;
  description: string;
  cuisine_style?: string;
  region: string;
  city?: string;
  location: GeoPoint;
  address?: string;
  photos?: string[];
  dietary_tags?: DietaryTag[];
  contact_phone?: string;
  contact_email?: string;
}

export type UpdateRestaurantPayload = Partial<CreateRestaurantPayload>;

export interface RestaurantDetail {
  id: string;
  name: string;
  type: EstablishmentType;
  description: string;
  cuisine_style?: string;
  region: string;
  city?: string;
  location: GeoPoint;
  address?: string;
  photos: string[];
  dietary_tags: DietaryTag[];
  contact_phone?: string;
  contact_email?: string;
}
