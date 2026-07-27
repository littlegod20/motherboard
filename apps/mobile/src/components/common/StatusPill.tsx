import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { colors } from '../../theme/colors';
import { monoFontFamily } from '../../theme/typography';

type PillTone = 'pass' | 'fail';

interface StatusPillProps {
  label: string;
  confidence: number;
  tone: PillTone;
}

const toneColor: Record<PillTone, string> = {
  pass: colors.green,
  fail: colors.red,
};

const toneBg: Record<PillTone, string> = {
  pass: colors.greenMuted,
  fail: colors.redMuted,
};

export function StatusPill({ label, confidence, tone }: StatusPillProps) {
  const color = toneColor[tone];
  return (
    <View style={[styles.pill, { backgroundColor: toneBg[tone] }]}>
      <Text style={[styles.text, { color }]}>
        {label} · {confidence}%
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 10,
  },
  text: {
    fontFamily: monoFontFamily,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
