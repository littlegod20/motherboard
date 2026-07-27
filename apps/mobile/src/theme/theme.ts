import { MD3DarkTheme, adaptNavigationTheme } from 'react-native-paper';
import { DarkTheme as NavigationDarkTheme } from '@react-navigation/native';
import { colors } from './colors';

export const paperTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: colors.teal,
    onPrimary: colors.background,
    secondary: colors.amber,
    onSecondary: colors.onAmber,
    background: colors.background,
    surface: colors.surface,
    surfaceVariant: colors.surfaceVariant,
    onSurface: colors.textPrimary,
    onSurfaceVariant: colors.textSecondary,
    outline: colors.border,
    outlineVariant: colors.borderSubtle,
    error: colors.red,
    onError: colors.background,
  },
};

const { DarkTheme: adaptedNavigationDarkTheme } = adaptNavigationTheme({
  reactNavigationDark: NavigationDarkTheme,
});

export const navigationTheme = {
  ...adaptedNavigationDarkTheme,
  fonts: NavigationDarkTheme.fonts,
  colors: {
    ...adaptedNavigationDarkTheme.colors,
    primary: colors.teal,
    background: colors.background,
    card: colors.background,
    text: colors.textPrimary,
    border: colors.borderSubtle,
    notification: colors.red,
  },
};
