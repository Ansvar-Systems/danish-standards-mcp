// __tests__/unit/get-control.test.ts
import { describe, it, expect } from 'vitest';
import { handleGetControl } from '../../src/tools/get-control.js';

describe('handleGetControl', () => {
  it('returns full control detail for cfcs-vejledning:N01', () => {
    const result = handleGetControl({ control_id: 'cfcs-vejledning:N01' });

    expect(result.isError).toBeFalsy();
    expect(result._meta).toBeDefined();

    const text = result.content[0].text;

    // Heading: control number
    expect(text).toContain('N01');

    // English title present
    expect(text).toContain('Network segmentation');

    // Framework name
    expect(text).toContain('CFCS');

    // Category
    expect(text).toContain('Netvaerkssikkerhed');

    // ISO mapping
    expect(text).toContain('8.22');

    // Danish description present
    expect(text).toContain('Netvaerkssegmentering');
  });

  it('returns NO_MATCH for cfcs-vejledning:999.999', () => {
    const result = handleGetControl({ control_id: 'cfcs-vejledning:999.999' });

    expect(result.isError).toBe(true);
    expect(result._error_type).toBe('NO_MATCH');
    expect(result._meta).toBeDefined();
  });

  it('returns INVALID_INPUT for missing control_id', () => {
    // @ts-expect-error -- intentional missing arg for test
    const result = handleGetControl({});

    expect(result.isError).toBe(true);
    expect(result._error_type).toBe('INVALID_INPUT');
    expect(result._meta).toBeDefined();
  });
});
