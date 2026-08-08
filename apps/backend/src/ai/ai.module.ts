import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { ClaudeVisionProvider } from './providers/claude.provider';
import { OpenAiVisionProvider } from './providers/openai.provider';

@Module({
  providers: [ClaudeVisionProvider, OpenAiVisionProvider, AiService],
  exports: [AiService],
})
export class AiModule {}
