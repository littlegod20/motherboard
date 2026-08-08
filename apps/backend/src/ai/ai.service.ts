import {
  Injectable,
  Logger,
  ServiceUnavailableException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ZodType } from 'zod';
import { ClaudeVisionProvider } from './providers/claude.provider';
import { OpenAiVisionProvider } from './providers/openai.provider';
import { VisionProvider } from './providers/vision.provider';
import { parseAiJson } from './utils/parse-ai-json';
import {
  ComponentResult,
  componentResultSchema,
  TriageAiResult,
  triageCheckResultSchema,
} from './schemas/component-result.schema';
import {
  COMPONENT_IDENTIFY_SYSTEM_PROMPT,
  COMPONENT_REPAIR_PROMPT,
} from './prompts/component-identify.prompt';
import {
  buildTriageSystemPrompt,
  TRIAGE_REPAIR_PROMPT,
} from './prompts/triage-check.prompt';

export type AiMeta = {
  provider: string;
  cacheHit?: boolean;
};

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(
    private readonly claude: ClaudeVisionProvider,
    private readonly openai: OpenAiVisionProvider,
  ) {}

  async identifyComponent(
    imageBase64: string,
    mimeType: string,
  ): Promise<{ result: ComponentResult; provider: string }> {
    return this.runWithFallback(
      COMPONENT_IDENTIFY_SYSTEM_PROMPT,
      COMPONENT_REPAIR_PROMPT,
      'Identify the motherboard component in this cropped image.',
      imageBase64,
      mimeType,
      componentResultSchema,
    );
  }

  async analyzeTriageCheck(
    imageBase64: string,
    mimeType: string,
    checkLabel: string,
    checkDetail: string,
  ): Promise<{ result: TriageAiResult; provider: string }> {
    return this.runWithFallback(
      buildTriageSystemPrompt(checkLabel, checkDetail),
      TRIAGE_REPAIR_PROMPT,
      `Analyze this image for the "${checkLabel}" triage check.`,
      imageBase64,
      mimeType,
      triageCheckResultSchema,
    );
  }

  private providers(): VisionProvider[] {
    const list: VisionProvider[] = [];
    if (this.claude.isConfigured()) list.push(this.claude);
    if (this.openai.isConfigured()) list.push(this.openai);
    return list;
  }

  private async runWithFallback<T>(
    systemPrompt: string,
    repairPrompt: string,
    userText: string,
    imageBase64: string,
    mimeType: string,
    schema: ZodType<T>,
  ): Promise<{ result: T; provider: string }> {
    const providers = this.providers();
    if (providers.length === 0) {
      throw new ServiceUnavailableException({
        code: 'AI_UNAVAILABLE',
        message: 'No vision AI providers configured',
      });
    }

    let lastError: unknown;

    for (const provider of providers) {
      try {
        const raw = await provider.analyze({
          systemPrompt,
          userText,
          imageBase64,
          mimeType,
        });

        try {
          return { result: parseAiJson(raw, schema), provider: provider.name };
        } catch {
          this.logger.warn(`${provider.name}: parse failed, attempting repair`);
          const repaired = await provider.analyze({
            systemPrompt: `${systemPrompt}\n\n${repairPrompt}`,
            userText: `Previous invalid output:\n${raw.slice(0, 1500)}\n\nReturn corrected JSON only.`,
            imageBase64,
            mimeType,
            repairPrompt,
          });
          return {
            result: parseAiJson(repaired, schema),
            provider: provider.name,
          };
        }
      } catch (err) {
        lastError = err;
        this.logger.warn(
          `${provider.name} failed, trying next: ${err instanceof Error ? err.message : err}`,
        );
      }
    }

    throw new UnprocessableEntityException({
      code: 'UNIDENTIFIED',
      message: 'Could not identify from image',
      details:
        lastError instanceof Error ? lastError.message : 'All providers failed',
    });
  }
}
