// scripts/ingest-kl-sikkerhed.ts
// KL (Kommunernes Landsforening) sikkerhedsvejledning for kommuner

import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'data', 'extracted');
const OUTPUT_FILE = join(DATA_DIR, 'kl-sikkerhed.json');

interface Control {
  control_number: string; title: string; title_nl: string; description: string; description_nl: string;
  category: string; subcategory: string | null; level: string | null; iso_mapping: string | null;
  implementation_guidance: string | null; verification_guidance: string | null; source_url: string;
}

function generateControls(): Control[] {
  const controls: Control[] = [];
  let seq = 1;
  function add(cat: string, sub: string | null, tDa: string, tEn: string, dDa: string, dEn: string, iso: string | null, guide: string | null, level: string | null) {
    controls.push({ control_number: `KL${seq.toString().padStart(2, '0')}`, title: tEn, title_nl: tDa, description: dEn, description_nl: dDa, category: cat, subcategory: sub, level: level ?? 'Anbefaling', iso_mapping: iso, implementation_guidance: guide, verification_guidance: null, source_url: 'https://www.kl.dk/it-og-digitalisering/informationssikkerhed/' });
    seq++;
  }

  // === ISMS i kommunerne (ISMS in Municipalities) ===
  add('ISMS', 'Ledelsessystem', 'Kommunalt ISMS baseret pa ISO 27001', 'Municipal ISMS based on ISO 27001',
    'Kommuner skal etablere et ledelsessystem for informationssikkerhed (ISMS) baseret pa ISO 27001 med ledelsens aktive engagement.',
    'Municipalities must establish an information security management system (ISMS) based on ISO 27001 with active management engagement.',
    '5.1', 'Foelg KLs implementeringsvejledning for kommunalt ISMS. Start med ledelsens commitment og scope-definition.', 'Krav');

  add('ISMS', 'Risikovurdering', 'Kommunal risikovurdering', 'Municipal risk assessment',
    'Kommunen skal gennemfoere regelmaeessig risikovurdering af alle IT-systemer med saerligt fokus pa borgerdata og kritiske velfaerdssystemer.',
    'The municipality must conduct regular risk assessment of all IT systems with particular focus on citizen data and critical welfare systems.',
    '5.7', null, 'Krav');

  add('ISMS', 'Politik', 'Kommunal informationssikkerhedspolitik', 'Municipal information security policy',
    'Kommunalbestyrelsen skal godkende en informationssikkerhedspolitik der fastlaegger rammer for kommunens informationssikkerhed.',
    'The municipal council must approve an information security policy that establishes the framework for the municipality information security.',
    '5.1', null, 'Krav');

  // === Borgerdata (Citizen Data) ===
  add('Borgerdata', 'Beskyttelse', 'Beskyttelse af borgeroplysninger', 'Protection of citizen information',
    'Kommunen skal sikre at borgeroplysninger beskyttes med passende tekniske og organisatoriske foranstaltninger i henhold til GDPR.',
    'The municipality must ensure citizen information is protected with appropriate technical and organizational measures in accordance with GDPR.',
    '5.34', null, 'Krav');

  add('Borgerdata', 'Klassifikation', 'Klassifikation af kommunale data', 'Classification of municipal data',
    'Kommunale data skal klassificeres i kategorier (offentlig, intern, fortrolig, folsom) med definerede handteringskrav for hver kategori.',
    'Municipal data must be classified into categories (public, internal, confidential, sensitive) with defined handling requirements for each category.',
    '5.12', null, 'Krav');

  add('Borgerdata', 'Adgang', 'Adgangskontrol til borgersystemer', 'Access control to citizen systems',
    'Adgang til systemer med borgerdata skal styres med rollebaseret adgangskontrol og regelmaessig review af adgangsrettigheder.',
    'Access to systems with citizen data must be managed with role-based access control and regular review of access rights.',
    '8.5', null, 'Krav');

  // === Medarbejdersikkerhed (Employee Security) ===
  add('Medarbejdersikkerhed', 'Traening', 'Informationssikkerhedstraening for kommunalt personale', 'Information security training for municipal staff',
    'Alle kommunale medarbejdere skal gennemfoere arlig informationssikkerhedstraening med fokus pa phishing, datahaandtering og rapportering.',
    'All municipal employees must complete annual information security training focusing on phishing, data handling, and reporting.',
    '6.3', null, 'Krav');

  add('Medarbejdersikkerhed', 'Traening', 'Saerlig traening for IT-personale', 'Special training for IT staff',
    'Kommunens IT-personale skal modtage specialiseret sikkerhedstraening relevant for deres tekniske ansvarsomraader.',
    'The municipality IT staff must receive specialized security training relevant to their technical areas of responsibility.',
    '6.3', null, 'Anbefaling');

  add('Medarbejdersikkerhed', 'Fjernarbejde', 'Sikkerhed ved fjernarbejde i kommuner', 'Security for remote work in municipalities',
    'Kommunalt personale der arbejder hjemmefra skal overholde sikkerhedskrav for fjernadgang inklusiv VPN og enhedssikkerhed.',
    'Municipal staff working from home must comply with security requirements for remote access including VPN and device security.',
    '8.20', null, 'Krav');

  // === IT-drift (IT Operations) ===
  add('IT-drift', 'Patch', 'Patchstyring i kommuner', 'Patch management in municipalities',
    'Kommunen skal have en dokumenteret proces for patchstyring med prioritering baseret pa sarbarheders alvorsgrad og systemkritikalitet.',
    'The municipality must have a documented process for patch management with prioritization based on vulnerability severity and system criticality.',
    '8.8', null, 'Krav');

  add('IT-drift', 'Backup', 'Backup af kommunale systemer', 'Backup of municipal systems',
    'Kritiske kommunale systemer og data skal sikkerhedskopieres regelmaessigt med test af gendannelse mindst halvaarligt.',
    'Critical municipal systems and data must be regularly backed up with recovery testing at least semi-annually.',
    '8.13', null, 'Krav');

  add('IT-drift', 'Haendelse', 'Kommunal haendelseshaandtering', 'Municipal incident handling',
    'Kommunen skal have en haendelseshaandteringsproces med klare roller, eskalering og kommunikationsplaner for IT-sikkerhedshaendelser.',
    'The municipality must have an incident handling process with clear roles, escalation, and communication plans for IT security incidents.',
    '5.24', null, 'Krav');

  add('IT-drift', 'Leverandoer', 'Kommunal IT-leverandoerstyring', 'Municipal IT vendor management',
    'Kommunen skal stille sikkerhedskrav til IT-leverandoerer og gennemfoere regelmaessig kontrol af leverandoerens overholdelse.',
    'The municipality must impose security requirements on IT vendors and conduct regular verification of vendor compliance.',
    '5.19', null, 'Krav');

  // === NIS2-compliance ===
  add('NIS2-compliance', 'Vurdering', 'Kommunal NIS2-vurdering', 'Municipal NIS2 assessment',
    'Kommuner skal vurdere om de er omfattet af NIS2 som vasentlig eller vigtig enhed og implementere de paakraevede foranstaltninger.',
    'Municipalities must assess whether they are covered by NIS2 as an essential or important entity and implement the required measures.',
    null, 'KL udarbejder vejledning om NIS2-compliance for kommuner. Vurder om kritisk infrastruktur (vand, varme) er omfattet.', 'Krav');

  return controls;
}

async function main(): Promise<void> {
  console.log('KL Municipal Security Ingestion');
  const controls = generateControls();
  console.log(`Generated ${controls.length} controls`);
  mkdirSync(DATA_DIR, { recursive: true });
  const output = {
    framework: {
      id: 'kl-sikkerhed',
      name: 'KL Municipal Information Security Guidance',
      name_nl: 'KL Kommunernes sikkerhedsvejledning',
      issuing_body: 'KL (Kommunernes Landsforening)',
      version: '2024',
      effective_date: '2024-01-01',
      scope: 'Information security guidance for Danish municipalities covering ISMS, citizen data, employee security, and IT operations',
      scope_sectors: ['government'],
      structure_description: 'Guidance organized by domains: ISMS, citizen data protection, employee security, IT operations, and NIS2 compliance.',
      source_url: 'https://www.kl.dk/it-og-digitalisering/informationssikkerhed/',
      license: 'Public sector publication',
      language: 'da+en',
    },
    controls,
    metadata: { ingested_at: new Date().toISOString(), source: 'KL sikkerhedsvejledning for kommuner', total_controls: controls.length },
  };
  writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2), 'utf-8');
  console.log(`Output: ${OUTPUT_FILE}`);
}

main().catch((err) => { console.error('Fatal:', err); process.exit(1); });
