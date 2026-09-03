import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';

import { Button, Spinner, EmptyResults, DataTable, Badge, ConfirmDialog } from '../../../shared/ui';
import type { DataTableColumn } from '../../../shared/ui/DataTable';
import { useToastStore } from '../../../store/toast.store';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { useEduOutings, useDeleteEduOuting } from '../hooks/useEduOutings';
import { CreateEduOutingModal } from '../components/CreateEduOutingModal';
import { EditEduOutingModal } from '../components/EditEduOutingModal';
import { EDU_OUTING_TYPE_LABELS, type EduOutingSummary } from '../types';
import styles from '../../../shared/ui/listPage.module.css';
import actionStyles from '../../../shared/ui/rowActions.module.css';

export function EduOutingsPage() {
  const push = useToastStore((s) => s.push);
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<EduOutingSummary | null>(null);
  const { data, isLoading, isError, refetch } = useEduOutings(page, 20);
  const { mutate: deleteOuting, isPending: isDeleting } = useDeleteEduOuting();

  function handleConfirmDelete() {
    if (!deleteTarget) return;
    deleteOuting(deleteTarget.id, {
      onSuccess: () => {
        push({ variant: 'success', message: 'Sortie éducative supprimée avec succès' });
        setDeleteTarget(null);
      },
      onError: (err) => push({ variant: 'error', message: extractApiErrorMessage(err, 'Une erreur est survenue') }),
    });
  }

  const columns: DataTableColumn<EduOutingSummary>[] = [
    { key: 'title', header: 'Titre', render: (row) => <span className={styles.name}>{row.title}</span> },
    {
      key: 'type',
      header: 'Type',
      render: (row) => <Badge tone="brand">{EDU_OUTING_TYPE_LABELS[row.type]}</Badge>,
    },
    { key: 'region', header: 'Région', render: (row) => row.region },
    { key: 'city', header: 'Ville', render: (row) => row.city ?? '—' },
    {
      key: 'price',
      header: 'Prix / participant',
      render: (row) =>
        row.price_per_participant != null ? (
          <span className={styles.name}>
            {row.price_per_participant.toLocaleString('fr-FR')} {row.currency}
          </span>
        ) : (
          '—'
        ),
    },
    {
      key: 'max_participants',
      header: 'Max participants',
      render: (row) => row.max_participants ?? '—',
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
          <h1 className={styles.title}>Tourisme éducatif</h1>
          <p className={styles.subtitle}>Sorties scolaires, visites historiques, culturelles, scientifiques.</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus size={16} strokeWidth={2} />
          Créer une sortie
        </Button>
      </div>

      {isLoading && (
        <div className={styles.center}>
          <Spinner size={28} />
        </div>
      )}

      {!isLoading && isError && <EmptyResults variant="error" onRetry={() => refetch()} />}

      {!isLoading && !isError && data && data.items.length === 0 && (
        <EmptyResults variant="empty" title="Aucune sortie" text="Créez la première sortie éducative." />
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

      <CreateEduOutingModal open={createOpen} onClose={() => setCreateOpen(false)} />
      <EditEduOutingModal outingId={editId} onClose={() => setEditId(null)} />
      <ConfirmDialog
        open={!!deleteTarget}
        title="Supprimer la sortie"
        text={`Voulez-vous vraiment supprimer « ${deleteTarget?.title} » ? Cette action est irréversible.`}
        confirmLabel="Supprimer"
        isPending={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
