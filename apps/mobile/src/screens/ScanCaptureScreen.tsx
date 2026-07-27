import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  ScreenContainer,
  StepHeader,
  SegmentedStepBar,
  ViewfinderFrame,
  Button,
} from '../components/common';
import { ImageIcon } from '../components/icons';
import { colors } from '../theme/colors';
import { monoFontFamily } from '../theme/typography';
import type { ScanStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<ScanStackParamList, 'ScanCapture'>;

export function ScanCaptureScreen({ navigation }: Props) {
  return (
    <ScreenContainer scroll>
      <StepHeader active="scan" accent={colors.amber} />
      <View style={styles.progressGap}>
        <SegmentedStepBar total={3} filled={2} color={colors.amber} />
      </View>

      <Text style={styles.stepLabel}>STEP 2 OF 3 · CAPTURE</Text>
      <Text style={styles.title}>Capture Component</Text>
      <Text style={styles.subtitle}>
        Center the component in the frame and hold steady. BoardScan identifies it automatically.
      </Text>

      <View style={styles.frameWrap}>
        <ViewfinderFrame variant="neutral">
          <ImageIcon size={30} />
          <Text style={styles.previewText}>Camera preview</Text>
          <Text style={styles.browseText}>
            or <Text style={styles.browseLink} onPress={() => navigation.navigate('ScanLive')}>browse files</Text>
          </Text>
        </ViewfinderFrame>
        <Text style={styles.analyzing}>Analyzing feed…</Text>
      </View>

      <Button
        label="Capture"
        variant="primary"
        // TODO: wire up capture action / Claude Vision API call here
        onPress={() => navigation.navigate('ScanLive')}
      />
      <Text style={styles.caption}>Auto-detect components</Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  progressGap: {
    marginTop: 14,
    marginBottom: 18,
  },
  stepLabel: {
    fontFamily: monoFontFamily,
    fontSize: 12,
    letterSpacing: 1,
    color: colors.textMuted,
    fontWeight: '700',
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    marginTop: 8,
    marginBottom: 24,
    lineHeight: 21,
  },
  frameWrap: {
    marginBottom: 24,
  },
  previewText: {
    color: colors.textMuted,
    fontSize: 15,
    fontWeight: '600',
    marginTop: 10,
  },
  browseText: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 4,
  },
  browseLink: {
    color: colors.textSecondary,
    textDecorationLine: 'underline',
  },
  analyzing: {
    fontFamily: monoFontFamily,
    color: colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 12,
  },
  caption: {
    fontFamily: monoFontFamily,
    color: colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 12,
  },
});
