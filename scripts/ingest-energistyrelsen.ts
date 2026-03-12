// scripts/ingest-energistyrelsen.ts
// Energistyrelsens cybersikkerhedskrav for energisektoren

import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'data', 'extracted');
const OUTPUT_FILE = join(DATA_DIR, 'energistyrelsen-cyber.json');

interface Control {
  control_number: string; title: string; title_nl: string; description: string; description_nl: string;
  category: string; subcategory: string | null; level: string | null; iso_mapping: string | null;
  implementation_guidance: string | null; verification_guidance: string | null; source_url: string;
}

function generateControls(): Control[] {
  const controls: Control[] = [];
  let seq = 1;
  function add(cat: string, sub: string | null, tDa: string, tEn: string, dDa: string, dEn: string, iso: string | null, guide: string | null, level: string | null) {
    controls.push({ control_number: `EN${seq.toString().padStart(2, '0')}`, title: tEn, title_nl: tDa, description: dEn, description_nl: dDa, category: cat, subcategory: sub, level: level ?? 'Krav', iso_mapping: iso, implementation_guidance: guide, verification_guidance: null, source_url: 'https://ens.dk/ansvarsomraader/cybersikkerhed/' });
    seq++;
  }

  // === Governance ===
  add('Governance', 'Ledelse', 'Ledelsesansvar for cybersikkerhed i energisektoren', 'Management responsibility for cybersecurity in energy sector',
    'Ledelsen i energivirksomheder skal godkende og loebende overvage cybersikkerhedsforanstaltninger i henhold til NIS2/sektorregulering.',
    'Management in energy companies must approve and continuously monitor cybersecurity measures in accordance with NIS2/sector regulation.',
    '5.1', null, 'Krav');

  add('Governance', 'Politik', 'Cybersikkerhedspolitik for energivirksomheder', 'Cybersecurity policy for energy companies',
    'Energivirksomheder skal have en dokumenteret cybersikkerhedspolitik der adresserer bade IT- og OT-miljoeer.',
    'Energy companies must have a documented cybersecurity policy that addresses both IT and OT environments.',
    '5.1', null, 'Krav');

  add('Governance', 'Risiko', 'Risikovurdering for kritisk energiinfrastruktur', 'Risk assessment for critical energy infrastructure',
    'Energivirksomheder skal gennemfoere regelmaessig risikovurdering med saerligt fokus pa OT-systemer og deres forbindelse til IT-netvaerk.',
    'Energy companies must conduct regular risk assessment with particular focus on OT systems and their connection to IT networks.',
    '5.7', null, 'Krav');

  // === OT-sikkerhed (OT Security) ===
  add('OT-sikkerhed', 'SCADA', 'Sikkerhed for SCADA-systemer', 'Security for SCADA systems',
    'SCADA-systemer i energisektoren skal beskyttes med netvaerksisolering, adgangskontrol og overvagning i henhold til IEC 62351 og IEC 62443.',
    'SCADA systems in the energy sector must be protected with network isolation, access control, and monitoring in accordance with IEC 62351 and IEC 62443.',
    '8.22', 'Implementer DMZ mellem SCADA og virksomhedsnetvaerk. Anvend unidirektionelle gateways for dataoverfoersel.', 'Krav');

  add('OT-sikkerhed', 'SCADA', 'Fjernadgang til SCADA og kontrolsystemer', 'Remote access to SCADA and control systems',
    'Fjernadgang til SCADA-systemer skal begraenses og ske via dedikerede, krypterede forbindelser med MFA og sessionovervagning.',
    'Remote access to SCADA systems must be restricted and use dedicated, encrypted connections with MFA and session monitoring.',
    '8.20', null, 'Krav');

  add('OT-sikkerhed', 'SmartGrid', 'Smart grid-sikkerhed', 'Smart grid security',
    'Smart grid-komponenter inklusiv smarte maalere og distributionsautomatisering skal beskyttes med kryptering og autentifikation.',
    'Smart grid components including smart meters and distribution automation must be protected with encryption and authentication.',
    '8.24', null, 'Krav');

  add('OT-sikkerhed', 'Haerdning', 'Haerdning af energi-OT-systemer', 'Hardening of energy OT systems',
    'OT-systemer i energisektoren skal haerdes med deaktivering af unoedvendige tjenester, standardadgangskoder og ikke-anvendte protokoller.',
    'OT systems in the energy sector must be hardened by disabling unnecessary services, default credentials, and unused protocols.',
    '8.9', null, 'Krav');

  // === Haendelseshaandtering (Incident Management) ===
  add('Haendelseshaandtering', 'Rapportering', 'Rapportering af cyberhaendelser til Energistyrelsen', 'Reporting cyber incidents to Danish Energy Agency',
    'Vasentlige cyberhaendelser i energisektoren skal rapporteres til Energistyrelsen og SektorCERT inden for NIS2-fristerne.',
    'Significant cyber incidents in the energy sector must be reported to the Danish Energy Agency and SectorCERT within NIS2 deadlines.',
    '5.26', 'Foelg SektorCERTs rapporteringsskabelon. Tidlig advarsel inden 24 timer, fuld underretning inden 72 timer.', 'Krav');

  add('Haendelseshaandtering', 'SektorCERT', 'Tilslutning til SektorCERT', 'Connection to SectorCERT',
    'Energivirksomheder skal vaere tilsluttet SektorCERT for at modtage trusselsadvarsler og dele information om cybertrusler.',
    'Energy companies must be connected to SectorCERT to receive threat warnings and share information about cyber threats.',
    '5.5', null, 'Krav');

  add('Haendelseshaandtering', 'Beredskab', 'Cyberberedskabsplan for energisektoren', 'Cyber contingency plan for energy sector',
    'Energivirksomheder skal have en cyberberedskabsplan der adresserer scenarier med cyberangreb mod produktions- og distributionssystemer.',
    'Energy companies must have a cyber contingency plan addressing scenarios with cyber attacks on production and distribution systems.',
    '5.24', null, 'Krav');

  // === Forsyningssikkerhed (Supply Security) ===
  add('Forsyningssikkerhed', 'Kontinuitet', 'Driftskontinuitet for kritiske energisystemer', 'Operational continuity for critical energy systems',
    'Kritiske energisystemer skal have redundans og beredskabsplaner der sikrer forsyningskontinuitet ved cyberhaendelser.',
    'Critical energy systems must have redundancy and contingency plans ensuring supply continuity during cyber incidents.',
    '5.30', null, 'Krav');

  add('Forsyningssikkerhed', 'Backup', 'Backup og gendannelse af kontrolsystemer', 'Backup and recovery of control systems',
    'Konfigurationer og software for energikontrolsystemer skal sikkerhedskopieres regelmaessigt med offline-opbevaring.',
    'Configurations and software for energy control systems must be regularly backed up with offline storage.',
    '8.13', null, 'Krav');

  add('Forsyningssikkerhed', 'Oevelser', 'Cybersikkerhedsoevelser for energisektoren', 'Cybersecurity exercises for energy sector',
    'Energivirksomheder skal deltage i sektoroevelser koordineret af SektorCERT og Energistyrelsen mindst arligt.',
    'Energy companies must participate in sector exercises coordinated by SectorCERT and the Danish Energy Agency at least annually.',
    '5.30', null, 'Krav');

  // === Leverandoerstyring (Supply Chain) ===
  add('Leverandoerstyring', 'Leverandoerer', 'Sikkerhedskrav til energileverandoerer', 'Security requirements for energy vendors',
    'Leverandoerer af udstyr og software til energisektoren skal overholde specifikke sikkerhedskrav og gennemga sikkerhedsvurdering.',
    'Vendors of equipment and software for the energy sector must comply with specific security requirements and undergo security assessment.',
    '5.19', null, 'Krav');

  add('Leverandoerstyring', 'Leverandoerer', 'Sikkerhed i energiforsyningskaeden', 'Security in energy supply chain',
    'Energivirksomheder skal vurdere cybersikkerhedsrisici i hele forsyningskaeden inklusiv hardware-, software- og serviceleverandoerer.',
    'Energy companies must assess cybersecurity risks throughout the supply chain including hardware, software, and service vendors.',
    '5.19', null, 'Krav');

  return controls;
}

async function main(): Promise<void> {
  console.log('Energistyrelsen Cybersecurity Ingestion');
  const controls = generateControls();
  console.log(`Generated ${controls.length} controls`);
  mkdirSync(DATA_DIR, { recursive: true });
  const output = {
    framework: {
      id: 'energistyrelsen-cyber',
      name: 'Danish Energy Agency Cybersecurity Requirements',
      name_nl: 'Energistyrelsens cybersikkerhedskrav',
      issuing_body: 'Energistyrelsen',
      version: '2025',
      effective_date: '2025-01-01',
      scope: 'Cybersecurity requirements for Danish energy sector operators including electricity, gas, oil, and district heating',
      scope_sectors: ['energy'],
      structure_description: 'Requirements organized by domains: governance, OT security, incident management, supply security, and supply chain.',
      source_url: 'https://ens.dk/ansvarsomraader/cybersikkerhed/',
      license: 'Public sector publication',
      language: 'da+en',
    },
    controls,
    metadata: { ingested_at: new Date().toISOString(), source: 'Energistyrelsens cybersikkerhedskrav for energisektoren', total_controls: controls.length },
  };
  writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2), 'utf-8');
  console.log(`Output: ${OUTPUT_FILE}`);
}

main().catch((err) => { console.error('Fatal:', err); process.exit(1); });
