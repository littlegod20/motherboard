import { ScrollView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BoundingBoxLabel, SelectionChip, Button } from '../components/common';
import { ImageIcon } from '../components/icons';
import { colors } from '../theme/colors';
import { monoFontFamily } from '../theme/typography';
import { liveDetections } from '../data/mock';
import type { ScanStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<ScanStackParamList, 'ScanLive'>;

export function ScanLiveScreen({ navigation }: Props) {
  const selectedCount = liveDetections.filter((item) => item.confirmed).length;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.topRow}>
        <View style={styles.liveTag}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE</Text>
        </View>
        <Text style={styles.claudeText}>CLAUDE VISION · ACTIVE</Text>
      </View>

      <View style={styles.viewport}>
        <View style={styles.placeholderCenter}>
          <ImageIcon size={40} color={colors.borderSubtle} />
          <Text style={styles.placeholderText}>Drop a motherboard photo</Text>
          <Text style={styles.placeholderLink} onPress={() => navigation.navigate('ScanCapture')}>
            or browse files
          </Text>
        </View>

        {liveDetections.map((item) => (
          <BoundingBoxLabel
            key={item.id}
            label={item.label}
            confidence={item.confidence}
            confirmed={item.confirmed}
            top={`${item.position.top}%`}
            left={`${item.position.left}%`}
          />
        ))}
      </View>

      <View style={styles.bottomSheet}>
        <Text style={styles.detectedCount}>{liveDetections.length} COMPONENTS DETECTED</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
          {liveDetections.map((item) => (
            <SelectionChip key={item.id} label={item.label} selected={item.confirmed} />
          ))}
        </ScrollView>
        <Button
          label={`IDENTIFY SELECTED (${selectedCount})`}
          variant={selectedCount > 0 ? 'primary' : 'muted'}
          style={selectedCount > 0 ? styles.identifyActive : styles.identifyInactive}
          textColor={selectedCount > 0 ? colors.onAmber : colors.teal}
          // TODO: wire up Claude Vision identify call here
          onPress={() => navigation.navigate('Result', { componentId: 'c47' })}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  liveTag: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.red,
    marginRight: 6,
  },
  liveText: {
    fontFamily: monoFontFamily,
    color: colors.textPrimary,
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 0.5,
  },
  claudeText: {
    fontFamily: monoFontFamily,
    color: colors.teal,
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  viewport: {
    flex: 1,
    paddingHorizontal: 12,
  },
  placeholderCenter: {
    position: 'absolute',
    top: '38%',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  placeholderText: {
    color: colors.borderSubtle,
    fontSize: 15,
    fontWeight: '600',
    marginTop: 10,
  },
  placeholderLink: {
    color: colors.borderSubtle,
    fontSize: 13,
    textDecorationLine: 'underline',
    marginTop: 2,
  },
  bottomSheet: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  detectedCount: {
    fontFamily: monoFontFamily,
    color: colors.textMuted,
    fontSize: 12,
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  chipRow: {
    marginBottom: 14,
  },
  identifyActive: {
    backgroundColor: colors.teal,
  },
  identifyInactive: {
    backgroundColor: colors.tealMuted,
  },
});
