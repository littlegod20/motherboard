import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getScan, submitFeedback } from '../api/scan';
import { userFacingError } from '../api/errors';
import type { ScanResult } from '../api/types';
import { Button, DetailField, FailureSignItem, SectionLabel } from '../components/common';
import { ImageIcon } from '../components/icons';
import { colors } from '../theme/colors';
import { monoFontFamily } from '../theme/typography';
import type {
  ScanStackParamList,
  HomeStackParamList,
  HistoryStackParamList,
} from '../navigation/types';

type Props = NativeStackScreenProps<
  ScanStackParamList | HomeStackParamList | HistoryStackParamList,
  'Result'
>;

export function ResultScreen({ route, navigation }: Props) {
  const scanId = route.params.scanId;
  const [detail, setDetail] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [feedbackBusy, setFeedbackBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setDetail(await getScan(scanId));
    } catch (err) {
      Alert.alert('Could not load scan', userFacingError(err));
    } finally {
      setLoading(false);
    }
  }, [scanId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function onFeedback(rating: 'up' | 'down') {
    setFeedbackBusy(true);
    try {
      await submitFeedback(scanId, rating);
      setDetail((prev) => (prev ? { ...prev, feedback: rating } : prev));
    } catch (err) {
      Alert.alert('Feedback failed', userFacingError(err));
    } finally {
      setFeedbackBusy(false);
    }
  }

  if (loading || !detail) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator color={colors.teal} style={{ marginTop: 40 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.photo}>
        {detail.imageUrl ? (
          <Image source={{ uri: detail.imageUrl }} style={styles.photoImage} resizeMode="cover" />
        ) : (
          <ImageIcon size={36} color={colors.borderSubtle} />
        )}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.backLink} onPress={() => navigation.goBack()}>
          ← BACK
        </Text>

        <Text style={styles.title}>{detail.name.toUpperCase()}</Text>
        <Text style={styles.designator}>{detail.designator || detail.type}</Text>

        <View style={styles.confidenceRow}>
          <Text style={styles.confidenceValue}>{detail.confidence}%</Text>
          <Text style={styles.confidenceLabel}>CONFIDENCE</Text>
        </View>

        <View style={styles.divider} />

        <DetailField label="TYPE" value={detail.type} />
        <DetailField label="PACKAGE" value={detail.package || '—'} />
        <DetailField label="VOLTAGE" value={detail.voltage || '—'} />
        <DetailField label="RELATED" value={detail.related || '—'} showDivider={false} />

        {detail.description ? (
          <>
            <View style={styles.divider} />
            <SectionLabel>DESCRIPTION</SectionLabel>
            <Text style={styles.body}>{detail.description}</Text>
          </>
        ) : null}

        <View style={styles.divider} />

        <SectionLabel>KNOWN FAILURE SIGNS</SectionLabel>
        {(detail.knownFailureSigns?.length ? detail.knownFailureSigns : ['None reported']).map(
          (sign) => (
            <FailureSignItem key={sign} text={sign} />
          ),
        )}

        <View style={styles.divider} />
        <SectionLabel>WAS THIS HELPFUL?</SectionLabel>
        <View style={styles.feedbackRow}>
          <Button
            label={detail.feedback === 'up' ? '👍 Yes' : 'Yes'}
            variant={detail.feedback === 'up' ? 'primary' : 'outline'}
            style={styles.feedbackBtn}
            onPress={() => void onFeedback('up')}
            disabled={feedbackBusy}
          />
          <Button
            label={detail.feedback === 'down' ? '👎 No' : 'No'}
            variant={detail.feedback === 'down' ? 'primary' : 'outline'}
            style={styles.feedbackBtn}
            onPress={() => void onFeedback('down')}
            disabled={feedbackBusy}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  photo: {
    height: 260,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderSubtle,
    overflow: 'hidden',
  },
  photoImage: { width: '100%', height: '100%' },
  content: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 24 },
  backLink: {
    fontFamily: monoFontFamily,
    color: colors.textMuted,
    fontSize: 12,
    letterSpacing: 0.5,
    fontWeight: '700',
    marginBottom: 16,
  },
  title: {
    fontFamily: monoFontFamily,
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  designator: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 4,
    marginBottom: 20,
  },
  confidenceRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 20 },
  confidenceValue: {
    fontFamily: monoFontFamily,
    color: colors.teal,
    fontSize: 40,
    fontWeight: '800',
    marginRight: 10,
  },
  confidenceLabel: {
    fontFamily: monoFontFamily,
    color: colors.textMuted,
    fontSize: 12,
    letterSpacing: 0.5,
    fontWeight: '700',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginVertical: 8,
  },
  body: { color: colors.textSecondary, fontSize: 14, lineHeight: 20, marginBottom: 8 },
  feedbackRow: { flexDirection: 'row', gap: 10, marginTop: 8 },
  feedbackBtn: { flex: 1 },
});
