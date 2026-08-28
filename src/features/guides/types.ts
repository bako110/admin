export interface CertificationInput {
  title: string;
  issued_by?: string;
  document_url?: string;
}

export interface GuideSummary {
  id: string;
  display_name: string;
  photo_url?: string;
  languages: string[];
  specialties: string[];
  regions_covered: string[];
  is_verified: boolean;
  average_rating: number;
  review_count: number;
  daily_rate?: number;
  currency: string;
}

export interface CreateGuidePayload {
  display_name: string;
  bio?: string;
  photo_url?: string;
  languages?: string[];
  specialties?: string[];
  regions_covered?: string[];
  hourly_rate?: number;
  daily_rate?: number;
  currency?: string;
}

export type UpdateGuidePayload = Partial<CreateGuidePayload>;

export interface GuideDetail {
  id: string;
  user_id: string;
  display_name: string;
  bio?: string;
  photo_url?: string;
  languages: string[];
  specialties: string[];
  regions_covered: string[];
  hourly_rate?: number;
  daily_rate?: number;
  currency: string;
  is_verified: boolean;
  status: 'pending' | 'active' | 'suspended';
}
