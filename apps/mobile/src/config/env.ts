import Constants from 'expo-constants';

const extra = (Constants.expoConfig?.extra ?? {}) as Record<string, string>;

function required(name: string, value: string | undefined, fallback: string): string {
  return value || extra[name] || fallback;
}

export const env = {
  apiUrl: required(
    'EXPO_PUBLIC_API_URL',
    process.env.EXPO_PUBLIC_API_URL,
    'http://localhost:3000/api/v1',
  ),
  cloudinaryCloudName: required(
    'EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME',
    process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME,
    '',
  ),
};
