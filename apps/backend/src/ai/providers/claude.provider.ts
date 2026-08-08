import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';
import {
  VisionAnalyzeInput,
  VisionProvider,
} from './vision.provider';

@Injectable()
export class ClaudeVisionProvider implements VisionProvider {
  readonly name = 'claude';
  private readonly logger = new Logger(ClaudeVisionProvider.name);
  private readonly client: Anthropic | null;
  private readonly timeoutMs: number;

  constructor(config: ConfigService) {
    const apiKey = config.get<string>('ANTHROPIC_API_KEY', '');
    this.client = apiKey ? new Anthropic({ apiKey }) : null;
    this.timeoutMs = config.get<number>('AI_TIMEOUT_MS', 7000);
  }

  isConfigured(): boolean {
    return !!this.client;
  }

  async analyze(input: VisionAnalyzeInput): Promise<string> {
    if (!this.client) {
      throw new Error('Anthropic API key not configured');
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await this.client.messages.create(
        {
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1024,
          system: input.systemPrompt,
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'image',
                  source: {
                    type: 'base64',
                    media_type: input.mimeType as
                      | 'image/jpeg'
                      | 'image/png'
                      | 'image/webp'
                      | 'image/gif',
                    data: input.imageBase64,
                  },
                },
                {
                  type: 'text',
                  text:
                    input.userText ||
                    'Identify the motherboard component in this image.',
                },
              ],
            },
          ],
        },
        { signal: controller.signal },
      );

      const text = response.content
        .filter((b) => b.type === 'text')
        .map((b) => (b.type === 'text' ? b.text : ''))
        .join('\n');

      if (!text) {
        throw new Error('Empty Claude response');
      }
      return text;
    } catch (err) {
      this.logger.warn(
        `Claude analyze failed: ${err instanceof Error ? err.message : err}`,
      );
      throw err;
    } finally {
      clearTimeout(timer);
    }
  }
}
