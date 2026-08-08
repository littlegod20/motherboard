import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HistoryScreen } from '../screens/HistoryScreen';
import { ResultScreen } from '../screens/ResultScreen';
import type { HistoryStackParamList } from './types';

const Stack = createNativeStackNavigator<HistoryStackParamList>();

export function HistoryStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="History" component={HistoryScreen} />
      <Stack.Screen name="Result" component={ResultScreen} />
    </Stack.Navigator>
  );
}
