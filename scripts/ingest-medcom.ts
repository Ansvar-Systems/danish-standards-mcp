// scripts/ingest-medcom.ts
// MedCom healthcare messaging and integration security standards

import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'data', 'extracted');
const OUTPUT_FILE = join(DATA_DIR, 'medcom-standarder.json');

interface Control {
  control_number: string; title: string; title_nl: string; description: string; description_nl: string;
  category: string; subcategory: string | null; level: string | null; iso_mapping: string | null;
  implementation_guidance: string | null; verification_guidance: string | null; source_url: string;
}

function generateControls(): Control[] {
  const controls: Control[] = [];
  let seq = 1;
  function add(cat: string, sub: string | null, tDa: string, tEn: string, dDa: string, dEn: string, iso: string | null, guide: string | null, level: string | null) {
    controls.push({ control_number: `MC${seq.toString().padStart(2, '0')}`, title: tEn, title_nl: tDa, description: dEn, description_nl: dDa, category: cat, subcategory: sub, level: level ?? 'Krav', iso_mapping: iso, implementation_guidance: guide, verification_guidance: null, source_url: 'https://www.medcom.dk/standarder/' });
    seq++;
  }

  // === Beskedsikkerhed (Message Security) ===
  add('Beskedsikkerhed', 'Kryptering', 'Kryptering af sundhedsmeddelelser', 'Encryption of health messages',
    'Alle elektroniske sundhedsmeddelelser der indeholder patientidentificerbare oplysninger skal krypteres under transmission.',
    'All electronic health messages containing patient-identifiable information must be encrypted during transmission.',
    '8.24', 'Anvend OCES-certifikater (organisation) for punkt-til-punkt kryptering af MedCom-meddelelser.', 'Krav');

  add('Beskedsikkerhed', 'Signering', 'Digital signering af sundhedsmeddelelser', 'Digital signing of health messages',
    'Sundhedsmeddelelser skal signeres digitalt for at sikre autenticitet og integritet af afsender og indhold.',
    'Health messages must be digitally signed to ensure authenticity and integrity of sender and content.',
    '8.24', null, 'Krav');

  add('Beskedsikkerhed', 'Transport', 'Sikker transport via VANS/eDelivery', 'Secure transport via VANS/eDelivery',
    'MedCom-meddelelser skal transmitteres via godkendte VANS-leverandoerer eller eDelivery-infrastruktur med garanteret levering.',
    'MedCom messages must be transmitted via approved VANS providers or eDelivery infrastructure with guaranteed delivery.',
    '8.20', null, 'Krav');

  add('Beskedsikkerhed', 'Kvittering', 'Kvitteringshaandtering for meddelelser', 'Receipt handling for messages',
    'Systemer skal implementere kvitteringshaandtering (positive og negative kvitteringer) for alle MedCom-meddelelser.',
    'Systems must implement receipt handling (positive and negative receipts) for all MedCom messages.',
    '8.26', null, 'Krav');

  // === Adgangskontrol (Access Control) ===
  add('Adgangskontrol', 'Autentifikation', 'Autentifikation i sundhedssystemer', 'Authentication in health systems',
    'Sundhedspersonale skal autentificeres med sikre metoder (sundhedsfagligt ID-kort, MitID) foer adgang til patientdata.',
    'Healthcare personnel must be authenticated with secure methods (healthcare professional ID card, MitID) before accessing patient data.',
    '8.5', null, 'Krav');

  add('Adgangskontrol', 'Roller', 'Rollebaseret adgang til sundhedsdata', 'Role-based access to health data',
    'Adgang til sundhedsdata skal styres via rollebaseret adgangskontrol baseret pa sundhedsfaglig rolle og behandlingsrelation.',
    'Access to health data must be managed via role-based access control based on healthcare professional role and treatment relation.',
    '5.15', null, 'Krav');

  add('Adgangskontrol', 'Samtykke', 'Patientsamtykke for datadeling', 'Patient consent for data sharing',
    'Deling af patientdata pa tvaers af sundhedsaktorer kraever patientens informerede samtykke medmindre lovhjemmel foreligger.',
    'Sharing patient data across healthcare actors requires the patient informed consent unless legal authority exists.',
    '5.34', null, 'Krav');

  // === Sundhedsdatanettet (Health Data Network) ===
  add('Sundhedsdatanettet', 'Tilslutning', 'Tilslutningskrav til Sundhedsdatanettet', 'Connection requirements for Health Data Network',
    'Systemer der tilsluttes Sundhedsdatanettet skal overholde de tekniske og sikkerhedsmaessige tilslutningskrav inklusiv netvaerkssikkerhed og certifikater.',
    'Systems connecting to the Health Data Network must comply with technical and security connection requirements including network security and certificates.',
    '8.22', null, 'Krav');

  add('Sundhedsdatanettet', 'Tilslutning', 'VPN-krav for Sundhedsdatanettet', 'VPN requirements for Health Data Network',
    'Tilslutning til Sundhedsdatanettet skal ske via krypteret VPN-forbindelse med certifikatbaseret autentifikation.',
    'Connection to the Health Data Network must use encrypted VPN connection with certificate-based authentication.',
    '8.20', null, 'Krav');

  // === Standardmeddelelser (Standard Messages) ===
  add('Standardmeddelelser', 'FHIR', 'FHIR-sikkerhed i MedCom-standarder', 'FHIR security in MedCom standards',
    'MedCom FHIR-meddelelser skal implementere OAuth 2.0 autentifikation og SMART on FHIR autorisering for API-baseret dataudveksling.',
    'MedCom FHIR messages must implement OAuth 2.0 authentication and SMART on FHIR authorization for API-based data exchange.',
    '8.5', null, 'Krav');

  add('Standardmeddelelser', 'Validering', 'Validering af indgaende meddelelser', 'Validation of incoming messages',
    'Alle indgaende MedCom-meddelelser skal valideres mod det relevante XML-skema eller FHIR-profil foer behandling.',
    'All incoming MedCom messages must be validated against the relevant XML schema or FHIR profile before processing.',
    '8.28', null, 'Krav');

  add('Standardmeddelelser', 'Fejlhaandtering', 'Fejlhaandtering og retry for meddelelser', 'Error handling and retry for messages',
    'Systemer skal implementere fejlhaandtering med automatisk retry og alarmering ved fejlede meddelelsestransmissioner.',
    'Systems must implement error handling with automatic retry and alerting for failed message transmissions.',
    '8.14', null, 'Krav');

  // === Audit og logning (Audit and Logging) ===
  add('Audit og logning', 'Logning', 'Logning af adgang til sundhedsdata', 'Logging of access to health data',
    'Al adgang til patientdata skal logges med brugeridentitet, tidspunkt, handling og patientidentifikation i henhold til Sundhedsloven.',
    'All access to patient data must be logged with user identity, timestamp, action, and patient identification in accordance with the Health Act.',
    '8.15', null, 'Krav');

  add('Audit og logning', 'Logning', 'Patientens logadgang', 'Patient log access',
    'Patienter skal have adgang til at se hvem der har tilgaaet deres sundhedsdata via sundhed.dk (MinLog).',
    'Patients must have access to see who has accessed their health data via sundhed.dk (MinLog).',
    '8.15', null, 'Krav');

  add('Audit og logning', 'Opbevaring', 'Opbevaring af sundhedslogdata', 'Retention of health log data',
    'Logdata for adgang til sundhedsoplysninger skal opbevares i mindst 2 ar i henhold til Sundhedsloven.',
    'Log data for access to health information must be retained for at least 2 years in accordance with the Health Act.',
    '8.15', null, 'Krav');

  // === Test og certificering (Testing and Certification) ===
  add('Test og certificering', 'Test', 'MedCom-certificering af systemer', 'MedCom certification of systems',
    'IT-systemer der skal udveksle MedCom-meddelelser skal gennemga MedComs testproces og opna certificering foer produktionsbrug.',
    'IT systems exchanging MedCom messages must undergo MedCom testing process and obtain certification before production use.',
    '8.29', null, 'Krav');

  add('Test og certificering', 'Test', 'Test af meddelelsesflow', 'Testing of message flows',
    'Alle meddelelsesflow skal testes end-to-end inklusiv fejlscenarier og kvitteringshaandtering foer idriftsaettelse.',
    'All message flows must be tested end-to-end including error scenarios and receipt handling before deployment.',
    '8.29', null, 'Krav');

  return controls;
}

async function main(): Promise<void> {
  console.log('MedCom Standards Ingestion');
  const controls = generateControls();
  console.log(`Generated ${controls.length} controls`);
  mkdirSync(DATA_DIR, { recursive: true });
  const output = {
    framework: {
      id: 'medcom-standarder',
      name: 'MedCom Healthcare Messaging Security Standards',
      name_nl: 'MedCom standarder for sundhedsmeddelelser',
      issuing_body: 'MedCom',
      version: '2024',
      effective_date: '2024-01-01',
      scope: 'Security standards for healthcare messaging and integration in the Danish health sector',
      scope_sectors: ['healthcare'],
      structure_description: 'Standards organized by domains: message security, access control, Health Data Network, standard messages, audit and logging, and testing and certification.',
      source_url: 'https://www.medcom.dk/standarder/',
      license: 'Public sector publication',
      language: 'da+en',
    },
    controls,
    metadata: { ingested_at: new Date().toISOString(), source: 'MedCom standarder for sundhedsmeddelelser og integration', total_controls: controls.length },
  };
  writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2), 'utf-8');
  console.log(`Output: ${OUTPUT_FILE}`);
}

main().catch((err) => { console.error('Fatal:', err); process.exit(1); });
