import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateScanDto {
  @ApiProperty({ description: 'Base64 or data-URL of cropped region' })
  @IsString()
  croppedImage!: string;

  @ApiPropertyOptional({ description: 'Optional full-frame base64 image' })
  @IsOptional()
  @IsString()
  fullImage?: string;

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
