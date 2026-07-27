import { Platform } from 'react-native';

// Uppercase HUD-style labels (STEP 2 OF 3, LIVE, PASS · 98%) use a monospace
// face; everything else uses the platform default sans-serif.
export const monoFontFamily = Platform.select({
  ios: 'Courier',
  android: 'monospace',
  web: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
  default: 'monospace',
});

export const sansFontFamily = Platform.select({
  ios: undefined,
  android: undefined,
  web: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  default: undefined,
});
