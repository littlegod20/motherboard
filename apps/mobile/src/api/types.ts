export type Tier = 'FREE' | 'PRO';

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
  user: { id: string; email: string; tier: Tier };
};

export type UserProfile = {
  id: string;
  email: string;
  tier: Tier;
  scansUsedThisMonth: number;
  scansRemaining: number;
  monthlyLimit: number;
  subscriptionStatus: 'active' | 'none';
  stripeCustomerId: string | null;
  createdAt: string;
};

export type ScanResult = {
  scanId: string;
  id: string;
  name: string;
  designator: string;
  confidence: number;
  type: string;
  package: string;
  voltage: string;
  related: string;
  knownFailureSigns: string[];
  category?: string;
  description?: string;
  upgradeNotes?: string;
  specifications?: Record<string, string>;
  imageUrl?: string | null;
  feedback?: 'up' | 'down' | null;
  createdAt?: string;
  provider?: string;
  cacheHit?: boolean;
};

export type ScanHistoryItem = {
  id: string;
  title: string;
  timestamp: string;
  confidence: number;
  thumbnailUrl?: string | null;
};

export type ScanHistoryResponse = {
  items: ScanHistoryItem[];
  page: number;
  limit: number;
  total: number;
};

export type MediaSignResponse = {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  signature: string;
  folder: string;
  uploadUrl: string;
};

export type TriageCheckStatus = 'pass' | 'fail' | 'pending' | 'skipped';

export type TriageCheck = {
  id: string;
  checkKey: string;
  label: string;
  detail: string;
  status: TriageCheckStatus;
  confidence?: number;
  resultText?: string;
  instructions?: string;
};

export type PrimarySuspect = {
  title: string;
  confidence: number;
  detail: string;
  checkKey: string | null;
};

export type TriageSession = {
  id: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | string;
  createdAt: string;
  completedAt: string | null;
  primarySuspect: PrimarySuspect | null;
  checks: TriageCheck[];
};

export type ApiErrorBody = {
  code?: string;
  message?: string;
  details?: unknown;
};
