import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { colors } from '../../theme/colors';
import { monoFontFamily } from '../../theme/typography';

type PipelineStep = 'scan' | 'result' | 'triage';

interface StepHeaderProps {
  active: PipelineStep;
  accent?: string;
}

const STEPS: { key: PipelineStep; label: string }[] = [
  { key: 'scan', label: 'SCAN' },
  { key: 'result', label: 'RESULT' },
  { key: 'triage', label: 'TRIAGE' },
];

// Non-interactive breadcrumb for the capture pipeline; tapping does nothing.
export function StepHeader({ active, accent = colors.amber }: StepHeaderProps) {
  return (
    <View style={styles.row}>
      {STEPS.map((step) => {
        const isActive = step.key === active;
        return (
          <View key={step.key} style={styles.stepWrap}>
            <Text style={[styles.label, isActive ? { color: accent } : styles.inactive]}>{step.label}</Text>
            <View style={[styles.underline, isActive && { backgroundColor: accent }]} />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  stepWrap: {
    marginRight: 28,
  },
  label: {
    fontFamily: monoFontFamily,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
    paddingBottom: 8,
  },
  inactive: {
    color: colors.textMuted,
  },
  underline: {
    height: 2,
    borderRadius: 1,
    backgroundColor: 'transparent',
  },
});
