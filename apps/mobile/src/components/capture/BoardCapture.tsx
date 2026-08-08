import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../common';
import { colors } from '../../theme/colors';
import { monoFontFamily } from '../../theme/typography';
import {
  compressFullImage,
  cropAroundTap,
  pickFromGallery,
  takePhotoWithPicker,
} from '../../services/imageCapture';

type Props = {
  title?: string;
  instructions?: string;
  submitting?: boolean;
  onCaptured: (payload: {
    cropUri: string;
    fullUri: string;
    tapX: number;
    tapY: number;
  }) => void;
  onCancel?: () => void;
};

export function BoardCapture({
  title = 'TAP TO IDENTIFY',
  instructions = 'Frame the board, capture, then tap a component',
  submitting,
  onCaptured,
  onCancel,
}: Props) {
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState({ width: 1, height: 1 });
  const [layout, setLayout] = useState({ width: 1, height: 1 });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tapIndicator, setTapIndicator] = useState<{ x: number; y: number } | null>(
    null,
  );

  async function setCapturedUri(uri: string) {
    setBusy(true);
    setError(null);
    try {
      const compressed = await compressFullImage(uri);
      Image.getSize(
        compressed,
        (width, height) => {
          setImageSize({ width, height });
          setImageUri(compressed);
          setBusy(false);
        },
        () => {
          setImageUri(compressed);
          setBusy(false);
        },
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not process image');
      setBusy(false);
    }
  }

  async function onShutter() {
    setBusy(true);
    setError(null);
    try {
      if (cameraRef.current) {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          skipProcessing: false,
        });
        if (photo?.uri) {
          await setCapturedUri(photo.uri);
          return;
        }
      }
      const fallback = await takePhotoWithPicker();
      if (fallback) await setCapturedUri(fallback);
      else setBusy(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Capture failed');
      setBusy(false);
    }
  }

  async function onGallery() {
    try {
      const uri = await pickFromGallery();
      if (uri) await setCapturedUri(uri);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gallery failed');
    }
  }

  async function onTap(event: {
    nativeEvent: { locationX: number; locationY: number };
  }) {
    if (!imageUri || busy || submitting) return;
    const { locationX, locationY } = event.nativeEvent;
    setTapIndicator({ x: locationX, y: locationY });
    const tapX = Math.min(1, Math.max(0, locationX / layout.width));
    const tapY = Math.min(1, Math.max(0, locationY / layout.height));

    setBusy(true);
    setError(null);
    try {
      const { cropUri } = await cropAroundTap(
        imageUri,
        tapX,
        tapY,
        imageSize.width,
        imageSize.height,
      );
      onCaptured({ cropUri, fullUri: imageUri, tapX, tapY });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Crop failed');
    } finally {
      setBusy(false);
    }
  }

  function onLayout(e: LayoutChangeEvent) {
    const { width, height } = e.nativeEvent.layout;
    setLayout({ width, height });
  }

  if (!permission) {
    return (
      <SafeAreaView style={styles.safe}>
        <ActivityIndicator color={colors.teal} />
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.title}>Camera permission needed</Text>
        <Button label="Grant camera access" onPress={() => void requestPermission()} />
        <Button label="Use photo library" variant="outline" onPress={() => void onGallery()} />
        {onCancel ? <Button label="Cancel" variant="muted" onPress={onCancel} /> : null}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.sub}>{instructions}</Text>
      </View>

      <View style={styles.viewport} onLayout={onLayout}>
        {imageUri ? (
          <Pressable style={StyleSheet.absoluteFill} onPress={onTap}>
            <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
            {tapIndicator ? (
              <View
                style={[
                  styles.tapDot,
                  { left: tapIndicator.x - 18, top: tapIndicator.y - 18 },
                ]}
              />
            ) : null}
          </Pressable>
        ) : (
          <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing="back" />
        )}
        {(busy || submitting) && (
          <View style={styles.overlay}>
            <ActivityIndicator color={colors.teal} size="large" />
            <Text style={styles.overlayText}>
              {submitting ? 'Identifying…' : 'Processing…'}
            </Text>
          </View>
        )}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.actions}>
        {imageUri ? (
          <>
            <Button
              label="Retake"
              variant="outline"
              onPress={() => {
                setImageUri(null);
                setTapIndicator(null);
              }}
              disabled={busy || submitting}
            />
            <Text style={styles.hint}>Tap a component on the photo to identify it</Text>
          </>
        ) : (
          <>
            <Button label="Capture" onPress={() => void onShutter()} disabled={busy} />
            <Button
              label="Photo library"
              variant="outline"
              onPress={() => void onGallery()}
              disabled={busy}
            />
          </>
        )}
        {onCancel ? (
          <Button label="Back" variant="muted" onPress={onCancel} disabled={submitting} />
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background, paddingHorizontal: 16 },
  header: { paddingTop: 8, paddingBottom: 10 },
  title: {
    fontFamily: monoFontFamily,
    color: colors.teal,
    fontWeight: '800',
    letterSpacing: 1,
    fontSize: 14,
  },
  sub: { color: colors.textSecondary, marginTop: 4, fontSize: 13 },
  viewport: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  image: { width: '100%', height: '100%' },
  tapDot: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: colors.teal,
    backgroundColor: 'rgba(45,212,191,0.25)',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(10,13,18,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  overlayText: { color: colors.textPrimary, fontFamily: monoFontFamily },
  actions: { paddingVertical: 14, gap: 10 },
  hint: {
    textAlign: 'center',
    color: colors.textMuted,
    fontFamily: monoFontFamily,
    fontSize: 12,
  },
  error: {
    color: colors.red,
    fontFamily: monoFontFamily,
    fontSize: 12,
    marginTop: 8,
  },
});
