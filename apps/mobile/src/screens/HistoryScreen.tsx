import { useCallback, useState } from 'react';
import { ActivityIndicator, RefreshControl, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { getScanHistory } from '../api/scan';
import type { ScanHistoryItem } from '../api/types';
import { ScreenContainer, ScreenHeader, ScanListItem } from '../components/common';
import { colors } from '../theme/colors';
import { monoFontFamily } from '../theme/typography';
import type { HistoryStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<HistoryStackParamList, 'History'>;

export function HistoryScreen({ navigation }: Props) {
  const [items, setItems] = useState<ScanHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const res = await getScanHistory(1, 50);
      setItems(res.items);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  return (
    <ScreenContainer
      scroll
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => void load(true)}
          tintColor={colors.teal}
        />
      }
    >
      <ScreenHeader title="Scan History" />
      <View>
        {loading ? <ActivityIndicator color={colors.teal} /> : null}
        {!loading && items.length === 0 ? (
          <Text style={{ color: colors.textMuted, fontFamily: monoFontFamily }}>
            No scans yet.
          </Text>
        ) : null}
        {items.map((entry, index) => (
          <ScanListItem
            key={entry.id}
            title={entry.title}
            timestamp={new Date(entry.timestamp).toLocaleString()}
            confidence={entry.confidence}
            showDivider={index < items.length - 1}
            onPress={() => navigation.navigate('Result', { scanId: entry.id })}
          />
        ))}
      </View>
    </ScreenContainer>
  );
}
