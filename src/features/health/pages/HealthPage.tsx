import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';

import { Button, Spinner, EmptyResults, DataTable, Badge, ConfirmDialog } from '../../../shared/ui';
import type { DataTableColumn } from '../../../shared/ui/DataTable';
import { useToastStore } from '../../../store/toast.store';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { useDeleteHealthFacility, useHealthFacilities } from '../hooks/useHealthFacilities';
import { CreateHealthFacilityModal } from '../components/CreateHealthFacilityModal';
import { EditHealthFacilityModal } from '../components/EditHealthFacilityModal';
import { HEALTH_FACILITY_TYPE_LABELS, type HealthFacilitySummary } from '../types';
import styles from '../../../shared/ui/listPage.module.css';
import actionStyles from '../../../shared/ui/rowActions.module.css';

export function HealthPage() {
  const push = useToastStore((s) => s.push);
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<HealthFacilitySummary | null>(null);
  const { data, isLoading, isError, refetch } = useHealthFacilities(page, 20);
  const { mutate: deleteHealthFacility, isPending: isDeleting } = useDeleteHealthFacility();

  function handleConfirmDelete() {
    if (!deleteTarget) return;
    deleteHealthFacility(deleteTarget.id, {
      onSuccess: () => {
        push({ variant: 'success', message: 'Établissement de santé supprimé avec succès' });
        setDeleteTarget(null);
      },
      onError: (err) => push({ variant: 'error', message: extractApiErrorMessage(err, 'Une erreur est survenue') }),
    });
  }

  const columns: DataTableColumn<HealthFacilitySummary>[] = [
    { key: 'name', header: 'Nom', render: (row) => <span className={styles.name}>{row.name}</span> },
    {
      key: 'type',
      header: 'Type',
      render: (row) => <Badge tone="brand">{HEALTH_FACILITY_TYPE_LABELS[row.type]}</Badge>,
    },
    { key: 'region', header: 'Région', render: (row) => row.region },
    { key: 'city', header: 'Ville', render: (row) => row.city ?? '—' },
    {
      key: 'on_duty',
      header: 'Garde',
      render: (row) => (row.is_on_duty ? <Badge tone="success">De garde</Badge> : '—'),
    },
    { key: 'contact_phone', header: 'Téléphone', render: (row) => row.contact_phone ?? '—' },
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
          <h1 className={styles.title}>Santé</h1>
          <p className={styles.subtitle}>Pharmacies, hôpitaux, cliniques et laboratoires.</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus size={16} strokeWidth={2} />
          Créer un établissement
        </Button>
      </div>

      {isLoading && (
        <div className={styles.center}>
          <Spinner size={28} />
        </div>
      )}

      {!isLoading && isError && <EmptyResults variant="error" onRetry={() => refetch()} />}

      {!isLoading && !isError && data && data.items.length === 0 && (
        <EmptyResults variant="empty" title="Aucun établissement" text="Créez le premier établissement de santé." />
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

      <CreateHealthFacilityModal open={createOpen} onClose={() => setCreateOpen(false)} />
      <EditHealthFacilityModal facilityId={editId} onClose={() => setEditId(null)} />
      <ConfirmDialog
        open={!!deleteTarget}
        title="Supprimer l'établissement"
        text={`Voulez-vous vraiment supprimer « ${deleteTarget?.name} » ? Cette action est irréversible.`}
        confirmLabel="Supprimer"
        isPending={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
