import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { uploadImageToCloudinary } from '../api/media';
import { userFacingError } from '../api/errors';
import { BoardCapture } from '../components/capture/BoardCapture';
import {
  ScreenContainer,
  CheckHeaderRow,
  StatusPill,
  Button,
  FloatingBackButton,
} from '../components/common';
import { useTriageStore } from '../stores/triageStore';
import { useAuthStore } from '../stores/authStore';
import { colors } from '../theme/colors';
import type { TriageStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<TriageStackParamList, 'TriageCheckCapture'>;

export function TriageCheckCaptureScreen({ route, navigation }: Props) {
  const { checkId } = route.params;
  const session = useTriageStore((s) => s.session);
  const analyze = useTriageStore((s) => s.analyze);
  const refreshProfile = useAuthStore((s) => s.refreshProfile);
  const [submitting, setSubmitting] = useState(false);
  const [capturing, setCapturing] = useState(false);

  const checks = session?.checks ?? [];
  const currentIndex = Math.max(
    0,
    checks.findIndex((c) => c.checkKey === checkId),
  );
  const check = checks[currentIndex];
  const nextCheck = checks.slice(currentIndex + 1).find((c) => c.status === 'pending');

  if (!session || !check) {
    return (
      <ScreenContainer>
        <Text style={{ color: colors.textMuted }}>Loading check…</Text>
      </ScreenContainer>
    );
  }

  const goNext = () => {
    if (nextCheck) {
      navigation.navigate('TriageCheckCapture', { checkId: nextCheck.checkKey });
    } else {
      navigation.navigate('TriageSummary');
    }
  };

  if (capturing || check.status === 'pending') {
    if (!capturing && check.status === 'pending') {
      return (
        <ScreenContainer scroll>
          <CheckHeaderRow
            current={currentIndex + 1}
            total={checks.length}
            label={check.label}
          />
          <Text style={styles.subheading}>{check.detail}</Text>
          <Text style={styles.instructions}>
            {check.instructions || 'Capture the area for this check.'}
          </Text>
          <Button label="CAPTURE & ANALYZE" onPress={() => setCapturing(true)} />
          <View style={styles.backButtonWrap}>
            <FloatingBackButton onPress={() => navigation.goBack()} />
          </View>
        </ScreenContainer>
      );
    }

    return (
      <BoardCapture
        title={check.label.toUpperCase()}
        instructions={check.instructions || check.detail}
        submitting={submitting}
        onCancel={() => setCapturing(false)}
        onCaptured={(payload) => {
          void (async () => {
            setSubmitting(true);
            try {
              const imageUrl = await uploadImageToCloudinary(payload.cropUri);
              await analyze(check.checkKey, imageUrl);
              await refreshProfile();
              setCapturing(false);
            } catch (err) {
              Alert.alert('Analysis failed', userFacingError(err));
            } finally {
              setSubmitting(false);
            }
          })();
        }}
      />
    );
  }

  return (
    <ScreenContainer scroll>
      <CheckHeaderRow
        current={currentIndex + 1}
        total={checks.length}
        label={check.label}
      />

      <StatusPill
        label={check.status === 'pass' ? 'PASS' : 'FAIL'}
        confidence={check.confidence ?? 0}
        tone={check.status === 'pass' ? 'pass' : 'fail'}
      />
      <Text style={styles.resultText}>{check.resultText}</Text>

      {check.status === 'fail' ? (
        <View style={styles.buttonRow}>
          <Button
            label="BACK TO LIST"
            variant="outline"
            style={styles.flexButton}
            onPress={() => navigation.navigate('TriageDeadBoard')}
          />
          <Button label="CONTINUE" variant="primary" style={styles.flexButton} onPress={goNext} />
        </View>
      ) : (
        <Button label="NEXT CHECK" variant="muted" onPress={goNext} />
      )}

      <View style={styles.backButtonWrap}>
        <FloatingBackButton onPress={() => navigation.goBack()} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  subheading: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 6,
    marginTop: 16,
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
    marginTop: 12,
    lineHeight: 20,
  },
  buttonRow: { flexDirection: 'row', gap: 12 },
  flexButton: { flex: 1 },
  backButtonWrap: {
    marginTop: 24,
    marginBottom: 20,
    alignItems: 'flex-start',
  },
});
