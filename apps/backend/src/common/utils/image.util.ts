import { BadRequestException } from '@nestjs/common';
import { createHash } from 'crypto';

export const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

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

export function decodeImageBuffer(
  buffer: Buffer,
  mimeHint?: string,
): DecodedImage {
  if (buffer.length === 0 || buffer.length > MAX_IMAGE_BYTES) {
    throw new BadRequestException({
      code: 'IMAGE_TOO_LARGE',
      message: `Image must be between 1 byte and ${MAX_IMAGE_BYTES} bytes`,
    });
  }

  const mimeType = detectMime(buffer) || mimeHint;
  if (
    !mimeType ||
    !['image/jpeg', 'image/png', 'image/webp'].includes(mimeType)
  ) {
    throw new BadRequestException({
      code: 'INVALID_IMAGE_TYPE',
      message: 'Only JPEG, PNG, and WebP images are allowed',
    });
  }

  const cleanBase64 = buffer.toString('base64');
  const hash = createHash('sha256').update(buffer).digest('hex');

  return { buffer, base64: cleanBase64, mimeType, hash };
}

function detectMime(buffer: Buffer): string | null {
  for (const entry of MAGIC) {
    if (entry.bytes.every((b, i) => buffer[i] === b)) {
      if (entry.mime === 'image/webp') {
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
