import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { colors } from '../../theme/colors';
import { ImageIcon } from '../icons';
import { ConfidenceText } from './ConfidenceText';

interface ScanListItemProps {
  title: string;
  timestamp: string;
  confidence: number;
  onPress?: () => void;
  showDivider?: boolean;
}

export function ScanListItem({ title, timestamp, confidence, onPress, showDivider = true }: ScanListItemProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        showDivider && styles.divider,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.thumb}>
        <ImageIcon size={20} />
      </View>
      <View style={styles.textWrap}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.timestamp}>{timestamp}</Text>
      </View>
      <ConfidenceText percent={confidence} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  divider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  pressed: {
    opacity: 0.7,
  },
  thumb: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: colors.surfaceVariant,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  textWrap: {
    flex: 1,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  timestamp: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 2,
  },
});
