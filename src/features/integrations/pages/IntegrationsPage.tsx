import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';

import { Button, Spinner, EmptyResults, DataTable, Badge, ConfirmDialog, Tabs } from '../../../shared/ui';
import type { DataTableColumn } from '../../../shared/ui/DataTable';
import { useToastStore } from '../../../store/toast.store';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { useConnectors } from '../hooks/useConnectors';
import { useDeleteWebhook, useMyWebhooks } from '../hooks/useWebhooks';
import { ConfigureConnectorModal } from '../components/ConfigureConnectorModal';
import { CreateWebhookModal } from '../components/CreateWebhookModal';
import { ImportDataPanel } from '../components/ImportDataPanel';
import {
  CONNECTOR_TYPES,
  CONNECTOR_TYPE_LABELS,
  CONNECTOR_STATUS_LABELS,
  WEBHOOK_EVENT_TYPE_LABELS,
  type Connector,
  type ConnectorStatus,
  type ConnectorType,
  type Webhook,
} from '../types';
import styles from '../../../shared/ui/listPage.module.css';
import actionStyles from '../../../shared/ui/rowActions.module.css';

const STATUS_TONE: Record<ConnectorStatus, 'neutral' | 'success' | 'warning'> = {
  not_configured: 'neutral',
  configured: 'success',
  disabled: 'warning',
};

export function IntegrationsPage() {
  const push = useToastStore((s) => s.push);
  const [tab, setTab] = useState<'connectors' | 'webhooks' | 'import'>('connectors');
  const [configuring, setConfiguring] = useState<ConnectorType | null>(null);
  const [createWebhookOpen, setCreateWebhookOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Webhook | null>(null);

  const { data: connectors, isLoading: connectorsLoading, isError: connectorsError, refetch: refetchConnectors } =
    useConnectors();
  const { data: webhooks, isLoading: webhooksLoading, isError: webhooksError, refetch: refetchWebhooks } =
    useMyWebhooks();
  const { mutate: deleteWebhook, isPending: isDeleting } = useDeleteWebhook();

  const connectorByType = new Map<ConnectorType, Connector>((connectors ?? []).map((c) => [c.type, c]));

  function handleConfirmDelete() {
    if (!deleteTarget) return;
    deleteWebhook(deleteTarget.id, {
      onSuccess: () => {
        push({ variant: 'success', message: 'Webhook supprimé avec succès' });
        setDeleteTarget(null);
      },
      onError: (err) => push({ variant: 'error', message: extractApiErrorMessage(err, 'Une erreur est survenue') }),
    });
  }

  const connectorColumns: DataTableColumn<{ type: ConnectorType; connector?: Connector }>[] = [
    {
      key: 'type',
      header: 'Connecteur',
      render: (row) => <span className={styles.name}>{CONNECTOR_TYPE_LABELS[row.type]}</span>,
    },
    {
      key: 'provider',
      header: 'Fournisseur',
      render: (row) => row.connector?.provider_name ?? '—',
    },
    {
      key: 'status',
      header: 'Statut',
      render: (row) => {
        const status = row.connector?.status ?? 'not_configured';
        return <Badge tone={STATUS_TONE[status]}>{CONNECTOR_STATUS_LABELS[status]}</Badge>;
      },
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
            title="Configurer"
            onClick={(e) => {
              e.stopPropagation();
              setConfiguring(row.type);
            }}
          >
            <Pencil size={15} strokeWidth={2} />
          </button>
        </div>
      ),
    },
  ];

  const webhookColumns: DataTableColumn<Webhook>[] = [
    {
      key: 'event_type',
      header: 'Événement',
      render: (row) => <Badge tone="brand">{WEBHOOK_EVENT_TYPE_LABELS[row.event_type]}</Badge>,
    },
    { key: 'target_url', header: 'URL cible', render: (row) => row.target_url },
    {
      key: 'is_active',
      header: 'Actif',
      render: (row) => (row.is_active ? <Badge tone="success">Oui</Badge> : <Badge tone="neutral">Non</Badge>),
    },
    {
      key: 'actions',
      header: '',
      width: '56px',
      render: (row) => (
        <div className={actionStyles.actions}>
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
          <h1 className={styles.title}>Intégrations</h1>
          <p className={styles.subtitle}>Connecteurs externes, webhooks et import de données en masse.</p>
        </div>
        {tab === 'webhooks' && (
          <Button onClick={() => setCreateWebhookOpen(true)}>
            <Plus size={16} strokeWidth={2} />
            Créer un webhook
          </Button>
        )}
      </div>

      <Tabs
        items={[
          { key: 'connectors', label: 'Connecteurs' },
          { key: 'webhooks', label: 'Webhooks' },
          { key: 'import', label: 'Import de données' },
        ]}
        active={tab}
        onChange={(key) => setTab(key as 'connectors' | 'webhooks' | 'import')}
      />

      {tab === 'connectors' && (
        <>
          {connectorsLoading && (
            <div className={styles.center}>
              <Spinner size={28} />
            </div>
          )}
          {!connectorsLoading && connectorsError && (
            <EmptyResults variant="error" onRetry={() => refetchConnectors()} />
          )}
          {!connectorsLoading && !connectorsError && (
            <DataTable
              columns={connectorColumns}
              rows={CONNECTOR_TYPES.map((type) => ({ type, connector: connectorByType.get(type) }))}
              getRowId={(row) => row.type}
            />
          )}
        </>
      )}

      {tab === 'webhooks' && (
        <>
          {webhooksLoading && (
            <div className={styles.center}>
              <Spinner size={28} />
            </div>
          )}
          {!webhooksLoading && webhooksError && <EmptyResults variant="error" onRetry={() => refetchWebhooks()} />}
          {!webhooksLoading && !webhooksError && (!webhooks || webhooks.length === 0) && (
            <EmptyResults variant="empty" title="Aucun webhook" text="Créez votre premier webhook." />
          )}
          {!webhooksLoading && !webhooksError && webhooks && webhooks.length > 0 && (
            <DataTable columns={webhookColumns} rows={webhooks} getRowId={(row) => row.id} />
          )}
        </>
      )}

      {tab === 'import' && <ImportDataPanel />}

      <ConfigureConnectorModal
        connectorType={configuring}
        existing={configuring ? connectorByType.get(configuring) : undefined}
        onClose={() => setConfiguring(null)}
      />
      <CreateWebhookModal open={createWebhookOpen} onClose={() => setCreateWebhookOpen(false)} />
      <ConfirmDialog
        open={!!deleteTarget}
        title="Supprimer le webhook"
        text="Voulez-vous vraiment supprimer ce webhook ? Cette action est irréversible."
        confirmLabel="Supprimer"
        isPending={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
