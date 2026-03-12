// scripts/ingest-cfcs-ransomware.ts
// CFCS Vejledning om beskyttelse mod ransomware

import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'data', 'extracted');
const OUTPUT_FILE = join(DATA_DIR, 'cfcs-ransomware.json');

interface Control {
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

function generateControls(): Control[] {
  const controls: Control[] = [];
  let seq = 1;

  function add(cat: string, sub: string | null, tDa: string, tEn: string, dDa: string, dEn: string, iso: string | null, guide: string | null, level: string | null) {
    controls.push({
      control_number: `RW${seq.toString().padStart(2, '0')}`,
      title: tEn, title_nl: tDa, description: dEn, description_nl: dDa,
      category: cat, subcategory: sub, level: level ?? 'Krav',
      iso_mapping: iso, implementation_guidance: guide, verification_guidance: null,
      source_url: 'https://www.cfcs.dk/da/forebyggelse/vejledninger/ransomware/',
    });
    seq++;
  }

  // === Forebyggelse (Prevention) ===
  add('Forebyggelse', 'E-mail', 'E-mail-filtrering mod ransomware', 'Email filtering against ransomware',
    'Organisationen skal implementere avanceret e-mail-filtrering der blokerer eksekverbare vedhaeftninger, makroaktiverede dokumenter og kendte phishing-moenstre.',
    'The organization must implement advanced email filtering that blocks executable attachments, macro-enabled documents, and known phishing patterns.',
    '8.23', 'Bloker .exe, .vbs, .js og makroaktiverede Office-dokumenter i e-mail-gateway. Implementer sandboxing af vedhaeftninger.', 'Krav');

  add('Forebyggelse', 'E-mail', 'Phishing-traening mod ransomware', 'Phishing training against ransomware',
    'Medarbejdere skal traenes regelmaeessigt i at identificere phishing-e-mails der bruges til at levere ransomware.',
    'Employees must be trained regularly to identify phishing emails used to deliver ransomware.',
    '6.3', null, 'Krav');

  add('Forebyggelse', 'Makrosikkerhed', 'Begraensning af makroer i Office-dokumenter', 'Restriction of macros in Office documents',
    'Makroer i Microsoft Office skal deaktiveres som standard. Kun signerede makroer fra godkendte udgivere ma aktiveres.',
    'Macros in Microsoft Office must be disabled by default. Only signed macros from approved publishers may be enabled.',
    '8.9', 'Konfigurer Group Policy til at blokere makroer i filer hentet fra internettet.', 'Krav');

  add('Forebyggelse', 'Softwarebeskyttelse', 'Applikationskontrol og hvidlisting', 'Application control and whitelisting',
    'Organisationen skal implementere applikationshvidlisting sa kun godkendte programmer kan koeres pa arbejdsstationer og servere.',
    'The organization must implement application whitelisting so only approved programs can run on workstations and servers.',
    '8.9', null, 'Anbefaling');

  add('Forebyggelse', 'Softwarebeskyttelse', 'Opdatering af software og operativsystemer', 'Software and operating system updates',
    'Alle systemer skal have de nyeste sikkerhedsopdateringer installeret. Kritiske patches skal udrolles inden for 72 timer.',
    'All systems must have the latest security updates installed. Critical patches must be deployed within 72 hours.',
    '8.8', 'Etabler automatisk patchstyring. Prioriter patches for kendte ransomware-angrebsvektorer.', 'Krav');

  add('Forebyggelse', 'Netvaerk', 'Netvaerkssegmentering mod lateral bevaegelse', 'Network segmentation against lateral movement',
    'Netvaerket skal segmenteres for at forhindre lateral bevaegelse af ransomware mellem systemer og afdelinger.',
    'The network must be segmented to prevent lateral movement of ransomware between systems and departments.',
    '8.22', null, 'Krav');

  add('Forebyggelse', 'Netvaerk', 'Begrans RDP og fjernadgang', 'Restrict RDP and remote access',
    'Remote Desktop Protocol (RDP) skal begraenses til godkendte brugere og krypteres via VPN. RDP-porte ma ikke vaere direkte eksponeret mod internettet.',
    'Remote Desktop Protocol (RDP) must be restricted to approved users and encrypted via VPN. RDP ports must not be directly exposed to the internet.',
    '8.20', 'Deaktiver RDP pa systemer der ikke har behov. Anvend Network Level Authentication (NLA) for alle RDP-forbindelser.', 'Krav');

  add('Forebyggelse', 'Adgangskontrol', 'Begrans administratorrettigheder', 'Restrict administrator privileges',
    'Administrative rettigheder skal begraenses efter princippet om mindste privilegium. Daglig brug af administratorkonti skal forbydes.',
    'Administrative privileges must be restricted following the principle of least privilege. Daily use of administrator accounts must be prohibited.',
    '8.2', null, 'Krav');

  // === Detektion (Detection) ===
  add('Detektion', 'Endpoint', 'Endpoint Detection and Response (EDR)', 'Endpoint Detection and Response (EDR)',
    'Organisationen skal implementere EDR-loesninger pa alle endpoints der kan detektere og automatisk respondere pa ransomware-aktivitet.',
    'The organization must implement EDR solutions on all endpoints that can detect and automatically respond to ransomware activity.',
    '8.7', 'Vaelg EDR med ransomware-specifikke detektionsmoduler inklusiv filadfaerdsanalyse og krypteringsdetektering.', 'Krav');

  add('Detektion', 'Endpoint', 'Anti-ransomware-specifikke detektioner', 'Anti-ransomware-specific detections',
    'Sikkerhedsloesninger skal konfigureres med specifikke detektionsregler for ransomware-adfaerd som massekryptering af filer og sletning af skyggekopier.',
    'Security solutions must be configured with specific detection rules for ransomware behavior such as mass file encryption and deletion of shadow copies.',
    '8.7', null, null);

  add('Detektion', 'Overvagning', 'Overvagning af filsystemaktivitet', 'File system activity monitoring',
    'Kritiske filservere og delte drev skal overvaages for usaedvanlig filaendringsaktivitet der kan indikere ransomware-kryptering.',
    'Critical file servers and shared drives must be monitored for unusual file modification activity that may indicate ransomware encryption.',
    '8.16', null, null);

  // === Backup og gendannelse (Backup and Recovery) ===
  add('Backup og gendannelse', 'Backup', 'Ransomware-resistent backup', 'Ransomware-resistant backup',
    'Backups skal vaere beskyttet mod ransomware via offline-lagring, air-gapped systemer eller uforanderlige (immutable) backups.',
    'Backups must be protected against ransomware via offline storage, air-gapped systems, or immutable backups.',
    '8.13', 'Implementer 3-2-1-1-0 backup-strategi: 3 kopier, 2 medietyper, 1 offsite, 1 offline/immutable, 0 fejl ved test.', 'Krav');

  add('Backup og gendannelse', 'Backup', 'Regelmaeessig test af gendannelse', 'Regular recovery testing',
    'Gendannelse fra backup skal testes mindst kvartalsmaeessigt med realistiske scenarier inklusiv fuld systemgendannelse.',
    'Recovery from backup must be tested at least quarterly with realistic scenarios including full system recovery.',
    '8.13', null, 'Krav');

  add('Backup og gendannelse', 'Backup', 'Segmentering af backup-infrastruktur', 'Segmentation of backup infrastructure',
    'Backup-systemer og backup-administratorkonti skal vaere separeret fra det generelle netvaerk og anvende dedikerede adgangsoplysninger.',
    'Backup systems and backup administrator accounts must be separated from the general network and use dedicated credentials.',
    '8.13', null, 'Krav');

  // === Respons (Response) ===
  add('Respons', 'Haandtering', 'Ransomware-haendelsesresponsplan', 'Ransomware incident response plan',
    'Organisationen skal have en specifik haendelsesresponsplan for ransomware der inkluderer isolering, vurdering, kommunikation og gendannelse.',
    'The organization must have a specific incident response plan for ransomware that includes isolation, assessment, communication, and recovery.',
    '5.24', 'Planen skal adressere: beslutning om at betale/ikke betale, kommunikation til medarbejdere og kunder, rapportering til CFCS og politi.', 'Krav');

  add('Respons', 'Haandtering', 'Hurtig netvaerksisolering', 'Rapid network isolation',
    'Organisationen skal have evnen til hurtigt at isolere inficerede systemer fra netvaerket for at stoppe ransomwarens spredning.',
    'The organization must have the ability to rapidly isolate infected systems from the network to stop ransomware from spreading.',
    '5.26', null, 'Krav');

  add('Respons', 'Kommunikation', 'Rapportering til CFCS ved ransomware', 'Reporting to CFCS during ransomware',
    'Ransomware-angreb mod statslige myndigheder og kritisk infrastruktur skal rapporteres til CFCS hurtigst muligt og senest inden for 24 timer.',
    'Ransomware attacks against government authorities and critical infrastructure must be reported to CFCS as soon as possible and no later than within 24 hours.',
    '5.26', null, 'Krav');

  add('Respons', 'Kommunikation', 'Betalingspolitik for ransomware', 'Ransomware payment policy',
    'Organisationen skal have en dokumenteret politik for haandtering af losepengekrav. CFCS fraraader generelt at betale losesum.',
    'The organization must have a documented policy for handling ransom demands. CFCS generally advises against paying ransom.',
    '5.24', null, null);

  return controls;
}

async function main(): Promise<void> {
  console.log('CFCS Ransomware Protection Ingestion');
  const controls = generateControls();
  console.log(`Generated ${controls.length} controls`);
  mkdirSync(DATA_DIR, { recursive: true });

  const output = {
    framework: {
      id: 'cfcs-ransomware',
      name: 'CFCS Ransomware Protection Guidance',
      name_nl: 'CFCS Vejledning om beskyttelse mod ransomware',
      issuing_body: 'Center for Cybersikkerhed (CFCS)',
      version: '2024',
      effective_date: '2024-01-01',
      scope: 'Guidance for preventing, detecting, and responding to ransomware attacks targeting Danish organizations',
      scope_sectors: ['government', 'healthcare', 'finance', 'energy', 'education', 'digital_infrastructure'],
      structure_description: 'Guidance organized by ransomware defense phases: prevention, detection, backup and recovery, and response.',
      source_url: 'https://www.cfcs.dk/da/forebyggelse/vejledninger/ransomware/',
      license: 'Public sector publication',
      language: 'da+en',
    },
    controls,
    metadata: {
      ingested_at: new Date().toISOString(),
      source: 'CFCS vejledning om beskyttelse mod ransomware',
      total_controls: controls.length,
    },
  };

  writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2), 'utf-8');
  console.log(`Output: ${OUTPUT_FILE}`);
}

main().catch((err) => { console.error('Fatal:', err); process.exit(1); });
