import {
  BadRequestException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DecodedImage,
  decodeImageBuffer,
  MAX_IMAGE_BYTES,
} from '../common/utils/image.util';

@Injectable()
export class ImageFetchService {
  private readonly logger = new Logger(ImageFetchService.name);

  constructor(private readonly config: ConfigService) {}

  async fetchAllowlistedImage(url: string): Promise<DecodedImage> {
    this.assertAllowlistedUrl(url);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);

    try {
      const response = await fetch(url, {
        method: 'GET',
        redirect: 'follow',
        signal: controller.signal,
        headers: { Accept: 'image/*' },
      });

      if (!response.ok) {
        throw new BadRequestException({
          code: 'IMAGE_FETCH_FAILED',
          message: `Failed to fetch image (${response.status})`,
        });
      }

      const contentLength = Number(response.headers.get('content-length') || 0);
      if (contentLength > MAX_IMAGE_BYTES) {
        throw new BadRequestException({
          code: 'IMAGE_TOO_LARGE',
          message: 'Remote image exceeds size limit',
        });
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const contentType = response.headers.get('content-type') || undefined;
      return decodeImageBuffer(buffer, contentType?.split(';')[0]);
    } catch (err) {
      if (err instanceof BadRequestException) throw err;
      this.logger.warn(
        `Image fetch failed: ${err instanceof Error ? err.message : err}`,
      );
      throw new BadRequestException({
        code: 'IMAGE_FETCH_FAILED',
        message: 'Could not download image from URL',
      });
    } finally {
      clearTimeout(timer);
    }
  }

  assertAllowlistedUrl(url: string): void {
    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      throw new BadRequestException({
        code: 'INVALID_IMAGE_URL',
        message: 'imageUrl must be a valid HTTPS URL',
      });
    }

    if (parsed.protocol !== 'https:') {
      throw new BadRequestException({
        code: 'INVALID_IMAGE_URL',
        message: 'imageUrl must use HTTPS',
      });
    }

    const cloudName = this.config.get<string>('CLOUDINARY_CLOUD_NAME', '');
    const allowedHosts = new Set([
      'res.cloudinary.com',
      'media.cloudinary.com',
    ]);
    if (cloudName) {
      allowedHosts.add(`${cloudName}-res.cloudinary.com`);
    }

    const host = parsed.hostname.toLowerCase();
    const allowed =
      allowedHosts.has(host) ||
      (cloudName &&
        host.endsWith('.cloudinary.com') &&
        host.includes(cloudName.toLowerCase()));

    if (!allowed) {
      throw new BadRequestException({
        code: 'INVALID_IMAGE_URL',
        message: 'imageUrl host is not allowlisted',
      });
    }

    // Path should look like a Cloudinary delivery URL when cloud name set
    if (cloudName && !parsed.pathname.includes(`/${cloudName}/`)) {
      // Allow if host is res.cloudinary.com/cloudName/...
      const parts = parsed.pathname.split('/').filter(Boolean);
      if (parts[0] !== cloudName) {
        throw new BadRequestException({
          code: 'INVALID_IMAGE_URL',
          message: 'imageUrl does not match configured Cloudinary cloud',
        });
      }
    }
  }
}
