import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { ScreenContainer, ScreenHeader, SectionLabel, ThresholdRow, NavArrowRow, ToggleRow } from '../components/common';
import { colors } from '../theme/colors';
import { monoFontFamily } from '../theme/typography';

export function SettingsScreen() {
  return (
    <ScreenContainer scroll>
      <ScreenHeader title="Settings" />

      <SectionLabel>DETECTION</SectionLabel>
      <ThresholdRow label="Confidence Threshold" percent={70} />
      <NavArrowRow label="Camera Calibration" showDivider={false} />

      <SectionLabel>PREFERENCES</SectionLabel>
      <ToggleRow label="Haptic Feedback" value={true} />
      <ToggleRow label="Save Scans to History" value={true} showDivider={false} />

      <View style={styles.footer}>
        <Text style={styles.footerText}>BoardScan v0.9.2 · Powered by Claude Vision</Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  footer: {
    marginTop: 40,
    alignItems: 'center',
  },
  footerText: {
    fontFamily: monoFontFamily,
    color: colors.textMuted,
    fontSize: 12,
  },
});
