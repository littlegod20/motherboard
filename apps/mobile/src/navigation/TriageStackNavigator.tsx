import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TriageDeadBoardScreen } from '../screens/TriageDeadBoardScreen';
import { TriageCheckCaptureScreen } from '../screens/TriageCheckCaptureScreen';
import { TriageSummaryScreen } from '../screens/TriageSummaryScreen';
import type { TriageStackParamList } from './types';

const Stack = createNativeStackNavigator<TriageStackParamList>();

export function TriageStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TriageDeadBoard" component={TriageDeadBoardScreen} />
      <Stack.Screen name="TriageCheckCapture" component={TriageCheckCaptureScreen} />
      <Stack.Screen name="TriageSummary" component={TriageSummaryScreen} />
    </Stack.Navigator>
  );
}
