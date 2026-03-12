// scripts/ingest-digst.ts
// Generates Digitaliseringsstyrelsen (Digst) security guidance controls.
// Source: Agency for Digital Government security guidelines for public sector IT.

import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'data', 'extracted');
const OUTPUT_FILE = join(DATA_DIR, 'digst-sikkerhed.json');

interface DigstControl {
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

function generateControls(): DigstControl[] {
  const controls: DigstControl[] = [];
  let seq = 1;

  function add(cat: string, subcat: string | null, titleDa: string, titleEn: string, descDa: string, descEn: string, iso: string | null, guidance: string | null) {
    const num = `DS${seq.toString().padStart(2, '0')}`;
    controls.push({
      control_number: num,
      title: titleEn,
      title_nl: titleDa,
      description: descEn,
      description_nl: descDa,
      category: cat,
      subcategory: subcat,
      level: null,
      iso_mapping: iso,
      implementation_guidance: guidance,
      verification_guidance: null,
      source_url: 'https://digst.dk/it-loesninger/sikkerhed/',
    });
    seq++;
  }

  // ISMS
  const isms = 'Ledelsessystem for informationssikkerhed';
  add(isms, null, 'Etablering af ISMS', 'Establishing an ISMS',
    'Myndigheden skal etablere et ledelsessystem for informationssikkerhed (ISMS) i overensstemmelse med ISO 27001.',
    'The authority must establish an information security management system (ISMS) in accordance with ISO 27001.',
    '5.1', 'Definer scope, kontekst og ledelsens forpligtelse til ISMS.');

  add(isms, null, 'Informationssikkerhedspolitik', 'Information security policy',
    'Myndigheden skal have en godkendt informationssikkerhedspolitik der fastlaegger rammer og principper for informationssikkerhed.',
    'The authority must have an approved information security policy that establishes the framework and principles for information security.',
    '5.1', null);

  add(isms, null, 'Roller og ansvar for informationssikkerhed', 'Roles and responsibilities for information security',
    'Roller og ansvar for informationssikkerhed skal vaere klart defineret og kommunikeret i hele organisationen.',
    'Roles and responsibilities for information security must be clearly defined and communicated throughout the organization.',
    '5.2', null);

  add(isms, null, 'Ledelsens opfoelgning pa informationssikkerhed', 'Management review of information security',
    'Ledelsen skal mindst arligt gennemga ISMS for at sikre fortsat egnethed, tilstraekkelighed og effektivitet.',
    'Management must review the ISMS at least annually to ensure continued suitability, adequacy, and effectiveness.',
    '5.35', null);

  // Risikostyring
  const risk = 'Risikostyring';
  add(risk, null, 'Risikovurdering', 'Risk assessment',
    'Myndigheden skal gennemfore regelmaeessige risikovurderinger for at identificere, analysere og evaluere informationssikkerhedsrisici.',
    'The authority must conduct regular risk assessments to identify, analyze, and evaluate information security risks.',
    '5.1', 'Gennemfor risikovurdering efter ISO 27005 eller tilsvarende metode.');

  add(risk, null, 'Risikobehandling', 'Risk treatment',
    'For hver identificeret risiko skal myndigheden beslutte en behandlingsstrategi: reducere, overfoere, acceptere eller undga.',
    'For each identified risk the authority must decide a treatment strategy: reduce, transfer, accept, or avoid.',
    '5.1', null);

  add(risk, null, 'Risikoregister', 'Risk register',
    'Myndigheden skal vedligeholde et risikoregister med alle identificerede risici, deres behandling og restrisici.',
    'The authority must maintain a risk register with all identified risks, their treatment, and residual risks.',
    '5.1', null);

  // Sikkerhedspolitik
  const pol = 'Sikkerhedspolitik';
  add(pol, null, 'Emnespecifikke politikker', 'Topic-specific policies',
    'Myndigheden skal udarbejde emnespecifikke politikker for omrader som adgangsstyring, kryptering og mobilsikkerhed.',
    'The authority must develop topic-specific policies for areas such as access control, encryption, and mobile security.',
    '5.1', null);

  add(pol, null, 'Klassifikation af information', 'Classification of information',
    'Al information skal klassificeres i henhold til et defineret klassifikationsskema baseret pa fortrolighed, integritet og tilgaengelighed.',
    'All information must be classified according to a defined classification scheme based on confidentiality, integrity, and availability.',
    '5.12', null);

  add(pol, null, 'Acceptabel brug af IT-aktiver', 'Acceptable use of IT assets',
    'Myndigheden skal have en politik for acceptabel brug af IT-udstyr, e-mail, internet og mobile enheder.',
    'The authority must have a policy for acceptable use of IT equipment, email, internet, and mobile devices.',
    '5.10', null);

  // Personalesikkerhed
  const pers = 'Personalesikkerhed';
  add(pers, null, 'Sikkerhed ved ansaettelse', 'Security at hiring',
    'Myndigheden skal verificere kandidaters baggrund forud for ansaettelse, proportionalt med adgangen til folsomme systemer.',
    'The authority must verify candidates backgrounds before hiring, proportional to access to sensitive systems.',
    '6.1', null);

  add(pers, null, 'Bevidstgorelse og uddannelse', 'Awareness and education',
    'Alle medarbejdere skal modtage regelmaeessig uddannelse i informationssikkerhed, herunder phishing-bevidsthed.',
    'All employees must receive regular information security education, including phishing awareness.',
    '6.3', null);

  add(pers, null, 'Procedurer ved fratradelse', 'Procedures at termination',
    'Ved medarbejderes fratradelse skal alle adgangsrettigheder tilbagekaldes og IT-aktiver returneres inden afgang.',
    'At employee termination all access rights must be revoked and IT assets returned before departure.',
    '6.5', null);

  // Fysisk sikkerhed
  const phys = 'Fysisk sikkerhed';
  add(phys, null, 'Sikring af serverrum og datacentre', 'Securing server rooms and data centers',
    'Serverrum og datacentre skal have fysisk adgangskontrol, overvagning og miljobeskyttelse.',
    'Server rooms and data centers must have physical access control, monitoring, and environmental protection.',
    '7.1', null);

  add(phys, null, 'Clean desk og clean screen', 'Clean desk and clean screen',
    'Myndigheden skal implementere en clean desk- og clean screen-politik for at beskytte folsom information.',
    'The authority must implement a clean desk and clean screen policy to protect sensitive information.',
    '7.7', null);

  add(phys, null, 'Beskyttelse af udstyr uden for kontoret', 'Protection of off-site equipment',
    'IT-udstyr der anvendes uden for myndighedens lokaler skal beskyttes mod tyveri og uautoriseret adgang.',
    'IT equipment used outside the authority premises must be protected against theft and unauthorized access.',
    '7.9', null);

  // Driftssikkerhed
  const ops = 'Driftssikkerhed';
  add(ops, null, 'Aendringsstyring', 'Change management',
    'Alle aendringer til IT-systemer skal folge en formel aendringsstyringsproces med risikovurdering og godkendelse.',
    'All changes to IT systems must follow a formal change management process with risk assessment and approval.',
    '8.32', null);

  add(ops, null, 'Kapacitetsstyring', 'Capacity management',
    'Myndigheden skal overvage og planlaeegge IT-kapacitet for at sikre tilstraekkelig ydelse og tilgaengelighed.',
    'The authority must monitor and plan IT capacity to ensure adequate performance and availability.',
    '8.6', null);

  add(ops, null, 'Backup', 'Backup',
    'Der skal vaere en backup-politik med regelmaeessig backup af alle kritiske data og systemer samt test af gendannelse.',
    'There must be a backup policy with regular backup of all critical data and systems and testing of recovery.',
    '8.13', null);

  add(ops, null, 'Malwarebeskyttelse', 'Malware protection',
    'Alle slutpunkter og servere skal have aktuel malwarebeskyttelse med automatisk opdatering.',
    'All endpoints and servers must have current malware protection with automatic updates.',
    '8.7', null);

  add(ops, null, 'Sarbarhedshandtering', 'Vulnerability management',
    'Myndigheden skal have en proces for sarbarhedsscanning og patching af alle systemer inden for definerede tidsfrister.',
    'The authority must have a process for vulnerability scanning and patching all systems within defined deadlines.',
    '8.8', null);

  add(ops, null, 'Logning og overvagning', 'Logging and monitoring',
    'Sikkerhedsrelevante haendelser skal logges og overrages. Logdata skal beskyttes mod manipulation.',
    'Security-relevant events must be logged and monitored. Log data must be protected against tampering.',
    '8.15', null);

  // Adgangsstyring
  const access = 'Adgangsstyring';
  add(access, null, 'Adgangspolitik', 'Access policy',
    'Myndigheden skal have en adgangspolitik baseret pa princippet om mindste rettigheder og need-to-know.',
    'The authority must have an access policy based on the principle of least privilege and need-to-know.',
    '5.15', null);

  add(access, null, 'Brugerregistrering og deprovisionering', 'User registration and deprovisioning',
    'Der skal vaere en formel proces for oprettelse og nedlaeggelse af brugerkonti med dokumenteret godkendelse.',
    'There must be a formal process for creating and decommissioning user accounts with documented approval.',
    '5.16', null);

  add(access, null, 'Staaerk autentifikation', 'Strong authentication',
    'Adgang til kritiske systemer skal kraeeve staaerk autentifikation, herunder flerfaktorautentifikation.',
    'Access to critical systems must require strong authentication, including multi-factor authentication.',
    '8.5', null);

  add(access, null, 'Adgangskontrol til netvaerk', 'Network access control',
    'Adgang til interne netvaerk skal kontrolleres og begraenses til autoriserede enheder og brugere.',
    'Access to internal networks must be controlled and restricted to authorized devices and users.',
    '8.20', null);

  // Anskaffelse og udvikling
  const dev = 'Anskaffelse og udvikling';
  add(dev, null, 'Sikkerhedskrav i anskaffelsesprocessen', 'Security requirements in procurement',
    'Informationssikkerhedskrav skal indga i kravspecifikationen ved anskaffelse af nye IT-loesninger.',
    'Information security requirements must be included in the requirements specification when procuring new IT solutions.',
    '5.19', null);

  add(dev, null, 'Sikker systemudvikling', 'Secure system development',
    'Systemudvikling skal folge en sikker udviklingslivscyklus med sikkerhedstest i alle faser.',
    'System development must follow a secure development lifecycle with security testing in all phases.',
    '8.25', null);

  add(dev, null, 'Sikkerhedstest for idriftsaettelse', 'Security testing before deployment',
    'Alle systemer skal gennemga sikkerhedstest, herunder penetrationstest, for de settes i produktion.',
    'All systems must undergo security testing, including penetration testing, before being put into production.',
    '8.29', null);

  add(dev, null, 'Leverandorstyring', 'Supplier management',
    'Myndigheden skal stille informationssikkerhedskrav til leverandoerer og overvage deres overholdelse.',
    'The authority must set information security requirements for suppliers and monitor their compliance.',
    '5.19', null);

  // Haendelseshandtering
  const inc = 'Haendelseshandtering';
  add(inc, null, 'Haendelsesberedskab', 'Incident response readiness',
    'Myndigheden skal have dokumenterede procedurer for handtering af informationssikkerhedshaendelser.',
    'The authority must have documented procedures for handling information security incidents.',
    '5.24', null);

  add(inc, null, 'Rapportering af haendelser', 'Incident reporting',
    'Medarbejdere skal rapportere mistaeenkelige haendelser via etablerede kanaler. Alvorlige haendelser skal rapporteres til CFCS.',
    'Employees must report suspicious incidents via established channels. Serious incidents must be reported to CFCS.',
    '6.8', null);

  // Compliance
  const comp = 'Overensstemmelse';
  add(comp, null, 'Lovmaessige krav', 'Legal requirements',
    'Myndigheden skal identificere og overholde alle relevante lovmaessige, regulatoriske og kontraktmaessige krav vedroeerende informationssikkerhed.',
    'The authority must identify and comply with all relevant legal, regulatory, and contractual information security requirements.',
    '5.31', null);

  add(comp, null, 'Databeskyttelse og GDPR', 'Data protection and GDPR',
    'Myndigheden skal sikre overensstemmelse med databeskyttelsesforordningen (GDPR) og databeskyttelsesloven.',
    'The authority must ensure compliance with the General Data Protection Regulation (GDPR) and the Data Protection Act.',
    '5.34', null);

  add(comp, null, 'Intern audit af informationssikkerhed', 'Internal audit of information security',
    'Der skal gennemfoeres regelmaeessige interne audits af ISMS for at verificere effektivitet og overensstemmelse.',
    'Regular internal audits of the ISMS must be conducted to verify effectiveness and compliance.',
    '5.35', null);

  add(comp, null, 'Uafhaeengig gennemgang', 'Independent review',
    'Informationssikkerhedsindsatsen skal underkastes uafhaeengig gennemgang med regelmaeessige intervaller.',
    'The information security effort must be subject to independent review at regular intervals.',
    '5.35', null);

  return controls;
}

async function main(): Promise<void> {
  console.log('Digst Security Guidance Ingestion Script');
  console.log('=========================================');

  const controls = generateControls();
  console.log(`Generated ${controls.length} Digst controls`);

  mkdirSync(DATA_DIR, { recursive: true });

  const output = {
    framework: {
      id: 'digst-sikkerhed',
      name: 'Agency for Digital Government Security Guidance',
      name_nl: 'Digitaliseringsstyrelsens sikkerhedsvejledning',
      issuing_body: 'Digitaliseringsstyrelsen (Digst)',
      version: '2024',
      effective_date: '2024-01-01',
      scope: 'Information security guidelines for Danish public sector IT systems and services',
      scope_sectors: ['government'],
      structure_description: 'Guidelines organized by ISMS domain: management system, risk management, security policy, personnel security, physical security, operations security, access control, procurement, incident management, and compliance.',
      source_url: 'https://digst.dk/it-loesninger/sikkerhed/',
      license: 'Public sector publication',
      language: 'da+en',
    },
    controls,
    metadata: {
      ingested_at: new Date().toISOString(),
      source: 'Digitaliseringsstyrelsen security guidance (compiled from published guidance)',
      total_controls: controls.length,
    },
  };

  writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2), 'utf-8');
  console.log(`Output: ${OUTPUT_FILE}`);
}

main().catch((err) => { console.error('Fatal:', err); process.exit(1); });
