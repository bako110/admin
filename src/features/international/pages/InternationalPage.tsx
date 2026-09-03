import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';

import { Button, Spinner, EmptyResults, DataTable, Badge, ConfirmDialog } from '../../../shared/ui';
import type { DataTableColumn } from '../../../shared/ui/DataTable';
import { useToastStore } from '../../../store/toast.store';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { useGuideEntries, useDeleteGuideEntry, useSupportedLanguages, useSetLanguageActive } from '../hooks/useGuideEntries';
import { CreateGuideEntryModal } from '../components/CreateGuideEntryModal';
import { EditGuideEntryModal } from '../components/EditGuideEntryModal';
import { FIRST_VISIT_GUIDE_CATEGORY_LABELS, type GuideEntry } from '../types';
import styles from '../../../shared/ui/listPage.module.css';
import actionStyles from '../../../shared/ui/rowActions.module.css';

export function InternationalPage() {
  const push = useToastStore((s) => s.push);
  const [createOpen, setCreateOpen] = useState(false);
  const [editEntry, setEditEntry] = useState<GuideEntry | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<GuideEntry | null>(null);
  const { data, isLoading, isError, refetch } = useGuideEntries();
  const { mutate: deleteEntry, isPending: isDeleting } = useDeleteGuideEntry();
  const { data: languages } = useSupportedLanguages();
  const { mutate: setLanguageActive } = useSetLanguageActive();

  function handleConfirmDelete() {
    if (!deleteTarget) return;
    deleteEntry(deleteTarget.id, {
      onSuccess: () => {
        push({ variant: 'success', message: 'Entrée du guide supprimée avec succès' });
        setDeleteTarget(null);
      },
      onError: (err) => push({ variant: 'error', message: extractApiErrorMessage(err, 'Une erreur est survenue') }),
    });
  }

  const columns: DataTableColumn<GuideEntry>[] = [
    { key: 'title', header: 'Titre', render: (row) => <span className={styles.name}>{row.title}</span> },
    {
      key: 'category',
      header: 'Catégorie',
      render: (row) => <Badge tone="brand">{FIRST_VISIT_GUIDE_CATEGORY_LABELS[row.category]}</Badge>,
    },
    { key: 'language', header: 'Langue', render: (row) => row.language.toUpperCase() },
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
              setEditEntry(row);
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
          <h1 className={styles.title}>Tourisme international</h1>
          <p className={styles.subtitle}>Guide de première visite et langues disponibles.</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus size={16} strokeWidth={2} />
          Créer une entrée
        </Button>
      </div>

      {languages && languages.length > 0 && (
        <div className={styles.header} style={{ flexWrap: 'wrap', gap: '8px' }}>
          {languages.map((lang) => (
            <Badge key={lang.code} tone={lang.is_active ? 'success' : 'neutral'}>
              <button
                type="button"
                style={{ all: 'unset', cursor: 'pointer' }}
                onClick={() => setLanguageActive({ code: lang.code, isActive: !lang.is_active })}
                title={lang.is_active ? 'Cliquer pour désactiver' : 'Cliquer pour activer'}
              >
                {lang.label} ({lang.code}) · {lang.is_active ? 'Active' : 'Inactive'}
              </button>
            </Badge>
          ))}
        </div>
      )}

      {isLoading && (
        <div className={styles.center}>
          <Spinner size={28} />
        </div>
      )}

      {!isLoading && isError && <EmptyResults variant="error" onRetry={() => refetch()} />}

      {!isLoading && !isError && data && data.length === 0 && (
        <EmptyResults variant="empty" title="Aucune entrée" text="Créez la première entrée du guide." />
      )}

      {!isLoading && !isError && data && data.length > 0 && (
        <DataTable columns={columns} rows={data} getRowId={(row) => row.id} />
      )}

      <CreateGuideEntryModal open={createOpen} onClose={() => setCreateOpen(false)} />
      <EditGuideEntryModal entry={editEntry} onClose={() => setEditEntry(null)} />
      <ConfirmDialog
        open={!!deleteTarget}
        title="Supprimer l'entrée"
        text={`Voulez-vous vraiment supprimer « ${deleteTarget?.title} » ? Cette action est irréversible.`}
        confirmLabel="Supprimer"
        isPending={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
