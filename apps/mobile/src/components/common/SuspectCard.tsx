import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { colors } from '../../theme/colors';
import { monoFontFamily } from '../../theme/typography';

interface SuspectCardProps {
  title: string;
  confidence: number;
  detail: string;
}

export function SuspectCard({ title, confidence, detail }: SuspectCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.eyebrow}>PRIMARY SUSPECT</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.detail}>
        {confidence}% confidence · {detail}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.redMuted,
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(240,98,95,0.35)',
    marginTop: 20,
    marginBottom: 24,
  },
  eyebrow: {
    fontFamily: monoFontFamily,
    color: colors.red,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 8,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 6,
  },
  detail: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
  },
});
