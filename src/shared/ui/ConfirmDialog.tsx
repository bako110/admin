import { AlertTriangle } from 'lucide-react';

import { Modal } from './Modal';
import { Button } from './Button';
import styles from './ConfirmDialog.module.css';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  text: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isPending?: boolean;
  danger?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmDialog({
  open,
  title,
  text,
  confirmLabel = 'Confirmer',
  cancelLabel = 'Annuler',
  isPending = false,
  danger = true,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className={styles.content}>
        <span className={styles.icon}>
          <AlertTriangle size={28} strokeWidth={1.75} />
        </span>
        <p className={styles.text}>{text}</p>
        <div className={styles.actions}>
          <Button variant="secondary" fullWidth onClick={onClose} disabled={isPending}>
            {cancelLabel}
          </Button>
          <Button variant={danger ? 'danger' : 'primary'} fullWidth onClick={onConfirm} disabled={isPending}>
            {isPending ? 'Chargement...' : confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
