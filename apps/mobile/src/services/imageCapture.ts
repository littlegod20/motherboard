import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';

const CROP_SIZE = 200;

export async function pickFromGallery(): Promise<string | null> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    throw new Error('Photo library permission is required');
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    quality: 0.85,
    allowsEditing: false,
  });

  if (result.canceled || !result.assets[0]?.uri) return null;
  return result.assets[0].uri;
}

export async function takePhotoWithPicker(): Promise<string | null> {
  const permission = await ImagePicker.requestCameraPermissionsAsync();
  if (!permission.granted) {
    throw new Error('Camera permission is required');
  }

  const result = await ImagePicker.launchCameraAsync({
    quality: 0.85,
    allowsEditing: false,
  });

  if (result.canceled || !result.assets[0]?.uri) return null;
  return result.assets[0].uri;
}

export async function compressFullImage(uri: string): Promise<string> {
  const result = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: 1600 } }],
    { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG },
  );
  return result.uri;
}

export async function cropAroundTap(
  uri: string,
  tapX: number,
  tapY: number,
  imageWidth: number,
  imageHeight: number,
): Promise<{ cropUri: string; tapX: number; tapY: number }> {
  const originX = Math.max(
    0,
    Math.min(imageWidth - CROP_SIZE, Math.round(tapX * imageWidth - CROP_SIZE / 2)),
  );
  const originY = Math.max(
    0,
    Math.min(imageHeight - CROP_SIZE, Math.round(tapY * imageHeight - CROP_SIZE / 2)),
  );
  const width = Math.min(CROP_SIZE, imageWidth - originX);
  const height = Math.min(CROP_SIZE, imageHeight - originY);

  const result = await ImageManipulator.manipulateAsync(
    uri,
    [{ crop: { originX, originY, width, height } }],
    { compress: 0.75, format: ImageManipulator.SaveFormat.JPEG },
  );

  return { cropUri: result.uri, tapX, tapY };
}
