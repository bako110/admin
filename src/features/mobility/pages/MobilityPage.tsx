import { useState } from 'react';
import { Plus, Star, Pencil, Trash2 } from 'lucide-react';

import { Button, Spinner, EmptyResults, DataTable, Badge, ConfirmDialog } from '../../../shared/ui';
import type { DataTableColumn } from '../../../shared/ui/DataTable';
import { useToastStore } from '../../../store/toast.store';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { useDeleteTransportProvider, useTransportProviders } from '../hooks/useTransportProviders';
import { CreateTransportProviderModal } from '../components/CreateTransportProviderModal';
import { EditTransportProviderModal } from '../components/EditTransportProviderModal';
import { TRANSPORT_TYPE_LABELS, type TransportProviderSummary } from '../types';
import styles from '../../../shared/ui/listPage.module.css';
import actionStyles from '../../../shared/ui/rowActions.module.css';

export function MobilityPage() {
  const push = useToastStore((s) => s.push);
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TransportProviderSummary | null>(null);
  const { data, isLoading, isError, refetch } = useTransportProviders(page, 20);
  const { mutate: deleteTransportProvider, isPending: isDeleting } = useDeleteTransportProvider();

  function handleConfirmDelete() {
    if (!deleteTarget) return;
    deleteTransportProvider(deleteTarget.id, {
      onSuccess: () => {
        push({ variant: 'success', message: 'Prestataire de transport supprimé avec succès' });
        setDeleteTarget(null);
      },
      onError: (err) => push({ variant: 'error', message: extractApiErrorMessage(err, 'Une erreur est survenue') }),
    });
  }

  const columns: DataTableColumn<TransportProviderSummary>[] = [
    { key: 'name', header: 'Nom', render: (row) => <span className={styles.name}>{row.name}</span> },
    {
      key: 'type',
      header: 'Type',
      render: (row) => <Badge tone="brand">{TRANSPORT_TYPE_LABELS[row.type]}</Badge>,
    },
    { key: 'region', header: 'Région', render: (row) => row.region },
    { key: 'city', header: 'Ville', render: (row) => row.city ?? '—' },
    {
      key: 'price',
      header: 'Prix estimé',
      render: (row) => (row.price_estimate ? `${row.price_estimate.toLocaleString('fr-FR')} ${row.price_currency}` : '—'),
    },
    {
      key: 'rating',
      header: 'Note',
      render: (row) =>
        row.review_count > 0 ? (
          <span className={styles.rating}>
            <Star size={13} strokeWidth={2} fill="currentColor" />
            {row.average_rating.toFixed(1)} ({row.review_count})
          </span>
        ) : (
          '—'
        ),
    },
    {
      key: 'actions',
      header: '',
      width: '88px',
      render: (row) => (
        <div className={actionStyles.actions}>
          <button
            type="button"
            className={actionStyles.actionButton}
            title="Modifier"
            onClick={(e) => {
              e.stopPropagation();
              setEditId(row.id);
            }}
          >
            <Pencil size={15} strokeWidth={2} />
          </button>
          <button
            type="button"
            className={actionStyles.actionButton}
            title="Supprimer"
            onClick={(e) => {
              e.stopPropagation();
              setDeleteTarget(row);
            }}
          >
            <Trash2 size={15} strokeWidth={2} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Transport</h1>
          <p className={styles.subtitle}>Taxis, chauffeurs privés, location et transferts aéroport.</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus size={16} strokeWidth={2} />
          Créer un prestataire
        </Button>
      </div>

      {isLoading && (
        <div className={styles.center}>
          <Spinner size={28} />
        </div>
      )}

      {!isLoading && isError && <EmptyResults variant="error" onRetry={() => refetch()} />}

      {!isLoading && !isError && data && data.items.length === 0 && (
        <EmptyResults variant="empty" title="Aucun prestataire" text="Créez le premier prestataire de transport." />
      )}

      {!isLoading && !isError && data && data.items.length > 0 && (
        <>
          <DataTable columns={columns} rows={data.items} getRowId={(row) => row.id} />
          <div className={styles.pagination}>
            <Button variant="secondary" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
              Précédent
            </Button>
            <span className={styles.pageInfo}>
              Page {page} · {data.total} résultats
            </span>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={page * 20 >= data.total}
            >
              Suivant
            </Button>
          </div>
        </>
      )}

      <CreateTransportProviderModal open={createOpen} onClose={() => setCreateOpen(false)} />
      <EditTransportProviderModal providerId={editId} onClose={() => setEditId(null)} />
      <ConfirmDialog
        open={!!deleteTarget}
        title="Supprimer le prestataire"
        text={`Voulez-vous vraiment supprimer « ${deleteTarget?.name} » ? Cette action est irréversible.`}
        confirmLabel="Supprimer"
        isPending={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
