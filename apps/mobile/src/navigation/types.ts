import { NavigatorScreenParams } from '@react-navigation/native';

export type ScanStackParamList = {
  ScanLive: undefined;
  ScanCapture: undefined;
  Result: { componentId: string };
};

export type TriageStackParamList = {
  TriageDeadBoard: undefined;
  TriageCheckCapture: { checkId: string };
  TriageSummary: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
  Result: { componentId: string };
};

export type HistoryStackParamList = {
  History: undefined;
};

export type SettingsStackParamList = {
  Settings: undefined;
};

export type RootTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  ScanTab: NavigatorScreenParams<ScanStackParamList>;
  TriageTab: NavigatorScreenParams<TriageStackParamList>;
  HistoryTab: NavigatorScreenParams<HistoryStackParamList>;
  SettingsTab: NavigatorScreenParams<SettingsStackParamList>;
};
