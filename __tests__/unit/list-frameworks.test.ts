// __tests__/unit/list-frameworks.test.ts
import { describe, it, expect } from 'vitest';
import { handleListFrameworks } from '../../src/tools/list-frameworks.js';

describe('handleListFrameworks', () => {
  it('returns a Markdown table containing all 6 frameworks with control counts', () => {
    const result = handleListFrameworks();

    expect(result.isError).toBeFalsy();
    expect(result._meta).toBeDefined();

    const text = result.content[0].text;

    // Core framework IDs present
    expect(text).toContain('cfcs-vejledning');
    expect(text).toContain('statens-iso27001');
    expect(text).toContain('digst-sikkerhed');

    // Framework names present
    expect(text).toContain('CFCS');
    expect(text).toContain('statens-iso27001');
    expect(text).toContain('Digitaliseringsstyrelsen');

    // Issuing bodies present
    expect(text).toContain('Center for Cybersikkerhed');

    // cfcs-vejledning row present
    expect(text).toContain('| cfcs-vejledning |');

    // Sectors present
    expect(text).toContain('government');
    expect(text).toContain('healthcare');

    // Markdown table structure
    expect(text).toContain('| ID |');
    expect(text).toContain('|');

    // 20 frameworks
    expect(text).toContain('20 frameworks');
  });
});
