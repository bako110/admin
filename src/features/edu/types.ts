export type EduOutingType =
  | 'visite_historique'
  | 'visite_culturelle'
  | 'visite_scientifique'
  | 'visite_agricole'
  | 'visite_industrielle'
  | 'excursion_universitaire';

export const EDU_OUTING_TYPES: EduOutingType[] = [
  'visite_historique',
  'visite_culturelle',
  'visite_scientifique',
  'visite_agricole',
  'visite_industrielle',
  'excursion_universitaire',
];

export const EDU_OUTING_TYPE_LABELS: Record<EduOutingType, string> = {
  visite_historique: 'Visite historique',
  visite_culturelle: 'Visite culturelle',
  visite_scientifique: 'Visite scientifique',
  visite_agricole: 'Visite agricole',
  visite_industrielle: 'Visite industrielle',
  excursion_universitaire: 'Excursion universitaire',
};

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface EduOutingSummary {
  id: string;
  title: string;
  type: EduOutingType;
  region: string;
  city?: string;
  price_per_participant?: number;
  currency: string;
  max_participants?: number;
}

export interface CreateEduOutingPayload {
  title: string;
  type: EduOutingType;
  description: string;
  region: string;
  city?: string;
  location?: GeoPoint;
  target_level?: string;
  price_per_participant?: number;
  currency?: string;
  max_participants?: number;
}

export type UpdateEduOutingPayload = Partial<CreateEduOutingPayload>;

export interface EduOutingDetail {
  id: string;
  organizer_id: string;
  title: string;
  type: EduOutingType;
  description: string;
  region: string;
  city?: string;
  location?: GeoPoint;
  target_level?: string;
  price_per_participant?: number;
  currency: string;
  max_participants?: number;
  created_at: string;
}
