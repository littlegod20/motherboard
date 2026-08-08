import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';
import type { Tier, UserProfile } from '../api/types';
import { getMe } from '../api/user';

const ACCESS_KEY = 'boardscan_access';
const REFRESH_KEY = 'boardscan_refresh';

type AuthUser = { id: string; email: string; tier: Tier };

type AuthState = {
  hydrated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  profile: UserProfile | null;
  hydrate: () => Promise<void>;
  setTokens: (
    accessToken: string,
    refreshToken: string,
    user: AuthUser,
  ) => Promise<void>;
  refreshProfile: () => Promise<UserProfile | null>;
  clearSession: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  hydrated: false,
  accessToken: null,
  refreshToken: null,
  user: null,
  profile: null,

  hydrate: async () => {
    try {
      const [accessToken, refreshToken] = await Promise.all([
        SecureStore.getItemAsync(ACCESS_KEY),
        SecureStore.getItemAsync(REFRESH_KEY),
      ]);
      if (accessToken && refreshToken) {
        set({ accessToken, refreshToken });
        try {
          const profile = await getMe();
          set({
            user: { id: profile.id, email: profile.email, tier: profile.tier },
            profile,
          });
        } catch {
          await get().clearSession();
        }
      }
    } finally {
      set({ hydrated: true });
    }
  },

  setTokens: async (accessToken, refreshToken, user) => {
    await Promise.all([
      SecureStore.setItemAsync(ACCESS_KEY, accessToken),
      SecureStore.setItemAsync(REFRESH_KEY, refreshToken),
    ]);
    set({ accessToken, refreshToken, user });
  },

  refreshProfile: async () => {
    try {
      const profile = await getMe();
      set({
        profile,
        user: { id: profile.id, email: profile.email, tier: profile.tier },
      });
      return profile;
    } catch {
      return null;
    }
  },

  clearSession: async () => {
    await Promise.all([
      SecureStore.deleteItemAsync(ACCESS_KEY),
      SecureStore.deleteItemAsync(REFRESH_KEY),
    ]);
    set({
      accessToken: null,
      refreshToken: null,
      user: null,
      profile: null,
    });
  },
}));
