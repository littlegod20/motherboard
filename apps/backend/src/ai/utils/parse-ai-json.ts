import { ZodType } from 'zod';

export function extractJsonText(raw: string): string {
  const trimmed = raw.trim();
  if (trimmed.startsWith('```')) {
    return trimmed
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/, '')
      .trim();
  }
  const start = trimmed.indexOf('{');
  const end = trimmed.lastIndexOf('}');
  if (start >= 0 && end > start) {
    return trimmed.slice(start, end + 1);
  }
  return trimmed;
}

export function parseAiJson<T>(raw: string, schema: ZodType<T>): T {
  const text = extractJsonText(raw);
  const data = JSON.parse(text) as unknown;
  return schema.parse(data);
}
