import { Global, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ImageFetchService } from './image-fetch.service';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';

@Global()
@Module({
  imports: [AuthModule],
  controllers: [MediaController],
  providers: [MediaService, ImageFetchService],
  exports: [MediaService, ImageFetchService],
})
export class MediaModule {}
