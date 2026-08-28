export type ConnectivityPointType =
  | 'operateur_telecom'
  | 'point_vente_sim'
  | 'wifi_public'
  | 'wifi_prive'
  | 'coworking'
  | 'boutique_telephonie';

export const CONNECTIVITY_POINT_TYPES: ConnectivityPointType[] = [
  'operateur_telecom',
  'point_vente_sim',
  'wifi_public',
  'wifi_prive',
  'coworking',
  'boutique_telephonie',
];

export const CONNECTIVITY_POINT_TYPE_LABELS: Record<ConnectivityPointType, string> = {
  operateur_telecom: 'Opérateur télécom',
  point_vente_sim: 'Point de vente SIM',
  wifi_public: 'Wi-Fi public',
  wifi_prive: 'Wi-Fi privé',
  coworking: 'Coworking',
  boutique_telephonie: 'Boutique de téléphonie',
};

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface ConnectivityPointSummary {
  id: string;
  name: string;
  type: ConnectivityPointType;
  operator?: string;
  region: string;
  city?: string;
  location: GeoPoint;
  is_free?: boolean;
  offers_esim: boolean;
}

export interface CreateConnectivityPointPayload {
  name: string;
  type: ConnectivityPointType;
  operator?: string;
  region: string;
  city?: string;
  location: GeoPoint;
  address?: string;
  is_free?: boolean;
  offers_esim?: boolean;
  contact_phone?: string;
}

export type UpdateConnectivityPointPayload = Partial<CreateConnectivityPointPayload>;

export interface ConnectivityPointDetail {
  id: string;
  name: string;
  type: ConnectivityPointType;
  operator?: string;
  region: string;
  city?: string;
  location: GeoPoint;
  address?: string;
  is_free?: boolean;
  offers_esim: boolean;
  contact_phone?: string;
}
