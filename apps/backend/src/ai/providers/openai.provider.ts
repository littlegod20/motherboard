import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import {
  VisionAnalyzeInput,
  VisionProvider,
} from './vision.provider';

@Injectable()
export class OpenAiVisionProvider implements VisionProvider {
  readonly name = 'openai';
  private readonly logger = new Logger(OpenAiVisionProvider.name);
  private readonly client: OpenAI | null;
  private readonly timeoutMs: number;

  constructor(config: ConfigService) {
    const apiKey = config.get<string>('OPENAI_API_KEY', '');
    this.client = apiKey ? new OpenAI({ apiKey }) : null;
    this.timeoutMs = config.get<number>('AI_TIMEOUT_MS', 7000);
  }

  isConfigured(): boolean {
    return !!this.client;
  }

  async analyze(input: VisionAnalyzeInput): Promise<string> {
    if (!this.client) {
      throw new Error('OpenAI API key not configured');
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await this.client.chat.completions.create(
        {
          model: 'gpt-4o',
          max_tokens: 1024,
          messages: [
            { role: 'system', content: input.systemPrompt },
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text:
                    input.userText ||
                    'Identify the motherboard component in this image.',
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:${input.mimeType};base64,${input.imageBase64}`,
                  },
                },
              ],
            },
          ],
        },
        { signal: controller.signal },
      );

      const text = response.choices[0]?.message?.content;
      if (!text) {
        throw new Error('Empty OpenAI response');
      }
      return text;
    } catch (err) {
      this.logger.warn(
        `OpenAI analyze failed: ${err instanceof Error ? err.message : err}`,
      );
      throw err;
    } finally {
      clearTimeout(timer);
    }
  }
}
