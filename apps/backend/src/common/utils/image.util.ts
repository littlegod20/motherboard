import { BadRequestException } from '@nestjs/common';
import { createHash } from 'crypto';

const MAX_BYTES = 2 * 1024 * 1024;

const MAGIC: Array<{ mime: string; bytes: number[] }> = [
  { mime: 'image/jpeg', bytes: [0xff, 0xd8, 0xff] },
  { mime: 'image/png', bytes: [0x89, 0x50, 0x4e, 0x47] },
  { mime: 'image/webp', bytes: [0x52, 0x49, 0x46, 0x46] },
];

export type DecodedImage = {
  buffer: Buffer;
  base64: string;
  mimeType: string;
  hash: string;
};

export function decodeImagePayload(input: string): DecodedImage {
  if (!input || typeof input !== 'string') {
    throw new BadRequestException({
      code: 'INVALID_IMAGE',
      message: 'croppedImage is required',
    });
  }

  let base64 = input;
  let mimeHint: string | undefined;

  const dataUrl = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/s.exec(input);
  if (dataUrl) {
    mimeHint = dataUrl[1];
    base64 = dataUrl[2];
  }

  let buffer: Buffer;
  try {
    buffer = Buffer.from(base64, 'base64');
  } catch {
    throw new BadRequestException({
      code: 'INVALID_IMAGE',
      message: 'Image must be valid base64',
    });
  }

  if (buffer.length === 0 || buffer.length > MAX_BYTES) {
    throw new BadRequestException({
      code: 'IMAGE_TOO_LARGE',
      message: `Image must be between 1 byte and ${MAX_BYTES} bytes`,
    });
  }

  const mimeType = detectMime(buffer) || mimeHint;
  if (!mimeType || !['image/jpeg', 'image/png', 'image/webp'].includes(mimeType)) {
    throw new BadRequestException({
      code: 'INVALID_IMAGE_TYPE',
      message: 'Only JPEG, PNG, and WebP images are allowed',
    });
  }

  // Re-encode clean base64 without data-url prefix
  const cleanBase64 = buffer.toString('base64');
  const hash = createHash('sha256').update(buffer).digest('hex');

  return { buffer, base64: cleanBase64, mimeType, hash };
}

function detectMime(buffer: Buffer): string | null {
  for (const entry of MAGIC) {
    if (entry.bytes.every((b, i) => buffer[i] === b)) {
      if (entry.mime === 'image/webp') {
        // RIFF....WEBP
        if (buffer.length >= 12 && buffer.toString('ascii', 8, 12) === 'WEBP') {
          return 'image/webp';
        }
        continue;
      }
      return entry.mime;
    }
  }
  return null;
}
