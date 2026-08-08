import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl } from 'class-validator';

export class AnalyzeCheckDto {
  @ApiProperty({ description: 'Cloudinary HTTPS URL for this check image' })
  @IsString()
  @IsUrl({ protocols: ['https'], require_protocol: true })
  imageUrl!: string;
}
