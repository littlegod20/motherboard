import { ActivityIndicator, View } from 'react-native';
import { useEffect } from 'react';
import { AuthStackNavigator } from './AuthStackNavigator';
import { RootNavigator } from './RootNavigator';
import { useAuthStore } from '../stores/authStore';
import { colors } from '../theme/colors';

export function AppNavigator() {
  const hydrated = useAuthStore((s) => s.hydrated);
  const accessToken = useAuthStore((s) => s.accessToken);
  const hydrate = useAuthStore((s) => s.hydrate);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  if (!hydrated) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator color={colors.teal} />
      </View>
    );
  }

  return accessToken ? <RootNavigator /> : <AuthStackNavigator />;
}
