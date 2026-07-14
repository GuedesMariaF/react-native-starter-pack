import { create } from 'zustand';
import type { Toast, ToastContextValue, ToastOptions } from '../components/ui/Toast.types';

const DEFAULT_TOAST_OPTIONS: Required<ToastOptions> = {
  duration: 3000,
  type: 'default',
  position: 'top',
  backgroundColor: '#262626',
  onClose: () => {},
  action: null,
  expandedContent: null,
  style: {},
};

export const useToastStore = create<ToastContextValue>((set) => ({
  toasts: [],
  expandedToasts: new Set(),

  show: (content, options) => {
    const id = Math.random().toString(36).substring(2, 9);
    const toast: Toast = {
      id,
      content,
      options: { ...DEFAULT_TOAST_OPTIONS, ...options },
    };
    set((state) => ({ toasts: [...state.toasts, toast] }));
    setTimeout(() => {
      const duration = toast.options.duration;
      if (duration > 0) {
        useToastStore.getState().dismiss(id);
        toast.options.onClose?.();
      }
    }, toast.options.duration);
    return id;
  },

  update: (id, content, options) => {
    set((state) => ({
      toasts: state.toasts.map((t) =>
        t.id === id
          ? { ...t, content, options: { ...t.options, ...options } }
          : t,
      ),
    }));
  },

  dismiss: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
      expandedToasts: new Set([...state.expandedToasts].filter((eid) => eid !== id)),
    }));
  },

  dismissAll: () => {
    set({ toasts: [], expandedToasts: new Set() });
  },

  expandToast: (id) => {
    set((state) => {
      const newSet = new Set(state.expandedToasts);
      if (newSet.size >= 3 && !newSet.has(id)) {
        const firstId = Array.from(newSet)[0];
        newSet.delete(firstId);
      }
      newSet.add(id);
      return { expandedToasts: newSet };
    });
  },

  collapseToast: (id) => {
    set((state) => {
      const newSet = new Set(state.expandedToasts);
      newSet.delete(id);
      return { expandedToasts: newSet };
    });
  },
}));
