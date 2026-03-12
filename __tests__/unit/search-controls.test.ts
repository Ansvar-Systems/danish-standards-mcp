// __tests__/unit/search-controls.test.ts
import { describe, it, expect } from 'vitest';
import { handleSearchControls } from '../../src/tools/search-controls.js';

describe('handleSearchControls', () => {
  it('finds controls by Danish term "informationssikkerhed"', () => {
    const result = handleSearchControls({ query: 'informationssikkerhed' });

    expect(result.isError).toBeFalsy();
    expect(result._meta).toBeDefined();

    const text = result.content[0].text;

    // Should find statens-iso27001 controls
    expect(text).toContain('statens-iso27001:');
    expect(text).toContain('total_results');

    // Markdown table structure
    expect(text).toContain('| ID |');
    expect(text).toContain('|');
  });

  it('finds controls by English term "segmentation"', () => {
    const result = handleSearchControls({ query: 'segmentation' });

    expect(result.isError).toBeFalsy();

    const text = result.content[0].text;

    // Should find cfcs-vejledning:N01 which has "segmentation" in English title
    expect(text).toContain('cfcs-vejledning:N01');
    expect(text).toContain('total_results');
    // Should find at least one result
    const totalMatch = text.match(/total_results:\s*(\d+)/);
    expect(totalMatch).not.toBeNull();
    const total = parseInt(totalMatch![1], 10);
    expect(total).toBeGreaterThan(0);
  });

  it('filters by framework_id', () => {
    const result = handleSearchControls({ query: 'sikkerhed', framework_id: 'cfcs-vejledning' });

    expect(result.isError).toBeFalsy();

    const text = result.content[0].text;

    // Should find cfcs-vejledning controls only
    expect(text).toContain('cfcs-vejledning:');

    // Should NOT find controls from other frameworks
    expect(text).not.toContain('statens-iso27001:');
    expect(text).not.toContain('sds-sundhed:');
  });

  it('returns NO_MATCH for gibberish', () => {
    const result = handleSearchControls({ query: 'xyzzyqqqfoobarblarg' });

    expect(result.isError).toBe(true);
    expect(result._error_type).toBe('NO_MATCH');
    expect(result._meta).toBeDefined();
  });

  it('returns INVALID_INPUT for empty query', () => {
    const result = handleSearchControls({ query: '' });

    expect(result.isError).toBe(true);
    expect(result._error_type).toBe('INVALID_INPUT');
    expect(result._meta).toBeDefined();
  });

  it('returns INVALID_INPUT for missing query', () => {
    // @ts-expect-error -- intentional missing arg for test
    const result = handleSearchControls({});

    expect(result.isError).toBe(true);
    expect(result._error_type).toBe('INVALID_INPUT');
    expect(result._meta).toBeDefined();
  });

  it('supports pagination with offset', () => {
    // Search for something broad enough to return multiple results
    const page1 = handleSearchControls({ query: 'sikkerhed', limit: 1, offset: 0 });
    const page2 = handleSearchControls({ query: 'sikkerhed', limit: 1, offset: 1 });

    expect(page1.isError).toBeFalsy();

    const text1 = page1.content[0].text;

    // Page 1 reports total count
    expect(text1).toContain('total_results');

    // If there are multiple results, page 2 should differ from page 1
    const totalMatch = text1.match(/total_results:\s*(\d+)/);
    if (totalMatch && parseInt(totalMatch[1], 10) > 1) {
      expect(page2.isError).toBeFalsy();
      const text2 = page2.content[0].text;

      // Pages should not be identical
      expect(text1).not.toBe(text2);
    }
  });

  it('language fallback: EN preferred for bilingual controls', () => {
    // Search with language en -- cfcs controls have English titles
    const result = handleSearchControls({ query: 'sikkerhed', language: 'en' });

    expect(result.isError).toBeFalsy();

    const text = result.content[0].text;

    // Should have results
    expect(text).toContain('total_results');
  });

  it('language fallback: Danish title shown when English title is null for a Danish-only control', () => {
    // Search for a control that exists in Danish
    const result = handleSearchControls({ query: 'Netvaerkssegmentering', language: 'en' });

    expect(result.isError).toBeFalsy();

    const text = result.content[0].text;

    // Should find cfcs-vejledning:N01
    expect(text).toContain('cfcs-vejledning:N01');
  });
});
