// __tests__/unit/compare-controls.test.ts
import { describe, it, expect } from 'vitest';
import { handleCompareControls } from '../../src/tools/compare-controls.js';

describe('handleCompareControls', () => {
  it('compares controls across cfcs-vejledning and statens-iso27001 for "sikkerhed"', () => {
    const result = handleCompareControls({
      query: 'sikkerhed',
      framework_ids: ['cfcs-vejledning', 'statens-iso27001'],
    });

    expect(result.isError).toBeFalsy();
    expect(result._meta).toBeDefined();

    const text = result.content[0].text;

    // Should have a section for each framework
    expect(text).toContain('cfcs-vejledning');
    expect(text).toContain('statens-iso27001');
  });

  it('returns INVALID_INPUT for fewer than 2 frameworks', () => {
    const result = handleCompareControls({
      query: 'sikkerhed',
      framework_ids: ['cfcs-vejledning'],
    });

    expect(result.isError).toBe(true);
    expect(result._error_type).toBe('INVALID_INPUT');
    expect(result._meta).toBeDefined();
  });

  it('returns INVALID_INPUT for empty framework_ids array', () => {
    const result = handleCompareControls({
      query: 'sikkerhed',
      framework_ids: [],
    });

    expect(result.isError).toBe(true);
    expect(result._error_type).toBe('INVALID_INPUT');
  });

  it('returns INVALID_INPUT for more than 4 frameworks', () => {
    const result = handleCompareControls({
      query: 'sikkerhed',
      framework_ids: ['cfcs-vejledning', 'statens-iso27001', 'digst-sikkerhed', 'sds-sundhed', 'datatilsynet-dk'],
    });

    expect(result.isError).toBe(true);
    expect(result._error_type).toBe('INVALID_INPUT');
    expect(result._meta).toBeDefined();
  });

  it('returns INVALID_INPUT when framework_ids is missing', () => {
    // @ts-expect-error -- intentional missing arg for test
    const result = handleCompareControls({ query: 'sikkerhed' });

    expect(result.isError).toBe(true);
    expect(result._error_type).toBe('INVALID_INPUT');
  });

  it('returns INVALID_INPUT when query is missing', () => {
    // @ts-expect-error -- intentional missing arg for test
    const result = handleCompareControls({ framework_ids: ['cfcs-vejledning', 'statens-iso27001'] });

    expect(result.isError).toBe(true);
    expect(result._error_type).toBe('INVALID_INPUT');
  });

  it('renders one markdown section per framework with control number and title', () => {
    const result = handleCompareControls({
      query: 'sikkerhed',
      framework_ids: ['cfcs-vejledning', 'statens-iso27001'],
    });

    expect(result.isError).toBeFalsy();

    const text = result.content[0].text;

    // Section headers for each framework
    expect(text).toMatch(/##\s+cfcs-vejledning/);
    expect(text).toMatch(/##\s+statens-iso27001/);
  });
});
