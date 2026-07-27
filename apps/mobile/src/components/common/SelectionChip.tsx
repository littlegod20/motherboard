import { Pressable, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { colors } from '../../theme/colors';
import { monoFontFamily } from '../../theme/typography';

interface SelectionChipProps {
  label: string;
  selected: boolean;
  onPress?: () => void;
}

export function SelectionChip({ label, selected, onPress }: SelectionChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        selected && styles.chipSelected,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.text, selected && styles.textSelected]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },
  chipSelected: {
    borderColor: colors.teal,
    backgroundColor: colors.tealMuted,
  },
  pressed: {
    opacity: 0.75,
  },
  text: {
    fontFamily: monoFontFamily,
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.3,
  },
  textSelected: {
    color: colors.teal,
  },
});
