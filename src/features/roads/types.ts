export type RoadServiceType =
  | 'station_service'
  | 'garage'
  | 'mecanicien'
  | 'vulcanisateur'
  | 'depannage'
  | 'remorquage'
  | 'lavage_auto'
  | 'pieces_auto'
  | 'parking'
  | 'borne_recharge';

export const ROAD_SERVICE_TYPES: RoadServiceType[] = [
  'station_service',
  'garage',
  'mecanicien',
  'vulcanisateur',
  'depannage',
  'remorquage',
  'lavage_auto',
  'pieces_auto',
  'parking',
  'borne_recharge',
];

export const ROAD_SERVICE_TYPE_LABELS: Record<RoadServiceType, string> = {
  station_service: 'Station-service',
  garage: 'Garage',
  mecanicien: 'Mécanicien',
  vulcanisateur: 'Vulcanisateur',
  depannage: 'Dépannage',
  remorquage: 'Remorquage',
  lavage_auto: 'Lavage auto',
  pieces_auto: 'Pièces auto',
  parking: 'Parking',
  borne_recharge: 'Borne de recharge',
};

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface RoadServiceSummary {
  id: string;
  name: string;
  type: RoadServiceType;
  region: string;
  city?: string;
  location: GeoPoint;
  offers_24h: boolean;
  contact_phone?: string;
}

export interface CreateRoadServicePayload {
  name: string;
  type: RoadServiceType;
  description?: string;
  region: string;
  city?: string;
  location: GeoPoint;
  address?: string;
  offers_24h?: boolean;
  contact_phone?: string;
}

export type UpdateRoadServicePayload = Partial<CreateRoadServicePayload>;

export interface RoadServiceDetail {
  id: string;
  name: string;
  type: RoadServiceType;
  description?: string;
  region: string;
  city?: string;
  location: GeoPoint;
  address?: string;
  offers_24h: boolean;
  contact_phone?: string;
}
