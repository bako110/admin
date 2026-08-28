export type TransportType =
  | 'taxi_vtc'
  | 'chauffeur_prive'
  | 'location_voiture'
  | 'location_moto'
  | 'transport_interurbain'
  | 'transfert_aeroport'
  | 'transport_touristique_prive';

export const TRANSPORT_TYPES: TransportType[] = [
  'taxi_vtc',
  'chauffeur_prive',
  'location_voiture',
  'location_moto',
  'transport_interurbain',
  'transfert_aeroport',
  'transport_touristique_prive',
];

export const TRANSPORT_TYPE_LABELS: Record<TransportType, string> = {
  taxi_vtc: 'Taxi / VTC',
  chauffeur_prive: 'Chauffeur privé',
  location_voiture: 'Location de voiture',
  location_moto: 'Location de moto',
  transport_interurbain: 'Transport interurbain',
  transfert_aeroport: "Transfert aéroport",
  transport_touristique_prive: 'Transport touristique privé',
};

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface TransportProviderSummary {
  id: string;
  name: string;
  type: TransportType;
  region: string;
  city?: string;
  price_estimate?: number;
  price_currency: string;
  is_verified: boolean;
  average_rating: number;
  review_count: number;
}

export interface CreateTransportProviderPayload {
  name: string;
  type: TransportType;
  description?: string;
  region: string;
  city?: string;
  base_location?: GeoPoint;
  vehicle_info?: string;
  price_estimate?: number;
  price_currency?: string;
  contact_phone: string;
}

export type UpdateTransportProviderPayload = Partial<CreateTransportProviderPayload>;

export interface TransportProviderDetail {
  id: string;
  name: string;
  type: TransportType;
  description?: string;
  region: string;
  city?: string;
  base_location?: GeoPoint;
  vehicle_info?: string;
  price_estimate?: number;
  price_currency: string;
  contact_phone: string;
}
