export type ChecklistTemplateItem = {
  checkKey: string;
  label: string;
  detail: string;
  instructions: string;
};

export const DEFAULT_TRIAGE_CHECKLIST: ChecklistTemplateItem[] = [
  {
    checkKey: 'power-connectors',
    label: 'Power Connectors',
    detail: '24-Pin ATX / EPS 8-Pin',
    instructions: 'Aim at the 24-pin ATX and EPS CPU power connectors.',
  },
  {
    checkKey: 'capacitors',
    label: 'Capacitors',
    detail: 'Bulging / Leakage Check',
    instructions: 'Aim at the VRM filter capacitor bank near the CPU socket.',
  },
  {
    checkKey: 'vrm-mosfets',
    label: 'VRM MOSFETs',
    detail: 'Thermal / Short Check',
    instructions: 'Aim at the VRM MOSFET heatsinks or exposed MOSFET packages.',
  },
  {
    checkKey: 'cmos-battery',
    label: 'CMOS Battery',
    detail: 'Voltage Check',
    instructions: 'Aim at the CMOS battery holder near the bottom edge.',
  },
  {
    checkKey: 'board-short',
    label: 'Board Short-Circuit Test',
    detail: 'Continuity Check',
    instructions: 'Aim at the board standoffs and rear I/O shield contacts.',
  },
];
