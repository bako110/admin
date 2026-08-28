export type AccommodationType =
  | 'hotel'
  | 'auberge'
  | 'campement'
  | 'maison_hotes'
  | 'residence'
  | 'hebergement_habitant'
  | 'hebergement_communautaire';

export const ACCOMMODATION_TYPES: AccommodationType[] = [
  'hotel',
  'auberge',
  'campement',
  'maison_hotes',
  'residence',
  'hebergement_habitant',
  'hebergement_communautaire',
];

export const ACCOMMODATION_TYPE_LABELS: Record<AccommodationType, string> = {
  hotel: 'Hôtel',
  auberge: 'Auberge',
  campement: 'Campement',
  maison_hotes: "Maison d'hôtes",
  residence: 'Résidence',
  hebergement_habitant: "Hébergement chez l'habitant",
  hebergement_communautaire: 'Hébergement communautaire',
};

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface HotelSummary {
  id: string;
  name: string;
  type: AccommodationType;
  region: string;
  city?: string;
  photo?: string;
  min_price?: number;
  currency: string;
  average_rating: number;
  review_count: number;
  is_verified: boolean;
}

export interface CreateHotelPayload {
  name: string;
  type: AccommodationType;
  description: string;
  region: string;
  city?: string;
  location: GeoPoint;
  address?: string;
  photos?: string[];
  amenities?: string[];
  contact_phone?: string;
  contact_email?: string;
}

export type UpdateHotelPayload = Partial<CreateHotelPayload>;

export interface HotelDetail {
  id: string;
  name: string;
  type: AccommodationType;
  description: string;
  region: string;
  city?: string;
  location: GeoPoint;
  address?: string;
  photos: string[];
  amenities: string[];
  contact_phone?: string;
  contact_email?: string;
}
