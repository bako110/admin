export type CultureContentType =
  | 'histoire'
  | 'patrimoine_materiel'
  | 'patrimoine_immateriel'
  | 'tradition'
  | 'langue'
  | 'conte_legende'
  | 'musique_danse'
  | 'artisanat'
  | 'costume'
  | 'gastronomie'
  | 'personnalite';

export const CULTURE_CONTENT_TYPES: CultureContentType[] = [
  'histoire',
  'patrimoine_materiel',
  'patrimoine_immateriel',
  'tradition',
  'langue',
  'conte_legende',
  'musique_danse',
  'artisanat',
  'costume',
  'gastronomie',
  'personnalite',
];

export const CULTURE_CONTENT_TYPE_LABELS: Record<CultureContentType, string> = {
  histoire: 'Histoire',
  patrimoine_materiel: 'Patrimoine matériel',
  patrimoine_immateriel: 'Patrimoine immatériel',
  tradition: 'Tradition',
  langue: 'Langue',
  conte_legende: 'Conte / légende',
  musique_danse: 'Musique / danse',
  artisanat: 'Artisanat',
  costume: 'Costume',
  gastronomie: 'Gastronomie',
  personnalite: 'Personnalité',
};

export type CultureMediaType = 'texte' | 'audio' | 'video';

export const CULTURE_MEDIA_TYPES: CultureMediaType[] = ['texte', 'audio', 'video'];

export const CULTURE_MEDIA_TYPE_LABELS: Record<CultureMediaType, string> = {
  texte: 'Texte',
  audio: 'Audio',
  video: 'Vidéo',
};

export interface CultureContentSummary {
  id: string;
  title: string;
  type: CultureContentType;
  media_type: CultureMediaType;
  summary?: string;
  cover_photo?: string;
  region?: string;
}

export interface CreateCultureContentPayload {
  title: string;
  type: CultureContentType;
  media_type?: CultureMediaType;
  summary?: string;
  content?: string;
  media_url?: string;
  cover_photo?: string;
  region?: string;
  author?: string;
}

export type UpdateCultureContentPayload = Partial<CreateCultureContentPayload>;

export interface CultureContentDetail {
  id: string;
  title: string;
  type: CultureContentType;
  media_type: CultureMediaType;
  summary?: string;
  content?: string;
  media_url?: string;
  cover_photo?: string;
  region?: string;
  author?: string;
}
