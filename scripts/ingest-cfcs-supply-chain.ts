// scripts/ingest-cfcs-supply-chain.ts
// CFCS Vejledning om leverandoerstyring (supply chain security)

import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'data', 'extracted');
const OUTPUT_FILE = join(DATA_DIR, 'cfcs-supply-chain.json');

interface Control {
  control_number: string; title: string; title_nl: string; description: string; description_nl: string;
  category: string; subcategory: string | null; level: string | null; iso_mapping: string | null;
  implementation_guidance: string | null; verification_guidance: string | null; source_url: string;
}

function generateControls(): Control[] {
  const controls: Control[] = [];
  let seq = 1;
  function add(cat: string, sub: string | null, tDa: string, tEn: string, dDa: string, dEn: string, iso: string | null, guide: string | null, level: string | null) {
    controls.push({ control_number: `SC${seq.toString().padStart(2, '0')}`, title: tEn, title_nl: tDa, description: dEn, description_nl: dDa, category: cat, subcategory: sub, level: level ?? 'Krav', iso_mapping: iso, implementation_guidance: guide, verification_guidance: null, source_url: 'https://www.cfcs.dk/da/forebyggelse/vejledninger/leverandoerstyring/' });
    seq++;
  }

  // === Leverandoervurdering (Vendor Assessment) ===
  add('Leverandoervurdering', 'Risiko', 'Risikovurdering af leverandoerer', 'Vendor risk assessment',
    'Organisationen skal gennemfoere en risikovurdering af alle leverandoerer med adgang til organisationens systemer, data eller netvaerk.',
    'The organization must conduct a risk assessment of all vendors with access to the organization systems, data, or network.',
    '5.19', 'Klassificer leverandoerer efter risiko baseret pa dataadgang, systemadgang og leverandoerens kritikalitet for forretningen.', 'Krav');

  add('Leverandoervurdering', 'Risiko', 'Leverandoer-due-diligence', 'Vendor due diligence',
    'Foer kontraktindgaelse skal organisationen verificere leverandoerens sikkerhedsniveau via certificeringer, audits eller sikkerhedsvurderinger.',
    'Before contract signing, the organization must verify the vendor security level via certifications, audits, or security assessments.',
    '5.19', null, 'Krav');

  add('Leverandoervurdering', 'Klassifikation', 'Leverandoerklassifikation', 'Vendor classification',
    'Leverandoerer skal klassificeres i risikoniveauer baseret pa hvilke data og systemer de har adgang til og deres pavirkning pa organisationens sikkerhed.',
    'Vendors must be classified into risk levels based on which data and systems they have access to and their impact on the organization security.',
    '5.19', null, 'Krav');

  // === Kontraktstyring (Contract Management) ===
  add('Kontraktstyring', 'Sikkerhedskrav', 'Sikkerhedskrav i leverandoeraftaler', 'Security requirements in vendor agreements',
    'Kontrakter med leverandoerer skal indeholde specifikke sikkerhedskrav herunder kryptering, adgangsstyring, logning og incidentrapportering.',
    'Contracts with vendors must contain specific security requirements including encryption, access control, logging, and incident reporting.',
    '5.20', 'Inkluder krav til ISO 27001-certificering eller tilsvarende. Definer krav til audit-adgang og exit-plan.', 'Krav');

  add('Kontraktstyring', 'Sikkerhedskrav', 'Databehandleraftale', 'Data processing agreement',
    'For leverandoerer der behandler personoplysninger pa vegne af organisationen, skal der indgas en databehandleraftale i henhold til GDPR artikel 28.',
    'For vendors processing personal data on behalf of the organization, a data processing agreement must be entered into in accordance with GDPR Article 28.',
    '5.20', null, 'Krav');

  add('Kontraktstyring', 'Underleverandoerer', 'Styring af underleverandoerer', 'Management of sub-contractors',
    'Organisationen skal have indsigt i og godkendelsesret over leverandoerens brug af underleverandoerer med adgang til organisationens data.',
    'The organization must have visibility into and approval rights over the vendor use of sub-contractors with access to the organization data.',
    '5.21', null, 'Krav');

  // === Adgangsstyring (Access Management) ===
  add('Leverandoeradgang', 'Kontrol', 'Leverandoeradgangsstyring', 'Vendor access management',
    'Leverandoerens adgang til organisationens systemer skal vaere specifik, tidsbegraenset og underlagt mindste-privilegium-princippet.',
    'Vendor access to the organization systems must be specific, time-limited, and subject to the principle of least privilege.',
    '8.2', null, 'Krav');

  add('Leverandoeradgang', 'Kontrol', 'Leverandoer-fjernadgang', 'Vendor remote access',
    'Fjernadgang for leverandoerer skal ske via dedikerede, krypterede kanaler med sessionovervagning og logging af alle aktiviteter.',
    'Remote access for vendors must use dedicated, encrypted channels with session monitoring and logging of all activities.',
    '8.20', null, 'Krav');

  add('Leverandoeradgang', 'Revision', 'Regelmaessig revision af leverandoeradgang', 'Regular review of vendor access',
    'Alle leverandoerkonti og adgangsrettigheder skal gennemgas mindst halvaarligt og fjernes straks ved kontraktophoer.',
    'All vendor accounts and access rights must be reviewed at least semi-annually and removed immediately upon contract termination.',
    '5.18', null, 'Krav');

  // === Overvagning (Monitoring) ===
  add('Leverandoerovervagning', 'Sikkerhed', 'Loebende overvagning af leverandoersikkerhed', 'Ongoing monitoring of vendor security',
    'Organisationen skal loebende overvaage leverandoerens sikkerhedsniveau via regelmaessige audits, certificeringsfornyelser og nyhedsovervagning.',
    'The organization must continuously monitor the vendor security level via regular audits, certification renewals, and news monitoring.',
    '5.22', null, 'Krav');

  add('Leverandoerovervagning', 'Sikkerhed', 'Leverandoersikkerhedsincidenter', 'Vendor security incidents',
    'Leverandoerer skal vaere forpligtet til at rapportere sikkerhedshaendelser der pavirker organisationen inden for en aftalt tidsramme.',
    'Vendors must be obligated to report security incidents that affect the organization within an agreed timeframe.',
    '5.24', null, 'Krav');

  add('Leverandoerovervagning', 'SLA', 'SLA-overvagning for sikkerhed', 'SLA monitoring for security',
    'Sikkerhedsrelaterede SLA-krav til leverandoerer skal overvaages systematisk med definerede konsekvenser ved manglende overholdelse.',
    'Security-related SLA requirements for vendors must be monitored systematically with defined consequences for non-compliance.',
    '5.22', null, null);

  // === Software-forsyningskaede (Software Supply Chain) ===
  add('Software-forsyningskaede', 'Integritet', 'Verifikation af softwareintegritet', 'Verification of software integrity',
    'Al software fra leverandoerer skal verificeres for integritet via digitale signaturer, checksums eller Software Bill of Materials (SBOM).',
    'All software from vendors must be verified for integrity via digital signatures, checksums, or Software Bill of Materials (SBOM).',
    '8.28', 'Krav SBOM for kritisk software. Verificer digitale signaturer foer installation.', 'Krav');

  add('Software-forsyningskaede', 'Integritet', 'Sarbarhedsstyring i tredjepartssoftware', 'Vulnerability management in third-party software',
    'Organisationen skal have processer for at identificere og handtere sarbarheder i tredjepartssoftware og open source-komponenter.',
    'The organization must have processes for identifying and handling vulnerabilities in third-party software and open source components.',
    '8.8', null, 'Krav');

  add('Software-forsyningskaede', 'Opdateringer', 'Sikker distribution af softwareopdateringer', 'Secure distribution of software updates',
    'Softwareopdateringer fra leverandoerer skal modtages via sikre kanaler og verificeres foer udrulning i produktionsmiljoeet.',
    'Software updates from vendors must be received via secure channels and verified before deployment to the production environment.',
    '8.8', null, 'Krav');

  // === Beredskab (Contingency) ===
  add('Leverandoerberedskab', 'Kontinuitet', 'Leverandoerberedskabsplan', 'Vendor contingency plan',
    'Organisationen skal have beredskabsplaner for scenariet hvor en kritisk leverandoer er utilgaengelig, kompromitteret eller ophorer.',
    'The organization must have contingency plans for the scenario where a critical vendor is unavailable, compromised, or ceases operations.',
    '5.29', null, 'Krav');

  add('Leverandoerberedskab', 'Kontinuitet', 'Undgaelse af leverandoerlaas', 'Avoidance of vendor lock-in',
    'Organisationen skal minimere afhaengighed af enkelte leverandoerer og sikre at systemer og data kan migreres ved behov.',
    'The organization must minimize dependence on individual vendors and ensure that systems and data can be migrated if needed.',
    '5.29', null, 'Anbefaling');

  return controls;
}

async function main(): Promise<void> {
  console.log('CFCS Supply Chain Security Ingestion');
  const controls = generateControls();
  console.log(`Generated ${controls.length} controls`);
  mkdirSync(DATA_DIR, { recursive: true });
  const output = {
    framework: {
      id: 'cfcs-supply-chain',
      name: 'CFCS Supply Chain Security Guidance',
      name_nl: 'CFCS Vejledning om leverandoerstyring',
      issuing_body: 'Center for Cybersikkerhed (CFCS)',
      version: '2024',
      effective_date: '2024-01-01',
      scope: 'Guidance for managing cybersecurity risks in the supply chain for Danish organizations',
      scope_sectors: ['government', 'healthcare', 'finance', 'energy', 'digital_infrastructure'],
      structure_description: 'Guidance organized by supply chain security domains: vendor assessment, contract management, access management, monitoring, software supply chain, and contingency.',
      source_url: 'https://www.cfcs.dk/da/forebyggelse/vejledninger/leverandoerstyring/',
      license: 'Public sector publication',
      language: 'da+en',
    },
    controls,
    metadata: { ingested_at: new Date().toISOString(), source: 'CFCS vejledning om leverandoerstyring', total_controls: controls.length },
  };
  writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2), 'utf-8');
  console.log(`Output: ${OUTPUT_FILE}`);
}

main().catch((err) => { console.error('Fatal:', err); process.exit(1); });
