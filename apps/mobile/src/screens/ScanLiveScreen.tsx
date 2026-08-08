import { useState } from 'react';
import { Alert } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { uploadImageToCloudinary } from '../api/media';
import { createScan } from '../api/scan';
import { userFacingError } from '../api/errors';
import { BoardCapture } from '../components/capture/BoardCapture';
import { useAuthStore } from '../stores/authStore';
import type { ScanStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<ScanStackParamList, 'ScanLive'>;

export function ScanLiveScreen({ navigation }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const refreshProfile = useAuthStore((s) => s.refreshProfile);

  async function onCaptured(payload: {
    cropUri: string;
    fullUri: string;
    tapX: number;
    tapY: number;
  }) {
    setSubmitting(true);
    try {
      const [imageUrl, fullImageUrl] = await Promise.all([
        uploadImageToCloudinary(payload.cropUri),
        uploadImageToCloudinary(payload.fullUri),
      ]);
      const result = await createScan({
        imageUrl,
        fullImageUrl,
        tapX: payload.tapX,
        tapY: payload.tapY,
      });
      await refreshProfile();
      navigation.navigate('Result', { scanId: result.scanId });
    } catch (err) {
      Alert.alert('Scan failed', userFacingError(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <BoardCapture
      title="SCAN · TAP TO IDENTIFY"
      instructions="Capture or pick a board photo, then tap a component"
      submitting={submitting}
      onCaptured={(p) => void onCaptured(p)}
    />
  );
}
