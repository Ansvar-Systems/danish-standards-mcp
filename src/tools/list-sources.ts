// src/tools/list-sources.ts
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { successResponse } from '../response-meta.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

interface SourceEntry {
  id: string;
  authority: string;
  name: string;
  retrieval_method: string;
  license: string;
  url?: string;
}

const FALLBACK_SOURCES: SourceEntry[] = [
  {
    id: 'CFCS',
    authority: 'Center for Cybersikkerhed (CFCS)',
    name: 'CFCS Cybersikkerhedsvejledning',
    retrieval_method: 'Static download (PDF/HTML)',
    license: 'Public sector publication',
    url: 'https://www.cfcs.dk/da/forebyggelse/vejledninger/',
  },
  {
    id: 'Digst',
    authority: 'Digitaliseringsstyrelsen',
    name: 'Digitaliseringsstyrelsens sikkerhedsvejledning',
    retrieval_method: 'Static download (PDF/HTML)',
    license: 'Public sector publication',
    url: 'https://digst.dk/it-loesninger/sikkerhed/',
  },
  {
    id: 'Statens-ISO27001',
    authority: 'Digitaliseringsstyrelsen',
    name: 'ISO 27001-baseret sikkerhedsstandard for statslige myndigheder',
    retrieval_method: 'Static download (PDF/HTML)',
    license: 'Public sector publication',
    url: 'https://digst.dk/it-loesninger/standarder/iso-27001/',
  },
  {
    id: 'D-maerket',
    authority: 'D-maerket (independent body)',
    name: 'D-maerket Digital Trust Label',
    retrieval_method: 'Static download (HTML)',
    license: 'Public sector publication',
    url: 'https://www.markup.dk/',
  },
  {
    id: 'Datatilsynet',
    authority: 'Datatilsynet',
    name: 'Datatilsynets vejledning om tekniske og organisatoriske foranstaltninger',
    retrieval_method: 'Static download (PDF/HTML)',
    license: 'Public sector publication',
    url: 'https://www.datatilsynet.dk/hvad-siger-reglerne/vejledning/',
  },
  {
    id: 'SDS',
    authority: 'Sundhedsdatastyrelsen',
    name: 'Sundhedsdatastyrelsens krav til IT-sikkerhed',
    retrieval_method: 'Static download (PDF/HTML)',
    license: 'Public sector publication',
    url: 'https://sundhedsdatastyrelsen.dk/da/registre-og-services/om-informationssikkerhed',
  },
];

export function handleListSources() {
  const sources: SourceEntry[] = FALLBACK_SOURCES;

  const sourcesPath = join(__dirname, '..', '..', 'sources.yml');
  if (existsSync(sourcesPath)) {
    try {
      const raw = readFileSync(sourcesPath, 'utf-8');
      void raw;
    } catch {
      // Ignore read errors — use fallback
    }
  }

  const lines: string[] = [];

  lines.push('## Data Sources');
  lines.push('');
  lines.push(
    'This MCP server aggregates Danish cybersecurity standards from the following authoritative sources:'
  );
  lines.push('');
  lines.push('| ID | Authority | Standard / Document | Retrieval method | License |');
  lines.push('|----|-----------|---------------------|-----------------|---------|');

  for (const src of sources) {
    const nameCell = src.url ? `[${src.name}](${src.url})` : src.name;
    lines.push(`| ${src.id} | ${src.authority} | ${nameCell} | ${src.retrieval_method} | ${src.license} |`);
  }

  lines.push('');
  lines.push(`**Total sources:** ${sources.length}`);
  lines.push('');
  lines.push(
    '> All data is extracted from public authoritative documents. ' +
    'This tool is a reference aid — verify critical compliance decisions against the originals.'
  );

  return successResponse(lines.join('\n'));
}
