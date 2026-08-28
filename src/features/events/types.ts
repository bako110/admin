export type EventCategory =
  | 'festival'
  | 'concert'
  | 'foire'
  | 'exposition'
  | 'culturel'
  | 'sportif'
  | 'gastronomique'
  | 'ceremonie_traditionnelle'
  | 'conference'
  | 'salon';

export const EVENT_CATEGORIES: EventCategory[] = [
  'festival',
  'concert',
  'foire',
  'exposition',
  'culturel',
  'sportif',
  'gastronomique',
  'ceremonie_traditionnelle',
  'conference',
  'salon',
];

export const EVENT_CATEGORY_LABELS: Record<EventCategory, string> = {
  festival: 'Festival',
  concert: 'Concert',
  foire: 'Foire',
  exposition: 'Exposition',
  culturel: 'Culturel',
  sportif: 'Sportif',
  gastronomique: 'Gastronomique',
  ceremonie_traditionnelle: 'Cérémonie traditionnelle',
  conference: 'Conférence',
  salon: 'Salon',
};

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface EventSummary {
  id: string;
  title: string;
  category: EventCategory;
  region: string;
  city?: string;
  photo?: string;
  start_date: string;
  end_date?: string;
  ticket_price?: number;
  currency: string;
  requires_ticket: boolean;
}

export interface CreateEventPayload {
  title: string;
  description: string;
  category: EventCategory;
  region: string;
  city?: string;
  location: GeoPoint;
  address?: string;
  photos?: string[];
  start_date: string;
  end_date?: string;
  ticket_price?: number;
  currency?: string;
  requires_ticket?: boolean;
}

export type UpdateEventPayload = Partial<CreateEventPayload>;

export interface EventDetail {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  region: string;
  city?: string;
  location: GeoPoint;
  address?: string;
  photos: string[];
  start_date: string;
  end_date?: string;
  ticket_price?: number;
  currency: string;
  requires_ticket: boolean;
}
