import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ScanLiveScreen } from '../screens/ScanLiveScreen';
import { ScanCaptureScreen } from '../screens/ScanCaptureScreen';
import { ResultScreen } from '../screens/ResultScreen';
import type { ScanStackParamList } from './types';

const Stack = createNativeStackNavigator<ScanStackParamList>();

export function ScanStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ScanLive" component={ScanLiveScreen} />
      <Stack.Screen name="ScanCapture" component={ScanCaptureScreen} />
      <Stack.Screen name="Result" component={ResultScreen} />
    </Stack.Navigator>
  );
}
