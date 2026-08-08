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
          Result: 'result/:scanId',
        },
      },
      ScanTab: {
        screens: {
          ScanLive: 'scan',
          ScanCapture: 'scan/capture',
          Result: 'scan/result/:scanId',
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
          Result: 'history/result/:scanId',
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
