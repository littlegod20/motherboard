import { StyleSheet, View } from 'react-native';
import { colors } from '../../theme/colors';

interface ContinuousProgressBarProps {
  percent: number;
  color?: string;
}

export function ContinuousProgressBar({ percent, color = colors.teal }: ContinuousProgressBarProps) {
  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${percent}%`, backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.surfaceVariant,
    overflow: 'hidden',
  },
  fill: {
    height: 4,
    borderRadius: 2,
  },
});
