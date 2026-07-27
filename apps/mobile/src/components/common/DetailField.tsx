import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { colors } from '../../theme/colors';
import { monoFontFamily } from '../../theme/typography';

interface DetailFieldProps {
  label: string;
  value: string;
  linkValue?: boolean;
  onPress?: () => void;
  showDivider?: boolean;
}

export function DetailField({ label, value, linkValue, onPress, showDivider = true }: DetailFieldProps) {
  return (
    <View style={[styles.row, showDivider && styles.divider]}>
      <Text style={styles.label}>{label}</Text>
      <Pressable onPress={onPress} disabled={!onPress}>
        <Text style={[styles.value, linkValue && styles.linkValue]}>{value}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  divider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  label: {
    fontFamily: monoFontFamily,
    fontSize: 12,
    letterSpacing: 0.5,
    color: colors.textMuted,
    fontWeight: '700',
  },
  value: {
    fontFamily: monoFontFamily,
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  linkValue: {
    color: colors.teal,
  },
});
