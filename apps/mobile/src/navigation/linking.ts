import type { LinkingOptions } from '@react-navigation/native';
import type { RootTabParamList } from './types';

// Only used by the Expo web target during development so screens are
// deep-linkable while reviewing in a browser; native ignores this.
export const linking: LinkingOptions<RootTabParamList> = {
  prefixes: [],
  config: {
    screens: {
      HomeTab: {
        screens: {
          Home: '',
          Result: 'result/:componentId',
        },
      },
      ScanTab: {
        screens: {
          ScanLive: 'scan',
          ScanCapture: 'scan/capture',
          Result: 'scan/result/:componentId',
        },
      },
      TriageTab: {
        screens: {
          TriageDeadBoard: 'triage',
          TriageCheckCapture: 'triage/check/:checkId',
          TriageSummary: 'triage/summary',
        },
      },
      HistoryTab: {
        screens: {
          History: 'history',
        },
      },
      SettingsTab: {
        screens: {
          Settings: 'settings',
        },
      },
    },
  },
};
