// scripts/ingest-cfcs-secure-dev.ts
// CFCS Vejledning om sikker softwareudvikling

import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'data', 'extracted');
const OUTPUT_FILE = join(DATA_DIR, 'cfcs-secure-dev.json');

interface Control {
  control_number: string; title: string; title_nl: string; description: string; description_nl: string;
  category: string; subcategory: string | null; level: string | null; iso_mapping: string | null;
  implementation_guidance: string | null; verification_guidance: string | null; source_url: string;
}

function generateControls(): Control[] {
  const controls: Control[] = [];
  let seq = 1;
  function add(cat: string, sub: string | null, tDa: string, tEn: string, dDa: string, dEn: string, iso: string | null, guide: string | null, level: string | null) {
    controls.push({ control_number: `SD${seq.toString().padStart(2, '0')}`, title: tEn, title_nl: tDa, description: dEn, description_nl: dDa, category: cat, subcategory: sub, level: level ?? 'Krav', iso_mapping: iso, implementation_guidance: guide, verification_guidance: null, source_url: 'https://www.cfcs.dk/da/forebyggelse/vejledninger/sikker-softwareudvikling/' });
    seq++;
  }

  // === Sikker udviklingsproces (Secure SDLC) ===
  add('Sikker udviklingsproces', 'SDLC', 'Sikker softwareudviklingslivscyklus (SSDLC)', 'Secure software development lifecycle (SSDLC)',
    'Organisationen skal implementere en sikker softwareudviklingslivscyklus der integrerer sikkerhed i alle faser fra krav til udfasning.',
    'The organization must implement a secure software development lifecycle that integrates security in all phases from requirements to decommissioning.',
    '8.25', 'Adopter en SSDLC-model baseret pa OWASP SAMM eller Microsoft SDL. Definer sikkerhedsaktiviteter for hver fase.', 'Krav');

  add('Sikker udviklingsproces', 'Krav', 'Sikkerhedskrav i kravspecifikation', 'Security requirements in specification',
    'Sikkerhedskrav skal defineres eksplicit i kravspecifikationen for alle softwareprojekter baseret pa trusselsmodellering og risikovurdering.',
    'Security requirements must be defined explicitly in the specification for all software projects based on threat modeling and risk assessment.',
    '8.25', null, 'Krav');

  add('Sikker udviklingsproces', 'Trusselsmodellering', 'Trusselsmodellering i designfasen', 'Threat modeling in design phase',
    'Trusselsmodellering skal udfoeres i designfasen for at identificere trusler, angrebsflader og sikkerhedsarkitekturens tilstraekkelighed.',
    'Threat modeling must be performed in the design phase to identify threats, attack surfaces, and the adequacy of the security architecture.',
    '8.25', 'Anvend STRIDE eller tilsvarende metodik. Dokumenter trusler, modforanstaltninger og restrisici.', 'Krav');

  // === Sikker kodning (Secure Coding) ===
  add('Sikker kodning', 'Retningslinjer', 'Retningslinjer for sikker kodning', 'Secure coding guidelines',
    'Organisationen skal have dokumenterede retningslinjer for sikker kodning der daekker input-validering, output-encoding, autentifikation, session-styring og fejlhandtering.',
    'The organization must have documented secure coding guidelines covering input validation, output encoding, authentication, session management, and error handling.',
    '8.28', 'Baser retningslinjerne pa OWASP Secure Coding Practices. Tilpas til organisationens teknologistak.', 'Krav');

  add('Sikker kodning', 'Input', 'Input-validering og output-encoding', 'Input validation and output encoding',
    'Al brugerinput skal valideres pa serversiden. Output skal encodes korrekt baseret pa konteksten for at forebygge injection-angreb.',
    'All user input must be validated on the server side. Output must be correctly encoded based on context to prevent injection attacks.',
    '8.28', null, 'Krav');

  add('Sikker kodning', 'Autentifikation', 'Sikker autentifikation og sessionhandtering', 'Secure authentication and session handling',
    'Applikationer skal implementere sikker autentifikation med beskyttelse mod brute force, credential stuffing og sessionkapring.',
    'Applications must implement secure authentication with protection against brute force, credential stuffing, and session hijacking.',
    '8.5', null, 'Krav');

  add('Sikker kodning', 'Hemmeligheder', 'Handtering af hemmeligheder i kode', 'Handling of secrets in code',
    'Adgangskoder, API-noegler og andre hemmeligheder ma aldrig hardkodes i kildekoden. Anvend hemmeligheds-vaults eller miljoevariabler.',
    'Passwords, API keys, and other secrets must never be hardcoded in source code. Use secrets vaults or environment variables.',
    '8.24', null, 'Krav');

  add('Sikker kodning', 'Kryptografi', 'Korrekt brug af kryptografi', 'Correct use of cryptography',
    'Udviklere skal anvende etablerede kryptografiske biblioteker og algoritmer. Hjemmelavede krypteringsloesninger er forbudt.',
    'Developers must use established cryptographic libraries and algorithms. Homegrown encryption solutions are prohibited.',
    '8.24', null, 'Krav');

  // === Kodegennemgang og test (Code Review and Testing) ===
  add('Kodegennemgang og test', 'SAST', 'Statisk kodeanalyse (SAST)', 'Static code analysis (SAST)',
    'Al kode skal scannes med statiske analysevaerktojer (SAST) som del af CI/CD-pipelinen. Kritiske fund skal blokere deployment.',
    'All code must be scanned with static analysis tools (SAST) as part of the CI/CD pipeline. Critical findings must block deployment.',
    '8.25', 'Integrer SAST i pull request-processen. Definer kvalitetsgates baseret pa sarbarhedens alvorsgrad.', 'Krav');

  add('Kodegennemgang og test', 'DAST', 'Dynamisk applikationstest (DAST)', 'Dynamic application testing (DAST)',
    'Webapplikationer skal testes med DAST-vaerktojer i staging-miljoeet foer produktionsudrulning.',
    'Web applications must be tested with DAST tools in the staging environment before production deployment.',
    '8.29', null, 'Krav');

  add('Kodegennemgang og test', 'SCA', 'Software Composition Analysis (SCA)', 'Software Composition Analysis (SCA)',
    'Tredjepartsafhaengigheder skal scannes for kendte sarbarheder med SCA-vaerktojer. Kritiske sarbarheder skal udbedres inden release.',
    'Third-party dependencies must be scanned for known vulnerabilities with SCA tools. Critical vulnerabilities must be remediated before release.',
    '8.28', null, 'Krav');

  add('Kodegennemgang og test', 'Peer review', 'Sikkerhedsfokuseret kodegennemgang', 'Security-focused code review',
    'Alle kodeaendringer skal gennemga peer review med fokus pa sikkerhed foer merge til hovedgrenen.',
    'All code changes must undergo peer review with a focus on security before merging to the main branch.',
    '8.25', null, 'Krav');

  add('Kodegennemgang og test', 'Pentest', 'Penetrationstest af applikationer', 'Penetration testing of applications',
    'Kritiske applikationer skal underkastes penetrationstest af kvalificerede testere mindst arligt og efter vesentlige aendringer.',
    'Critical applications must undergo penetration testing by qualified testers at least annually and after significant changes.',
    '8.29', null, 'Krav');

  // === Sikker CI/CD (Secure CI/CD) ===
  add('Sikker CI/CD', 'Pipeline', 'Sikkerhed i CI/CD-pipeline', 'Security in CI/CD pipeline',
    'CI/CD-pipelinen skal beskyttes mod manipulation med adgangskontrol, signerede artefakter og audit-logning af alle handlinger.',
    'The CI/CD pipeline must be protected against tampering with access control, signed artifacts, and audit logging of all actions.',
    '8.25', null, 'Krav');

  add('Sikker CI/CD', 'Pipeline', 'Automatiserede sikkerhedsgates', 'Automated security gates',
    'CI/CD-pipelinen skal have automatiserede sikkerhedsgates der forhindrer deployment af kode med kritiske sarbarheder.',
    'The CI/CD pipeline must have automated security gates that prevent deployment of code with critical vulnerabilities.',
    '8.25', null, 'Krav');

  add('Sikker CI/CD', 'Artefakter', 'Signering af build-artefakter', 'Signing of build artifacts',
    'Build-artefakter inklusiv container-images skal signeres digitalt for at sikre integritet fra build til deployment.',
    'Build artifacts including container images must be digitally signed to ensure integrity from build to deployment.',
    '8.28', null, 'Anbefaling');

  // === Sarbarhedshandtering (Vulnerability Management) ===
  add('Sarbarhedshandtering', 'Disclosure', 'Ansvarlig saerbarhedsrapportering', 'Responsible vulnerability disclosure',
    'Organisationen skal have en offentlig politik og kontaktkanal for ansvarlig saerbarhedsrapportering (security.txt).',
    'The organization must have a public policy and contact channel for responsible vulnerability disclosure (security.txt).',
    '8.8', 'Opret security.txt-fil pa webapplikationer. Definer tidsrammer for bekraeftelse og udbedring.', 'Krav');

  add('Sarbarhedshandtering', 'Patching', 'Sikkerhedsopdateringer af afhaengigheder', 'Security updates of dependencies',
    'Afhaengigheder med kendte sarbarheder skal opdateres inden for definerede tidsrammer baseret pa CVSS-alvorsgrad.',
    'Dependencies with known vulnerabilities must be updated within defined timeframes based on CVSS severity.',
    '8.8', null, 'Krav');

  return controls;
}

async function main(): Promise<void> {
  console.log('CFCS Secure Development Ingestion');
  const controls = generateControls();
  console.log(`Generated ${controls.length} controls`);
  mkdirSync(DATA_DIR, { recursive: true });
  const output = {
    framework: {
      id: 'cfcs-secure-dev',
      name: 'CFCS Secure Software Development Guidance',
      name_nl: 'CFCS Vejledning om sikker softwareudvikling',
      issuing_body: 'Center for Cybersikkerhed (CFCS)',
      version: '2024',
      effective_date: '2024-01-01',
      scope: 'Guidance for secure software development practices in Danish organizations',
      scope_sectors: ['government', 'healthcare', 'finance', 'digital_infrastructure'],
      structure_description: 'Guidance organized by secure development domains: secure SDLC, secure coding, code review and testing, secure CI/CD, and vulnerability management.',
      source_url: 'https://www.cfcs.dk/da/forebyggelse/vejledninger/sikker-softwareudvikling/',
      license: 'Public sector publication',
      language: 'da+en',
    },
    controls,
    metadata: { ingested_at: new Date().toISOString(), source: 'CFCS vejledning om sikker softwareudvikling', total_controls: controls.length },
  };
  writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2), 'utf-8');
  console.log(`Output: ${OUTPUT_FILE}`);
}

main().catch((err) => { console.error('Fatal:', err); process.exit(1); });
