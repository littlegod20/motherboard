import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';

export class FeedbackDto {
  @ApiProperty({ enum: ['up', 'down'] })
  @IsIn(['up', 'down'])
  rating!: 'up' | 'down';
}
