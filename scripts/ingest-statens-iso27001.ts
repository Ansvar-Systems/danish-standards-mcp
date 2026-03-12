// scripts/ingest-statens-iso27001.ts
// Generates ISO 27001-based security standard for Danish state authorities.
// Mandatory for all statslige myndigheder since 2014.

import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'data', 'extracted');
const OUTPUT_FILE = join(DATA_DIR, 'statens-iso27001.json');

interface IsoControl {
  control_number: string;
  title: string;
  title_nl: string;
  description: string;
  description_nl: string;
  category: string;
  subcategory: string | null;
  level: string;
  iso_mapping: string;
  implementation_guidance: string | null;
  verification_guidance: string | null;
  source_url: string;
}

function generateControls(): IsoControl[] {
  const controls: IsoControl[] = [];

  function add(num: string, cat: string, subcat: string | null, titleDa: string, titleEn: string, descDa: string, descEn: string, iso: string, level: string, guidance: string | null) {
    controls.push({
      control_number: num,
      title: titleEn,
      title_nl: titleDa,
      description: descEn,
      description_nl: descDa,
      category: cat,
      subcategory: subcat,
      level,
      iso_mapping: iso,
      implementation_guidance: guidance,
      verification_guidance: null,
      source_url: 'https://digst.dk/it-loesninger/standarder/iso-27001/',
    });
  }

  // A.5 Informationssikkerhedspolitikker
  const a5 = 'A.5 Informationssikkerhedspolitikker';
  add('A.5.1', a5, null, 'Politikker for informationssikkerhed', 'Policies for information security',
    'Et saet af politikker for informationssikkerhed skal defineres, godkendes af ledelsen og kommunikeres til alle medarbejdere.',
    'A set of information security policies must be defined, approved by management, and communicated to all employees.',
    '5.1', 'Obligatorisk', 'Udarbejd overordnet sikkerhedspolitik og emnespecifikke politikker. Ledelsen skal godkende og underskrive.');

  add('A.5.2', a5, null, 'Gennemgang af sikkerhedspolitikker', 'Review of security policies',
    'Informationssikkerhedspolitikkerne skal gennemgas med planlagte intervaller eller ved vaesentlige aendringer.',
    'Information security policies must be reviewed at planned intervals or when significant changes occur.',
    '5.1', 'Obligatorisk', null);

  // A.6 Organisering af informationssikkerhed
  const a6 = 'A.6 Organisering af informationssikkerhed';
  add('A.6.1', a6, null, 'Roller og ansvar', 'Roles and responsibilities',
    'Alle ansvarsomrader for informationssikkerhed skal defineres og tildeles.',
    'All information security responsibilities must be defined and assigned.',
    '5.2', 'Obligatorisk', 'Udpeg en informationssikkerhedsansvarlig (CISO) og definer ansvarsmatrice.');

  add('A.6.2', a6, null, 'Funktionsadskillelse', 'Segregation of duties',
    'Konflikter mellem opgaver og ansvarsomrader skal identificeres og forebygges.',
    'Conflicts between tasks and responsibilities must be identified and prevented.',
    '5.3', 'Obligatorisk', null);

  add('A.6.3', a6, null, 'Kontakt med myndigheder', 'Contact with authorities',
    'Passende kontakter med relevante myndigheder, herunder CFCS og Datatilsynet, skal vedligeholdes.',
    'Appropriate contacts with relevant authorities, including CFCS and the Data Protection Authority, must be maintained.',
    '5.5', 'Obligatorisk', null);

  add('A.6.4', a6, null, 'Informationssikkerhed i projektstyring', 'Information security in project management',
    'Informationssikkerhed skal adresseres i projektledelse uanset projekttype.',
    'Information security must be addressed in project management regardless of project type.',
    '5.8', 'Obligatorisk', null);

  // A.7 Personalesikkerhed
  const a7 = 'A.7 Personalesikkerhed';
  add('A.7.1', a7, null, 'Screening', 'Screening',
    'Baggrundskontrol af alle kandidater til ansaettelse skal gennemfores i overensstemmelse med gaeldende love.',
    'Background checks of all candidates for employment must be conducted in accordance with applicable laws.',
    '6.1', 'Obligatorisk', null);

  add('A.7.2', a7, null, 'Ansaettelsesvilkar', 'Terms of employment',
    'Kontraktmaessige aftaler med medarbejdere skal angive deres og organisationens ansvar for informationssikkerhed.',
    'Contractual agreements with employees must state their and the organization responsibilities for information security.',
    '6.2', 'Obligatorisk', null);

  add('A.7.3', a7, null, 'Bevidstgorelse og uddannelse', 'Awareness and training',
    'Alle medarbejdere og relevante kontrahenter skal modtage passende bevidstgorelse og uddannelse i informationssikkerhed.',
    'All employees and relevant contractors must receive appropriate awareness and training in information security.',
    '6.3', 'Obligatorisk', 'Arlig sikkerhedsbevidsthedskursus og kvartalsvis phishing-simulation.');

  add('A.7.4', a7, null, 'Disciplinaere foranstaltninger', 'Disciplinary process',
    'Der skal vaere en formel og kommunikeret disciplinaer proces for medarbejdere der overtreeder sikkerhedspolitikken.',
    'There must be a formal and communicated disciplinary process for employees who breach the security policy.',
    '6.4', 'Obligatorisk', null);

  add('A.7.5', a7, null, 'Ansvar ved fratradelse', 'Responsibilities at termination',
    'Informationssikkerhedsansvar der forbliver gyldige efter fratradelse skal defineres og kommunikeres.',
    'Information security responsibilities that remain valid after termination must be defined and communicated.',
    '6.5', 'Obligatorisk', null);

  // A.8 Styring af aktiver
  const a8 = 'A.8 Styring af aktiver';
  add('A.8.1', a8, null, 'Fortegnelse over aktiver', 'Inventory of assets',
    'Information og andre aktiver forbundet med informationsbehandling skal identificeres og en fortegnelse vedligeholdes.',
    'Information and other assets associated with information processing must be identified and an inventory maintained.',
    '5.9', 'Obligatorisk', null);

  add('A.8.2', a8, null, 'Klassifikation af information', 'Classification of information',
    'Information skal klassificeres i henhold til lovkrav, vaerdi, kritikalitet og folsomhed.',
    'Information must be classified according to legal requirements, value, criticality, and sensitivity.',
    '5.12', 'Obligatorisk', 'Anvend dansk klassifikationsmodel: FORTROLIG, INTERN, OFFENTLIG.');

  add('A.8.3', a8, null, 'Maerkning af information', 'Labelling of information',
    'Et passende saet af procedurer for maerkning af information skal udvikles i overensstemmelse med klassifikationsskemaet.',
    'An appropriate set of procedures for labelling information must be developed in accordance with the classification scheme.',
    '5.13', 'Obligatorisk', null);

  add('A.8.4', a8, null, 'Handtering af aktiver', 'Handling of assets',
    'Procedurer for handtering af aktiver skal udvikles i overensstemmelse med klassifikationsskemaet.',
    'Procedures for handling assets must be developed in accordance with the classification scheme.',
    '5.10', 'Obligatorisk', null);

  // A.9 Adgangsstyring
  const a9 = 'A.9 Adgangsstyring';
  add('A.9.1', a9, null, 'Adgangskontrolpolitik', 'Access control policy',
    'En adgangskontrolpolitik skal etableres, dokumenteres og gennemgas baseret pa forretnings- og sikkerhedskrav.',
    'An access control policy must be established, documented, and reviewed based on business and security requirements.',
    '5.15', 'Obligatorisk', null);

  add('A.9.2', a9, null, 'Brugerregistrering og afregistrering', 'User registration and deregistration',
    'En formel proces for brugerregistrering og afregistrering skal implementeres for at muliggore tildeling af adgangsrettigheder.',
    'A formal user registration and deregistration process must be implemented to enable assignment of access rights.',
    '5.16', 'Obligatorisk', null);

  add('A.9.3', a9, null, 'Styring af privilegerede adgangsrettigheder', 'Management of privileged access rights',
    'Tildeling og brug af privilegerede adgangsrettigheder skal begraenses og kontrolleres.',
    'Allocation and use of privileged access rights must be restricted and controlled.',
    '8.2', 'Obligatorisk', null);

  add('A.9.4', a9, null, 'Adgangskodepolitik', 'Password policy',
    'Der skal vaere en adgangskodepolitik med krav til laengde, kompleksitet og udskiftningsfrekvens.',
    'There must be a password policy with requirements for length, complexity, and change frequency.',
    '5.17', 'Obligatorisk', 'Mindst 12 tegn, kompleksitetskrav, ingen genbrug af de seneste 10 adgangskoder.');

  add('A.9.5', a9, null, 'Gennemgang af brugeradgangsrettigheder', 'Review of user access rights',
    'Ejere af aktiver skal gennemga brugeradgangsrettigheder med regelmaeessige intervaller.',
    'Asset owners must review user access rights at regular intervals.',
    '5.18', 'Obligatorisk', null);

  // A.10 Kryptografi
  const a10 = 'A.10 Kryptografi';
  add('A.10.1', a10, null, 'Politik for brug af kryptografi', 'Policy on use of cryptography',
    'Der skal udvikles og implementeres en politik for brug af kryptografiske kontroller til beskyttelse af information.',
    'A policy for the use of cryptographic controls for the protection of information must be developed and implemented.',
    '8.24', 'Obligatorisk', 'Anvend AES-256 for data i hvile og TLS 1.2+ for data i transit.');

  add('A.10.2', a10, null, 'Noeglehandtering', 'Key management',
    'En politik for brug, beskyttelse og levetid af kryptografiske noegler skal udvikles og implementeres.',
    'A policy on the use, protection, and lifetime of cryptographic keys must be developed and implemented.',
    '8.24', 'Obligatorisk', null);

  // A.11 Fysisk sikkerhed
  const a11 = 'A.11 Fysisk sikkerhed';
  add('A.11.1', a11, null, 'Fysiske sikkerhedsomrader', 'Physical security perimeters',
    'Sikkerhedsomrader skal defineres og anvendes til at beskytte omrader der indeholder folsom information.',
    'Security perimeters must be defined and used to protect areas containing sensitive information.',
    '7.1', 'Obligatorisk', null);

  add('A.11.2', a11, null, 'Fysiske adgangskontroller', 'Physical entry controls',
    'Sikre omrader skal beskyttes af passende adgangskontroller for at sikre, at kun autoriseret personale far adgang.',
    'Secure areas must be protected by appropriate entry controls to ensure only authorized personnel gain access.',
    '7.2', 'Obligatorisk', null);

  add('A.11.3', a11, null, 'Beskyttelse mod ydre trusler', 'Protection against external threats',
    'Fysisk beskyttelse mod naturkatastrofer, ondsindede angreb eller ulykker skal designes og anvendes.',
    'Physical protection against natural disasters, malicious attacks, or accidents must be designed and applied.',
    '7.5', 'Obligatorisk', null);

  add('A.11.4', a11, null, 'Sikring af udstyr', 'Equipment security',
    'Udstyr skal placeres og beskyttes for at reducere risici fra miljoetrusler og uautoriseret adgang.',
    'Equipment must be sited and protected to reduce risks from environmental threats and unauthorized access.',
    '7.8', 'Obligatorisk', null);

  // A.12 Driftssikkerhed
  const a12 = 'A.12 Driftssikkerhed';
  add('A.12.1', a12, null, 'Dokumenterede driftsprocedurer', 'Documented operating procedures',
    'Driftsprocedurer skal dokumenteres og goeres tilgaeengelige for alle brugere der har behov herfor.',
    'Operating procedures must be documented and made available to all users who need them.',
    '5.37', 'Obligatorisk', null);

  add('A.12.2', a12, null, 'Aendringsstyring', 'Change management',
    'Aendringer til organisationen, forretningsprocesser og IT-systemer skal kontrolleres.',
    'Changes to the organization, business processes, and IT systems must be controlled.',
    '8.32', 'Obligatorisk', null);

  add('A.12.3', a12, null, 'Kapacitetsstyring', 'Capacity management',
    'Brugen af ressourcer skal overrages og justeres, og der skal foretages fremskrivninger af fremtidige kapacitetsbehov.',
    'The use of resources must be monitored and tuned, and projections must be made of future capacity requirements.',
    '8.6', 'Obligatorisk', null);

  add('A.12.4', a12, null, 'Beskyttelse mod malware', 'Protection against malware',
    'Detektions-, forebyggelses- og gendannelseskontroller mod malware skal implementeres kombineret med bevidstgorelse.',
    'Detection, prevention, and recovery controls against malware must be implemented combined with awareness.',
    '8.7', 'Obligatorisk', null);

  add('A.12.5', a12, null, 'Backup', 'Backup',
    'Backupkopier af information, software og systembilleder skal tages og testes regelmaeessigt.',
    'Backup copies of information, software, and system images must be taken and tested regularly.',
    '8.13', 'Obligatorisk', null);

  add('A.12.6', a12, null, 'Logning', 'Logging',
    'Haendelseslogger der registrerer brugeraktiviteter, undtagelser og informationssikkerhedshaendelser skal oprettes og opbevares.',
    'Event logs recording user activities, exceptions, and information security events must be produced and kept.',
    '8.15', 'Obligatorisk', 'Centraliser logindsamling. Opbevar logdata i mindst 12 maneder.');

  add('A.12.7', a12, null, 'Sarbarhedshandtering', 'Vulnerability management',
    'Information om tekniske sarbarheder skal indhentes rettidigt, og passende foranstaltninger skal traeffes.',
    'Information about technical vulnerabilities must be obtained in a timely fashion, and appropriate measures must be taken.',
    '8.8', 'Obligatorisk', null);

  // A.13 Kommunikationssikkerhed
  const a13 = 'A.13 Kommunikationssikkerhed';
  add('A.13.1', a13, null, 'Netvaerkssikkerhedsstyring', 'Network security management',
    'Netvaerk skal styres og kontrolleres for at beskytte information i systemer og applikationer.',
    'Networks must be managed and controlled to protect information in systems and applications.',
    '8.20', 'Obligatorisk', null);

  add('A.13.2', a13, null, 'Netvaerkssegmentering', 'Network segregation',
    'Grupper af informationstjenester, brugere og systemer skal segmenteres pa netvaerk.',
    'Groups of information services, users, and systems must be segregated on networks.',
    '8.22', 'Obligatorisk', null);

  add('A.13.3', a13, null, 'Informationsoverforsel', 'Information transfer',
    'Formelle overforselspolititikker, procedurer og kontroller skal vaere pa plads for at beskytte overforsel af information.',
    'Formal transfer policies, procedures, and controls must be in place to protect the transfer of information.',
    '5.14', 'Obligatorisk', null);

  // A.14 Anskaffelse, udvikling og vedligeholdelse
  const a14 = 'A.14 Anskaffelse, udvikling og vedligeholdelse';
  add('A.14.1', a14, null, 'Sikkerhedskrav til informationssystemer', 'Security requirements for information systems',
    'Informationssikkerhedsrelaterede krav skal medtages i kravene til nye informationssystemer.',
    'Information security related requirements must be included in the requirements for new information systems.',
    '8.26', 'Obligatorisk', null);

  add('A.14.2', a14, null, 'Sikker udviklingslivscyklus', 'Secure development lifecycle',
    'Regler for udvikling af software og systemer skal etableres og anvendes pa udviklinger i organisationen.',
    'Rules for the development of software and systems must be established and applied to developments within the organization.',
    '8.25', 'Obligatorisk', null);

  add('A.14.3', a14, null, 'Sikkerhedstest', 'Security testing',
    'Sikkerhedstest skal gennemfores under udvikling og for produktionsudrulning.',
    'Security testing must be conducted during development and before production deployment.',
    '8.29', 'Obligatorisk', null);

  add('A.14.4', a14, null, 'Beskyttelse af testdata', 'Protection of test data',
    'Testdata skal vaelges omhyggeligt, beskyttes og kontrolleres. Produktionsdata ma ikke anvendes ukritisk som testdata.',
    'Test data must be carefully selected, protected, and controlled. Production data must not be used uncritically as test data.',
    '8.33', 'Obligatorisk', null);

  // A.15 Leverandorforhold
  const a15 = 'A.15 Leverandorforhold';
  add('A.15.1', a15, null, 'Informationssikkerhed i leverandorforhold', 'Information security in supplier relationships',
    'Krav til reduktion af risici forbundet med leverandorers adgang til organisationens aktiver skal aftales og dokumenteres.',
    'Requirements for mitigating risks associated with supplier access to the organization assets must be agreed upon and documented.',
    '5.19', 'Obligatorisk', null);

  add('A.15.2', a15, null, 'Leverandoerservice-styring', 'Supplier service management',
    'Levering af tjenester fra leverandoerer skal overrages, gennemgas og auditeres regelmaeessigt.',
    'Delivery of services from suppliers must be monitored, reviewed, and audited regularly.',
    '5.22', 'Obligatorisk', null);

  add('A.15.3', a15, null, 'Sikkerhed i forsyningskaeden', 'Supply chain security',
    'Aftaler med leverandoerer skal indeholde krav om informationssikkerhed i hele forsyningskaeden.',
    'Agreements with suppliers must include requirements for information security throughout the supply chain.',
    '5.21', 'Obligatorisk', null);

  // A.16 Styring af informationssikkerhedshaendelser
  const a16 = 'A.16 Haendelsesstyring';
  add('A.16.1', a16, null, 'Haendelsesstyringsproces', 'Incident management process',
    'Ledelsesansvar og -procedurer skal etableres for at sikre hurtig, effektiv og ordnet respons pa informationssikkerhedshaendelser.',
    'Management responsibilities and procedures must be established to ensure a quick, effective, and orderly response to information security incidents.',
    '5.24', 'Obligatorisk', null);

  add('A.16.2', a16, null, 'Rapportering af haendelser', 'Reporting of incidents',
    'Informationssikkerhedshaendelser skal rapporteres via passende kanaler sa hurtigt som muligt.',
    'Information security incidents must be reported through appropriate channels as quickly as possible.',
    '6.8', 'Obligatorisk', null);

  add('A.16.3', a16, null, 'Vurdering og beslutning', 'Assessment and decision',
    'Informationssikkerhedshaendelser skal vurderes, og der skal traeffes beslutning om klassifikation.',
    'Information security events must be assessed and a decision made on classification.',
    '5.25', 'Obligatorisk', null);

  add('A.16.4', a16, null, 'Respons pa haendelser', 'Response to incidents',
    'Informationssikkerhedshaendelser skal handteres i overensstemmelse med de dokumenterede procedurer.',
    'Information security incidents must be responded to in accordance with the documented procedures.',
    '5.26', 'Obligatorisk', null);

  add('A.16.5', a16, null, 'Laering af haendelser', 'Learning from incidents',
    'Viden opnaet fra analyse og losning af informationssikkerhedshaendelser skal bruges til at reducere fremtidige haendelser.',
    'Knowledge gained from analyzing and resolving information security incidents must be used to reduce future incidents.',
    '5.27', 'Obligatorisk', null);

  // A.17 Beredskabsstyring
  const a17 = 'A.17 Beredskabsstyring';
  add('A.17.1', a17, null, 'Informationssikkerhedskontinuitet', 'Information security continuity',
    'Informationssikkerhedskontinuitet skal indarbejdes i organisationens beredskabsstyringsystem.',
    'Information security continuity must be embedded in the organization business continuity management system.',
    '5.29', 'Obligatorisk', null);

  add('A.17.2', a17, null, 'IT-beredskabsplan', 'IT contingency plan',
    'IT-beredskabsplaner skal dokumenteres, implementeres og testes for at sikre passende tilgaeengelighed.',
    'IT contingency plans must be documented, implemented, and tested to ensure appropriate availability.',
    '5.30', 'Obligatorisk', null);

  add('A.17.3', a17, null, 'Redundans', 'Redundancy',
    'Informationsbehandlingsfaciliteter skal implementeres med tilstraekkelig redundans til at opfylde tilgaeengelighedskrav.',
    'Information processing facilities must be implemented with sufficient redundancy to meet availability requirements.',
    '8.14', 'Obligatorisk', null);

  // A.18 Overensstemmelse
  const a18 = 'A.18 Overensstemmelse';
  add('A.18.1', a18, null, 'Lovmaessige og kontraktmaessige krav', 'Legal and contractual requirements',
    'Alle relevante lovmaessige, regulatoriske og kontraktmaessige krav skal identificeres, dokumenteres og holdes opdateret.',
    'All relevant legal, regulatory, and contractual requirements must be identified, documented, and kept up to date.',
    '5.31', 'Obligatorisk', null);

  add('A.18.2', a18, null, 'Beskyttelse af personoplysninger', 'Protection of personal data',
    'Privatlivets fred og beskyttelse af personoplysninger skal sikres i overensstemmelse med relevant lovgivning.',
    'Privacy and protection of personal data must be ensured in accordance with relevant legislation.',
    '5.34', 'Obligatorisk', null);

  add('A.18.3', a18, null, 'Uafhaeengig gennemgang af informationssikkerhed', 'Independent review of information security',
    'Organisationens tilgang til styring af informationssikkerhed skal underkastes uafhaeengig gennemgang.',
    'The organization approach to managing information security must be independently reviewed.',
    '5.35', 'Obligatorisk', null);

  add('A.18.4', a18, null, 'Overensstemmelse med sikkerhedspolitikker og -standarder', 'Compliance with security policies and standards',
    'Ledere skal regelmaeessigt gennemga overensstemmelse med informationssikkerhedspolitikker og -standarder.',
    'Managers must regularly review compliance with information security policies and standards.',
    '5.36', 'Obligatorisk', null);

  return controls;
}

async function main(): Promise<void> {
  console.log('Statens ISO 27001 Ingestion Script');
  console.log('====================================');

  const controls = generateControls();
  console.log(`Generated ${controls.length} controls`);

  mkdirSync(DATA_DIR, { recursive: true });

  const output = {
    framework: {
      id: 'statens-iso27001',
      name: 'ISO 27001-based Security Standard for Danish State Authorities',
      name_nl: 'ISO 27001-baseret sikkerhedsstandard for statslige myndigheder',
      issuing_body: 'Digitaliseringsstyrelsen',
      version: '2014',
      effective_date: '2014-06-01',
      scope: 'Mandatory information security standard for all Danish state authorities, based on ISO 27001 Annex A controls adapted for Danish government context',
      scope_sectors: ['government'],
      structure_description: 'Organized by ISO 27001:2013 Annex A domains (A.5 through A.18), with each control adapted for the Danish government context. All controls are mandatory for statslige myndigheder.',
      source_url: 'https://digst.dk/it-loesninger/standarder/iso-27001/',
      license: 'Public sector publication',
      language: 'da+en',
    },
    controls,
    metadata: {
      ingested_at: new Date().toISOString(),
      source: 'Statens ISO 27001 standard (compiled from published guidance)',
      total_controls: controls.length,
    },
  };

  writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2), 'utf-8');
  console.log(`Output: ${OUTPUT_FILE}`);
}

main().catch((err) => { console.error('Fatal:', err); process.exit(1); });
