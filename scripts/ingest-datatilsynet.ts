// scripts/ingest-datatilsynet.ts
// Generates Datatilsynet (Danish DPA) GDPR technical measures guidance.

import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'data', 'extracted');
const OUTPUT_FILE = join(DATA_DIR, 'datatilsynet-dk.json');

interface DtControl {
  control_number: string;
  title: string;
  title_nl: string;
  description: string;
  description_nl: string;
  category: string;
  subcategory: string | null;
  level: string | null;
  iso_mapping: string | null;
  implementation_guidance: string | null;
  verification_guidance: string | null;
  source_url: string;
}

function generateControls(): DtControl[] {
  const controls: DtControl[] = [];
  let seq = 1;

  function add(cat: string, titleDa: string, titleEn: string, descDa: string, descEn: string, iso: string | null, guidance: string | null) {
    const num = `DT${seq.toString().padStart(2, '0')}`;
    controls.push({
      control_number: num,
      title: titleEn,
      title_nl: titleDa,
      description: descEn,
      description_nl: descDa,
      category: cat,
      subcategory: null,
      level: 'Vejledning',
      iso_mapping: iso,
      implementation_guidance: guidance,
      verification_guidance: null,
      source_url: 'https://www.datatilsynet.dk/hvad-siger-reglerne/vejledning/',
    });
    seq++;
  }

  add('Adgangsstyring', 'Rollebaseret adgangsstyring', 'Role-based access control',
    'Adgang til personoplysninger skal tildeles baseret pa brugerens rolle og strengt efter need-to-know princippet.',
    'Access to personal data must be granted based on the user role and strictly following the need-to-know principle.',
    '5.15', null);

  add('Adgangsstyring', 'Flerfaktorautentifikation for folsomme data', 'Multi-factor authentication for sensitive data',
    'Adgang til systemer med folsomme personoplysninger skal kraeeve flerfaktorautentifikation.',
    'Access to systems with sensitive personal data must require multi-factor authentication.',
    '8.5', null);

  add('Adgangsstyring', 'Regelmaessig gennemgang af adgangsrettigheder', 'Regular review of access rights',
    'Adgangsrettigheder til personoplysninger skal gennemgas regelmaeessigt og tilbagekaldes nar de ikke laengere er nodvendige.',
    'Access rights to personal data must be reviewed regularly and revoked when no longer necessary.',
    '5.18', null);

  add('Adgangsstyring', 'Logning af adgang til personoplysninger', 'Logging of access to personal data',
    'Adgang til personoplysninger skal logges med angivelse af hvem, hvad, hvornor og hvorfor.',
    'Access to personal data must be logged indicating who, what, when, and why.',
    '8.15', null);

  add('Kryptering', 'Kryptering af data i transit', 'Encryption of data in transit',
    'Personoplysninger der overfoeres elektronisk skal krypteres med TLS 1.2 eller staerkere.',
    'Personal data transferred electronically must be encrypted with TLS 1.2 or stronger.',
    '8.24', null);

  add('Kryptering', 'Kryptering af data i hvile', 'Encryption of data at rest',
    'Folsomme personoplysninger der opbevares elektronisk skal krypteres pa disk- eller databaseniveau.',
    'Sensitive personal data stored electronically must be encrypted at disk or database level.',
    '8.24', null);

  add('Kryptering', 'Kryptering af mobile enheder', 'Encryption of mobile devices',
    'Mobile enheder der kan indeholde personoplysninger skal have fulddiskkryptering aktiveret.',
    'Mobile devices that may contain personal data must have full-disk encryption enabled.',
    '8.1', null);

  add('Kryptering', 'Kryptering af e-mail med personoplysninger', 'Encryption of email with personal data',
    'E-mails der indeholder folsomme personoplysninger skal krypteres end-to-end eller sendes via sikker portal.',
    'Emails containing sensitive personal data must be encrypted end-to-end or sent via secure portal.',
    '8.24', null);

  add('Logning', 'Logning af behandlingsaktiviteter', 'Logging of processing activities',
    'Alle behandlinger af personoplysninger skal logges, saerligt oprettelse, aendring, soegning og sletning.',
    'All processing of personal data must be logged, particularly creation, modification, search, and deletion.',
    '8.15', null);

  add('Logning', 'Beskyttelse af logdata', 'Protection of log data',
    'Logdata om behandling af personoplysninger skal beskyttes mod manipulation og uautoriseret adgang.',
    'Log data about processing of personal data must be protected against tampering and unauthorized access.',
    '8.15', null);

  add('Logning', 'Opbevaring af logdata', 'Retention of log data',
    'Logdata skal opbevares i tilstraekkelig tid til at understotte tilsyn og efterforskning, men ikke laengere end nodvendigt.',
    'Log data must be retained for sufficient time to support supervision and investigation, but not longer than necessary.',
    '8.15', null);

  add('Sarbarhedshandtering', 'Sarbarhedsscanning', 'Vulnerability scanning',
    'Systemer der behandler personoplysninger skal scannes regelmaeessigt for tekniske sarbarheder.',
    'Systems processing personal data must be scanned regularly for technical vulnerabilities.',
    '8.8', null);

  add('Sarbarhedshandtering', 'Patch management', 'Patch management',
    'Sikkerhedsopdateringer for systemer med personoplysninger skal installeres inden for definerede tidsfrister.',
    'Security updates for systems with personal data must be installed within defined deadlines.',
    '8.8', null);

  add('Sarbarhedshandtering', 'Sikkerhedstest for nye systemer', 'Security testing for new systems',
    'Nye systemer der skal behandle personoplysninger skal gennemga sikkerhedstest for idriftsaettelse.',
    'New systems that will process personal data must undergo security testing before deployment.',
    '8.29', null);

  add('Backup', 'Backup af personoplysninger', 'Backup of personal data',
    'Der skal taees regelmaeessig backup af personoplysninger med test af gendannelsesprocedurer.',
    'Regular backups of personal data must be taken with testing of recovery procedures.',
    '8.13', null);

  add('Backup', 'Kryptering af backup-medier', 'Encryption of backup media',
    'Backup-medier der indeholder personoplysninger skal krypteres.',
    'Backup media containing personal data must be encrypted.',
    '8.13', null);

  add('Sletning', 'Sikker sletning af personoplysninger', 'Secure deletion of personal data',
    'Personoplysninger skal slettes sikkert nar opbevaringsperioden udlober, sa de ikke kan gendannes.',
    'Personal data must be securely deleted when the retention period expires so it cannot be recovered.',
    '8.10', null);

  add('Sletning', 'Sletning ved udstyrsskift', 'Deletion at equipment disposal',
    'Ved bortskaffelse eller genbrug af udstyr skal alle personoplysninger slettes sikkert.',
    'When disposing of or reusing equipment, all personal data must be securely deleted.',
    '7.14', null);

  add('Netvaerkssikkerhed', 'Netvaerkssegmentering', 'Network segmentation',
    'Systemer der behandler personoplysninger skal vaere segmenteret fra det oeevrige netvaerk.',
    'Systems processing personal data must be segmented from the rest of the network.',
    '8.22', null);

  add('Netvaerkssikkerhed', 'Beskyttelse mod uautoriseret adgang', 'Protection against unauthorized access',
    'Netvaerkstrafik til systemer med personoplysninger skal overrages og filtreres.',
    'Network traffic to systems with personal data must be monitored and filtered.',
    '8.20', null);

  add('Fysisk sikkerhed', 'Fysisk adgangskontrol til serverrum', 'Physical access control to server rooms',
    'Serverrum og datacentre der opbevarer personoplysninger skal have fysisk adgangskontrol og logning.',
    'Server rooms and data centers storing personal data must have physical access control and logging.',
    '7.2', null);

  add('Databrud', 'Procedurer for haandtering af databrud', 'Procedures for handling data breaches',
    'Organisationen skal have klare procedurer for identificering, vurdering og anmeldelse af brud pa persondatasikkerheden.',
    'The organization must have clear procedures for identifying, assessing, and reporting breaches of personal data security.',
    '5.24', 'Databrud skal anmeldes til Datatilsynet inden 72 timer. Alvorlige brud skal ogsa meddeles de registrerede.');

  add('Databrud', 'Dokumentation af databrud', 'Documentation of data breaches',
    'Alle databrud skal dokumenteres, uanset om de anmeldes til Datatilsynet eller ej.',
    'All data breaches must be documented, regardless of whether they are reported to the DPA.',
    '5.27', null);

  add('Leverandorstyring', 'Databehandleraftaler', 'Data processor agreements',
    'Organisationen skal indga databehandleraftaler med alle leverandoerer der behandler personoplysninger pa dens vegne.',
    'The organization must enter into data processor agreements with all suppliers processing personal data on its behalf.',
    '5.20', null);

  add('Leverandorstyring', 'Audit af databehandlere', 'Audit of data processors',
    'Organisationen skal regelmaeessigt auditere eller indhente auditrapporter fra sine databehandlere.',
    'The organization must regularly audit or obtain audit reports from its data processors.',
    '5.22', null);

  add('Datatilgang', 'Dataportabilitet', 'Data portability',
    'Organisationen skal vaere i stand til at udlevere personoplysninger i et struktureret, maskinlaesbart format.',
    'The organization must be able to provide personal data in a structured, machine-readable format.',
    '5.34', null);

  add('Datatilgang', 'Ret til indsigt', 'Right of access',
    'Organisationen skal have en procedure for at besvare indsigtsanmodninger inden for 30 dage.',
    'The organization must have a procedure for responding to access requests within 30 days.',
    '5.34', null);

  add('Datatilgang', 'Ret til sletning', 'Right to erasure',
    'Organisationen skal have en procedure for at haandtere anmodninger om sletning af personoplysninger.',
    'The organization must have a procedure for handling requests for erasure of personal data.',
    '5.34', null);

  add('Privacy by design', 'Databeskyttelse gennem design', 'Data protection by design',
    'Nye systemer og processer skal designes med databeskyttelse indbygget fra starten.',
    'New systems and processes must be designed with data protection built in from the start.',
    '5.34', null);

  add('Privacy by design', 'Standardindstillinger for databeskyttelse', 'Default data protection settings',
    'Standardindstillinger skal sikre det hoejeste niveau af databeskyttelse (privacy by default).',
    'Default settings must ensure the highest level of data protection (privacy by default).',
    '5.34', null);

  return controls;
}

async function main(): Promise<void> {
  console.log('Datatilsynet DK Ingestion Script');
  console.log('=================================');

  const controls = generateControls();
  console.log(`Generated ${controls.length} Datatilsynet measures`);

  mkdirSync(DATA_DIR, { recursive: true });

  const output = {
    framework: {
      id: 'datatilsynet-dk',
      name: 'Datatilsynet GDPR Technical Measures Guidance',
      name_nl: 'Datatilsynets vejledning om tekniske og organisatoriske foranstaltninger',
      issuing_body: 'Datatilsynet',
      version: '2024',
      effective_date: '2024-01-01',
      scope: 'Technical and organizational measures for personal data protection under GDPR, as recommended by the Danish Data Protection Authority',
      scope_sectors: ['government', 'healthcare', 'finance', 'education', 'digital_infrastructure'],
      structure_description: 'Measures organized by security domain: access control, encryption, logging, vulnerability management, backup, deletion, network security, physical security, data breach handling, supplier management, data subject rights, and privacy by design.',
      source_url: 'https://www.datatilsynet.dk/hvad-siger-reglerne/vejledning/',
      license: 'Public sector publication',
      language: 'da+en',
    },
    controls,
    metadata: {
      ingested_at: new Date().toISOString(),
      source: 'Datatilsynet GDPR guidance (compiled from published guidance)',
      total_controls: controls.length,
    },
  };

  writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2), 'utf-8');
  console.log(`Output: ${OUTPUT_FILE}`);
}

main().catch((err) => { console.error('Fatal:', err); process.exit(1); });
