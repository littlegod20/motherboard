import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { register } from '../api/auth';
import { userFacingError } from '../api/errors';
import { Button, ScreenContainer } from '../components/common';
import { useAuthStore } from '../stores/authStore';
import { colors } from '../theme/colors';
import { monoFontFamily } from '../theme/typography';
import type { AuthStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export function RegisterScreen({ navigation }: Props) {
  const setTokens = useAuthStore((s) => s.setTokens);
  const refreshProfile = useAuthStore((s) => s.refreshProfile);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit() {
    setError(null);
    setLoading(true);
    try {
      const tokens = await register(email.trim(), password);
      await setTokens(tokens.accessToken, tokens.refreshToken, tokens.user);
      await refreshProfile();
    } catch (err) {
      setError(userFacingError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.wrap}
      >
        <Text style={styles.brand}>CREATE ACCOUNT</Text>
        <Text style={styles.sub}>Free tier includes 10 AI scans per month</Text>

        <TextInput
          mode="outlined"
          label="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          textColor={colors.textPrimary}
        />
        <TextInput
          mode="outlined"
          label="Password (min 8)"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          textColor={colors.textPrimary}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Button
          label="Register"
          onPress={onSubmit}
          loading={loading}
          disabled={loading || !email || password.length < 8}
        />

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Have an account?</Text>
          <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
            Sign in
          </Text>
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, justifyContent: 'center', gap: 12, paddingHorizontal: 4 },
  brand: {
    fontFamily: monoFontFamily,
    color: colors.teal,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 1,
  },
  sub: {
    fontFamily: monoFontFamily,
    color: colors.textSecondary,
    marginBottom: 16,
    fontSize: 13,
  },
  input: { backgroundColor: colors.surface },
  error: { color: colors.red, fontFamily: monoFontFamily, fontSize: 12 },
  footerRow: { flexDirection: 'row', gap: 8, marginTop: 16, justifyContent: 'center' },
  footerText: { color: colors.textMuted, fontFamily: monoFontFamily },
  link: { color: colors.teal, fontFamily: monoFontFamily, fontWeight: '700' },
});
