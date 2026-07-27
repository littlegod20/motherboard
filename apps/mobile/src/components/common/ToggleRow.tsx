import { StyleSheet, View } from 'react-native';
import { Switch, Text } from 'react-native-paper';
import { colors } from '../../theme/colors';

interface ToggleRowProps {
  label: string;
  value: boolean;
  showDivider?: boolean;
}

export function ToggleRow({ label, value, showDivider = true }: ToggleRowProps) {
  return (
    <View style={[styles.row, showDivider && styles.divider]}>
      <Text style={styles.label}>{label}</Text>
      <Switch value={value} color={colors.green} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  divider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  label: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
});
