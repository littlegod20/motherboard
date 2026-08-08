import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { userFacingError } from '../api/errors';
import {
  ScreenContainer,
  ScreenHeader,
  ContinuousProgressBar,
  CheckRow,
  Button,
} from '../components/common';
import { useTriageStore } from '../stores/triageStore';
import { colors } from '../theme/colors';
import type { TriageStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<TriageStackParamList, 'TriageDeadBoard'>;

export function TriageDeadBoardScreen({ navigation }: Props) {
  const session = useTriageStore((s) => s.session);
  const ensureSession = useTriageStore((s) => s.ensureSession);
  const reset = useTriageStore((s) => s.reset);
  const [booting, setBooting] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setBooting(true);
      ensureSession()
        .catch((err) => {
          if (active) Alert.alert('Triage unavailable', userFacingError(err));
        })
        .finally(() => {
          if (active) setBooting(false);
        });
      return () => {
        active = false;
      };
    }, [ensureSession]),
  );

  const checks = session?.checks ?? [];
  const completed = checks.filter((c) => c.status !== 'pending').length;
  const total = checks.length || 5;
  const nextCheck = checks.find((c) => c.status === 'pending');
  const allDone = checks.length > 0 && !nextCheck;

  return (
    <ScreenContainer scroll>
      <ScreenHeader
        title="Dead Board Triage"
        subtitle={`${completed} of ${total} checks complete`}
      />
      <View style={styles.progressWrap}>
        <ContinuousProgressBar percent={total ? (completed / total) * 100 : 0} />
      </View>

      {booting || !session ? (
        <ActivityIndicator color={colors.teal} />
      ) : (
        <View>
          {checks.map((check, index) => (
            <CheckRow
              key={check.checkKey}
              label={check.label}
              subtitle={check.detail}
              status={check.status}
              showDivider={index < checks.length - 1}
              onPress={() =>
                navigation.navigate('TriageCheckCapture', { checkId: check.checkKey })
              }
            />
          ))}
        </View>
      )}

      <View style={styles.buttonWrap}>
        {allDone ? (
          <Button
            label="View Summary"
            variant="primary"
            onPress={() => navigation.navigate('TriageSummary')}
          />
        ) : (
          <Button
            label="Continue Triage"
            variant="primary"
            disabled={!nextCheck}
            onPress={() =>
              nextCheck &&
              navigation.navigate('TriageCheckCapture', { checkId: nextCheck.checkKey })
            }
          />
        )}
        <Button
          label="Start new session"
          variant="outline"
          onPress={() => {
            reset();
            setBooting(true);
            void ensureSession().finally(() => setBooting(false));
          }}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  progressWrap: { marginBottom: 20 },
  buttonWrap: { marginTop: 24, marginBottom: 20, gap: 10 },
});
