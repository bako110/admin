import { useState } from 'react';

import { Spinner, EmptyResults, DataTable, Badge } from '../../../shared/ui';
import type { DataTableColumn } from '../../../shared/ui/DataTable';
import { useQuoteRequests } from '../hooks/useQuoteRequests';
import { QuoteRequestModal } from '../components/QuoteRequestModal';
import { QUOTE_REQUEST_STATUSES, QUOTE_REQUEST_STATUS_LABELS, type QuoteRequest, type QuoteRequestStatus } from '../types';
import styles from '../../../shared/ui/listPage.module.css';
import formStyles from '../../../shared/ui/formLayout.module.css';

const STATUS_BADGE_TONE: Record<QuoteRequestStatus, 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'brand'> = {
  submitted: 'info',
  in_review: 'warning',
  quoted: 'brand',
  accepted: 'success',
  declined: 'danger',
};

export function QuoteRequestsPage() {
  const [statusFilter, setStatusFilter] = useState<QuoteRequestStatus | ''>('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { data, isLoading, isError, refetch } = useQuoteRequests(statusFilter || undefined);

  const columns: DataTableColumn<QuoteRequest>[] = [
    { key: 'company_name', header: 'Entreprise', render: (row) => <span className={styles.name}>{row.company_name}</span> },
    { key: 'region', header: 'Région', render: (row) => row.region ?? '—' },
    { key: 'participant_count', header: 'Participants', render: (row) => row.participant_count },
    {
      key: 'quoted_amount',
      header: 'Montant devis',
      render: (row) => (row.quoted_amount != null ? `${row.quoted_amount.toLocaleString('fr-FR')} ${row.currency}` : '—'),
    },
    {
      key: 'status',
      header: 'Statut',
      render: (row) => <Badge tone={STATUS_BADGE_TONE[row.status]}>{QUOTE_REQUEST_STATUS_LABELS[row.status]}</Badge>,
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Tourisme d'affaires</h1>
          <p className={styles.subtitle}>Demandes de devis groupés : séminaires, congrès, team building.</p>
        </div>
        <div className={formStyles.field} style={{ minWidth: '220px' }}>
          <select
            className={formStyles.select}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as QuoteRequestStatus | '')}
          >
            <option value="">Tous les statuts</option>
            {QUOTE_REQUEST_STATUSES.map((s) => (
              <option key={s} value={s}>
                {QUOTE_REQUEST_STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading && (
        <div className={styles.center}>
          <Spinner size={28} />
        </div>
      )}

      {!isLoading && isError && <EmptyResults variant="error" onRetry={() => refetch()} />}

      {!isLoading && !isError && data && data.length === 0 && (
        <EmptyResults variant="empty" title="Aucune demande" text="Aucune demande de devis pour le moment." />
      )}

      {!isLoading && !isError && data && data.length > 0 && (
        <DataTable columns={columns} rows={data} getRowId={(row) => row.id} onRowClick={(row) => setSelectedId(row.id)} />
      )}

      <QuoteRequestModal quoteId={selectedId} onClose={() => setSelectedId(null)} />
    </div>
  );
}
