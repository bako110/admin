import { useState } from 'react';
import { FileText, ImageOff, CheckCircle2, XCircle } from 'lucide-react';

import { Modal, Button, Spinner } from '../../../shared/ui';
import { useToastStore } from '../../../store/toast.store';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { useGuide, useApproveGuide, useRejectGuide } from '../hooks/useGuides';
import { usePendingVerifications } from '../../verification/hooks/useVerification';
import styles from './GuideReviewPanel.module.css';

const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  piece_identite: "Pièce d'identité",
  document_professionnel: 'Document professionnel',
  justificatif_adresse: "Justificatif d'adresse",
  autre: 'Autre document',
};

interface GuideReviewPanelProps {
  guideId: string | null;
  onClose: () => void;
}

export function GuideReviewPanel({ guideId, onClose }: GuideReviewPanelProps) {
  const push = useToastStore((s) => s.push);
  const open = !!guideId;
  const { data: guide, isLoading } = useGuide(guideId);
  const { data: verifications, isLoading: isLoadingDocs } = usePendingVerifications();
  const { mutate: approve, isPending: isApproving } = useApproveGuide();
  const { mutate: reject, isPending: isRejecting } = useRejectGuide();

  const [showRejectForm, setShowRejectForm] = useState(false);
  const [reason, setReason] = useState('');

  const documents = (verifications ?? []).filter((v) => v.user_id === guide?.user_id);

  function resetAndClose() {
    setShowRejectForm(false);
    setReason('');
    onClose();
  }

  function handleApprove() {
    if (!guideId) return;
    approve(guideId, {
      onSuccess: () => {
        push({ variant: 'success', message: 'Guide approuvé avec succès' });
        resetAndClose();
      },
      onError: (err) => push({ variant: 'error', message: extractApiErrorMessage(err, 'Une erreur est survenue') }),
    });
  }

  function handleReject() {
    if (!guideId || !reason.trim()) return;
    reject(
      { id: guideId, reason: reason.trim() },
      {
        onSuccess: () => {
          push({ variant: 'success', message: 'Guide rejeté avec motif envoyé' });
          resetAndClose();
        },
        onError: (err) => push({ variant: 'error', message: extractApiErrorMessage(err, 'Une erreur est survenue') }),
      },
    );
  }

  const isBusy = isApproving || isRejecting;

  return (
    <Modal open={open} onClose={resetAndClose} title="Vérifier le guide">
      {(isLoading || isLoadingDocs) && (
        <div className={styles.section}>
          <Spinner size={28} />
        </div>
      )}

      {!isLoading && !isLoadingDocs && guide && (
        <div className={styles.section}>
          <div className={styles.profileHeader}>
            <div className={styles.avatar}>
              {guide.photo_url ? <img src={guide.photo_url} alt="" /> : <ImageOff size={22} strokeWidth={1.5} />}
            </div>
            <div>
              <h3 className={styles.profileName}>{guide.display_name}</h3>
              <p className={styles.profileMeta}>Compte : {guide.user_id}</p>
            </div>
          </div>

          {guide.status === 'pending' && guide.rejection_reason && (
            <div className={styles.rejectionBanner}>
              <span className={styles.rejectionBannerLabel}>Motif du précédent rejet :</span>
              {guide.rejection_reason}
            </div>
          )}

          {guide.bio && <p className={styles.bio}>{guide.bio}</p>}

          <div className={styles.fieldGrid}>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Langues</span>
              <span className={styles.fieldValue}>{guide.languages.join(', ') || '—'}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Spécialités</span>
              <span className={styles.fieldValue}>{guide.specialties.join(', ') || '—'}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Régions couvertes</span>
              <span className={styles.fieldValue}>{guide.regions_covered.join(', ') || '—'}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Tarifs</span>
              <span className={styles.fieldValue}>
                {guide.daily_rate ? `${guide.daily_rate.toLocaleString('fr-FR')} ${guide.currency}/jour` : '—'}
                {guide.hourly_rate ? ` · ${guide.hourly_rate.toLocaleString('fr-FR')} ${guide.currency}/h` : ''}
              </span>
            </div>
          </div>

          <h4 className={styles.sectionTitle}>Documents soumis</h4>
          {documents.length === 0 ? (
            <p className={styles.noDocuments}>
              Aucun document de vérification en attente pour ce compte — ne pas approuver sans document.
            </p>
          ) : (
            <div className={styles.documentList}>
              {documents.map((doc) => (
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

          {!showRejectForm && (
            <div className={styles.actions}>
              <Button variant="danger" fullWidth disabled={isBusy} onClick={() => setShowRejectForm(true)}>
                <XCircle size={16} strokeWidth={2} />
                Rejeter
              </Button>
              <Button fullWidth disabled={isBusy} onClick={handleApprove}>
                {isApproving ? <Spinner size={18} /> : (
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
                <Button variant="secondary" fullWidth disabled={isBusy} onClick={() => setShowRejectForm(false)}>
                  Annuler
                </Button>
                <Button variant="danger" fullWidth disabled={isBusy || !reason.trim()} onClick={handleReject}>
                  {isRejecting ? <Spinner size={18} /> : 'Confirmer le rejet'}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
