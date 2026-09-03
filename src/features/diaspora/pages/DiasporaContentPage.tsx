import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';

import { Button, Spinner, EmptyResults, DataTable, Badge, ConfirmDialog } from '../../../shared/ui';
import type { DataTableColumn } from '../../../shared/ui/DataTable';
import { useToastStore } from '../../../store/toast.store';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { useDiasporaContents, useDeleteDiasporaContent } from '../hooks/useDiasporaContents';
import { CreateDiasporaContentModal } from '../components/CreateDiasporaContentModal';
import { EditDiasporaContentModal } from '../components/EditDiasporaContentModal';
import { DIASPORA_CONTENT_TYPE_LABELS, type DiasporaContent } from '../types';
import styles from '../../../shared/ui/listPage.module.css';
import actionStyles from '../../../shared/ui/rowActions.module.css';

export function DiasporaContentPage() {
  const push = useToastStore((s) => s.push);
  const [createOpen, setCreateOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DiasporaContent | null>(null);
  const { data, isLoading, isError, refetch } = useDiasporaContents();
  const { mutate: deleteContent, isPending: isDeleting } = useDeleteDiasporaContent();

  function handleConfirmDelete() {
    if (!deleteTarget) return;
    deleteContent(deleteTarget.id, {
      onSuccess: () => {
        push({ variant: 'success', message: 'Contenu diaspora supprimé avec succès' });
        setDeleteTarget(null);
      },
      onError: (err) => push({ variant: 'error', message: extractApiErrorMessage(err, 'Une erreur est survenue') }),
    });
  }

  const columns: DataTableColumn<DiasporaContent>[] = [
    { key: 'title', header: 'Titre', render: (row) => <span className={styles.name}>{row.title}</span> },
    {
      key: 'type',
      header: 'Type',
      render: (row) => <Badge tone="brand">{DIASPORA_CONTENT_TYPE_LABELS[row.type]}</Badge>,
    },
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
          <h1 className={styles.title}>Diaspora & tourisme de retour</h1>
          <p className={styles.subtitle}>Circuits culturels, patrimoine familial, services pour visiteurs de retour.</p>
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

      {!isLoading && !isError && data && data.length === 0 && (
        <EmptyResults variant="empty" title="Aucun contenu" text="Créez le premier contenu diaspora." />
      )}

      {!isLoading && !isError && data && data.length > 0 && (
        <DataTable columns={columns} rows={data} getRowId={(row) => row.id} />
      )}

      <CreateDiasporaContentModal open={createOpen} onClose={() => setCreateOpen(false)} />
      <EditDiasporaContentModal contentId={editId} onClose={() => setEditId(null)} />
      <ConfirmDialog
        open={!!deleteTarget}
        title="Supprimer le contenu"
        text={`Voulez-vous vraiment supprimer « ${deleteTarget?.title} » ? Cette action est irréversible.`}
        confirmLabel="Supprimer"
        isPending={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
