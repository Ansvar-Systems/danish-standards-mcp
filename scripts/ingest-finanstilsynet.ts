// scripts/ingest-finanstilsynet.ts
// Finanstilsynets IKT-krav og vejledning om IT-sikkerhed for finansielle virksomheder

import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'data', 'extracted');
const OUTPUT_FILE = join(DATA_DIR, 'finanstilsynet-ikt.json');

interface Control {
  control_number: string; title: string; title_nl: string; description: string; description_nl: string;
  category: string; subcategory: string | null; level: string | null; iso_mapping: string | null;
  implementation_guidance: string | null; verification_guidance: string | null; source_url: string;
}

function generateControls(): Control[] {
  const controls: Control[] = [];
  let seq = 1;
  function add(cat: string, sub: string | null, tDa: string, tEn: string, dDa: string, dEn: string, iso: string | null, guide: string | null, level: string | null) {
    controls.push({ control_number: `FT${seq.toString().padStart(2, '0')}`, title: tEn, title_nl: tDa, description: dEn, description_nl: dDa, category: cat, subcategory: sub, level: level ?? 'Krav', iso_mapping: iso, implementation_guidance: guide, verification_guidance: null, source_url: 'https://www.finanstilsynet.dk/lovgivning/vejledninger-og-tilsynsafgoerelser/' });
    seq++;
  }

  // === IKT-governance (ICT Governance) ===
  add('IKT-governance', 'Ledelsesansvar', 'Bestyrelsens ansvar for IKT-risikostyring', 'Board responsibility for ICT risk management',
    'Bestyrelsen skal godkende og regelmaeessigt gennemga organisationens IKT-risikostyringsstrategi og sikre at der er tilstraekkelige ressourcer.',
    'The board must approve and regularly review the organization ICT risk management strategy and ensure adequate resources are allocated.',
    '5.1', 'Bestyrelsen skal orienteres minimum kvartalsmaeessigt om IKT-risikosituationen. IKT-risiko skal indga i den overordnede risikostyring.', 'Krav');

  add('IKT-governance', 'Ledelsesansvar', 'IKT-risikostyringsfunktion', 'ICT risk management function',
    'Virksomheden skal have en dedikeret IKT-risikostyringsfunktion med tilstraekkeligt uafhaengighed, kompetence og ressourcer.',
    'The company must have a dedicated ICT risk management function with sufficient independence, competence, and resources.',
    '5.2', null, 'Krav');

  add('IKT-governance', 'Politik', 'IKT-sikkerhedspolitik for finansielle virksomheder', 'ICT security policy for financial companies',
    'Virksomheden skal have en godkendt IKT-sikkerhedspolitik der fastlaegger rammer for informationssikkerhed og er baseret pa risikovurdering.',
    'The company must have an approved ICT security policy that establishes the framework for information security and is based on risk assessment.',
    '5.1', null, 'Krav');

  // === IKT-risikostyring (ICT Risk Management) ===
  add('IKT-risikostyring', 'Risikovurdering', 'IKT-risikovurdering og -behandling', 'ICT risk assessment and treatment',
    'Virksomheden skal gennemfoere regelmaeessig IKT-risikovurdering og implementere risikoreducerende foranstaltninger for identificerede risici.',
    'The company must conduct regular ICT risk assessment and implement risk-reducing measures for identified risks.',
    '5.7', null, 'Krav');

  add('IKT-risikostyring', 'Aktiver', 'IKT-aktivoversigt og klassifikation', 'ICT asset inventory and classification',
    'Virksomheden skal opretholde en komplet oversigt over alle IKT-aktiver og klassificere dem efter kritikalitet og risiko.',
    'The company must maintain a complete inventory of all ICT assets and classify them by criticality and risk.',
    '5.9', null, 'Krav');

  add('IKT-risikostyring', 'Trussel', 'IKT-trussels- og sarbarhedsvurdering', 'ICT threat and vulnerability assessment',
    'Virksomheden skal loebende vurdere trusler og sarbarheder mod sine IKT-systemer med saerligt fokus pa kritiske forretningssystemer.',
    'The company must continuously assess threats and vulnerabilities against its ICT systems with particular focus on critical business systems.',
    '8.8', null, 'Krav');

  // === IKT-sikkerhed (ICT Security) ===
  add('IKT-sikkerhed', 'Adgang', 'Adgangsstyring i finansielle systemer', 'Access control in financial systems',
    'Adgang til finansielle systemer skal styres baseret pa roller og mindste-privilegium-princippet med MFA for alle kritiske systemer.',
    'Access to financial systems must be managed based on roles and the principle of least privilege with MFA for all critical systems.',
    '8.5', null, 'Krav');

  add('IKT-sikkerhed', 'Adgang', 'Privilegeret adgangsstyring i finanssektoren', 'Privileged access management in financial sector',
    'Privilegerede konti skal administreres via PAM-loesning med just-in-time adgang, sessionoptagelse og automatisk rotation.',
    'Privileged accounts must be managed via PAM solution with just-in-time access, session recording, and automatic rotation.',
    '8.2', null, 'Krav');

  add('IKT-sikkerhed', 'Netvaerk', 'Netvaerkssikkerhed for finansielle systemer', 'Network security for financial systems',
    'Finansielle systemer skal beskyttes med segmenterede netvaerk, IDS/IPS og krypteret kommunikation mellem alle systemkomponenter.',
    'Financial systems must be protected with segmented networks, IDS/IPS, and encrypted communication between all system components.',
    '8.22', null, 'Krav');

  add('IKT-sikkerhed', 'Kryptering', 'Kryptering af finansielle data', 'Encryption of financial data',
    'Finansielle data skal krypteres i transit og i hvile med godkendte krypteringsalgoritmer. Krypteringsnoegler skal styres formelt.',
    'Financial data must be encrypted in transit and at rest with approved encryption algorithms. Encryption keys must be formally managed.',
    '8.24', null, 'Krav');

  add('IKT-sikkerhed', 'Logning', 'Audit trail for finansielle transaktioner', 'Audit trail for financial transactions',
    'Alle finansielle transaktioner og administrative handlinger skal logges med komplet audit trail der opbevares i mindst 5 ar.',
    'All financial transactions and administrative actions must be logged with a complete audit trail retained for at least 5 years.',
    '8.15', null, 'Krav');

  // === Outsourcing af IKT (ICT Outsourcing) ===
  add('IKT-outsourcing', 'Vurdering', 'Risikovurdering af IKT-outsourcing', 'Risk assessment of ICT outsourcing',
    'Foer outsourcing af kritiske IKT-funktioner skal virksomheden gennemfoere en grundig risikovurdering inklusiv vurdering af leverandoerens soliditet.',
    'Before outsourcing critical ICT functions, the company must conduct a thorough risk assessment including evaluation of the vendor financial stability.',
    '5.19', null, 'Krav');

  add('IKT-outsourcing', 'Kontrol', 'Kontrol med IKT-outsourcingaftaler', 'Control of ICT outsourcing agreements',
    'Outsourcingaftaler skal indeholde specifikke IKT-sikkerhedskrav, auditrettigheder og krav om rapportering af vasentlige haendelser.',
    'Outsourcing agreements must contain specific ICT security requirements, audit rights, and requirements for reporting significant incidents.',
    '5.20', null, 'Krav');

  add('IKT-outsourcing', 'Cloud', 'Cloud-outsourcing for finansielle virksomheder', 'Cloud outsourcing for financial companies',
    'Ved brug af cloud-tjenester skal virksomheden sikre at Finanstilsynets krav til outsourcing overholdes inklusiv dataplacering og auditadgang.',
    'When using cloud services, the company must ensure compliance with the FSA outsourcing requirements including data location and audit access.',
    '5.19', 'Anmeld vasentlig IKT-outsourcing til Finanstilsynet. Sikr at data opbevares inden for EU/EOS.', 'Krav');

  add('IKT-outsourcing', 'Underentreprise', 'Styring af videre-outsourcing', 'Management of sub-outsourcing',
    'Virksomheden skal have godkendelsesret over leverandoerens videre-outsourcing af kritiske IKT-tjenester.',
    'The company must have approval rights over the vendor sub-outsourcing of critical ICT services.',
    '5.21', null, 'Krav');

  // === IKT-haendelseshandtering (ICT Incident Management) ===
  add('IKT-haendelseshandtering', 'Proces', 'IKT-incidenthaandteringsproces', 'ICT incident handling process',
    'Virksomheden skal have en dokumenteret IKT-incidenthandteringsproces med klare roller, eskalering og kommunikationsplaner.',
    'The company must have a documented ICT incident handling process with clear roles, escalation, and communication plans.',
    '5.24', null, 'Krav');

  add('IKT-haendelseshandtering', 'Rapportering', 'Rapportering af IKT-haendelser til Finanstilsynet', 'Reporting of ICT incidents to FSA',
    'Vasentlige IKT-haendelser skal rapporteres til Finanstilsynet inden for de fastsatte tidsfrister i henhold til bekendtgorelse om rapportering.',
    'Significant ICT incidents must be reported to the FSA within the established deadlines in accordance with the reporting executive order.',
    '5.26', 'Rapporter via Finanstilsynets digitale indberetningsloesning. Foelg op med root cause-analyse.', 'Krav');

  // === IKT-kontinuitet (ICT Continuity) ===
  add('IKT-kontinuitet', 'BCP', 'IKT-beredskabsplan for finansielle virksomheder', 'ICT contingency plan for financial companies',
    'Virksomheden skal have en IKT-beredskabsplan der sikrer fortsat drift af kritiske finansielle tjenester ved IKT-forstyrrelser.',
    'The company must have an ICT contingency plan that ensures continued operation of critical financial services during ICT disruptions.',
    '5.30', null, 'Krav');

  add('IKT-kontinuitet', 'Test', 'Test af IKT-beredskabsplaner', 'Testing of ICT contingency plans',
    'IKT-beredskabsplaner skal testes mindst arligt med realistiske scenarier inklusiv cyberangreb og leverandoernedbrud.',
    'ICT contingency plans must be tested at least annually with realistic scenarios including cyber attacks and vendor outages.',
    '5.30', null, 'Krav');

  add('IKT-kontinuitet', 'Backup', 'Backup og gendannelse af finansielle data', 'Backup and recovery of financial data',
    'Finansielle data skal sikkerhedskopieres med definerede RPO og RTO. Gendannelse skal testes regelmaeessigt.',
    'Financial data must be backed up with defined RPO and RTO. Recovery must be tested regularly.',
    '8.13', null, 'Krav');

  // === DORA-implementering (DORA Implementation) ===
  add('DORA-implementering', 'Ramme', 'IKT-risikostyringsramme (DORA art. 6)', 'ICT risk management framework (DORA Art. 6)',
    'Virksomheden skal implementere en IKT-risikostyringsramme i henhold til DORA med strategier, politikker og procedurer for digital operationel resiliens.',
    'The company must implement an ICT risk management framework in accordance with DORA with strategies, policies, and procedures for digital operational resilience.',
    '5.1', 'Implementer DORA-krav trinvist. Start med gap-analyse mod nuvaerende IKT-governance.', 'Krav');

  add('DORA-implementering', 'Test', 'Trusselsbaseret penetrationstest (TLPT)', 'Threat-led penetration testing (TLPT)',
    'Systemisk vigtige finansielle virksomheder skal gennemfoere trusselsbaseret penetrationstest (TLPT) mindst hvert tredje ar.',
    'Systemically important financial companies must conduct threat-led penetration testing (TLPT) at least every three years.',
    '8.29', null, 'Krav');

  add('DORA-implementering', 'Rapportering', 'IKT-incidentrapportering under DORA', 'ICT incident reporting under DORA',
    'Vasentlige IKT-relaterede haendelser skal rapporteres til Finanstilsynet inden for de tidsfrister DORA fastsaetter (initial inden 4 timer).',
    'Significant ICT-related incidents must be reported to the FSA within the deadlines DORA establishes (initial within 4 hours).',
    '5.26', null, 'Krav');

  add('DORA-implementering', 'Tredjeparter', 'Styring af IKT-tredjepartsrisiko (DORA)', 'ICT third-party risk management (DORA)',
    'Virksomheden skal have et register over alle IKT-tredjepartsudbydere og vurdere risici forbundet med koncentration og afhaengighed.',
    'The company must maintain a register of all ICT third-party providers and assess risks associated with concentration and dependency.',
    '5.19', null, 'Krav');

  return controls;
}

async function main(): Promise<void> {
  console.log('Finanstilsynet ICT Requirements Ingestion');
  const controls = generateControls();
  console.log(`Generated ${controls.length} controls`);
  mkdirSync(DATA_DIR, { recursive: true });
  const output = {
    framework: {
      id: 'finanstilsynet-ikt',
      name: 'Finanstilsynet ICT Requirements',
      name_nl: 'Finanstilsynets IKT-krav',
      issuing_body: 'Finanstilsynet (Danish FSA)',
      version: '2025',
      effective_date: '2025-01-17',
      scope: 'ICT security and risk management requirements for Danish financial companies including DORA implementation',
      scope_sectors: ['finance'],
      structure_description: 'Requirements organized by domains: ICT governance, risk management, ICT security, outsourcing, incident management, continuity, and DORA implementation.',
      source_url: 'https://www.finanstilsynet.dk/lovgivning/vejledninger-og-tilsynsafgoerelser/',
      license: 'Public sector publication',
      language: 'da+en',
    },
    controls,
    metadata: { ingested_at: new Date().toISOString(), source: 'Finanstilsynets IKT-krav og DORA-implementering', total_controls: controls.length },
  };
  writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2), 'utf-8');
  console.log(`Output: ${OUTPUT_FILE}`);
}

main().catch((err) => { console.error('Fatal:', err); process.exit(1); });
