import { DimensionValue, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { colors } from '../../theme/colors';
import { monoFontFamily } from '../../theme/typography';
import { CheckIcon } from '../icons';

interface BoundingBoxLabelProps {
  label: string;
  confidence: number;
  confirmed: boolean;
  top: DimensionValue;
  left: DimensionValue;
}

const CORNER_SIZE = 22;

export function BoundingBoxLabel({ label, confidence, confirmed, top, left }: BoundingBoxLabelProps) {
  const color = confirmed ? colors.teal : colors.amber;

  return (
    <View style={[styles.container, { top, left }]}>
      <View style={styles.brackets}>
        <View style={[styles.corner, styles.cornerTL, { borderColor: color }]} />
        <View style={[styles.corner, styles.cornerTR, { borderColor: color }]} />
        <View style={[styles.corner, styles.cornerBL, { borderColor: color }]} />
        <View style={[styles.corner, styles.cornerBR, { borderColor: color }]} />
      </View>
      <View style={[styles.labelBox, { borderColor: color }]}>
        <Text style={[styles.labelText, { color }]}>{label}</Text>
        <Text style={styles.confText}>{confidence}% CONF</Text>
        {confirmed && (
          <View style={styles.badge}>
            <CheckIcon size={16} />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
  },
  brackets: {
    width: CORNER_SIZE * 3,
    height: CORNER_SIZE * 2.2,
    marginBottom: 4,
  },
  corner: {
    position: 'absolute',
    width: CORNER_SIZE,
    height: CORNER_SIZE,
  },
  cornerTL: { top: 0, left: 0, borderLeftWidth: 2, borderTopWidth: 2 },
  cornerTR: { top: 0, right: 0, borderRightWidth: 2, borderTopWidth: 2 },
  cornerBL: { bottom: 0, left: 0, borderLeftWidth: 2, borderBottomWidth: 2 },
  cornerBR: { bottom: 0, right: 0, borderRightWidth: 2, borderBottomWidth: 2 },
  labelBox: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
  labelText: {
    fontFamily: monoFontFamily,
    fontSize: 13,
    fontWeight: '700',
  },
  confText: {
    fontFamily: monoFontFamily,
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
  },
});
