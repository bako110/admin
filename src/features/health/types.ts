export type HealthFacilityType =
  | 'pharmacie'
  | 'hopital'
  | 'clinique'
  | 'laboratoire'
  | 'centre_premiers_secours'
  | 'dentiste'
  | 'autre';

export const HEALTH_FACILITY_TYPES: HealthFacilityType[] = [
  'pharmacie',
  'hopital',
  'clinique',
  'laboratoire',
  'centre_premiers_secours',
  'dentiste',
  'autre',
];

export const HEALTH_FACILITY_TYPE_LABELS: Record<HealthFacilityType, string> = {
  pharmacie: 'Pharmacie',
  hopital: 'Hôpital',
  clinique: 'Clinique',
  laboratoire: 'Laboratoire',
  centre_premiers_secours: 'Centre de premiers secours',
  dentiste: 'Dentiste',
  autre: 'Autre',
};

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface HealthFacilitySummary {
  id: string;
  name: string;
  type: HealthFacilityType;
  region: string;
  city?: string;
  location: GeoPoint;
  is_on_duty: boolean;
  contact_phone?: string;
}

export interface CreateHealthFacilityPayload {
  name: string;
  type: HealthFacilityType;
  description?: string;
  region: string;
  city?: string;
  location: GeoPoint;
  address?: string;
  is_on_duty?: boolean;
  services?: string[];
  contact_phone?: string;
}

export type UpdateHealthFacilityPayload = Partial<CreateHealthFacilityPayload>;

export interface HealthFacilityDetail {
  id: string;
  name: string;
  type: HealthFacilityType;
  description?: string;
  region: string;
  city?: string;
  location: GeoPoint;
  address?: string;
  is_on_duty: boolean;
  services: string[];
  contact_phone?: string;
}
