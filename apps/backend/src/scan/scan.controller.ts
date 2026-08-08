import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthUser, CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateScanDto } from './dto/create-scan.dto';
import { FeedbackDto } from './dto/feedback.dto';
import { ScanService } from './scan.service';

@ApiTags('scan')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('scan')
export class ScanController {
  constructor(private readonly scanService: ScanService) {}

  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateScanDto) {
    return this.scanService.createScan(user.id, dto);
  }

  @Get('history')
  history(
    @CurrentUser() user: AuthUser,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('q') q?: string,
  ) {
    return this.scanService.history(user.id, page, limit, q);
  }

  @Get(':id')
  getOne(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.scanService.getById(user.id, id);
  }

  @Post(':id/feedback')
  feedback(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: FeedbackDto,
  ) {
    return this.scanService.submitFeedback(user.id, id, dto.rating);
  }
}
