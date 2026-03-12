// scripts/ingest-trafikstyrelsen.ts
// Trafikstyrelsens krav til transportsektorens IKT-sikkerhed

import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'data', 'extracted');
const OUTPUT_FILE = join(DATA_DIR, 'trafikstyrelsen-ikt.json');

interface Control {
  control_number: string; title: string; title_nl: string; description: string; description_nl: string;
  category: string; subcategory: string | null; level: string | null; iso_mapping: string | null;
  implementation_guidance: string | null; verification_guidance: string | null; source_url: string;
}

function generateControls(): Control[] {
  const controls: Control[] = [];
  let seq = 1;
  function add(cat: string, sub: string | null, tDa: string, tEn: string, dDa: string, dEn: string, iso: string | null, guide: string | null, level: string | null) {
    controls.push({ control_number: `TS${seq.toString().padStart(2, '0')}`, title: tEn, title_nl: tDa, description: dEn, description_nl: dDa, category: cat, subcategory: sub, level: level ?? 'Krav', iso_mapping: iso, implementation_guidance: guide, verification_guidance: null, source_url: 'https://www.trafikstyrelsen.dk/da/it-sikkerhed/' });
    seq++;
  }

  // === Governance ===
  add('Governance', 'Politik', 'Cybersikkerhedspolitik for transportvirksomheder', 'Cybersecurity policy for transport companies',
    'Transportvirksomheder omfattet af NIS2 skal have en godkendt cybersikkerhedspolitik der daekker bade IT- og operationelle systemer.',
    'Transport companies covered by NIS2 must have an approved cybersecurity policy covering both IT and operational systems.',
    '5.1', null, 'Krav');

  add('Governance', 'Risiko', 'Risikovurdering for transportsystemer', 'Risk assessment for transport systems',
    'Transportvirksomheder skal gennemfoere risikovurdering med saerligt fokus pa safety-kritiske systemer og deres cybersikkerhed.',
    'Transport companies must conduct risk assessment with particular focus on safety-critical systems and their cybersecurity.',
    '5.7', null, 'Krav');

  // === Operationel sikkerhed (Operational Security) ===
  add('Operationel sikkerhed', 'Jernbane', 'Cybersikkerhed for jernbanesystemer', 'Cybersecurity for railway systems',
    'Jernbanesystemer inklusiv signalsystemer, togkontrol og stationssystemer skal beskyttes mod cyberangreb med saerlig hensyn til safety.',
    'Railway systems including signaling systems, train control, and station systems must be protected against cyber attacks with particular regard to safety.',
    '8.22', 'Foelg CLC/TS 50701 standarden for cybersikkerhed i jernbanesystemer. Implementer sikkerhedszoner.', 'Krav');

  add('Operationel sikkerhed', 'Jernbane', 'ERTMS/ETCS-sikkerhed', 'ERTMS/ETCS security',
    'European Rail Traffic Management System (ERTMS) og European Train Control System (ETCS) installationer skal beskyttes mod cybertrusler.',
    'European Rail Traffic Management System (ERTMS) and European Train Control System (ETCS) installations must be protected against cyber threats.',
    '8.22', null, 'Krav');

  add('Operationel sikkerhed', 'Luftfart', 'Cybersikkerhed i luftfartssystemer', 'Cybersecurity in aviation systems',
    'Luftfartsoperatoerer skal implementere cybersikkerhed i henhold til EASA-krav og nationale supplerende bestemmelser.',
    'Aviation operators must implement cybersecurity in accordance with EASA requirements and national supplementary provisions.',
    '5.1', null, 'Krav');

  add('Operationel sikkerhed', 'Maritim', 'Maritim cybersikkerhed', 'Maritime cybersecurity',
    'Rederier og havne skal implementere cybersikkerhed i overensstemmelse med IMOs retningslinjer for maritim cybersikkerhed.',
    'Shipping companies and ports must implement cybersecurity in accordance with IMO guidelines for maritime cybersecurity.',
    '5.1', null, 'Krav');

  add('Operationel sikkerhed', 'Vejtransport', 'Cybersikkerhed for intelligent transportsystemer (ITS)', 'Cybersecurity for intelligent transport systems (ITS)',
    'Intelligente transportsystemer inklusiv trafikstyring og tunnelsikkerhed skal beskyttes med cybersikkerhedsforanstaltninger.',
    'Intelligent transport systems including traffic management and tunnel safety must be protected with cybersecurity measures.',
    '8.22', null, 'Krav');

  // === Haendelseshaandtering (Incident Management) ===
  add('Haendelseshaandtering', 'Rapportering', 'Rapportering af cyberhaendelser i transportsektoren', 'Reporting of cyber incidents in transport sector',
    'Vasentlige cyberhaendelser i transportsektoren skal rapporteres til Trafikstyrelsen og CFCS inden for NIS2-fristerne.',
    'Significant cyber incidents in the transport sector must be reported to the Danish Transport Authority and CFCS within NIS2 deadlines.',
    '5.26', null, 'Krav');

  add('Haendelseshaandtering', 'Beredskab', 'Transportspecifik cyberberedskabsplan', 'Transport-specific cyber contingency plan',
    'Transportvirksomheder skal have en cyberberedskabsplan der adresserer bade cybersikkerhed og safety-konsekvenser.',
    'Transport companies must have a cyber contingency plan that addresses both cybersecurity and safety consequences.',
    '5.24', null, 'Krav');

  // === Safety/Security-integration ===
  add('Safety-Security', 'Integration', 'Integration af safety og cybersecurity', 'Integration of safety and cybersecurity',
    'Cybersikkerhedsforanstaltninger i transportsektoren skal integreres med safety management systemer for at sikre at sikkerhedstiltag ikke kompromitterer fysisk sikkerhed.',
    'Cybersecurity measures in the transport sector must be integrated with safety management systems to ensure security measures do not compromise physical safety.',
    '8.27', null, 'Krav');

  add('Safety-Security', 'Integration', 'Cybersikkerhed i safety-certificering', 'Cybersecurity in safety certification',
    'Cybersikkerhed skal indga som element i safety-certificering af transportinfrastruktur og -systemer.',
    'Cybersecurity must be included as an element in safety certification of transport infrastructure and systems.',
    '8.29', null, 'Krav');

  // === Leverandoerstyring ===
  add('Leverandoerstyring', 'Krav', 'Sikkerhedskrav til transportleverandoerer', 'Security requirements for transport vendors',
    'Leverandoerer af IT- og OT-systemer til transportsektoren skal overholde specifikke cybersikkerhedskrav defineret af Trafikstyrelsen.',
    'Vendors of IT and OT systems for the transport sector must comply with specific cybersecurity requirements defined by the Transport Authority.',
    '5.19', null, 'Krav');

  return controls;
}

async function main(): Promise<void> {
  console.log('Trafikstyrelsen ICT Security Ingestion');
  const controls = generateControls();
  console.log(`Generated ${controls.length} controls`);
  mkdirSync(DATA_DIR, { recursive: true });
  const output = {
    framework: {
      id: 'trafikstyrelsen-ikt',
      name: 'Danish Transport Authority ICT Security Requirements',
      name_nl: 'Trafikstyrelsens krav til transportsektorens IKT-sikkerhed',
      issuing_body: 'Trafikstyrelsen',
      version: '2025',
      effective_date: '2025-01-01',
      scope: 'ICT security requirements for Danish transport sector including railway, aviation, maritime, and road transport',
      scope_sectors: ['transport'],
      structure_description: 'Requirements organized by domains: governance, operational security per transport mode, incident management, safety/security integration, and supply chain.',
      source_url: 'https://www.trafikstyrelsen.dk/da/it-sikkerhed/',
      license: 'Public sector publication',
      language: 'da+en',
    },
    controls,
    metadata: { ingested_at: new Date().toISOString(), source: 'Trafikstyrelsens IKT-sikkerhedskrav for transportsektoren', total_controls: controls.length },
  };
  writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2), 'utf-8');
  console.log(`Output: ${OUTPUT_FILE}`);
}

main().catch((err) => { console.error('Fatal:', err); process.exit(1); });
