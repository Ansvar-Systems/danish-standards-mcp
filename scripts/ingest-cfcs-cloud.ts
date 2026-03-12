// scripts/ingest-cfcs-cloud.ts
// CFCS Vejledning om cloudsikkerhed

import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'data', 'extracted');
const OUTPUT_FILE = join(DATA_DIR, 'cfcs-cloud.json');

interface Control {
  control_number: string; title: string; title_nl: string; description: string; description_nl: string;
  category: string; subcategory: string | null; level: string | null; iso_mapping: string | null;
  implementation_guidance: string | null; verification_guidance: string | null; source_url: string;
}

function generateControls(): Control[] {
  const controls: Control[] = [];
  let seq = 1;
  function add(cat: string, sub: string | null, tDa: string, tEn: string, dDa: string, dEn: string, iso: string | null, guide: string | null, level: string | null) {
    controls.push({ control_number: `CL${seq.toString().padStart(2, '0')}`, title: tEn, title_nl: tDa, description: dEn, description_nl: dDa, category: cat, subcategory: sub, level: level ?? 'Krav', iso_mapping: iso, implementation_guidance: guide, verification_guidance: null, source_url: 'https://www.cfcs.dk/da/forebyggelse/vejledninger/cloudsikkerhed/' });
    seq++;
  }

  // === Risikovurdering (Risk Assessment) ===
  add('Risikovurdering', 'Klassifikation', 'Risikovurdering foer cloud-adoption', 'Risk assessment before cloud adoption',
    'Organisationen skal gennemfoere en risikovurdering foer migration til cloud der identificerer data, systemer og afhaengigheder der flyttes.',
    'The organization must conduct a risk assessment before cloud migration that identifies data, systems, and dependencies being moved.',
    '5.7', 'Klassificer data der flyttes til cloud. Vurder risici ved dataplacering, jurisdiktion og leverandoerafhaengighed.', 'Krav');

  add('Risikovurdering', 'Klassifikation', 'Dataklassifikation i cloud', 'Data classification in cloud',
    'Data i cloudmiljoeet skal klassificeres og behandles i henhold til organisationens informationsklassifikationspolitik.',
    'Data in the cloud environment must be classified and handled in accordance with the organization information classification policy.',
    '5.12', null, 'Krav');

  add('Risikovurdering', 'Jurisdiktion', 'Vurdering af dataplacering og jurisdiktion', 'Assessment of data location and jurisdiction',
    'Organisationen skal vurdere i hvilke lande data opbevares og behandles, og sikre at dette er i overensstemmelse med gaeldende lovgivning.',
    'The organization must assess in which countries data is stored and processed, and ensure this complies with applicable legislation.',
    '5.7', 'Vurder EU/EOS-dataplacering. For statslige myndigheder: overhold Sikkerhedscirkul aerets krav til klassificeret information.', 'Krav');

  // === Identitets- og adgangsstyring (Identity and Access) ===
  add('Cloud-adgangsstyring', 'Identitet', 'Cloud-identitetsstyring', 'Cloud identity management',
    'Organisationen skal implementere centraliseret identitetsstyring for cloud-tjenester med single sign-on og flerfaktorautentifikation.',
    'The organization must implement centralized identity management for cloud services with single sign-on and multi-factor authentication.',
    '8.5', 'Anvend foedereret identitetsstyring via SAML eller OpenID Connect. Krav MFA for alle cloud-konti.', 'Krav');

  add('Cloud-adgangsstyring', 'Identitet', 'Privilegeret cloud-adgang', 'Privileged cloud access',
    'Administrative konti i cloudmiljoeet skal beskyttes med phishing-resistent MFA, tidsbegraenset adgang og sessionovervagning.',
    'Administrative accounts in the cloud environment must be protected with phishing-resistant MFA, time-limited access, and session monitoring.',
    '8.2', null, 'Krav');

  add('Cloud-adgangsstyring', 'Noegler', 'Sikkerhed for API-noegler og hemmeligheder', 'Security for API keys and secrets',
    'API-noegler, adgangstokens og hemmeligheder skal opbevares i en dedikeret hemmeligheds-vault og roteres regelmaeessigt.',
    'API keys, access tokens, and secrets must be stored in a dedicated secrets vault and rotated regularly.',
    '8.24', null, 'Krav');

  // === Konfigurationssikkerhed (Configuration Security) ===
  add('Cloud-konfiguration', 'Haerdning', 'Sikker cloud-konfiguration', 'Secure cloud configuration',
    'Cloud-ressourcer skal konfigureres i henhold til leverandoerens sikkerhedsanbefalinger og CIS Cloud Benchmarks.',
    'Cloud resources must be configured in accordance with the vendor security recommendations and CIS Cloud Benchmarks.',
    '8.9', 'Anvend infrastructure-as-code med sikkerhedsscanning. Gennemga konfigurationen med Cloud Security Posture Management (CSPM).', 'Krav');

  add('Cloud-konfiguration', 'Haerdning', 'Netvaerkssikkerhed i cloud', 'Network security in cloud',
    'Cloud-netvaerk skal konfigureres med mindste-privilegium sikkerhedsgrupper, netvaerks-ACLer og privat netvaerksforbindelse hvor muligt.',
    'Cloud networks must be configured with least-privilege security groups, network ACLs, and private network connectivity where possible.',
    '8.22', null, 'Krav');

  add('Cloud-konfiguration', 'Kryptering', 'Kryptering i cloudmiljoeet', 'Encryption in cloud environment',
    'Alle data i cloudmiljoeet skal krypteres bade i transit og i hvile. Organisationen skal bevare kontrol over krypteringsnoegler.',
    'All data in the cloud environment must be encrypted both in transit and at rest. The organization must retain control over encryption keys.',
    '8.24', 'Anvend customer-managed keys (CMK) for folsomme data. Opbevar master-noegler i organisationens egen key vault.', 'Krav');

  add('Cloud-konfiguration', 'Lagring', 'Sikkerhed for cloud-lagring', 'Cloud storage security',
    'Cloud-lagring (S3-buckets, blob storage) skal konfigureres med blokeret offentlig adgang, versionering og adgangslogning.',
    'Cloud storage (S3 buckets, blob storage) must be configured with blocked public access, versioning, and access logging.',
    '8.10', null, 'Krav');

  // === Overvagning og logning (Monitoring and Logging) ===
  add('Cloud-overvagning', 'Logning', 'Cloud-audit-logning', 'Cloud audit logging',
    'Alle administrative handlinger, adgangshaendelser og konfigurationsaendringer i cloud skal logges i et centralt og beskyttet logarkiv.',
    'All administrative actions, access events, and configuration changes in cloud must be logged in a central and protected log archive.',
    '8.15', 'Aktiver cloud-leverandoerens audit trail (CloudTrail, Activity Log). Eksporter logs til eksternt SIEM.', 'Krav');

  add('Cloud-overvagning', 'Logning', 'Overvagning af cloud-udgifter og ressourcer', 'Monitoring of cloud expenses and resources',
    'Cloud-udgifter og ressourceforbrug skal overvaages for at detektere uautoriseret brug sasom cryptomining.',
    'Cloud expenses and resource consumption must be monitored to detect unauthorized use such as cryptomining.',
    '8.16', null, null);

  add('Cloud-overvagning', 'Trussel', 'Cloud-trusselsdetektering', 'Cloud threat detection',
    'Organisationen skal aktivere cloud-leverandoerens trusseldetekteringstjenester og integrere alarmer med organisationens sikkerhedsovervagning.',
    'The organization must enable the cloud vendor threat detection services and integrate alerts with the organization security monitoring.',
    '8.16', null, 'Anbefaling');

  // === Leverandoerstyring (Vendor Management) ===
  add('Cloud-leverandoerstyring', 'Kontrakt', 'Cloud-leverandoeraftale og SLA', 'Cloud vendor agreement and SLA',
    'Aftalen med cloud-leverandoeren skal specificere sikkerhedskrav, databeskyttelse, incidentrapportering, auditadgang og exit-strategi.',
    'The agreement with the cloud vendor must specify security requirements, data protection, incident reporting, audit access, and exit strategy.',
    '5.19', 'Krav til SOC 2 Type II eller ISO 27001-certificering hos leverandoeren. Definer RTO/RPO i SLA.', 'Krav');

  add('Cloud-leverandoerstyring', 'Kontrakt', 'Cloud exit-strategi', 'Cloud exit strategy',
    'Organisationen skal have en dokumenteret exit-strategi for cloud-tjenester der sikrer data kan migreres eller slettes ved kontraktophoer.',
    'The organization must have a documented exit strategy for cloud services that ensures data can be migrated or deleted at contract termination.',
    '5.20', null, 'Krav');

  add('Cloud-leverandoerstyring', 'Revision', 'Revision af cloud-leverandoerens sikkerhed', 'Audit of cloud vendor security',
    'Cloud-leverandoerens sikkerhed skal revideres regelmaeessigt baseret pa uafhaengige revisionsrapporter og certificeringer.',
    'The cloud vendor security must be audited regularly based on independent audit reports and certifications.',
    '5.22', null, 'Krav');

  // === Haendelsesberedskab (Incident Preparedness) ===
  add('Cloud-beredskab', 'Haendelse', 'Cloud-incidentresponsplan', 'Cloud incident response plan',
    'Haendelsesresponsplanen skal adressere cloud-specifikke scenarier inklusiv leverandoernedbrud, databrud og kontokompromittering.',
    'The incident response plan must address cloud-specific scenarios including vendor outage, data breach, and account compromise.',
    '5.24', null, 'Krav');

  add('Cloud-beredskab', 'Haendelse', 'Cloud-forensisk kapabilitet', 'Cloud forensic capability',
    'Organisationen skal sikre at cloud-logdata og snapshots er tilgaengelige for forensisk undersogelse efter en sikkerhedshaendelse.',
    'The organization must ensure that cloud log data and snapshots are available for forensic investigation after a security incident.',
    '5.28', null, 'Anbefaling');

  add('Cloud-beredskab', 'Backup', 'Cloud-backup og gendannelse', 'Cloud backup and recovery',
    'Kritiske data i cloud skal sikkerhedskopieres uafhaengigt af cloud-leverandoeren med regelmaeessig test af gendannelse.',
    'Critical data in cloud must be backed up independently of the cloud vendor with regular recovery testing.',
    '8.13', null, 'Krav');

  return controls;
}

async function main(): Promise<void> {
  console.log('CFCS Cloud Security Guidance Ingestion');
  const controls = generateControls();
  console.log(`Generated ${controls.length} controls`);
  mkdirSync(DATA_DIR, { recursive: true });

  const output = {
    framework: {
      id: 'cfcs-cloud',
      name: 'CFCS Cloud Security Guidance',
      name_nl: 'CFCS Vejledning om cloudsikkerhed',
      issuing_body: 'Center for Cybersikkerhed (CFCS)',
      version: '2024',
      effective_date: '2024-01-01',
      scope: 'Security guidance for Danish organizations adopting cloud services',
      scope_sectors: ['government', 'healthcare', 'finance', 'energy', 'education'],
      structure_description: 'Guidance organized by cloud security domains: risk assessment, identity and access management, configuration security, monitoring and logging, vendor management, and incident preparedness.',
      source_url: 'https://www.cfcs.dk/da/forebyggelse/vejledninger/cloudsikkerhed/',
      license: 'Public sector publication',
      language: 'da+en',
    },
    controls,
    metadata: { ingested_at: new Date().toISOString(), source: 'CFCS vejledning om cloudsikkerhed', total_controls: controls.length },
  };

  writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2), 'utf-8');
  console.log(`Output: ${OUTPUT_FILE}`);
}

main().catch((err) => { console.error('Fatal:', err); process.exit(1); });
