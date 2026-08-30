import { useState } from 'react';
import { FileText, ImageOff } from 'lucide-react';

import { Button, Spinner, EmptyResults, DataTable, Badge } from '../../../shared/ui';
import type { DataTableColumn } from '../../../shared/ui/DataTable';
import { usePendingVerifications } from '../hooks/useVerification';
import { VerificationReviewModal } from '../components/VerificationReviewModal';
import type { VerificationRequestAdminSummary } from '../types';
import styles from '../../../shared/ui/listPage.module.css';

const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  piece_identite: "Pièce d'identité",
  document_professionnel: 'Document professionnel',
  justificatif_adresse: "Justificatif d'adresse",
  autre: 'Autre document',
};

const ROLE_LABELS: Record<string, string> = {
  guide: 'Guide',
  provider: 'Prestataire',
};

const ESTABLISHMENT_KIND_LABELS: Record<string, string> = {
  hotel: 'Hôtel',
  restaurant: 'Restaurant',
  transport: 'Transport',
  artisan: 'Artisanat',
};

export function VerificationQueuePage() {
  const { data, isLoading, isError, refetch } = usePendingVerifications();
  const [reviewTarget, setReviewTarget] = useState<VerificationRequestAdminSummary | null>(null);

  const pendingOnly = (data ?? []).filter((v) => v.status === 'pending');

  const columns: DataTableColumn<VerificationRequestAdminSummary>[] = [
    {
      key: 'user',
      header: 'Compte',
      render: (row) => (
        <div>
          <div className={styles.name}>{row.user_full_name}</div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>{row.user_email}</div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Rôle',
      render: (row) => <Badge tone="brand">{ROLE_LABELS[row.user_role] ?? row.user_role}</Badge>,
    },
    {
      key: 'document',
      header: 'Document soumis',
      render: (row) => (
        <a
          href={row.document_url}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <FileText size={14} strokeWidth={2} />
          {DOCUMENT_TYPE_LABELS[row.document_type] ?? row.document_type}
        </a>
      ),
    },
    {
      key: 'establishments',
      header: 'Établissements soumis',
      render: (row) =>
        row.pending_establishments.length === 0 ? (
          <span style={{ color: 'var(--color-text-muted)' }}>
            <ImageOff size={13} strokeWidth={2} style={{ verticalAlign: 'middle', marginRight: 4 }} />
            Aucun
          </span>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {row.pending_establishments.map((e, i) => (
              <span key={i} style={{ fontSize: '0.8125rem' }}>
                {ESTABLISHMENT_KIND_LABELS[e.kind] ?? e.kind} — {e.name}
              </span>
            ))}
          </div>
        ),
    },
    {
      key: 'created_at',
      header: 'Soumis le',
      render: (row) => new Date(row.created_at).toLocaleDateString('fr-FR'),
    },
    {
      key: 'actions',
      header: '',
      width: '140px',
      render: (row) => (
        <Button size="sm" onClick={() => setReviewTarget(row)}>
          Examiner
        </Button>
      ),
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Vérification des comptes professionnels</h1>
          <p className={styles.subtitle}>
            Guides et prestataires (hôtel, restaurant, transport, artisanat) en attente d'approbation.
          </p>
        </div>
      </div>

      {isLoading && (
        <div className={styles.center}>
          <Spinner size={28} />
        </div>
      )}

      {!isLoading && isError && <EmptyResults variant="error" onRetry={() => refetch()} />}

      {!isLoading && !isError && pendingOnly.length === 0 && (
        <EmptyResults variant="empty" title="Aucune demande en attente" text="Toutes les demandes ont été traitées." />
      )}

      {!isLoading && !isError && pendingOnly.length > 0 && (
        <DataTable
          columns={columns}
          rows={pendingOnly}
          getRowId={(row) => row.id}
          onRowClick={(row) => setReviewTarget(row)}
        />
      )}

      <VerificationReviewModal request={reviewTarget} onClose={() => setReviewTarget(null)} />
    </div>
  );
}
