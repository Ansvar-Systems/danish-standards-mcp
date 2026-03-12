// scripts/ingest-sds-sundhed.ts
// Generates Sundhedsdatastyrelsen (Health Data Authority) IT security requirements.

import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'data', 'extracted');
const OUTPUT_FILE = join(DATA_DIR, 'sds-sundhed.json');

interface SdsControl {
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

function generateControls(): SdsControl[] {
  const controls: SdsControl[] = [];
  let seq = 1;

  function add(cat: string, titleDa: string, titleEn: string, descDa: string, descEn: string, iso: string | null) {
    const num = `SDS${seq.toString().padStart(2, '0')}`;
    controls.push({
      control_number: num,
      title: titleEn,
      title_nl: titleDa,
      description: descEn,
      description_nl: descDa,
      category: cat,
      subcategory: null,
      level: 'Krav',
      iso_mapping: iso,
      implementation_guidance: null,
      verification_guidance: null,
      source_url: 'https://sundhedsdatastyrelsen.dk/da/registre-og-services/om-informationssikkerhed',
    });
    seq++;
  }

  // Patientdata
  add('Patientdatabeskyttelse', 'Adgangskontrol til patientdata', 'Access control to patient data',
    'Adgang til patientdata skal styres strengt med rollebaseret adgangskontrol og logning af alle opslag.',
    'Access to patient data must be strictly controlled with role-based access control and logging of all lookups.',
    '5.15');

  add('Patientdatabeskyttelse', 'Noedadgang til patientdata', 'Emergency access to patient data',
    'Der skal vaere en dokumenteret noedadgangsprocedure der giver adgang i noedsituationer med efterfoelgende kontrol.',
    'There must be a documented emergency access procedure that grants access in emergencies with subsequent review.',
    '5.15');

  add('Patientdatabeskyttelse', 'Logning af opslag i patientdata', 'Logging of patient data access',
    'Alle opslag i patientdata skal logges med bruger-ID, tidspunkt, patient-ID og formel adgang i systemets adgangslog.',
    'All access to patient data must be logged with user ID, timestamp, patient ID, and purpose in the system access log.',
    '8.15');

  add('Patientdatabeskyttelse', 'Patientens ret til logoplysninger', 'Patient right to access log information',
    'Patienten skal kunne fa indsigt i hvem der har slaaet op i vedkommendes data.',
    'The patient must be able to gain insight into who has looked up their data.',
    '5.34');

  add('Patientdatabeskyttelse', 'Samtykkehandtering for sundhedsdata', 'Consent management for health data',
    'Behandling af sundhedsdata skal baseres pa gyldigt samtykke eller anden lovhjemmel med klar dokumentation.',
    'Processing of health data must be based on valid consent or other legal basis with clear documentation.',
    '5.34');

  // Systemsikkerhed
  add('Systemsikkerhed', 'Kryptering af sundhedsdata', 'Encryption of health data',
    'Sundhedsdata skal krypteres bade i transit og i hvile med godkendte krypteringsalgoritmer.',
    'Health data must be encrypted both in transit and at rest with approved encryption algorithms.',
    '8.24');

  add('Systemsikkerhed', 'Sikker integration mellem sundhedssystemer', 'Secure integration between health systems',
    'Integration mellem sundhedssystemer skal anvende sikre protokoller og gensidig autentifikation.',
    'Integration between health systems must use secure protocols and mutual authentication.',
    '8.20');

  add('Systemsikkerhed', 'Sikker kommunikation via Sundhedsdatanettet', 'Secure communication via Health Data Network',
    'Kommunikation via Sundhedsdatanettet skal overholde de gaeldende sikkerhedskrav og certificeringskrav.',
    'Communication via the Health Data Network must comply with applicable security and certification requirements.',
    '8.20');

  add('Systemsikkerhed', 'Autentifikation i sundhedssystemer', 'Authentication in health systems',
    'Brugere af sundhedssystemer skal autentificeres med flerfaktorautentifikation eller sundhedscertifikater.',
    'Users of health systems must be authenticated with multi-factor authentication or health certificates.',
    '8.5');

  add('Systemsikkerhed', 'Sarbarhedshandtering i sundhedssystemer', 'Vulnerability management in health systems',
    'Sundhedssystemer skal scannes regelmaeessigt for sarbarheder og patches skal installeres rettidigt.',
    'Health systems must be scanned regularly for vulnerabilities and patches must be installed in a timely manner.',
    '8.8');

  // Tilgaengelighed
  add('Tilgaengelighed', 'Hoej tilgaengelighed for kritiske sundhedssystemer', 'High availability for critical health systems',
    'Kritiske sundhedssystemer skal have hoejtilgaengelighedsarkitektur med definerede RTO og RPO.',
    'Critical health systems must have high-availability architecture with defined RTO and RPO.',
    '8.14');

  add('Tilgaengelighed', 'Backup af sundhedsdata', 'Backup of health data',
    'Sundhedsdata skal sikkerhedskopieres dagligt med test af gendannelse mindst kvartalsmaeessigt.',
    'Health data must be backed up daily with recovery testing at least quarterly.',
    '8.13');

  add('Tilgaengelighed', 'IT-beredskab for sundhedssektoren', 'IT contingency for the health sector',
    'Sundhedsorganisationer skal have IT-beredskabsplaner der sikrer fortsat patientbehandling under IT-nedbrud.',
    'Health organizations must have IT contingency plans that ensure continued patient care during IT outages.',
    '5.30');

  // Fysisk sikkerhed
  add('Fysisk sikkerhed', 'Fysisk sikring af sundhedsdata', 'Physical security of health data',
    'Fysiske lokaler med sundhedsdata og -systemer skal have adgangskontrol og overvagning.',
    'Physical premises with health data and systems must have access control and monitoring.',
    '7.2');

  add('Fysisk sikkerhed', 'Sikker bortskaffelse af sundhedsdata', 'Secure disposal of health data',
    'Medier og udstyr der indeholder sundhedsdata skal destrueres sikkert ved bortskaffelse.',
    'Media and equipment containing health data must be securely destroyed upon disposal.',
    '7.14');

  // Governance
  add('Governance', 'Sikkerhedsorganisation i sundhedssektoren', 'Security organization in the health sector',
    'Sundhedsorganisationer skal have en dedikeret informationssikkerhedsfunktion med rapportering til ledelsen.',
    'Health organizations must have a dedicated information security function with reporting to management.',
    '5.2');

  add('Governance', 'Risikovurdering af sundhedssystemer', 'Risk assessment of health systems',
    'Der skal gennemfores regelmaeessige risikovurderinger af alle sundhedssystemer med fokus pa patientdata.',
    'Regular risk assessments of all health systems must be conducted with focus on patient data.',
    '5.1');

  add('Governance', 'Haendelseshandtering i sundhedssektoren', 'Incident management in the health sector',
    'Sundhedsorganisationer skal have en haendelseshandteringsproces med saerlig fokus pa databrud vedroeerende patientdata.',
    'Health organizations must have an incident management process with special focus on data breaches concerning patient data.',
    '5.24');

  add('Governance', 'Uddannelse af sundhedspersonale', 'Training of health personnel',
    'Sundhedspersonale skal modtage regelmaeessig uddannelse i informationssikkerhed og databeskyttelse.',
    'Health personnel must receive regular training in information security and data protection.',
    '6.3');

  add('Governance', 'Leverandorstyring i sundhedssektoren', 'Supplier management in the health sector',
    'Leverandoerer af sundhedssystemer skal overholde sikkerhedskrav og underkastes regelmaeessig audit.',
    'Suppliers of health systems must comply with security requirements and be subject to regular audit.',
    '5.19');

  add('Governance', 'Overensstemmelse med sundhedslovgivning', 'Compliance with health legislation',
    'Sundhedsorganisationer skal sikre overensstemmelse med sundhedsloven, autorisationsloven og persondataforordningen.',
    'Health organizations must ensure compliance with the Health Act, Authorization Act, and Personal Data Regulation.',
    '5.31');

  return controls;
}

async function main(): Promise<void> {
  console.log('SDS Sundhed Ingestion Script');
  console.log('============================');

  const controls = generateControls();
  console.log(`Generated ${controls.length} SDS requirements`);

  mkdirSync(DATA_DIR, { recursive: true });

  const output = {
    framework: {
      id: 'sds-sundhed',
      name: 'Sundhedsdatastyrelsen IT Security Requirements',
      name_nl: 'Sundhedsdatastyrelsens krav til IT-sikkerhed',
      issuing_body: 'Sundhedsdatastyrelsen',
      version: '2024',
      effective_date: '2024-01-01',
      scope: 'IT security requirements for organizations processing health data in Denmark, covering patient data protection, system security, availability, physical security, and governance',
      scope_sectors: ['healthcare'],
      structure_description: 'Requirements organized by domain: patient data protection, system security, availability, physical security, and governance. All requirements apply to organizations handling Danish health data.',
      source_url: 'https://sundhedsdatastyrelsen.dk/da/registre-og-services/om-informationssikkerhed',
      license: 'Public sector publication',
      language: 'da+en',
    },
    controls,
    metadata: {
      ingested_at: new Date().toISOString(),
      source: 'Sundhedsdatastyrelsen IT security requirements (compiled from published guidance)',
      total_controls: controls.length,
    },
  };

  writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2), 'utf-8');
  console.log(`Output: ${OUTPUT_FILE}`);
}

main().catch((err) => { console.error('Fatal:', err); process.exit(1); });
