import { componentResultSchema } from '../schemas/component-result.schema';
import { extractJsonText, parseAiJson } from './parse-ai-json';

describe('parseAiJson', () => {
  it('extracts JSON from markdown fences', () => {
    const raw = '```json\n{"name":"VRM","confidence":0.9}\n```';
    expect(extractJsonText(raw)).toContain('"name"');
  });

  it('parses component schema', () => {
    const result = parseAiJson(
      JSON.stringify({
        name: 'VRM',
        designator: 'U1',
        confidence: 0.91,
        type: 'Power',
        package: '',
        voltage: '1.2V',
        related: 'CPU',
        knownFailureSigns: ['throttle'],
        category: 'Power Delivery',
        description: 'Regulates CPU power.',
        upgradeNotes: 'Check phases.',
        specifications: { phases: '8+2' },
      }),
      componentResultSchema,
    );
    expect(result.name).toBe('VRM');
    expect(result.confidence).toBe(0.91);
  });
});
