import { useCallback, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getScanHistory } from '../api/scan';
import type { ScanHistoryItem } from '../api/types';
import {
  ScreenContainer,
  ScreenHeader,
  SectionCard,
  SectionLabel,
  ScanListItem,
} from '../components/common';
import { ScanIcon, ActivityIcon } from '../components/icons';
import { colors } from '../theme/colors';
import type { HomeStackParamList, RootTabParamList } from '../navigation/types';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Nav = CompositeNavigationProp<
  NativeStackNavigationProp<HomeStackParamList, 'Home'>,
  BottomTabNavigationProp<RootTabParamList>
>;

type Props = {
  navigation: Nav;
};

export function HomeScreen({ navigation }: Props) {
  const [recent, setRecent] = useState<ScanHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);
      getScanHistory(1, 5)
        .then((res) => {
          if (active) setRecent(res.items.slice(0, 2));
        })
        .catch(() => {
          if (active) setRecent([]);
        })
        .finally(() => {
          if (active) setLoading(false);
        });
      return () => {
        active = false;
      };
    }, []),
  );

  return (
    <ScreenContainer scroll>
      <ScreenHeader title="BOARDSCAN" subtitle="Camera diagnostics for motherboards" />

      <SectionCard
        icon={<ScanIcon size={24} color={colors.teal} />}
        title="Start Scan"
        subtitle="Identify components live via camera"
        onPress={() => navigation.navigate('ScanTab', { screen: 'ScanLive' })}
      />
      <SectionCard
        icon={<ActivityIcon size={24} color={colors.red} />}
        title="Dead Board Triage"
        subtitle="5 checks · guided diagnostic flow"
        tone="danger"
        onPress={() => navigation.navigate('TriageTab', { screen: 'TriageDeadBoard' })}
      />

      <SectionLabel>RECENT</SectionLabel>
      <View>
        {loading ? <ActivityIndicator color={colors.teal} /> : null}
        {!loading && recent.length === 0 ? (
          <SectionLabel>No scans yet — start with the camera</SectionLabel>
        ) : null}
        {recent.map((entry, index) => (
          <ScanListItem
            key={entry.id}
            title={entry.title}
            timestamp={formatRelative(entry.timestamp)}
            confidence={entry.confidence}
            showDivider={index < recent.length - 1}
            onPress={() => navigation.navigate('Result', { scanId: entry.id })}
          />
        ))}
      </View>
    </ScreenContainer>
  );
}

function formatRelative(iso: string): string {
  const then = new Date(iso).getTime();
  const diff = Date.now() - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}
