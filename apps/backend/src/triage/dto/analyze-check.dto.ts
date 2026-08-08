import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AnalyzeCheckDto {
  @ApiProperty({ description: 'Base64 or data-URL image for this check' })
  @IsString()
  image!: string;
}
