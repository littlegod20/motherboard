export type VisionAnalyzeInput = {
  systemPrompt: string;
  userText?: string;
  imageBase64: string;
  mimeType: string;
  repairPrompt?: string;
};

export interface VisionProvider {
  readonly name: string;
  analyze(input: VisionAnalyzeInput): Promise<string>;
}

export const VISION_PROVIDERS = Symbol('VISION_PROVIDERS');
