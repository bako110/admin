export type VerificationDocumentType =
  | 'piece_identite'
  | 'document_professionnel'
  | 'justificatif_adresse'
  | 'autre';

export type VerificationStatus = 'pending' | 'active' | 'suspended' | 'rejected';

export interface VerificationRequest {
  id: string;
  user_id: string;
  document_type: VerificationDocumentType;
  document_url: string;
  status: VerificationStatus;
  review_notes?: string;
  created_at: string;
}

export interface PendingEstablishmentSummary {
  kind: 'hotel' | 'restaurant' | 'transport' | 'artisan';
  name: string;
}

export interface SubmittedDocumentSummary {
  id: string;
  document_type: VerificationDocumentType;
  document_url: string;
  review_notes?: string;
  created_at: string;
}

export interface PendingAccountSummary {
  user_id: string;
  user_full_name: string;
  user_email: string;
  user_role: string;
  documents: SubmittedDocumentSummary[];
  pending_establishments: PendingEstablishmentSummary[];
  account_created_at: string;
}

export interface ReviewVerificationPayload {
  status: 'active' | 'rejected';
  review_notes?: string;
}

export interface ReviewAccountPayload {
  approve: boolean;
  review_notes?: string;
}
