import { View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenContainer, ScreenHeader, ScanListItem } from '../components/common';
import { scanHistory } from '../data/mock';
import type { HistoryStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<HistoryStackParamList, 'History'>;

export function HistoryScreen({ navigation }: Props) {
  return (
    <ScreenContainer scroll>
      <ScreenHeader title="Scan History" />
      <View>
        {scanHistory.map((entry, index) => (
          <ScanListItem
            key={entry.id}
            title={entry.title}
            timestamp={entry.timestamp}
            confidence={entry.confidence}
            showDivider={index < scanHistory.length - 1}
          />
        ))}
      </View>
    </ScreenContainer>
  );
}
