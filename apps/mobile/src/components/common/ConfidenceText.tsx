import { StyleProp, StyleSheet, TextStyle } from 'react-native';
import { Text } from 'react-native-paper';
import { getConfidenceColor } from '../../theme/confidence';
import { monoFontFamily } from '../../theme/typography';

interface ConfidenceTextProps {
  percent: number;
  style?: StyleProp<TextStyle>;
}

export function ConfidenceText({ percent, style }: ConfidenceTextProps) {
  return (
    <Text style={[styles.text, { color: getConfidenceColor(percent) }, style]}>{percent}%</Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: monoFontFamily,
    fontWeight: '700',
    fontSize: 16,
  },
});
