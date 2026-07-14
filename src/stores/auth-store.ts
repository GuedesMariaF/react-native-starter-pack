import { create } from 'zustand';
import { me } from '@/api/generated/auth/auth';
import type { LoginEmailAndPassword200DataUser, Me200Data } from '@/api/generated/models';
import {
  getStoredToken,
  removeStoredToken,
  setOnUnauthorized,
  updateStoredToken,
} from '@/lib/auth';
export type AuthUser = LoginEmailAndPassword200DataUser | Me200Data;

type AuthStore = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  bootstrap: () => Promise<void>; //qaundo inicia o app verifica se ainda tem token valido salvo e valida com a api
  completeLogin: (user: AuthUser, token: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  bootstrap: async () => {
    const token = await getStoredToken();
    if (!token) {
      set({ isLoading: false });
      return;
    }
    try {
      const response = await me();
      set({ user: response.data, isAuthenticated: true });
    } catch {
      await removeStoredToken();
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },
  completeLogin: async (user, token) => {
    await updateStoredToken(token);
    set({ user, isAuthenticated: true });
  },
  logout: async () => {
    await removeStoredToken();
    set({ user: null, isAuthenticated: false });
  },
}));
setOnUnauthorized(() => {
  useAuthStore.setState({ user: null, isAuthenticated: false });
});
