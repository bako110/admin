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

export interface VerificationRequestAdminSummary {
  id: string;
  user_id: string;
  user_full_name: string;
  user_email: string;
  user_role: string;
  document_type: VerificationDocumentType;
  document_url: string;
  status: VerificationStatus;
  review_notes?: string;
  created_at: string;
  pending_establishments: PendingEstablishmentSummary[];
}

export interface ReviewVerificationPayload {
  status: 'active' | 'rejected';
  review_notes?: string;
}
