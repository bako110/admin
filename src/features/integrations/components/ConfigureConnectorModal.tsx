import { useEffect, useState, type FormEvent } from 'react';

import { Modal, Button, Input, Spinner } from '../../../shared/ui';
import { useToastStore } from '../../../store/toast.store';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { useUpsertConnector } from '../hooks/useConnectors';
import {
  CONNECTOR_TYPE_LABELS,
  type Connector,
  type ConnectorStatus,
  type ConnectorType,
} from '../types';
import styles from '../../../shared/ui/formLayout.module.css';

interface ConfigureConnectorModalProps {
  connectorType: ConnectorType | null;
  existing: Connector | undefined;
  onClose: () => void;
}

export function ConfigureConnectorModal({ connectorType, existing, onClose }: ConfigureConnectorModalProps) {
  const push = useToastStore((s) => s.push);
  const { mutate, isPending, error } = useUpsertConnector();

  const [providerName, setProviderName] = useState('');
  const [status, setStatus] = useState<ConnectorStatus>('not_configured');
  const [configNotes, setConfigNotes] = useState('');

  useEffect(() => {
    if (!connectorType) return;
    setProviderName(existing?.provider_name ?? '');
    setStatus(existing?.status ?? 'not_configured');
    setConfigNotes(existing?.config_notes ?? '');
  }, [connectorType, existing]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!connectorType) return;
    mutate(
      {
        type: connectorType,
        payload: { provider_name: providerName, status, config_notes: configNotes || undefined },
      },
      {
        onSuccess: () => {
          push({ variant: 'success', message: 'Connecteur mis à jour avec succès' });
          onClose();
        },
        onError: (err) => push({ variant: 'error', message: extractApiErrorMessage(err, 'Une erreur est survenue') }),
      },
    );
  }

  return (
    <Modal
      open={Boolean(connectorType)}
      onClose={onClose}
      title={connectorType ? `Configurer : ${CONNECTOR_TYPE_LABELS[connectorType]}` : ''}
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        <p className={styles.hint}>
          Les identifiants et clés API réels ne sont pas stockés ici — ils vivent dans les variables
          d'environnement du serveur. Ce formulaire ne gère que le statut et le fournisseur affichés.
        </p>

        <Input
          label="Fournisseur"
          name="provider_name"
          placeholder="Ex : Mapbox, OpenWeather, Orange Money"
          required
          minLength={2}
          value={providerName}
          onChange={(e) => setProviderName(e.target.value)}
        />

        <div className={styles.field}>
          <label htmlFor="status" className={styles.label}>
            Statut
          </label>
          <select
            id="status"
            className={styles.select}
            value={status}
            onChange={(e) => setStatus(e.target.value as ConnectorStatus)}
          >
            <option value="not_configured">Non configuré</option>
            <option value="configured">Configuré</option>
            <option value="disabled">Désactivé</option>
          </select>
        </div>

        <Input
          label="Notes de configuration (optionnel)"
          name="config_notes"
          value={configNotes}
          onChange={(e) => setConfigNotes(e.target.value)}
        />

        {error && <p className={styles.errorText}>{extractApiErrorMessage(error, 'Une erreur est survenue')}</p>}

        <Button type="submit" fullWidth disabled={isPending || providerName.trim().length < 2}>
          {isPending ? <Spinner size={18} /> : 'Enregistrer'}
        </Button>
      </form>
    </Modal>
  );
}
