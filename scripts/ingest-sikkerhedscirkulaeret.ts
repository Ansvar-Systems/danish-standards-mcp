// scripts/ingest-sikkerhedscirkulaeret.ts
// Sikkerhedscirkul aeret - Government security circular (classification and handling)

import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'data', 'extracted');
const OUTPUT_FILE = join(DATA_DIR, 'sikkerhedscirkulaeret.json');

interface Control {
  control_number: string; title: string; title_nl: string; description: string; description_nl: string;
  category: string; subcategory: string | null; level: string | null; iso_mapping: string | null;
  implementation_guidance: string | null; verification_guidance: string | null; source_url: string;
}

function generateControls(): Control[] {
  const controls: Control[] = [];
  let seq = 1;
  function add(cat: string, sub: string | null, tDa: string, tEn: string, dDa: string, dEn: string, iso: string | null, guide: string | null, level: string | null) {
    controls.push({ control_number: `SIK${seq.toString().padStart(2, '0')}`, title: tEn, title_nl: tDa, description: dEn, description_nl: dDa, category: cat, subcategory: sub, level: level ?? 'Krav', iso_mapping: iso, implementation_guidance: guide, verification_guidance: null, source_url: 'https://www.retsinformation.dk/eli/retsinfo/2014/10338' });
    seq++;
  }

  // === Klassifikation (Classification) ===
  add('Klassifikation', 'Niveauer', 'Klassifikationsniveauer for information', 'Classification levels for information',
    'Statslig information skal klassificeres i fire niveauer: YDERST HEMMELIGT, HEMMELIGT, FORTROLIGT og TIL TJENESTEBRUG.',
    'Government information must be classified at four levels: TOP SECRET, SECRET, CONFIDENTIAL, and RESTRICTED.',
    '5.12', null, 'Krav');

  add('Klassifikation', 'Niveauer', 'Klassifikation af digitale systemer', 'Classification of digital systems',
    'IT-systemer der behandler klassificeret information skal klassificeres mindst pa samme niveau som den hoejest klassificerede information de behandler.',
    'IT systems processing classified information must be classified at least at the same level as the highest classified information they process.',
    '5.12', null, 'Krav');

  add('Klassifikation', 'Maekning', 'Maekning af klassificeret information', 'Marking of classified information',
    'Al klassificeret information skal vaere tydeligt maerket med det korrekte klassifikationsniveau pa alle sider og medier.',
    'All classified information must be clearly marked with the correct classification level on all pages and media.',
    '5.13', null, 'Krav');

  add('Klassifikation', 'Revurdering', 'Regelmaeessig revurdering af klassifikation', 'Regular reassessment of classification',
    'Klassifikationsniveauer skal revurderes regelmaeessigt og nedklassificeres nar behovet for beskyttelse ikke laengere er til stede.',
    'Classification levels must be reassessed regularly and declassified when the need for protection no longer exists.',
    '5.12', null, 'Krav');

  // === Personelsikkerhed (Personnel Security) ===
  add('Personelsikkerhed', 'Godkendelse', 'Sikkerhedsgodkendelse af personel', 'Security clearance of personnel',
    'Personel med adgang til klassificeret information skal vaere sikkerhedsgodkendt pa det relevante niveau af Politiets Efterretningstjeneste (PET).',
    'Personnel with access to classified information must be security cleared at the relevant level by the Danish Security and Intelligence Service (PET).',
    '6.1', null, 'Krav');

  add('Personelsikkerhed', 'Godkendelse', 'Niveauer for sikkerhedsgodkendelse', 'Levels of security clearance',
    'Sikkerhedsgodkendelse udstedes i niveauerne TIL TJENESTEBRUG, FORTROLIGT, HEMMELIGT og YDERST HEMMELIGT svarende til informationsklassifikationen.',
    'Security clearance is issued at levels RESTRICTED, CONFIDENTIAL, SECRET, and TOP SECRET corresponding to the information classification.',
    '6.1', null, 'Krav');

  add('Personelsikkerhed', 'Instruks', 'Sikkerhedsinstruks til personel', 'Security instructions to personnel',
    'Alt sikkerhedsgodkendt personel skal modtage en skriftlig sikkerhedsinstruks og bekraefte modtagelsen.',
    'All security-cleared personnel must receive written security instructions and acknowledge receipt.',
    '6.2', null, 'Krav');

  add('Personelsikkerhed', 'Need-to-know', 'Need-to-know-princippet', 'Need-to-know principle',
    'Adgang til klassificeret information skal gives udelukkende pa need-to-know-basis uanset sikkerhedsgodkendelsesniveau.',
    'Access to classified information must be granted exclusively on a need-to-know basis regardless of security clearance level.',
    '5.15', null, 'Krav');

  // === Fysisk sikkerhed (Physical Security) ===
  add('Fysisk sikkerhed', 'Sikkerhedszoner', 'Sikkerhedszoner for klassificeret information', 'Security zones for classified information',
    'Lokaler hvor klassificeret information behandles eller opbevares skal vaere etableret som sikkerhedszoner med fysisk adgangskontrol.',
    'Premises where classified information is processed or stored must be established as security zones with physical access control.',
    '7.1', null, 'Krav');

  add('Fysisk sikkerhed', 'Opbevaring', 'Opbevaring af klassificeret information', 'Storage of classified information',
    'Klassificeret information skal opbevares i godkendte sikkerhedsskabe eller sikkerhedsrum nar den ikke er i aktiv brug.',
    'Classified information must be stored in approved security cabinets or security rooms when not in active use.',
    '7.8', null, 'Krav');

  add('Fysisk sikkerhed', 'Destruktion', 'Destruktion af klassificeret information', 'Destruction of classified information',
    'Klassificeret information skal destrueres ved brug af godkendte metoder (krydsmakulering, forbranding) nar den ikke laengere er nodvendig.',
    'Classified information must be destroyed using approved methods (cross-cut shredding, incineration) when no longer needed.',
    '7.14', null, 'Krav');

  // === IT-sikkerhed (IT Security) ===
  add('IT-sikkerhed', 'Godkendelse', 'Godkendelse af IT-systemer til klassificeret information', 'Approval of IT systems for classified information',
    'IT-systemer der skal behandle klassificeret information skal godkendes (akkrediteres) af den ansvarlige sikkerhedsmyndighed.',
    'IT systems intended to process classified information must be approved (accredited) by the responsible security authority.',
    '8.27', 'Kontakt CFCS for akkreditering af systemer til FORTROLIGT og derover. Dokumenter systemets sikkerhedsarkitektur.', 'Krav');

  add('IT-sikkerhed', 'Kryptering', 'Kryptering af klassificeret information', 'Encryption of classified information',
    'Klassificeret information FORTROLIGT og derover skal krypteres med godkendte krypteringsprodukter ved elektronisk transmission.',
    'Classified information CONFIDENTIAL and above must be encrypted with approved encryption products during electronic transmission.',
    '8.24', null, 'Krav');

  add('IT-sikkerhed', 'Netvaerk', 'Netvaerksseparation for klassificerede systemer', 'Network separation for classified systems',
    'Systemer der behandler klassificeret information FORTROLIGT og derover skal vaere fysisk adskilt fra internetforbundne netvaerk.',
    'Systems processing classified information CONFIDENTIAL and above must be physically separated from internet-connected networks.',
    '8.22', null, 'Krav');

  add('IT-sikkerhed', 'Medier', 'Handtering af flytbare medier', 'Handling of removable media',
    'Flytbare medier med klassificeret information skal maerkes, registreres og opbevares med samme beskyttelse som det klassificerede materiale.',
    'Removable media containing classified information must be marked, registered, and stored with the same protection as the classified material.',
    '7.10', null, 'Krav');

  // === Transport og transmission (Transport and Transmission) ===
  add('Transport', 'Fysisk', 'Fysisk transport af klassificeret information', 'Physical transport of classified information',
    'Klassificeret information skal transporteres i forseglede konvolutter med modtagerkvittering. HEMMELIGT og derover kraever kurer.',
    'Classified information must be transported in sealed envelopes with recipient receipt. SECRET and above requires courier.',
    '5.14', null, 'Krav');

  add('Transport', 'Elektronisk', 'Elektronisk transmission af klassificeret information', 'Electronic transmission of classified information',
    'Elektronisk transmission af klassificeret information skal ske via godkendte krypterede kommunikationssystemer.',
    'Electronic transmission of classified information must use approved encrypted communication systems.',
    '8.24', null, 'Krav');

  // === Sikkerhedsbrud (Security Breaches) ===
  add('Sikkerhedsbrud', 'Rapportering', 'Rapportering af sikkerhedsbrud', 'Reporting of security breaches',
    'Ethvert brud pa sikkerheden for klassificeret information skal straks rapporteres til sikkerhedsorganisationen og den ansvarlige myndighed.',
    'Any breach of security for classified information must be immediately reported to the security organization and the responsible authority.',
    '5.24', null, 'Krav');

  add('Sikkerhedsbrud', 'Undersogelse', 'Undersogelse af sikkerhedsbrud', 'Investigation of security breaches',
    'Sikkerhedsbrud skal undersoges for at fastslaa omfanget af kompromittering og forebygge gentagelse.',
    'Security breaches must be investigated to determine the extent of compromise and prevent recurrence.',
    '5.27', null, 'Krav');

  // === Sikkerhedsorganisation (Security Organization) ===
  add('Sikkerhedsorganisation', 'Ansvar', 'Udpegning af sikkerhedsansvarlig', 'Appointment of security officer',
    'Enhver myndighed der behandler klassificeret information skal udpege en sikkerhedsansvarlig med ansvar for sikkerhedscirkul aerets overholdelse.',
    'Every authority processing classified information must appoint a security officer responsible for compliance with the security circular.',
    '5.2', null, 'Krav');

  add('Sikkerhedsorganisation', 'Kontrol', 'Sikkerhedskontrol og inspektion', 'Security control and inspection',
    'Myndighedens sikkerhedsansvarlige skal gennemfoere regelmaessige sikkerhedskontroller og inspektioner af klassificeret materiale.',
    'The authority security officer must conduct regular security controls and inspections of classified material.',
    '5.35', null, 'Krav');

  return controls;
}

async function main(): Promise<void> {
  console.log('Sikkerhedscirkul aeret Ingestion');
  const controls = generateControls();
  console.log(`Generated ${controls.length} controls`);
  mkdirSync(DATA_DIR, { recursive: true });
  const output = {
    framework: {
      id: 'sikkerhedscirkulaeret',
      name: 'Government Security Circular (Sikkerhedscirkul aeret)',
      name_nl: 'Sikkerhedscirkul aeret',
      issuing_body: 'Justitsministeriet / PET / CFCS',
      version: '2014',
      effective_date: '2014-11-17',
      scope: 'Requirements for handling classified government information in Danish public sector',
      scope_sectors: ['government'],
      structure_description: 'Requirements organized by domains: classification, personnel security, physical security, IT security, transport and transmission, security breaches, and security organization.',
      source_url: 'https://www.retsinformation.dk/eli/retsinfo/2014/10338',
      license: 'Public sector publication',
      language: 'da+en',
    },
    controls,
    metadata: { ingested_at: new Date().toISOString(), source: 'Sikkerhedscirkul aeret (CIR nr 10338 af 17/11/2014)', total_controls: controls.length },
  };
  writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2), 'utf-8');
  console.log(`Output: ${OUTPUT_FILE}`);
}

main().catch((err) => { console.error('Fatal:', err); process.exit(1); });
