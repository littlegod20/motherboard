import { z } from 'zod';

export const COMPONENT_CATEGORIES = [
  'CPU Socket',
  'Power Delivery',
  'RAM Slots',
  'PCIe Slots',
  'Storage Connectors',
  'I/O Ports',
  'Chipset',
  'Fan Headers',
  'USB Headers',
  'Audio Subsystem',
  'Network Interface',
  'BIOS Chip',
  'Power Connectors',
  'Debugging Tools',
  'Unknown',
] as const;

export const componentResultSchema = z.object({
  name: z.string().min(1),
  designator: z.string().default(''),
  confidence: z.number().min(0).max(1),
  type: z.string().default('Unknown'),
  package: z.string().default(''),
  voltage: z.string().default(''),
  related: z.string().default(''),
  knownFailureSigns: z.array(z.string()).default([]),
  category: z.string().default('Unknown'),
  description: z.string().default(''),
  upgradeNotes: z.string().default(''),
  specifications: z.record(z.string(), z.string()).default({}),
});

export type ComponentResult = z.infer<typeof componentResultSchema>;

export const triageCheckResultSchema = z.object({
  status: z.enum(['pass', 'fail', 'pending']),
  confidence: z.number().min(0).max(1),
  resultText: z.string().min(1),
  findings: z.array(z.string()).default([]),
});

export type TriageAiResult = z.infer<typeof triageCheckResultSchema>;
