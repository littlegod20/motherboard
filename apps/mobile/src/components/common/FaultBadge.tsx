import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { colors } from '../../theme/colors';
import { monoFontFamily } from '../../theme/typography';

export function FaultBadge({ count }: { count: number }) {
  return (
    <View style={styles.badge}>
      <Text style={styles.text}>
        {count} FAULT{count === 1 ? '' : 'S'} FOUND
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.redMuted,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  text: {
    fontFamily: monoFontFamily,
    color: colors.red,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
