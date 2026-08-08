import type { ApiErrorBody } from './types';

export class ApiError extends Error {
  code: string;
  status: number;
  details?: unknown;

  constructor(status: number, body: ApiErrorBody | string) {
    const message =
      typeof body === 'string'
        ? body
        : body.message || `Request failed (${status})`;
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code =
      typeof body === 'string' ? 'HTTP_ERROR' : body.code || 'HTTP_ERROR';
    this.details = typeof body === 'string' ? undefined : body.details;
  }
}

export function userFacingError(err: unknown): string {
  if (err instanceof ApiError) {
    switch (err.code) {
      case 'QUOTA_EXCEEDED':
        return 'Monthly scan limit reached. Upgrade to Pro for more scans.';
      case 'RATE_LIMITED':
        return 'Too many requests. Wait a moment and try again.';
      case 'INVALID_IMAGE':
      case 'INVALID_IMAGE_TYPE':
      case 'INVALID_IMAGE_URL':
      case 'IMAGE_TOO_LARGE':
      case 'IMAGE_FETCH_FAILED':
        return 'That photo could not be used. Try a clearer JPEG/PNG under 2MB.';
      case 'INVALID_CREDENTIALS':
        return 'Invalid email or password.';
      case 'EMAIL_TAKEN':
        return 'That email is already registered.';
      case 'MEDIA_UNAVAILABLE':
        return 'Image upload is not configured on the server.';
      case 'BILLING_UNAVAILABLE':
        return 'Billing is not available right now.';
      case 'NETWORK':
        return 'You appear to be offline. Check your connection.';
      default:
        return err.message;
    }
  }
  if (err instanceof Error) return err.message;
  return 'Something went wrong.';
}
