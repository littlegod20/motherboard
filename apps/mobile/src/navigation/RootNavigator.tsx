import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute, RouteProp } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { HomeStackNavigator } from './HomeStackNavigator';
import { ScanStackNavigator } from './ScanStackNavigator';
import { TriageStackNavigator } from './TriageStackNavigator';
import { HistoryStackNavigator } from './HistoryStackNavigator';
import { SettingsStackNavigator } from './SettingsStackNavigator';
import { HomeIcon, ScanIcon, ActivityIcon, ClockIcon, SlidersIcon } from '../components/icons';
import { colors } from '../theme/colors';
import { monoFontFamily } from '../theme/typography';
import type { RootTabParamList } from './types';

const Tab = createBottomTabNavigator<RootTabParamList>();

// Full-screen camera/capture screens hide the tab bar; list/summary screens keep it.
const IMMERSIVE_ROUTES = ['ScanLive', 'ScanCapture', 'TriageCheckCapture'];

function getTabBarStyle(route: RouteProp<RootTabParamList, keyof RootTabParamList>) {
  const focusedRouteName = getFocusedRouteNameFromRoute(route);
  if (focusedRouteName && IMMERSIVE_ROUTES.includes(focusedRouteName)) {
    return { display: 'none' as const };
  }
  return styles.tabBar;
}

export function RootNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.teal,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarShowLabel: true,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <HomeIcon color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="ScanTab"
        component={ScanStackNavigator}
        options={({ route }) => ({
          title: 'Scan',
          tabBarIcon: ({ color, size }) => <ScanIcon color={color} size={size} />,
          tabBarStyle: getTabBarStyle(route),
        })}
      />
      <Tab.Screen
        name="TriageTab"
        component={TriageStackNavigator}
        options={({ route }) => ({
          title: 'Triage',
          tabBarIcon: ({ color, size }) => <ActivityIcon color={color} size={size} />,
          tabBarStyle: getTabBarStyle(route),
        })}
      />
      <Tab.Screen
        name="HistoryTab"
        component={HistoryStackNavigator}
        options={{
          title: 'History',
          tabBarIcon: ({ color, size }) => <ClockIcon color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsStackNavigator}
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <SlidersIcon color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.background,
    borderTopColor: colors.borderSubtle,
    borderTopWidth: StyleSheet.hairlineWidth,
    height: 64,
    paddingTop: 6,
    paddingBottom: 8,
  },
  tabBarLabel: {
    fontFamily: monoFontFamily,
    fontSize: 10,
    letterSpacing: 0.5,
    fontWeight: '700',
  },
});
