import { View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenContainer, ScreenHeader, SectionCard, SectionLabel, ScanListItem } from '../components/common';
import { ScanIcon, ActivityIcon } from '../components/icons';
import { colors } from '../theme/colors';
import { scanHistory } from '../data/mock';
import type { HomeStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<HomeStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  return (
    <ScreenContainer scroll>
      <ScreenHeader title="BOARDSCAN" subtitle="Camera diagnostics for motherboards" />

      <SectionCard
        icon={<ScanIcon size={24} color={colors.teal} />}
        title="Start Scan"
        subtitle="Identify components live via camera"
        onPress={() => navigation.navigate('Result', { componentId: 'c47' })}
      />
      <SectionCard
        icon={<ActivityIcon size={24} color={colors.red} />}
        title="Dead Board Triage"
        subtitle="5 checks · guided diagnostic flow"
        tone="danger"
      />

      <SectionLabel>RECENT</SectionLabel>
      <View>
        {scanHistory.slice(0, 2).map((entry, index) => (
          <ScanListItem
            key={entry.id}
            title={entry.title}
            timestamp={entry.timestamp}
            confidence={entry.confidence}
            showDivider={index < 1}
            onPress={() => navigation.navigate('Result', { componentId: entry.id })}
          />
        ))}
      </View>
    </ScreenContainer>
  );
}
