import { PropsWithChildren } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { colors } from '../../theme/colors';

interface SectionCardProps extends PropsWithChildren {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  tone?: 'default' | 'danger';
  onPress?: () => void;
}

export function SectionCard({ icon, title, subtitle, tone = 'default', onPress }: SectionCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        tone === 'danger' && styles.cardDanger,
        pressed && styles.cardPressed,
      ]}
    >
      <View style={styles.iconWrap}>{icon}</View>
      <View style={styles.textWrap}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  cardDanger: {
    backgroundColor: colors.redMuted,
    borderColor: 'rgba(240,98,95,0.35)',
  },
  cardPressed: {
    opacity: 0.75,
  },
  iconWrap: {
    marginRight: 14,
  },
  textWrap: {
    flex: 1,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
});
