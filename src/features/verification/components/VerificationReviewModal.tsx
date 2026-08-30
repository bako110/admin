import { useEffect, useState } from 'react';
import { FileText, CheckCircle2, XCircle } from 'lucide-react';

import { Modal, Button, Spinner } from '../../../shared/ui';
import { useToastStore } from '../../../store/toast.store';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { useReviewAccount } from '../hooks/useVerification';
import type { PendingAccountSummary } from '../types';
import styles from './VerificationReviewModal.module.css';

const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  piece_identite: "Pièce d'identité",
  document_professionnel: 'Document professionnel',
  justificatif_adresse: "Justificatif d'adresse",
  autre: 'Autre document',
};

const ESTABLISHMENT_KIND_LABELS: Record<string, string> = {
  hotel: 'Hôtel',
  restaurant: 'Restaurant',
  transport: 'Transport',
  artisan: 'Artisanat',
};

interface VerificationReviewModalProps {
  request: PendingAccountSummary | null;
  onClose: () => void;
}

export function VerificationReviewModal({ request, onClose }: VerificationReviewModalProps) {
  const push = useToastStore((s) => s.push);
  const { mutate: review, isPending } = useReviewAccount();

  const [showRejectForm, setShowRejectForm] = useState(false);
  const [reason, setReason] = useState('');

  useEffect(() => {
    setShowRejectForm(false);
    setReason('');
  }, [request]);

  if (!request) return null;

  function handleApprove() {
    if (!request) return;
    review(
      { userId: request.user_id, payload: { approve: true } },
      {
        onSuccess: () => {
          push({ variant: 'success', message: 'Compte approuvé : ses établissements en attente sont maintenant publiés.' });
          onClose();
        },
        onError: (err) => push({ variant: 'error', message: extractApiErrorMessage(err, 'Une erreur est survenue') }),
      },
    );
  }

  function handleReject() {
    if (!request || !reason.trim()) return;
    review(
      { userId: request.user_id, payload: { approve: false, review_notes: reason.trim() } },
      {
        onSuccess: () => {
          push({ variant: 'success', message: 'Demande rejetée avec motif envoyé au compte.' });
          onClose();
        },
        onError: (err) => push({ variant: 'error', message: extractApiErrorMessage(err, 'Une erreur est survenue') }),
      },
    );
  }

  return (
    <Modal open={Boolean(request)} onClose={onClose} title="Examiner le compte professionnel">
      <div className={styles.section}>
        <div className={styles.profileHeader}>
          <div>
            <h3 className={styles.profileName}>{request.user_full_name || 'Utilisateur'}</h3>
            <p className={styles.profileMeta}>{request.user_email || '—'}</p>
          </div>
        </div>

        <h4 className={styles.sectionTitle}>Documents soumis</h4>
        {request.documents.length === 0 ? (
          <p className={styles.noEstablishments}>
            Aucun document soumis par ce compte — vérifiez les établissements ci-dessous avant d'approuver.
          </p>
        ) : (
          <div className={styles.documentList}>
            {request.documents.map((doc) => (
              <div key={doc.id} className={styles.documentItem}>
                <span className={styles.documentInfo}>
                  <FileText size={16} strokeWidth={2} />
                  {DOCUMENT_TYPE_LABELS[doc.document_type] ?? doc.document_type}
                </span>
                <a href={doc.document_url} target="_blank" rel="noreferrer" className={styles.documentLink}>
                  Voir le document
                </a>
              </div>
            ))}
          </div>
        )}

        <h4 className={styles.sectionTitle}>Établissements soumis en attente</h4>
        {request.pending_establishments.length === 0 ? (
          <p className={styles.noEstablishments}>
            Aucun établissement soumis pour l'instant — ne pas approuver sans avoir vérifié qu'un profil complet
            (hôtel, restaurant, transport ou artisanat) a bien été renseigné par ce compte.
          </p>
        ) : (
          <div className={styles.establishmentList}>
            {request.pending_establishments.map((e, i) => (
              <div key={i} className={styles.establishmentItem}>
                <span className={styles.establishmentKind}>{ESTABLISHMENT_KIND_LABELS[e.kind] ?? e.kind}</span>
                <span>{e.name}</span>
              </div>
            ))}
          </div>
        )}

        {!showRejectForm && (
          <div className={styles.actions}>
            <Button variant="danger" fullWidth disabled={isPending} onClick={() => setShowRejectForm(true)}>
              <XCircle size={16} strokeWidth={2} />
              Rejeter
            </Button>
            <Button fullWidth disabled={isPending} onClick={handleApprove}>
              {isPending ? (
                <Spinner size={18} />
              ) : (
                <>
                  <CheckCircle2 size={16} strokeWidth={2} />
                  Approuver
                </>
              )}
            </Button>
          </div>
        )}

        {showRejectForm && (
          <div className={styles.rejectForm}>
            <textarea
              className={styles.textarea}
              rows={3}
              placeholder="Expliquez précisément ce qui ne va pas (document illisible, info manquante, incohérence...)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              autoFocus
            />
            <div className={styles.actions}>
              <Button variant="secondary" fullWidth disabled={isPending} onClick={() => setShowRejectForm(false)}>
                Annuler
              </Button>
              <Button variant="danger" fullWidth disabled={isPending || !reason.trim()} onClick={handleReject}>
                {isPending ? <Spinner size={18} /> : 'Confirmer le rejet'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
