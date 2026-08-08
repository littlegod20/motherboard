import { useCallback, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import * as WebBrowser from 'expo-web-browser';
import { logout as apiLogout } from '../api/auth';
import { createCheckout, createPortal } from '../api/billing';
import { userFacingError } from '../api/errors';
import {
  ScreenContainer,
  ScreenHeader,
  SectionLabel,
  ThresholdRow,
  NavArrowRow,
  ToggleRow,
  Button,
} from '../components/common';
import { useAuthStore } from '../stores/authStore';
import { colors } from '../theme/colors';
import { monoFontFamily } from '../theme/typography';

export function SettingsScreen() {
  const profile = useAuthStore((s) => s.profile);
  const refreshToken = useAuthStore((s) => s.refreshToken);
  const refreshProfile = useAuthStore((s) => s.refreshProfile);
  const clearSession = useAuthStore((s) => s.clearSession);
  const [busy, setBusy] = useState(false);

  useFocusEffect(
    useCallback(() => {
      void refreshProfile();
    }, [refreshProfile]),
  );

  async function onUpgrade() {
    setBusy(true);
    try {
      const { url } = await createCheckout();
      if (url) await WebBrowser.openBrowserAsync(url);
      await refreshProfile();
    } catch (err) {
      Alert.alert('Billing', userFacingError(err));
    } finally {
      setBusy(false);
    }
  }

  async function onManage() {
    setBusy(true);
    try {
      const { url } = await createPortal();
      if (url) await WebBrowser.openBrowserAsync(url);
      await refreshProfile();
    } catch (err) {
      Alert.alert('Billing', userFacingError(err));
    } finally {
      setBusy(false);
    }
  }

  async function onLogout() {
    setBusy(true);
    try {
      if (refreshToken) {
        await apiLogout(refreshToken).catch(() => undefined);
      }
      await clearSession();
    } finally {
      setBusy(false);
    }
  }

  return (
    <ScreenContainer scroll>
      <ScreenHeader title="Settings" />

      <SectionLabel>ACCOUNT</SectionLabel>
      <Text style={styles.accountLine}>{profile?.email ?? '—'}</Text>
      <Text style={styles.metaLine}>
        Tier: {profile?.tier ?? 'FREE'} · {profile?.scansRemaining ?? 0}/
        {profile?.monthlyLimit ?? 10} scans left
      </Text>

      {profile?.tier === 'PRO' ? (
        <Button
          label="Manage subscription"
          variant="outline"
          onPress={() => void onManage()}
          loading={busy}
          disabled={busy}
        />
      ) : (
        <Button
          label="Upgrade to Pro"
          onPress={() => void onUpgrade()}
          loading={busy}
          disabled={busy}
        />
      )}

      <SectionLabel>DETECTION</SectionLabel>
      <ThresholdRow label="Confidence Threshold" percent={70} />
      <NavArrowRow label="Camera Calibration" showDivider={false} />

      <SectionLabel>PREFERENCES</SectionLabel>
      <ToggleRow label="Haptic Feedback" value={true} />
      <ToggleRow label="Save Scans to History" value={true} showDivider={false} />

      <View style={styles.logoutWrap}>
        <Button
          label="Sign out"
          variant="muted"
          onPress={() => void onLogout()}
          disabled={busy}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>BoardScan v0.9.2 · Powered by Claude Vision</Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  accountLine: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  metaLine: {
    fontFamily: monoFontFamily,
    color: colors.textSecondary,
    fontSize: 12,
    marginBottom: 12,
  },
  logoutWrap: { marginTop: 28 },
  footer: { marginTop: 40, alignItems: 'center' },
  footerText: {
    fontFamily: monoFontFamily,
    color: colors.textMuted,
    fontSize: 12,
  },
});
