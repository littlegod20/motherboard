import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { colors } from '../../theme/colors';
import { WarningTriangleIcon } from '../icons';

export function FailureSignItem({ text }: { text: string }) {
  return (
    <View style={styles.row}>
      <WarningTriangleIcon size={16} color={colors.amber} />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  text: {
    color: colors.textSecondary,
    fontSize: 14,
    marginLeft: 10,
    flex: 1,
  },
});
