import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  ScreenContainer,
  CheckHeaderRow,
  ViewfinderFrame,
  StatusPill,
  Button,
  FloatingBackButton,
} from '../components/common';
import { ImageIcon } from '../components/icons';
import { colors } from '../theme/colors';
import { triageChecks } from '../data/mock';
import type { TriageStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<TriageStackParamList, 'TriageCheckCapture'>;

export function TriageCheckCaptureScreen({ route, navigation }: Props) {
  const { checkId } = route.params;
  const currentIndex = triageChecks.findIndex((check) => check.id === checkId);
  const check = triageChecks[currentIndex] ?? triageChecks[0];
  const nextCheck = triageChecks[currentIndex + 1];

  const goNext = () => {
    if (nextCheck) {
      navigation.navigate('TriageCheckCapture', { checkId: nextCheck.id });
    } else {
      navigation.navigate('TriageSummary');
    }
  };

  return (
    <ScreenContainer scroll>
      <CheckHeaderRow current={currentIndex + 1} total={triageChecks.length} label={check.label} />

      <View style={styles.frameWrap}>
        {check.status === 'pending' ? (
          <ViewfinderFrame variant="pendingDashed">
            <ImageIcon size={30} />
          </ViewfinderFrame>
        ) : (
          <ViewfinderFrame variant={check.status} />
        )}
      </View>

      {check.status === 'pending' ? (
        <>
          <Text style={styles.subheading}>{check.detail}</Text>
          <Text style={styles.instructions}>{check.instructions}</Text>
          <Button
            label="CAPTURE & ANALYZE"
            variant="primary"
            // TODO: wire up capture + analysis API call here
            onPress={goNext}
          />
        </>
      ) : (
        <>
          <StatusPill
            label={check.status === 'pass' ? 'PASS' : 'FAIL'}
            confidence={check.confidence ?? 0}
            tone={check.status}
          />
          <Text style={styles.resultText}>{check.resultText}</Text>

          {check.status === 'fail' ? (
            <View style={styles.buttonRow}>
              <Button
                label="MARK RESOLVED"
                variant="outline"
                style={styles.flexButton}
                // TODO: wire up mark-resolved state update here
                onPress={() => navigation.navigate('TriageDeadBoard')}
              />
              <Button label="CONTINUE" variant="primary" style={styles.flexButton} onPress={goNext} />
            </View>
          ) : (
            <Button label="NEXT CHECK" variant="muted" onPress={goNext} />
          )}
        </>
      )}

      <View style={styles.backButtonWrap}>
        <FloatingBackButton onPress={() => navigation.goBack()} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  frameWrap: {
    marginTop: 20,
    marginBottom: 20,
  },
  subheading: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 6,
  },
  instructions: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: 20,
    lineHeight: 20,
  },
  resultText: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: 20,
    lineHeight: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  flexButton: {
    flex: 1,
  },
  backButtonWrap: {
    marginTop: 24,
    marginBottom: 20,
    alignItems: 'flex-start',
  },
});
