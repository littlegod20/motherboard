import { colors } from './colors';

// Tiering inferred from the reference designs: 96/99/91/89% render green,
// 82% renders amber. Low confidence (not shown in the designs) falls back to red.
export function getConfidenceColor(percent: number): string {
  if (percent >= 85) return colors.green;
  if (percent >= 70) return colors.amber;
  return colors.red;
}
