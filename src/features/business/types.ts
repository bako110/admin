export type BusinessServiceType =
  | 'salle_conference'
  | 'seminaire'
  | 'congres'
  | 'team_building'
  | 'transport_groupe'
  | 'restauration_groupe'
  | 'prestataire_evenementiel'
  | 'photographie_audiovisuel';

export const BUSINESS_SERVICE_TYPE_LABELS: Record<BusinessServiceType, string> = {
  salle_conference: 'Salle de conférence',
  seminaire: 'Séminaire',
  congres: 'Congrès',
  team_building: 'Team building',
  transport_groupe: 'Transport groupé',
  restauration_groupe: 'Restauration groupée',
  prestataire_evenementiel: 'Prestataire événementiel',
  photographie_audiovisuel: 'Photographie / audiovisuel',
};

export type QuoteRequestStatus = 'submitted' | 'in_review' | 'quoted' | 'accepted' | 'declined';

export const QUOTE_REQUEST_STATUSES: QuoteRequestStatus[] = ['submitted', 'in_review', 'quoted', 'accepted', 'declined'];

export const QUOTE_REQUEST_STATUS_LABELS: Record<QuoteRequestStatus, string> = {
  submitted: 'Soumise',
  in_review: 'En cours d’examen',
  quoted: 'Devis envoyé',
  accepted: 'Acceptée',
  declined: 'Refusée',
};

export interface QuoteRequest {
  id: string;
  requester_id: string;
  company_name: string;
  service_types: BusinessServiceType[];
  region?: string;
  event_date?: string;
  participant_count: number;
  notes?: string;
  quoted_amount?: number;
  currency: string;
  status: QuoteRequestStatus;
  created_at: string;
}

export interface UpdateQuoteRequestPayload {
  status?: QuoteRequestStatus;
  quoted_amount?: number;
  currency?: string;
}

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue';

export const INVOICE_STATUSES: InvoiceStatus[] = ['draft', 'sent', 'paid', 'overdue'];

export const INVOICE_STATUS_LABELS: Record<InvoiceStatus, string> = {
  draft: 'Brouillon',
  sent: 'Envoyée',
  paid: 'Payée',
  overdue: 'En retard',
};

export interface Invoice {
  id: string;
  quote_request_id: string;
  company_name: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  due_date?: string;
  created_at: string;
}

export interface CreateInvoicePayload {
  quote_request_id: string;
  amount: number;
  currency?: string;
  due_date?: string;
}
