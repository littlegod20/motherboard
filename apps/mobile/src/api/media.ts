import { apiRequest } from './client';
import type { MediaSignResponse } from './types';

export function getUploadSignature() {
  return apiRequest<MediaSignResponse>('/media/sign', { method: 'POST' });
}

export async function uploadImageToCloudinary(localUri: string): Promise<string> {
  const sign = await getUploadSignature();

  const form = new FormData();
  form.append('file', {
    uri: localUri,
    type: 'image/jpeg',
    name: 'scan.jpg',
  } as unknown as Blob);
  form.append('api_key', sign.apiKey);
  form.append('timestamp', String(sign.timestamp));
  form.append('signature', sign.signature);
  form.append('folder', sign.folder);

  const res = await fetch(sign.uploadUrl, {
    method: 'POST',
    body: form,
  });

  const data = (await res.json()) as {
    secure_url?: string;
    error?: { message?: string };
  };
  if (!res.ok || !data.secure_url) {
    throw new Error(data.error?.message || 'Cloudinary upload failed');
  }
  return data.secure_url;
}
