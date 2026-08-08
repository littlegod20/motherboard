import { apiRequest } from './client';
import type { UserProfile } from './types';

export function getMe() {
  return apiRequest<UserProfile>('/user/me');
}
