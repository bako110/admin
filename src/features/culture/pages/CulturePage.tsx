import { useState } from 'react';
import { Plus, ImageOff, Pencil, Trash2 } from 'lucide-react';

import { Button, Spinner, EmptyResults, DataTable, Badge, ConfirmDialog } from '../../../shared/ui';
import type { DataTableColumn } from '../../../shared/ui/DataTable';
import { useToastStore } from '../../../store/toast.store';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { useCultureContent, useDeleteCultureContent } from '../hooks/useCultureContent';
import { CreateCultureContentModal } from '../components/CreateCultureContentModal';
import { EditCultureContentModal } from '../components/EditCultureContentModal';
import { CULTURE_CONTENT_TYPE_LABELS, type CultureContentSummary } from '../types';
import styles from '../../../shared/ui/listPage.module.css';
import actionStyles from '../../../shared/ui/rowActions.module.css';

export function CulturePage() {
  const push = useToastStore((s) => s.push);
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CultureContentSummary | null>(null);
  const { data, isLoading, isError, refetch } = useCultureContent(page, 20);
  const { mutate: deleteCultureContent, isPending: isDeleting } = useDeleteCultureContent();

  function handleConfirmDelete() {
    if (!deleteTarget) return;
    deleteCultureContent(deleteTarget.id, {
      onSuccess: () => {
        push({ variant: 'success', message: 'Contenu culturel supprimé avec succès' });
        setDeleteTarget(null);
      },
      onError: (err) => push({ variant: 'error', message: extractApiErrorMessage(err, 'Une erreur est survenue') }),
    });
  }

  const columns: DataTableColumn<CultureContentSummary>[] = [
    {
      key: 'photo',
      header: '',
      width: '56px',
      render: (row) => (
        <div className={styles.thumb}>
          {row.cover_photo ? <img src={row.cover_photo} alt="" /> : <ImageOff size={16} strokeWidth={1.5} />}
        </div>
      ),
    },
    { key: 'title', header: 'Titre', render: (row) => <span className={styles.name}>{row.title}</span> },
    {
      key: 'type',
      header: 'Type',
      render: (row) => <Badge tone="brand">{CULTURE_CONTENT_TYPE_LABELS[row.type]}</Badge>,
    },
    { key: 'media_type', header: 'Média', render: (row) => row.media_type },
    { key: 'region', header: 'Région', render: (row) => row.region ?? '—' },
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
          <h1 className={styles.title}>Culture</h1>
          <p className={styles.subtitle}>Histoire, patrimoine, traditions et contenus culturels.</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus size={16} strokeWidth={2} />
          Créer un contenu
        </Button>
      </div>

      {isLoading && (
        <div className={styles.center}>
          <Spinner size={28} />
        </div>
      )}

      {!isLoading && isError && <EmptyResults variant="error" onRetry={() => refetch()} />}

      {!isLoading && !isError && data && data.items.length === 0 && (
        <EmptyResults variant="empty" title="Aucun contenu culturel" text="Créez le premier contenu culturel." />
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

      <CreateCultureContentModal open={createOpen} onClose={() => setCreateOpen(false)} />
      <EditCultureContentModal contentId={editId} onClose={() => setEditId(null)} />
      <ConfirmDialog
        open={!!deleteTarget}
        title="Supprimer le contenu culturel"
        text={`Voulez-vous vraiment supprimer « ${deleteTarget?.title} » ? Cette action est irréversible.`}
        confirmLabel="Supprimer"
        isPending={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
