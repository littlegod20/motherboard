import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenContainer, FaultBadge, CheckRow, SuspectCard, Button } from '../components/common';
import { colors } from '../theme/colors';
import { triageChecks, primarySuspect } from '../data/mock';
import type { TriageStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<TriageStackParamList, 'TriageSummary'>;

export function TriageSummaryScreen({ navigation }: Props) {
  const faultCount = triageChecks.filter((check) => check.status === 'fail').length;

  return (
    <ScreenContainer scroll>
      <FaultBadge count={faultCount} />
      <Text style={styles.title}>Triage Summary</Text>

      <View style={styles.list}>
        {triageChecks.map((check, index) => (
          <CheckRow
            key={check.id}
            label={check.label}
            status={check.status}
            showDivider={index < triageChecks.length - 1}
          />
        ))}
      </View>

      <SuspectCard
        title={primarySuspect.title}
        confidence={primarySuspect.confidence}
        detail={primarySuspect.detail}
      />

      <View style={styles.buttonRow}>
        <Button
          label="Back to Home"
          variant="outline"
          style={styles.flexButton}
          onPress={() => navigation.getParent()?.navigate('HomeTab')}
        />
        <Button
          label="Export Report"
          variant="primary"
          style={styles.flexButton}
          // TODO: wire up report export/share action here
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 20,
  },
  list: {
    marginBottom: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  flexButton: {
    flex: 1,
  },
});
