import type * as React from 'react';
import { useToastStore } from '../../stores/toast-store';
import type { ToastOptions, ToastProps } from './Toast.types';
import { ToastViewport } from './ToastViewPort';

export const ToastProviderWithViewport: React.FC<ToastProps> = ({ children }) => {
  return (
    <>
      {children}
      <ToastViewport />
    </>
  );
};

export const Toast = {
  show: (content: React.ReactNode | string, options?: ToastOptions): string =>
    useToastStore.getState().show(content, options),

  update: (id: string, content: React.ReactNode | string, options?: ToastOptions): void =>
    useToastStore.getState().update(id, content, options),

  dismiss: (id: string): void =>
    useToastStore.getState().dismiss(id),

  dismissAll: (): void =>
    useToastStore.getState().dismissAll(),
};

export { useToastStore };
export type { ToastOptions, ToastPosition, ToastType } from './Toast.types';
