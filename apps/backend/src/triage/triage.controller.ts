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
import { AnalyzeCheckDto } from './dto/analyze-check.dto';
import { TriageService } from './triage.service';

@ApiTags('triage')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('triage')
export class TriageController {
  constructor(private readonly triageService: TriageService) {}

  @Post('sessions')
  create(@CurrentUser() user: AuthUser) {
    return this.triageService.createSession(user.id);
  }

  @Get('sessions')
  list(
    @CurrentUser() user: AuthUser,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.triageService.listSessions(user.id, page, limit);
  }

  @Get('sessions/:id')
  getOne(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.triageService.getSession(user.id, id);
  }

  @Post('sessions/:id/checks/:checkKey')
  analyzeCheck(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Param('checkKey') checkKey: string,
    @Body() dto: AnalyzeCheckDto,
  ) {
    return this.triageService.analyzeCheck(user.id, id, checkKey, dto.image);
  }

  @Post('sessions/:id/complete')
  complete(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.triageService.completeSession(user.id, id);
  }
}
