import { useState, type FormEvent } from 'react';

import { Modal, Button, Input, Spinner } from '../../../shared/ui';
import { useToastStore } from '../../../store/toast.store';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { useCreateWebhook } from '../hooks/useWebhooks';
import { WEBHOOK_EVENT_TYPES, WEBHOOK_EVENT_TYPE_LABELS, type WebhookEventType } from '../types';
import styles from '../../../shared/ui/formLayout.module.css';

interface CreateWebhookModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateWebhookModal({ open, onClose }: CreateWebhookModalProps) {
  const push = useToastStore((s) => s.push);
  const { mutate, isPending, error } = useCreateWebhook();

  const [eventType, setEventType] = useState<WebhookEventType>('booking_created');
  const [targetUrl, setTargetUrl] = useState('');

  function resetAndClose() {
    setEventType('booking_created');
    setTargetUrl('');
    onClose();
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    mutate(
      { event_type: eventType, target_url: targetUrl },
      {
        onSuccess: () => {
          push({ variant: 'success', message: 'Webhook créé avec succès' });
          resetAndClose();
        },
        onError: (err) => push({ variant: 'error', message: extractApiErrorMessage(err, 'Une erreur est survenue') }),
      },
    );
  }

  return (
    <Modal open={open} onClose={resetAndClose} title="Nouveau webhook">
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="event_type" className={styles.label}>
            Événement
          </label>
          <select
            id="event_type"
            className={styles.select}
            value={eventType}
            onChange={(e) => setEventType(e.target.value as WebhookEventType)}
          >
            {WEBHOOK_EVENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {WEBHOOK_EVENT_TYPE_LABELS[type]}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="URL cible"
          name="target_url"
          type="url"
          placeholder="https://mon-service.com/webhooks/fasoviva"
          required
          value={targetUrl}
          onChange={(e) => setTargetUrl(e.target.value)}
        />

        {error && <p className={styles.errorText}>{extractApiErrorMessage(error, 'Une erreur est survenue')}</p>}

        <Button type="submit" fullWidth disabled={isPending || !targetUrl.trim()}>
          {isPending ? <Spinner size={18} /> : 'Créer le webhook'}
        </Button>
      </form>
    </Modal>
  );
}
