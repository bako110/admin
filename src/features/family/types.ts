export type FamilyServiceType =
  | 'activite_familiale'
  | 'sanitaire_public'
  | 'espace_repos'
  | 'aire_jeux'
  | 'garde_enfants'
  | 'point_eau';

export const FAMILY_SERVICE_TYPES: FamilyServiceType[] = [
  'activite_familiale',
  'sanitaire_public',
  'espace_repos',
  'aire_jeux',
  'garde_enfants',
  'point_eau',
];

export const FAMILY_SERVICE_TYPE_LABELS: Record<FamilyServiceType, string> = {
  activite_familiale: 'Activité familiale',
  sanitaire_public: 'Sanitaire public',
  espace_repos: 'Espace de repos',
  aire_jeux: 'Aire de jeux',
  garde_enfants: "Garde d'enfants",
  point_eau: "Point d'eau",
};

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface FamilyServiceSummary {
  id: string;
  name: string;
  type: FamilyServiceType;
  region: string;
  city?: string;
  location: GeoPoint;
  is_family_friendly: boolean;
}

export interface CreateFamilyServicePayload {
  name: string;
  type: FamilyServiceType;
  description?: string;
  region: string;
  city?: string;
  location: GeoPoint;
  address?: string;
  is_family_friendly?: boolean;
  contact_phone?: string;
}

export type UpdateFamilyServicePayload = Partial<CreateFamilyServicePayload>;

export interface FamilyServiceDetail {
  id: string;
  name: string;
  type: FamilyServiceType;
  description?: string;
  region: string;
  city?: string;
  location: GeoPoint;
  address?: string;
  is_family_friendly: boolean;
  is_verified_provider: boolean;
  contact_phone?: string;
}
