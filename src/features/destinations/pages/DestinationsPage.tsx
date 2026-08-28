import { useState } from 'react';
import { Plus, Star, ImageOff, Pencil, Trash2 } from 'lucide-react';

import { Button, Spinner, EmptyResults, DataTable, Badge, ConfirmDialog } from '../../../shared/ui';
import type { DataTableColumn } from '../../../shared/ui/DataTable';
import { useToastStore } from '../../../store/toast.store';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { useDeleteDestination, useDestinations } from '../hooks/useDestinations';
import { CreateDestinationModal } from '../components/CreateDestinationModal';
import { EditDestinationModal } from '../components/EditDestinationModal';
import { DESTINATION_CATEGORY_LABELS, type DestinationSummary } from '../types';
import styles from '../../../shared/ui/listPage.module.css';
import actionStyles from '../../../shared/ui/rowActions.module.css';

export function DestinationsPage() {
  const push = useToastStore((s) => s.push);
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DestinationSummary | null>(null);
  const { data, isLoading, isError, refetch } = useDestinations(page, 20);
  const { mutate: deleteDestination, isPending: isDeleting } = useDeleteDestination();

  function handleConfirmDelete() {
    if (!deleteTarget) return;
    deleteDestination(deleteTarget.id, {
      onSuccess: () => {
        push({ variant: 'success', message: 'Destination supprimée avec succès' });
        setDeleteTarget(null);
      },
      onError: (err) => push({ variant: 'error', message: extractApiErrorMessage(err, 'Une erreur est survenue') }),
    });
  }

  const columns: DataTableColumn<DestinationSummary>[] = [
    {
      key: 'photo',
      header: '',
      width: '56px',
      render: (row) => (
        <div className={styles.thumb}>
          {row.photo ? <img src={row.photo} alt="" /> : <ImageOff size={16} strokeWidth={1.5} />}
        </div>
      ),
    },
    { key: 'name', header: 'Nom', render: (row) => <span className={styles.name}>{row.name}</span> },
    {
      key: 'category',
      header: 'Catégorie',
      render: (row) => <Badge tone="brand">{DESTINATION_CATEGORY_LABELS[row.category]}</Badge>,
    },
    { key: 'region', header: 'Région', render: (row) => row.region },
    { key: 'city', header: 'Ville', render: (row) => row.city ?? '—' },
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
          <h1 className={styles.title}>Destinations</h1>
          <p className={styles.subtitle}>Sites naturels, historiques, culturels et autres lieux touristiques.</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus size={16} strokeWidth={2} />
          Créer une destination
        </Button>
      </div>

      {isLoading && (
        <div className={styles.center}>
          <Spinner size={28} />
        </div>
      )}

      {!isLoading && isError && <EmptyResults variant="error" onRetry={() => refetch()} />}

      {!isLoading && !isError && data && data.items.length === 0 && (
        <EmptyResults variant="empty" title="Aucune destination" text="Créez la première destination." />
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

      <CreateDestinationModal open={createOpen} onClose={() => setCreateOpen(false)} />
      <EditDestinationModal destinationId={editId} onClose={() => setEditId(null)} />
      <ConfirmDialog
        open={!!deleteTarget}
        title="Supprimer la destination"
        text={`Voulez-vous vraiment supprimer « ${deleteTarget?.name} » ? Cette action est irréversible.`}
        confirmLabel="Supprimer"
        isPending={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
