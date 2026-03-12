// scripts/ingest-fetch.ts
// Orchestrates running all Danish standards ingestion scripts.
// Each script generates data/extracted/{framework-id}.json

import { execFileSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

interface FetchResult {
  script: string;
  source: string;
  success: boolean;
  error?: string;
  durationMs: number;
}

const SOURCES: { script: string; source: string }[] = [
  { script: join(__dirname, 'ingest-cfcs.ts'), source: 'CFCS Cybersikkerhedsvejledning' },
  { script: join(__dirname, 'ingest-digst.ts'), source: 'Digitaliseringsstyrelsen Sikkerhedsvejledning' },
  { script: join(__dirname, 'ingest-statens-iso27001.ts'), source: 'Statens ISO 27001' },
  { script: join(__dirname, 'ingest-d-maerket.ts'), source: 'D-maerket Digital Trust Label' },
  { script: join(__dirname, 'ingest-datatilsynet.ts'), source: 'Datatilsynet GDPR Measures' },
  { script: join(__dirname, 'ingest-sds-sundhed.ts'), source: 'Sundhedsdatastyrelsen IT Security' },
];

function runScript(scriptPath: string): { success: boolean; error?: string; durationMs: number } {
  const start = Date.now();
  try {
    execFileSync(
      process.execPath,
      ['--import', 'tsx', scriptPath],
      {
        stdio: 'inherit',
        timeout: 120_000,
      }
    );
    return { success: true, durationMs: Date.now() - start };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, error: msg, durationMs: Date.now() - start };
  }
}

async function main(): Promise<void> {
  console.log('Ingest Fetch — Danish Standards MCP');
  console.log('====================================');
  console.log(`Running ${SOURCES.length} source ingestion scripts`);
  console.log('');

  const results: FetchResult[] = [];

  for (const { script, source } of SOURCES) {
    console.log(`--- Fetching: ${source} ---`);
    const result = runScript(script);
    results.push({ script, source, ...result });
    console.log('');
  }

  // Summary
  console.log('=============================');
  console.log('Fetch Summary');
  console.log('=============================');

  const succeeded = results.filter((r) => r.success);
  const failed = results.filter((r) => !r.success);

  for (const r of results) {
    const status = r.success ? 'OK' : 'FAILED';
    const duration = (r.durationMs / 1000).toFixed(1);
    console.log(`  [${status}] ${r.source} (${duration}s)`);
    if (!r.success && r.error) {
      console.log(`         ${r.error.split('\n')[0]}`);
    }
  }

  console.log('');
  console.log(`Result: ${succeeded.length}/${SOURCES.length} sources fetched successfully`);

  if (failed.length > 0) {
    console.error(`\n${failed.length} source(s) failed. Check output above.`);
    process.exit(1);
  }

  console.log('Done.');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
