export type DiasporaContentType =
  | 'circuit_culturel'
  | 'patrimoine_familial'
  | 'hebergement'
  | 'transport'
  | 'evenement_culturel'
  | 'service_visiteur_retour';

export const DIASPORA_CONTENT_TYPES: DiasporaContentType[] = [
  'circuit_culturel',
  'patrimoine_familial',
  'hebergement',
  'transport',
  'evenement_culturel',
  'service_visiteur_retour',
];

export const DIASPORA_CONTENT_TYPE_LABELS: Record<DiasporaContentType, string> = {
  circuit_culturel: 'Circuit culturel',
  patrimoine_familial: 'Patrimoine familial',
  hebergement: 'Hébergement',
  transport: 'Transport',
  evenement_culturel: 'Événement culturel',
  service_visiteur_retour: 'Service visiteur de retour',
};

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface DiasporaContent {
  id: string;
  title: string;
  type: DiasporaContentType;
  description: string;
  region?: string;
  location?: GeoPoint;
  related_destination_id?: string;
  created_at: string;
}

export interface CreateDiasporaContentPayload {
  title: string;
  type: DiasporaContentType;
  description: string;
  region?: string;
  location?: GeoPoint;
  related_destination_id?: string;
}

export type UpdateDiasporaContentPayload = Partial<CreateDiasporaContentPayload>;
