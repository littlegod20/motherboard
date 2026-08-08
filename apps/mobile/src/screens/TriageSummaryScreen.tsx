import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { userFacingError } from '../api/errors';
import {
  ScreenContainer,
  FaultBadge,
  CheckRow,
  SuspectCard,
  Button,
} from '../components/common';
import { useTriageStore } from '../stores/triageStore';
import { colors } from '../theme/colors';
import type { TriageStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<TriageStackParamList, 'TriageSummary'>;

export function TriageSummaryScreen({ navigation }: Props) {
  const session = useTriageStore((s) => s.session);
  const complete = useTriageStore((s) => s.complete);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session && session.status !== 'COMPLETED') {
      setLoading(true);
      complete()
        .catch((err) => Alert.alert('Could not complete triage', userFacingError(err)))
        .finally(() => setLoading(false));
    }
  }, [session?.id]);

  const checks = session?.checks ?? [];
  const faultCount = checks.filter((c) => c.status === 'fail').length;
  const suspect = session?.primarySuspect;

  if (!session || loading) {
    return (
      <ScreenContainer>
        <ActivityIndicator color={colors.teal} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scroll>
      <FaultBadge count={faultCount} />
      <Text style={styles.title}>Triage Summary</Text>

      <View style={styles.list}>
        {checks.map((check, index) => (
          <CheckRow
            key={check.checkKey}
            label={check.label}
            status={check.status}
            showDivider={index < checks.length - 1}
          />
        ))}
      </View>

      {suspect ? (
        <SuspectCard
          title={suspect.title}
          confidence={suspect.confidence}
          detail={suspect.detail}
        />
      ) : null}

      <View style={styles.buttonRow}>
        <Button
          label="Back to Home"
          variant="outline"
          style={styles.flexButton}
          onPress={() => navigation.getParent()?.navigate('HomeTab')}
        />
        <Button
          label="New Triage"
          variant="primary"
          style={styles.flexButton}
          onPress={() => {
            useTriageStore.getState().reset();
            navigation.navigate('TriageDeadBoard');
          }}
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
  list: { marginBottom: 4 },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
    marginTop: 12,
  },
  flexButton: { flex: 1 },
});
