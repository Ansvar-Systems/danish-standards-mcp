// __tests__/unit/list-controls.test.ts
import { describe, it, expect } from 'vitest';
import { handleListControls } from '../../src/tools/list-controls.js';

describe('handleListControls', () => {
  it('lists all controls for cfcs-vejledning with total_results count', () => {
    const result = handleListControls({ framework_id: 'cfcs-vejledning' });

    expect(result.isError).toBeFalsy();
    expect(result._meta).toBeDefined();

    const text = result.content[0].text;

    // Header with total count (60 controls in cfcs-vejledning)
    expect(text).toContain('total_results: 58');

    // First cfcs control present
    expect(text).toContain('cfcs-vejledning:N01');

    // Markdown table structure
    expect(text).toContain('| ID |');
    expect(text).toContain('|');
  });

  it('filters controls by category', () => {
    const result = handleListControls({ framework_id: 'cfcs-vejledning', category: 'Netvaerkssikkerhed' });

    expect(result.isError).toBeFalsy();

    const text = result.content[0].text;

    // Network security controls present
    expect(text).toContain('cfcs-vejledning:N01');
    expect(text).toContain('cfcs-vejledning:N07');

    // Should NOT find identity management controls
    expect(text).not.toContain('cfcs-vejledning:N12');
  });

  it('returns INVALID_INPUT for missing framework_id', () => {
    // @ts-expect-error -- intentional missing arg for test
    const result = handleListControls({});

    expect(result.isError).toBe(true);
    expect(result._error_type).toBe('INVALID_INPUT');
    expect(result._meta).toBeDefined();
  });

  it('returns NO_MATCH for unknown framework', () => {
    const result = handleListControls({ framework_id: 'nonexistent-framework' });

    expect(result.isError).toBe(true);
    expect(result._error_type).toBe('NO_MATCH');
    expect(result._meta).toBeDefined();
  });

  it('paginates results via limit and offset', () => {
    const page1 = handleListControls({ framework_id: 'cfcs-vejledning', limit: 1, offset: 0 });
    const page2 = handleListControls({ framework_id: 'cfcs-vejledning', limit: 1, offset: 1 });

    expect(page1.isError).toBeFalsy();
    expect(page2.isError).toBeFalsy();

    const text1 = page1.content[0].text;
    const text2 = page2.content[0].text;

    // Both pages report the full total_results (60)
    expect(text1).toContain('total_results: 58');
    expect(text2).toContain('total_results: 58');

    // The two pages return different controls
    expect(text1).not.toBe(text2);
  });

  it('prefers English title when language is en', () => {
    const result = handleListControls({ framework_id: 'cfcs-vejledning', language: 'en' });

    expect(result.isError).toBeFalsy();

    const text = result.content[0].text;

    // English title present in cfcs data
    expect(text).toContain('Network segmentation');
  });

  it('defaults to Danish titles', () => {
    const result = handleListControls({ framework_id: 'cfcs-vejledning' });

    expect(result.isError).toBeFalsy();

    const text = result.content[0].text;

    // Danish title_nl
    expect(text).toContain('Segmentering af netvaerk');
  });
});
