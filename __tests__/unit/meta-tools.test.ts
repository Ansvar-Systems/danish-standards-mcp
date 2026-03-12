// __tests__/unit/meta-tools.test.ts
import { describe, it, expect } from 'vitest';
import { handleAbout } from '../../src/tools/about.js';
import { handleListSources } from '../../src/tools/list-sources.js';
import { handleCheckDataFreshness } from '../../src/tools/check-data-freshness.js';

describe('meta-tools', () => {
  it('about returns server metadata with _meta', () => {
    const result = handleAbout();
    const text = result.content[0].text;
    expect(text).toContain('Danish Standards MCP');
    expect(text).toContain('domain_intelligence');
    expect(text).toContain('Ansvar MCP Network');
    expect(result._meta).toBeDefined();
  });

  it('list_sources returns all 20 Danish sources', () => {
    const result = handleListSources();
    const text = result.content[0].text;
    expect(text).toContain('CFCS');
    expect(text).toContain('Digitaliseringsstyrelsen');
    expect(text).toContain('Datatilsynet');
    expect(text).toContain('Sundhedsdatastyrelsen');
    expect(text).toContain('D-maerket');
    expect(result._meta).toBeDefined();
  });

  it('check_data_freshness returns a freshness report', () => {
    const result = handleCheckDataFreshness();
    const text = result.content[0].text;
    expect(text).toContain('Data Freshness Report');
    expect(result._meta).toBeDefined();
  });
});
