// scripts/ingest-nis2-dk.ts
// Danish NIS2 transposition (Lov om net- og informationssikkerhed / L 111)

import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'data', 'extracted');
const OUTPUT_FILE = join(DATA_DIR, 'nis2-dk.json');

interface Control {
  control_number: string; title: string; title_nl: string; description: string; description_nl: string;
  category: string; subcategory: string | null; level: string | null; iso_mapping: string | null;
  implementation_guidance: string | null; verification_guidance: string | null; source_url: string;
}

function generateControls(): Control[] {
  const controls: Control[] = [];
  let seq = 1;
  function add(cat: string, sub: string | null, tDa: string, tEn: string, dDa: string, dEn: string, iso: string | null, guide: string | null, level: string | null) {
    controls.push({ control_number: `NIS${seq.toString().padStart(2, '0')}`, title: tEn, title_nl: tDa, description: dEn, description_nl: dDa, category: cat, subcategory: sub, level: level ?? 'Krav', iso_mapping: iso, implementation_guidance: guide, verification_guidance: null, source_url: 'https://www.retsinformation.dk/eli/lta/2024/1705' });
    seq++;
  }

  // === Governance og risikostyring (Governance and Risk Management) ===
  add('Governance', 'Ledelsesansvar', 'Ledelsens ansvar for cybersikkerhed (NIS2 art. 20)', 'Management responsibility for cybersecurity (NIS2 Art. 20)',
    'Ledelsen i vaesentlige og vigtige enheder skal godkende og foeere tilsyn med cybersikkerhedsforanstaltninger og kan holdes ansvarlig for overtraedelser.',
    'Management of essential and important entities must approve and supervise cybersecurity measures and can be held accountable for violations.',
    '5.1', 'Bestyrelsesmedlemmer skal gennemga cybersikkerhedstraening. Dokumenter ledelsens godkendelse af risikostyringsforanstaltninger.', 'Krav');

  add('Governance', 'Ledelsesansvar', 'Ledelsens cybersikkerhedstraening', 'Management cybersecurity training',
    'Medlemmer af ledelsesorganer i NIS2-omfattede enheder skal gennemga cybersikkerhedstraening for at kunne vurdere risici og godkende foranstaltninger.',
    'Members of management bodies in NIS2-covered entities must undergo cybersecurity training to be able to assess risks and approve measures.',
    '6.3', null, 'Krav');

  // === Risikostyringsforanstaltninger (Risk Management Measures - NIS2 Art. 21) ===
  add('Risikostyringsforanstaltninger', 'Politik', 'Politikker for risikoanalyse og informationssikkerhed', 'Policies for risk analysis and information security',
    'Enheden skal have dokumenterede politikker for risikoanalyse og informationssystemsikkerhed der er godkendt af ledelsen.',
    'The entity must have documented policies for risk analysis and information system security approved by management.',
    '5.1', null, 'Krav');

  add('Risikostyringsforanstaltninger', 'Haendelse', 'Haendelseshaandtering', 'Incident handling',
    'Enheden skal have processer til forebyggelse, detektering og reaktion pa haendelser i overensstemmelse med NIS2.',
    'The entity must have processes for prevention, detection, and response to incidents in accordance with NIS2.',
    '5.24', null, 'Krav');

  add('Risikostyringsforanstaltninger', 'Kontinuitet', 'Driftskontinuitet og krisestyring', 'Business continuity and crisis management',
    'Enheden skal have planer for driftskontinuitet inklusiv backup, katastrofegendannelse og krisestyring.',
    'The entity must have business continuity plans including backup, disaster recovery, and crisis management.',
    '5.29', null, 'Krav');

  add('Risikostyringsforanstaltninger', 'Forsyningskaede', 'Forsyningskaedessikkerhed', 'Supply chain security',
    'Enheden skal haandtere sikkerhedsrisici i forsyningskaeden inklusiv direkte leverandoerer og tjenesteudbydere.',
    'The entity must manage security risks in the supply chain including direct suppliers and service providers.',
    '5.19', null, 'Krav');

  add('Risikostyringsforanstaltninger', 'Anskaffelse', 'Sikkerhed i anskaffelse og udvikling', 'Security in procurement and development',
    'Sikkerhed skal integreres i anskaffelse, udvikling og vedligeholdelse af net- og informationssystemer inklusiv sarbarhedshandtering.',
    'Security must be integrated in procurement, development, and maintenance of network and information systems including vulnerability management.',
    '8.25', null, 'Krav');

  add('Risikostyringsforanstaltninger', 'Effektivitet', 'Vurdering af foranstaltningernes effektivitet', 'Assessment of measures effectiveness',
    'Enheden skal have processer til at vurdere effektiviteten af cybersikkerhedsforanstaltninger.',
    'The entity must have processes to assess the effectiveness of cybersecurity measures.',
    '5.7', null, 'Krav');

  add('Risikostyringsforanstaltninger', 'Uddannelse', 'Grundlaeggende cyberhygiejne og traening', 'Basic cyber hygiene and training',
    'Enheden skal implementere grundlaeggende cyberhygiejnepraksisser og cybersikkerhedstraening for alle medarbejdere.',
    'The entity must implement basic cyber hygiene practices and cybersecurity training for all employees.',
    '6.3', null, 'Krav');

  add('Risikostyringsforanstaltninger', 'Kryptografi', 'Brug af kryptografi og kryptering', 'Use of cryptography and encryption',
    'Enheden skal have politikker og procedurer for brug af kryptografi og kryptering til beskyttelse af data.',
    'The entity must have policies and procedures for the use of cryptography and encryption for data protection.',
    '8.24', null, 'Krav');

  add('Risikostyringsforanstaltninger', 'Personalesikkerhed', 'Personalesikkerhed og adgangskontrol', 'Personnel security and access control',
    'Enheden skal have processer for personalesikkerhed, aktiv-forvaltning og adgangskontrolpolitikker.',
    'The entity must have processes for personnel security, asset management, and access control policies.',
    '8.5', null, 'Krav');

  add('Risikostyringsforanstaltninger', 'MFA', 'Multi-faktor- eller kontinuerlig autentifikation', 'Multi-factor or continuous authentication',
    'Enheden skal anvende multi-faktor- eller kontinuerlig autentifikation og sikrede kommunikationsloesninger.',
    'The entity must use multi-factor or continuous authentication and secured communication solutions.',
    '8.5', null, 'Krav');

  // === Haendelsesrapportering (Incident Reporting - NIS2 Art. 23) ===
  add('Haendelsesrapportering', 'Tidlig', 'Tidlig advarsel inden for 24 timer', 'Early warning within 24 hours',
    'Ved en vaesentlig haendelse skal enheden sende en tidlig advarsel til CSIRT/CFCS inden for 24 timer efter at have faaet kendskab til haendelsen.',
    'In a significant incident, the entity must send an early warning to CSIRT/CFCS within 24 hours of becoming aware of the incident.',
    '5.26', 'Etabler intern proces for hurtig eskalering af haendelser. Definer kriterier for vaesentlige haendelser.', 'Krav');

  add('Haendelsesrapportering', 'Underretning', 'Haendelsesunderretning inden for 72 timer', 'Incident notification within 72 hours',
    'En haendelsesunderretning med foerste vurdering inklusiv alvorsgrad og pavirkning skal indsendes inden for 72 timer.',
    'An incident notification with initial assessment including severity and impact must be submitted within 72 hours.',
    '5.26', null, 'Krav');

  add('Haendelsesrapportering', 'Slutrapport', 'Slutrapport inden for en maned', 'Final report within one month',
    'En detaljeret slutrapport med beskrivelse af haendelsen, grundaarsag, afboedningsforanstaltninger og graensoverskridende pavirkning skal indsendes inden for en maned.',
    'A detailed final report describing the incident, root cause, mitigation measures, and cross-border impact must be submitted within one month.',
    '5.27', null, 'Krav');

  // === Tilsyn og haandhaevelse (Supervision and Enforcement) ===
  add('Tilsyn', 'Audit', 'Tilsynsmyndighedens auditbefoejelser', 'Supervisory authority audit powers',
    'Den sektoransvarlige myndighed kan kraeve audit, inspektion og dokumentation af NIS2-compliance hos omfattede enheder.',
    'The sector-responsible authority may require audit, inspection, and documentation of NIS2 compliance from covered entities.',
    '5.35', null, 'Krav');

  add('Tilsyn', 'Sanktioner', 'Sanktioner ved manglende overholdelse', 'Sanctions for non-compliance',
    'Manglende overholdelse af NIS2-forpligtelser kan medfoere administrative boeder pa op til 10 mio. EUR eller 2% af global omsaetning for vaesentlige enheder.',
    'Non-compliance with NIS2 obligations can result in administrative fines of up to EUR 10 million or 2% of global turnover for essential entities.',
    null, null, 'Krav');

  // === Registrering og sektoridentifikation (Registration and Sector Identification) ===
  add('Registrering', 'Identifikation', 'Registrering som NIS2-omfattet enhed', 'Registration as NIS2-covered entity',
    'Enheder omfattet af NIS2 skal registrere sig hos den relevante sektormyndighed med oplysninger om virksomhed, kontaktpunkter og IP-intervaller.',
    'Entities covered by NIS2 must register with the relevant sector authority with information about the company, contact points, and IP ranges.',
    null, null, 'Krav');

  add('Registrering', 'Klassifikation', 'Klassifikation som vaesentlig eller vigtig enhed', 'Classification as essential or important entity',
    'Enheder skal klassificeres som enten vaesentlige eller vigtige baseret pa storrelse, sektor og kritikalitet i henhold til NIS2-bilagene.',
    'Entities must be classified as either essential or important based on size, sector, and criticality in accordance with the NIS2 annexes.',
    null, null, 'Krav');

  // === Samarbejde og informationsdeling (Cooperation and Information Sharing) ===
  add('Samarbejde', 'CSIRT', 'Samarbejde med national CSIRT (CFCS)', 'Cooperation with national CSIRT (CFCS)',
    'NIS2-omfattede enheder skal samarbejde med den nationale CSIRT (CFCS) og deltage i informationsdelingsordninger.',
    'NIS2-covered entities must cooperate with the national CSIRT (CFCS) and participate in information sharing arrangements.',
    null, 'Tilmeld organisationen til CFCS varslingstjeneste. Deltag i sektorspecifikke informationsdelingsgrupper.', 'Krav');

  add('Samarbejde', 'Informationsdeling', 'Frivillig informationsdeling om cybertrusler', 'Voluntary cyber threat information sharing',
    'Enheder opfordres til at dele information om cybertrusler, sarbarheder og indikatorer for kompromittering med relevante myndigheder og andre enheder.',
    'Entities are encouraged to share information about cyber threats, vulnerabilities, and indicators of compromise with relevant authorities and other entities.',
    null, null, 'Anbefaling');

  return controls;
}

async function main(): Promise<void> {
  console.log('NIS2 Danish Implementation Ingestion');
  const controls = generateControls();
  console.log(`Generated ${controls.length} controls`);
  mkdirSync(DATA_DIR, { recursive: true });
  const output = {
    framework: {
      id: 'nis2-dk',
      name: 'Danish NIS2 Implementation (L 111)',
      name_nl: 'Dansk NIS2-implementering (Lov om net- og informationssikkerhed)',
      issuing_body: 'Forsvarsministeriet / Sektormyndigheder',
      version: '2025',
      effective_date: '2025-01-01',
      scope: 'Network and information security requirements for essential and important entities in Denmark under NIS2 transposition',
      scope_sectors: ['energy', 'transport', 'finance', 'healthcare', 'water', 'digital_infrastructure', 'government'],
      structure_description: 'Requirements organized by NIS2 obligations: governance, risk management measures (Art. 21), incident reporting (Art. 23), supervision, registration, and cooperation.',
      source_url: 'https://www.retsinformation.dk/eli/lta/2024/1705',
      license: 'Public sector publication',
      language: 'da+en',
    },
    controls,
    metadata: { ingested_at: new Date().toISOString(), source: 'Lov om net- og informationssikkerhed (NIS2 dansk implementering)', total_controls: controls.length },
  };
  writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2), 'utf-8');
  console.log(`Output: ${OUTPUT_FILE}`);
}

main().catch((err) => { console.error('Fatal:', err); process.exit(1); });
