export interface ScanHistoryEntry {
  id: string;
  title: string;
  timestamp: string;
  confidence: number;
}

export const scanHistory: ScanHistoryEntry[] = [
  { id: 'c47', title: 'Electrolytic Capacitor', timestamp: '2 min ago', confidence: 96 },
  { id: 'vrm-bank', title: 'VRM MOSFET Bank', timestamp: '14 min ago', confidence: 82 },
  { id: 'atx-24', title: '24-Pin ATX Connector', timestamp: '1 hr ago', confidence: 99 },
  { id: 'pwm-ic', title: 'PWM Controller IC', timestamp: 'Yesterday', confidence: 91 },
  { id: 'cmos-batt', title: 'CMOS Battery', timestamp: '2 days ago', confidence: 89 },
];

export interface ComponentDetail {
  id: string;
  name: string;
  designator: string;
  confidence: number;
  type: string;
  package: string;
  voltage: string;
  related: string;
  knownFailureSigns: string[];
}

export const componentDetails: Record<string, ComponentDetail> = {
  c47: {
    id: 'c47',
    name: 'Electrolytic Capacitor',
    designator: 'C47 · Main VRM Filter Bank',
    confidence: 96,
    type: 'Aluminum Electrolytic',
    package: 'Radial, 8x11mm',
    voltage: '16V',
    related: 'VRM MOSFETs, PWM Controller',
    knownFailureSigns: [
      'Bulging or domed top vent',
      'Dried electrolyte staining at base',
      'ESR drift under load',
    ],
  },
};

export type CheckStatus = 'pass' | 'fail' | 'pending';

export interface TriageCheck {
  id: string;
  label: string;
  detail: string;
  status: CheckStatus;
  confidence?: number;
  resultText?: string;
  instructions?: string;
}

export const triageChecks: TriageCheck[] = [
  { id: 'power-connectors', label: 'Power Connectors', detail: '24-Pin ATX / EPS 8-Pin', status: 'pass', confidence: 98, resultText: 'Properly seated, no pin damage or discoloration.' },
  { id: 'capacitors', label: 'Capacitors', detail: 'Bulging / Leakage Check', status: 'pass', confidence: 94, resultText: 'No bulging or leakage detected across the VRM filter bank.' },
  { id: 'vrm-mosfets', label: 'VRM MOSFETs', detail: 'Thermal / Short Check', status: 'fail', confidence: 91, resultText: 'MOSFET Q14 shows a thermal signature consistent with a short circuit.' },
  { id: 'cmos-battery', label: 'CMOS Battery', detail: 'Voltage Check', status: 'pending', instructions: 'Aim at the CMOS battery holder near the bottom edge.' },
  { id: 'board-short', label: 'Board Short-Circuit Test', detail: 'Continuity Check', status: 'pending', instructions: 'Aim at the board standoffs and rear I/O shield contacts.' },
];

export const primarySuspect = {
  title: 'VRM MOSFET Q14 — Short Circuit',
  confidence: 91,
  detail: 'thermal signature matches short-circuit failure',
};

export interface DetectedComponent {
  id: string;
  label: string;
  confidence: number;
  confirmed: boolean;
  position: { top: number; left: number; width: number; height: number };
}

export const liveDetections: DetectedComponent[] = [
  { id: 'c47', label: 'ELECTROLYTIC CAP', confidence: 96, confirmed: true, position: { top: 60, left: 12, width: 46, height: 20 } },
  { id: 'vrm-bank', label: 'VRM MOSFET BANK', confidence: 82, confirmed: false, position: { top: 46, left: 8, width: 50, height: 20 } },
  { id: 'atx-24', label: '24-PIN ATX CONNECTOR', confidence: 99, confirmed: true, position: { top: 68, left: 10, width: 56, height: 20 } },
];
