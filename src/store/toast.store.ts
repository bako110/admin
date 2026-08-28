import { create } from 'zustand';

export interface Toast {
  id: string;
  message: string;
  variant: 'info' | 'success' | 'error';
  actionLabel?: string;
  onAction?: () => void;
}

interface ToastState {
  toasts: Toast[];
  push: (toast: Omit<Toast, 'id'>) => void;
  dismiss: (id: string) => void;
}

let counter = 0;

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  push: (toast) => {
    const id = `toast-${Date.now()}-${counter++}`;
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
  },
  dismiss: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },
}));
