import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { colors } from '../../theme/colors';
import { monoFontFamily } from '../../theme/typography';
import { CheckCircleIcon, WarningTriangleIcon, CircleIcon } from '../icons';
import type { TriageCheckStatus } from '../../api/types';

type RowStatus = Extract<TriageCheckStatus, 'pass' | 'fail' | 'pending'>;

interface CheckRowProps {
  label: string;
  subtitle?: string;
  status: TriageCheckStatus;
  onPress?: () => void;
  showDivider?: boolean;
}

const statusText: Record<RowStatus, string> = {
  pass: 'PASS',
  fail: 'FAIL',
  pending: 'PENDING',
};

const statusColor: Record<RowStatus, string> = {
  pass: colors.green,
  fail: colors.red,
  pending: colors.textMuted,
};

function normalizeStatus(status: TriageCheckStatus): RowStatus {
  if (status === 'pass' || status === 'fail') return status;
  return 'pending';
}

function StatusIcon({ status }: { status: RowStatus }) {
  if (status === 'pass') return <CheckCircleIcon size={20} />;
  if (status === 'fail') return <WarningTriangleIcon size={20} />;
  return <CircleIcon size={20} />;
}

export function CheckRow({ label, subtitle, status, onPress, showDivider = true }: CheckRowProps) {
  const normalized = normalizeStatus(status);
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, showDivider && styles.divider, pressed && onPress && styles.pressed]}
    >
      <View style={styles.iconWrap}>
        <StatusIcon status={normalized} />
      </View>
      <View style={styles.textWrap}>
        <Text style={styles.label}>{label}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      <Text style={[styles.status, { color: statusColor[normalized] }]}>
        {statusText[normalized]}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  divider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  pressed: {
    opacity: 0.7,
  },
  iconWrap: {
    marginRight: 14,
  },
  textWrap: {
    flex: 1,
  },
  label: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 2,
  },
  status: {
    fontFamily: monoFontFamily,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
