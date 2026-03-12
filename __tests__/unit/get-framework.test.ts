// __tests__/unit/get-framework.test.ts
import { describe, it, expect } from 'vitest';
import { handleGetFramework } from '../../src/tools/get-framework.js';

describe('handleGetFramework', () => {
  it('returns framework details for cfcs-vejledning including control count, categories table, and sectors', () => {
    const result = handleGetFramework({ framework_id: 'cfcs-vejledning' });

    expect(result.isError).toBeFalsy();
    expect(result._meta).toBeDefined();

    const text = result.content[0].text;

    // Framework name
    expect(text).toContain('CFCS Cybersikkerhedsvejledning');
    expect(text).toContain('CFCS Cybersecurity Guidance');

    // Issuing body
    expect(text).toContain('Center for Cybersikkerhed');

    // Sectors
    expect(text).toContain('government');

    // Control count -- cfcs has 4 controls in test DB
    expect(text).toContain('4');

    // Categories present
    expect(text).toContain('Netvaerkssikkerhed');

    // Source URL
    expect(text).toContain('cfcs.dk');
  });

  it('returns NO_MATCH for unknown framework', () => {
    const result = handleGetFramework({ framework_id: 'nonexistent-fw' });

    expect(result.isError).toBe(true);
    expect(result._error_type).toBe('NO_MATCH');
    expect(result._meta).toBeDefined();
  });

  it('returns INVALID_INPUT for missing framework_id', () => {
    // @ts-expect-error -- intentional missing arg for test
    const result = handleGetFramework({});

    expect(result.isError).toBe(true);
    expect(result._error_type).toBe('INVALID_INPUT');
    expect(result._meta).toBeDefined();
  });
});
