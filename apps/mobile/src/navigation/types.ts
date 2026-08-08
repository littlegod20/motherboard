import { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type ScanStackParamList = {
  ScanLive: undefined;
  ScanCapture: undefined;
  Result: { scanId: string };
};

export type TriageStackParamList = {
  TriageDeadBoard: undefined;
  TriageCheckCapture: { checkId: string };
  TriageSummary: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
  Result: { scanId: string };
};

export type HistoryStackParamList = {
  History: undefined;
  Result: { scanId: string };
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
