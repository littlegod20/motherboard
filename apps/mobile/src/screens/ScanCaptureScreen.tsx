import { useEffect } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ScanStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<ScanStackParamList, 'ScanCapture'>;

/** Kept for deep links; capture now lives on ScanLive. */
export function ScanCaptureScreen({ navigation }: Props) {
  useEffect(() => {
    navigation.replace('ScanLive');
  }, [navigation]);

  return null;
}
