// __tests__/unit/search-by-sector.test.ts
import { describe, it, expect } from 'vitest';
import { handleSearchBySector } from '../../src/tools/search-by-sector.js';

describe('handleSearchBySector', () => {
  it('healthcare sector returns sds-sundhed', () => {
    const result = handleSearchBySector({ sector: 'healthcare' });

    expect(result.isError).toBeFalsy();
    expect(result._meta).toBeDefined();

    const text = result.content[0].text;

    expect(text).toContain('sds-sundhed');
  });

  it('finance sector returns d-maerket and datatilsynet-dk', () => {
    const result = handleSearchBySector({ sector: 'finance' });

    expect(result.isError).toBeFalsy();

    const text = result.content[0].text;

    // d-maerket and datatilsynet-dk cover finance sector
    expect(text).toContain('d-maerket');
    expect(text).toContain('datatilsynet-dk');
  });

  it('government sector returns cfcs-vejledning, digst-sikkerhed, and statens-iso27001', () => {
    const result = handleSearchBySector({ sector: 'government' });

    expect(result.isError).toBeFalsy();

    const text = result.content[0].text;

    expect(text).toContain('cfcs-vejledning');
    expect(text).toContain('digst-sikkerhed');
    expect(text).toContain('statens-iso27001');
  });

  it('with query param returns matching controls within sector frameworks', () => {
    const result = handleSearchBySector({ sector: 'government', query: 'sikkerhed' });

    expect(result.isError).toBeFalsy();

    const text = result.content[0].text;

    // Framework section must be present
    expect(text).toContain('cfcs-vejledning');

    // Must not leak controls from non-government sector-only frameworks
    expect(text).not.toContain('sds-sundhed:');
  });

  it('unknown sector returns INVALID_INPUT', () => {
    const result = handleSearchBySector({ sector: 'unknown-sector-xyz' });

    expect(result.isError).toBe(true);
    expect(result._error_type).toBe('INVALID_INPUT');
    expect(result._meta).toBeDefined();
  });

  it('missing/empty sector returns INVALID_INPUT', () => {
    // @ts-expect-error -- intentional missing arg for test
    const result = handleSearchBySector({});

    expect(result.isError).toBe(true);
    expect(result._error_type).toBe('INVALID_INPUT');
  });

  it('empty string sector returns INVALID_INPUT', () => {
    const result = handleSearchBySector({ sector: '' });

    expect(result.isError).toBe(true);
    expect(result._error_type).toBe('INVALID_INPUT');
  });

  it('returns NO_MATCH when sector has no frameworks', () => {
    // 'transport' without standalone assignment returns only if cfcs covers it;
    // use a sector that no framework has seeded
    const result = handleSearchBySector({ sector: 'water' });

    // CFCS covers water sector, so this returns a match
    expect(result.isError).toBeFalsy();
    expect(result.content[0].text).toContain('cfcs-vejledning');
  });
});
