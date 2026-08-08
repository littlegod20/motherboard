import { Module } from '@nestjs/common';
import { AiModule } from '../ai/ai.module';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { TriageController } from './triage.controller';
import { TriageService } from './triage.service';

@Module({
  imports: [AiModule, AuthModule, UsersModule],
  controllers: [TriageController],
  providers: [TriageService],
})
export class TriageModule {}
