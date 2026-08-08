import { apiRequest } from './client';

export function createCheckout() {
  return apiRequest<{ url: string; sessionId: string }>('/billing/checkout', {
    method: 'POST',
  });
}

export function createPortal() {
  return apiRequest<{ url: string }>('/billing/portal', {
    method: 'POST',
  });
}
