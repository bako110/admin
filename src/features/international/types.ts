export type FirstVisitGuideCategory = 'culture_usages' | 'monnaie' | 'formalites' | 'sante_securite' | 'transport';

export const FIRST_VISIT_GUIDE_CATEGORIES: FirstVisitGuideCategory[] = [
  'culture_usages',
  'monnaie',
  'formalites',
  'sante_securite',
  'transport',
];

export const FIRST_VISIT_GUIDE_CATEGORY_LABELS: Record<FirstVisitGuideCategory, string> = {
  culture_usages: 'Culture & usages',
  monnaie: 'Monnaie',
  formalites: 'Formalités',
  sante_securite: 'Santé & sécurité',
  transport: 'Transport',
};

export interface GuideEntry {
  id: string;
  category: FirstVisitGuideCategory;
  title: string;
  content: string;
  language: string;
  updated_at: string;
}

export interface CreateGuideEntryPayload {
  category: FirstVisitGuideCategory;
  title: string;
  content: string;
  language?: string;
}

export type UpdateGuideEntryPayload = Partial<CreateGuideEntryPayload>;

export interface SupportedLanguage {
  code: string;
  label: string;
  is_active: boolean;
}
