import { useEffect } from 'react';
import { X, Info, CheckCircle2, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

import { useToastStore, type Toast } from '../../store/toast.store';
import styles from './ToastViewport.module.css';

const AUTO_DISMISS_MS = 5000;
const VARIANT_ICON = {
  info: Info,
  success: CheckCircle2,
  error: AlertCircle,
} as const;

function ToastItem({ toast }: { toast: Toast }) {
  const dismiss = useToastStore((s) => s.dismiss);
  const Icon = VARIANT_ICON[toast.variant];

  useEffect(() => {
    const timer = setTimeout(() => dismiss(toast.id), AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [toast.id, dismiss]);

  return (
    <div className={clsx(styles.toast, styles[toast.variant])} role="status">
      <Icon size={18} strokeWidth={2} className={styles.icon} />
      <p className={styles.message}>{toast.message}</p>
      {toast.actionLabel && toast.onAction && (
        <button
          type="button"
          className={styles.action}
          onClick={() => {
            toast.onAction?.();
            dismiss(toast.id);
          }}
        >
          {toast.actionLabel}
        </button>
      )}
      <button type="button" className={styles.close} onClick={() => dismiss(toast.id)} aria-label="Close">
        <X size={15} strokeWidth={2} />
      </button>
    </div>
  );
}

export function ToastViewport() {
  const toasts = useToastStore((s) => s.toasts);

  if (toasts.length === 0) return null;

  return (
    <div className={styles.viewport}>
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}
