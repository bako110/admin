import { useState } from 'react';
import { Plus, ImageOff, Pencil, Trash2, ShieldCheck, ShieldOff } from 'lucide-react';

import { Button, Spinner, EmptyResults, DataTable, Badge, ConfirmDialog } from '../../../shared/ui';
import type { DataTableColumn } from '../../../shared/ui/DataTable';
import { useToastStore } from '../../../store/toast.store';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { useArtisans, useDeleteArtisan, useVerifyArtisan } from '../hooks/useArtisans';
import { CreateArtisanModal } from '../components/CreateArtisanModal';
import { EditArtisanModal } from '../components/EditArtisanModal';
import type { ArtisanSummary } from '../types';
import styles from '../../../shared/ui/listPage.module.css';
import actionStyles from '../../../shared/ui/rowActions.module.css';

export function ArtisansTab() {
  const push = useToastStore((s) => s.push);
  const [createOpen, setCreateOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ArtisanSummary | null>(null);
  const { data, isLoading, isError, refetch } = useArtisans();
  const { mutate: deleteArtisan, isPending: isDeleting } = useDeleteArtisan();
  const { mutate: verifyArtisan, isPending: isVerifying } = useVerifyArtisan();

  function handleConfirmDelete() {
    if (!deleteTarget) return;
    deleteArtisan(deleteTarget.id, {
      onSuccess: () => {
        push({ variant: 'success', message: 'Artisan supprimé avec succès' });
        setDeleteTarget(null);
      },
      onError: (err) => push({ variant: 'error', message: extractApiErrorMessage(err, 'Une erreur est survenue') }),
    });
  }

  function handleToggleVerify(row: ArtisanSummary) {
    verifyArtisan(
      { id: row.id, isVerified: !row.is_verified },
      {
        onSuccess: () =>
          push({
            variant: 'success',
            message: row.is_verified ? 'Vérification retirée' : 'Artisan vérifié avec succès',
          }),
        onError: (err) => push({ variant: 'error', message: extractApiErrorMessage(err, 'Une erreur est survenue') }),
      },
    );
  }

  const columns: DataTableColumn<ArtisanSummary>[] = [
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
    { key: 'region', header: 'Région', render: (row) => row.region },
    { key: 'city', header: 'Ville', render: (row) => row.city ?? '—' },
    {
      key: 'verified',
      header: 'Vérifié',
      render: (row) => (row.is_verified ? <Badge tone="success">Vérifié</Badge> : <Badge tone="neutral">Non vérifié</Badge>),
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
          <p className={styles.subtitle}>Profils des artisans et vendeurs de la marketplace.</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus size={16} strokeWidth={2} />
          Créer un artisan
        </Button>
      </div>

      {isLoading && (
        <div className={styles.center}>
          <Spinner size={28} />
        </div>
      )}

      {!isLoading && isError && <EmptyResults variant="error" onRetry={() => refetch()} />}

      {!isLoading && !isError && data && data.length === 0 && (
        <EmptyResults variant="empty" title="Aucun artisan" text="Créez le premier artisan." />
      )}

      {!isLoading && !isError && data && data.length > 0 && (
        <DataTable columns={columns} rows={data} getRowId={(row) => row.id} />
      )}

      <CreateArtisanModal open={createOpen} onClose={() => setCreateOpen(false)} />
      <EditArtisanModal artisanId={editId} onClose={() => setEditId(null)} />
      <ConfirmDialog
        open={!!deleteTarget}
        title="Supprimer l'artisan"
        text={`Voulez-vous vraiment supprimer « ${deleteTarget?.display_name} » ? Cette action est irréversible.`}
        confirmLabel="Supprimer"
        isPending={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
