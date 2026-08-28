import { useState } from 'react';
import { Plus, Star, ImageOff, Trash2, Pencil, ShieldCheck, ShieldOff } from 'lucide-react';

import { Button, Spinner, EmptyResults, DataTable, Badge, ConfirmDialog } from '../../../shared/ui';
import type { DataTableColumn } from '../../../shared/ui/DataTable';
import { useToastStore } from '../../../store/toast.store';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { useDeleteGuide, useGuides, useVerifyGuide } from '../hooks/useGuides';
import { CreateGuideModal } from '../components/CreateGuideModal';
import { EditGuideModal } from '../components/EditGuideModal';
import type { GuideSummary } from '../types';
import styles from '../../../shared/ui/listPage.module.css';
import actionStyles from '../../../shared/ui/rowActions.module.css';

export function GuidesPage() {
  const push = useToastStore((s) => s.push);
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<GuideSummary | null>(null);
  const { data, isLoading, isError, refetch } = useGuides(page, 20);
  const { mutate: deleteGuide, isPending: isDeleting } = useDeleteGuide();
  const { mutate: verifyGuide, isPending: isVerifying } = useVerifyGuide();

  function handleConfirmDelete() {
    if (!deleteTarget) return;
    deleteGuide(deleteTarget.id, {
      onSuccess: () => {
        push({ variant: 'success', message: 'Guide supprimé avec succès' });
        setDeleteTarget(null);
      },
      onError: (err) => push({ variant: 'error', message: extractApiErrorMessage(err, 'Une erreur est survenue') }),
    });
  }

  function handleToggleVerify(row: GuideSummary) {
    verifyGuide(
      { id: row.id, isVerified: !row.is_verified },
      {
        onSuccess: () =>
          push({
            variant: 'success',
            message: row.is_verified ? 'Vérification retirée' : 'Guide vérifié avec succès',
          }),
        onError: (err) => push({ variant: 'error', message: extractApiErrorMessage(err, 'Une erreur est survenue') }),
      },
    );
  }

  const columns: DataTableColumn<GuideSummary>[] = [
    {
      key: 'photo',
      header: '',
      width: '56px',
      render: (row) => (
        <div className={styles.thumb}>
          {row.photo_url ? <img src={row.photo_url} alt="" /> : <ImageOff size={16} strokeWidth={1.5} />}
        </div>
      ),
    },
    { key: 'name', header: 'Nom', render: (row) => <span className={styles.name}>{row.display_name}</span> },
    {
      key: 'regions',
      header: 'Régions couvertes',
      render: (row) => (row.regions_covered.length > 0 ? row.regions_covered.join(', ') : '—'),
    },
    {
      key: 'specialties',
      header: 'Spécialités',
      render: (row) =>
        row.specialties.length > 0 ? (
          <Badge tone="brand">{row.specialties.join(', ')}</Badge>
        ) : (
          '—'
        ),
    },
    {
      key: 'verified',
      header: 'Vérifié',
      render: (row) => (row.is_verified ? <Badge tone="success">Vérifié</Badge> : <Badge tone="neutral">Non vérifié</Badge>),
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
      width: '128px',
      render: (row) => (
        <div className={actionStyles.actions}>
          <button
            type="button"
            className={actionStyles.actionButton}
            title={row.is_verified ? 'Retirer la vérification' : 'Vérifier'}
            disabled={isVerifying}
            onClick={(e) => {
              e.stopPropagation();
              handleToggleVerify(row);
            }}
          >
            {row.is_verified ? <ShieldOff size={15} strokeWidth={2} /> : <ShieldCheck size={15} strokeWidth={2} />}
          </button>
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
          <h1 className={styles.title}>Guides</h1>
          <p className={styles.subtitle}>Guides touristiques professionnels.</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus size={16} strokeWidth={2} />
          Créer un guide
        </Button>
      </div>

      {isLoading && (
        <div className={styles.center}>
          <Spinner size={28} />
        </div>
      )}

      {!isLoading && isError && <EmptyResults variant="error" onRetry={() => refetch()} />}

      {!isLoading && !isError && data && data.items.length === 0 && (
        <EmptyResults variant="empty" title="Aucun guide" text="Créez le premier guide." />
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

      <CreateGuideModal open={createOpen} onClose={() => setCreateOpen(false)} />
      <EditGuideModal guideId={editId} onClose={() => setEditId(null)} />
      <ConfirmDialog
        open={!!deleteTarget}
        title="Supprimer le guide"
        text={`Voulez-vous vraiment supprimer « ${deleteTarget?.display_name} » ? Cette action est irréversible.`}
        confirmLabel="Supprimer"
        isPending={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
