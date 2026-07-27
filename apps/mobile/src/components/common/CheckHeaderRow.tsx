import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { colors } from '../../theme/colors';
import { monoFontFamily } from '../../theme/typography';

interface CheckHeaderRowProps {
  current: number;
  total: number;
  label: string;
}

export function CheckHeaderRow({ current, total, label }: CheckHeaderRowProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.left}>
        CHECK {current} OF {total}
      </Text>
      <Text style={styles.right}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    fontFamily: monoFontFamily,
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  right: {
    fontFamily: monoFontFamily,
    fontSize: 12,
    color: colors.amber,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
