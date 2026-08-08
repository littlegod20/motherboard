import { apiRequest } from './client';
import type { TriageCheck, TriageSession } from './types';

export function createTriageSession() {
  return apiRequest<TriageSession>('/triage/sessions', { method: 'POST' });
}

export function getTriageSession(id: string) {
  return apiRequest<TriageSession>(`/triage/sessions/${id}`);
}

export function analyzeTriageCheck(
  sessionId: string,
  checkKey: string,
  imageUrl: string,
) {
  return apiRequest<TriageCheck & { sessionId: string; provider?: string }>(
    `/triage/sessions/${sessionId}/checks/${checkKey}`,
    {
      method: 'POST',
      body: { imageUrl },
    },
  );
}

export function completeTriageSession(sessionId: string) {
  return apiRequest<TriageSession>(`/triage/sessions/${sessionId}/complete`, {
    method: 'POST',
  });
}
