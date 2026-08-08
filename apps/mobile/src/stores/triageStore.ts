import { create } from 'zustand';
import type { TriageSession } from '../api/types';
import {
  analyzeTriageCheck,
  completeTriageSession,
  createTriageSession,
  getTriageSession,
} from '../api/triage';

type TriageState = {
  session: TriageSession | null;
  loading: boolean;
  ensureSession: () => Promise<TriageSession>;
  refreshSession: () => Promise<void>;
  analyze: (checkKey: string, imageUrl: string) => Promise<void>;
  complete: () => Promise<TriageSession>;
  reset: () => void;
};

export const useTriageStore = create<TriageState>((set, get) => ({
  session: null,
  loading: false,

  ensureSession: async () => {
    const existing = get().session;
    if (existing && existing.status === 'IN_PROGRESS') {
      return existing;
    }
    set({ loading: true });
    try {
      const session = await createTriageSession();
      set({ session });
      return session;
    } finally {
      set({ loading: false });
    }
  },

  refreshSession: async () => {
    const id = get().session?.id;
    if (!id) return;
    const session = await getTriageSession(id);
    set({ session });
  },

  analyze: async (checkKey, imageUrl) => {
    const session = get().session;
    if (!session) throw new Error('No triage session');
    set({ loading: true });
    try {
      await analyzeTriageCheck(session.id, checkKey, imageUrl);
      const updated = await getTriageSession(session.id);
      set({ session: updated });
    } finally {
      set({ loading: false });
    }
  },

  complete: async () => {
    const session = get().session;
    if (!session) throw new Error('No triage session');
    set({ loading: true });
    try {
      const completed = await completeTriageSession(session.id);
      set({ session: completed });
      return completed;
    } finally {
      set({ loading: false });
    }
  },

  reset: () => set({ session: null, loading: false }),
}));
