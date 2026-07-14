import axios from 'axios';
import { Toast } from '@/components/ui';

type ApiErrorBody = {
  error?: boolean;
  message?: string;
};

const DEFAULT_MESSAGE = 'Algo deu errado. Tente novamente.';

export function onError(error: unknown, fallbackMessage: string = DEFAULT_MESSAGE): void {
  const message = axios.isAxiosError<ApiErrorBody>(error)
    ? error.response?.data?.message
    : undefined;

  Toast.show(message || fallbackMessage, { type: 'error' });
}
