import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsUrl, Max, Min } from 'class-validator';

export class CreateScanDto {
  @ApiProperty({ description: 'Cloudinary HTTPS URL of cropped region' })
  @IsString()
  @IsUrl({ protocols: ['https'], require_protocol: true })
  imageUrl!: string;

  @ApiPropertyOptional({ description: 'Optional full-frame Cloudinary URL' })
  @IsOptional()
  @IsString()
  @IsUrl({ protocols: ['https'], require_protocol: true })
  fullImageUrl?: string;

  @ApiProperty({ minimum: 0, maximum: 1 })
  @IsNumber()
  @Min(0)
  @Max(1)
  tapX!: number;

  @ApiProperty({ minimum: 0, maximum: 1 })
  @IsNumber()
  @Min(0)
  @Max(1)
  tapY!: number;
}
