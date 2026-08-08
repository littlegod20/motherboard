import {
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash } from 'crypto';

@Injectable()
export class MediaService {
  constructor(private readonly config: ConfigService) {}

  createSignedUpload(userId: string) {
    const cloudName = this.config.get<string>('CLOUDINARY_CLOUD_NAME', '');
    const apiKey = this.config.get<string>('CLOUDINARY_API_KEY', '');
    const apiSecret = this.config.get<string>('CLOUDINARY_API_SECRET', '');
    const folderRoot = this.config.get<string>(
      'CLOUDINARY_FOLDER',
      'boardscan',
    );

    if (!cloudName || !apiKey || !apiSecret) {
      throw new ServiceUnavailableException({
        code: 'MEDIA_UNAVAILABLE',
        message: 'Cloudinary is not configured',
      });
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const folder = `${folderRoot}/${userId}`;
    // Signed params for unsigned-style authenticated upload
    const paramsToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const signature = createHash('sha1').update(paramsToSign).digest('hex');

    return {
      cloudName,
      apiKey,
      timestamp,
      signature,
      folder,
      uploadUrl: `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    };
  }
}
