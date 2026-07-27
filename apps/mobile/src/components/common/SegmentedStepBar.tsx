import { StyleSheet, View } from 'react-native';
import { colors } from '../../theme/colors';

interface SegmentedStepBarProps {
  total: number;
  filled: number;
  color?: string;
}

export function SegmentedStepBar({ total, filled, color = colors.amber }: SegmentedStepBarProps) {
  return (
    <View style={styles.row}>
      {Array.from({ length: total }).map((_, index) => (
        <View
          key={index}
          style={[styles.segment, { backgroundColor: index < filled ? color : colors.surfaceVariant }]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 6,
  },
  segment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
});
