import { apiRequest } from './client';
import type { ScanHistoryResponse, ScanResult } from './types';

export function createScan(input: {
  imageUrl: string;
  fullImageUrl?: string;
  tapX: number;
  tapY: number;
}) {
  return apiRequest<ScanResult>('/scan', {
    method: 'POST',
    body: input,
  });
}

export function getScanHistory(page = 1, limit = 20, q?: string) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (q) params.set('q', q);
  return apiRequest<ScanHistoryResponse>(`/scan/history?${params.toString()}`);
}

export function getScan(id: string) {
  return apiRequest<ScanResult>(`/scan/${id}`);
}

export function submitFeedback(id: string, rating: 'up' | 'down') {
  return apiRequest<{ scanId: string; rating: string }>(`/scan/${id}/feedback`, {
    method: 'POST',
    body: { rating },
  });
}
