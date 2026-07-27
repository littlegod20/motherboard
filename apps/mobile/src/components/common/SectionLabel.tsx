import { StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { colors } from '../../theme/colors';
import { monoFontFamily } from '../../theme/typography';

export function SectionLabel({ children }: { children: string }) {
  return <Text style={styles.label}>{children}</Text>;
}

const styles = StyleSheet.create({
  label: {
    fontFamily: monoFontFamily,
    fontSize: 12,
    letterSpacing: 1.2,
    color: colors.textMuted,
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 8,
  },
});
