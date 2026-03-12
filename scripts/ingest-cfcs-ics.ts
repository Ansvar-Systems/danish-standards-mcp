// scripts/ingest-cfcs-ics.ts
// Generates CFCS ICS/OT security guidance controls.
// Source: Center for Cybersikkerhed - Vejledning om sikkerhed i industrielle kontrolsystemer

import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'data', 'extracted');
const OUTPUT_FILE = join(DATA_DIR, 'cfcs-ics.json');

interface Control {
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

function generateControls(): Control[] {
  const controls: Control[] = [];
  let seq = 1;

  function add(cat: string, sub: string | null, tDa: string, tEn: string, dDa: string, dEn: string, iso: string | null, guide: string | null, level: string | null) {
    controls.push({
      control_number: `ICS${seq.toString().padStart(2, '0')}`,
      title: tEn, title_nl: tDa, description: dEn, description_nl: dDa,
      category: cat, subcategory: sub, level: level ?? 'Krav',
      iso_mapping: iso, implementation_guidance: guide, verification_guidance: null,
      source_url: 'https://www.cfcs.dk/da/forebyggelse/vejledninger/industrielle-kontrolsystemer/',
    });
    seq++;
  }

  // === Netvaerksisolering (Network Isolation) ===
  add('Netvaerksisolering', 'OT/IT-separation', 'Adskillelse af IT- og OT-netvaerk', 'Separation of IT and OT networks',
    'Industrielle kontrolsystemer (ICS/OT) skal vaere fysisk eller logisk adskilt fra virksomhedens IT-netvaerk. Trafikken mellem zonerne skal kontrolleres via dedikerede firewalls.',
    'Industrial control systems (ICS/OT) must be physically or logically separated from the corporate IT network. Traffic between zones must be controlled via dedicated firewalls.',
    '8.22', 'Implementer en demilitariseret zone (DMZ) mellem IT- og OT-netvaerk. Anvend unidirektionelle gateways hvor muligt.', 'Krav');

  add('Netvaerksisolering', 'OT/IT-separation', 'Unidirektionelle sikkerhedsgateways', 'Unidirectional security gateways',
    'Hvor data skal overfoeres fra OT til IT, skal der anvendes unidirektionelle gateways (data dioder) for at forhindre indgaende trafik til OT-netvaerket.',
    'Where data must be transferred from OT to IT, unidirectional gateways (data diodes) must be used to prevent inbound traffic to the OT network.',
    '8.22', null, 'Anbefaling');

  add('Netvaerksisolering', 'Segmentering', 'Segmentering af OT-netvaerket', 'OT network segmentation',
    'OT-netvaerket skal segmenteres i zoner baseret pa sikkerhedsniveau og funktionalitet i henhold til IEC 62443.',
    'The OT network must be segmented into zones based on security level and functionality in accordance with IEC 62443.',
    '8.22', 'Definer zoner og conduits i henhold til IEC 62443-3-2. Dokumenter alle tilladte dataflow.', 'Krav');

  add('Netvaerksisolering', 'Segmentering', 'Industrielle firewalls', 'Industrial firewalls',
    'Firewalls mellem OT-zoner skal vaere industriklassificerede og konfigureret specifikt til industrielle protokoller.',
    'Firewalls between OT zones must be industrially rated and configured specifically for industrial protocols.',
    '8.20', null, null);

  // === Fjernadgang (Remote Access) ===
  add('Fjernadgang til OT', 'VPN', 'Sikker fjernadgang til OT-systemer', 'Secure remote access to OT systems',
    'Fjernadgang til OT-systemer skal begrenses til det absolut nodvendige og skal ske via dedikerede, krypterede forbindelser med flerfaktorautentifikation.',
    'Remote access to OT systems must be limited to what is strictly necessary and must use dedicated, encrypted connections with multi-factor authentication.',
    '8.20', 'Implementer dedikeret jump-server for OT-fjernadgang. Alle sessioner skal logges og overvaages.', 'Krav');

  add('Fjernadgang til OT', 'VPN', 'Tidsbegraenset fjernadgang', 'Time-limited remote access',
    'Fjernadgang til OT-systemer skal vaere tidsbegraenset og kraeve eksplicit godkendelse for hver session.',
    'Remote access to OT systems must be time-limited and require explicit approval for each session.',
    '8.2', null, 'Krav');

  add('Fjernadgang til OT', 'Leverandoeradgang', 'Leverandoerfjernadgang til OT', 'Vendor remote access to OT',
    'Leverandoerer med fjernadgang til OT-systemer skal godkendes individuelt. Adgangen skal vaere tidsbegraenset, overvaaget og logget.',
    'Vendors with remote access to OT systems must be individually approved. Access must be time-limited, monitored, and logged.',
    '5.19', null, 'Krav');

  // === Sarbarhedsstyring (Vulnerability Management) ===
  add('Sarbarhedsstyring i OT', 'Patching', 'OT-patching og opdateringsstrategi', 'OT patching and update strategy',
    'Organisationen skal have en dokumenteret strategi for patching af OT-systemer der tager hensyn til produktionens tilgaengelighed og leverandoerens anbefalinger.',
    'The organization must have a documented strategy for patching OT systems that considers production availability and vendor recommendations.',
    '8.8', 'Etabler et patchvinduesystem koordineret med driftstop. Test patches i testmiljoe foer produktion.', 'Krav');

  add('Sarbarhedsstyring i OT', 'Patching', 'Kompenserende kontroller for ikke-patchbare systemer', 'Compensating controls for unpatched systems',
    'For OT-systemer der ikke kan patches, skal der implementeres kompenserende kontroller sasom netvaerksisolering, IDS og applikationshvidlisting.',
    'For OT systems that cannot be patched, compensating controls must be implemented such as network isolation, IDS, and application whitelisting.',
    '8.8', null, 'Krav');

  add('Sarbarhedsstyring i OT', 'Scanning', 'Sarbarhedsscanning af OT-systemer', 'Vulnerability scanning of OT systems',
    'Sarbarhedsscanning af OT-systemer skal udfoeres med vaerktojer og metoder der er godkendt til brug i industrielle miljoeerer.',
    'Vulnerability scanning of OT systems must be performed with tools and methods approved for use in industrial environments.',
    '8.8', 'Anvend passive scanningsmetoder i produktionsmiljoeer. Aktiv scanning kun i vedligeholdelsesvinduer.', null);

  // === Haendelseshandtering (Incident Response) ===
  add('OT-haendelseshandtering', 'Beredskab', 'OT-specifik haendelsesresponsplan', 'OT-specific incident response plan',
    'Organisationen skal have en haendelsesresponsplan specifikt for OT-miljoeet der adresserer bade cyber- og fysiske konsekvenser.',
    'The organization must have an incident response plan specifically for the OT environment that addresses both cyber and physical consequences.',
    '5.24', 'Inkluder OT-specifikke scenarier i haendelsesberedskabet. Koordiner med sikkerhedspersonale og driftspersonale.', 'Krav');

  add('OT-haendelseshandtering', 'Beredskab', 'OT-beredskabsoevelser', 'OT contingency exercises',
    'Beredskabsoevelser for OT-systemer skal gennemfoeres mindst arligt og inkludere scenarier med cyberangreb mod industrielle kontrolsystemer.',
    'Contingency exercises for OT systems must be conducted at least annually and include scenarios involving cyber attacks on industrial control systems.',
    '5.30', null, 'Krav');

  add('OT-haendelseshandtering', 'Forensik', 'OT forensisk kapabilitet', 'OT forensic capability',
    'Organisationen skal have kapabilitet til at indsamle og bevare digitalt bevismateriale fra OT-systemer efter en sikkerhedshaendelse.',
    'The organization must have the capability to collect and preserve digital evidence from OT systems after a security incident.',
    '5.28', null, 'Anbefaling');

  // === Fysisk sikkerhed (Physical Security) ===
  add('Fysisk OT-sikkerhed', 'Adgangskontrol', 'Fysisk adgangskontrol til OT-anlaaeg', 'Physical access control to OT facilities',
    'Fysisk adgang til OT-anlaeg og kontrolrum skal begrenses og kontrolleres med elektronisk adgangsstyring og logning.',
    'Physical access to OT facilities and control rooms must be restricted and controlled with electronic access management and logging.',
    '7.1', null, 'Krav');

  add('Fysisk OT-sikkerhed', 'Adgangskontrol', 'Beskyttelse af fjaerninstallationer', 'Protection of remote installations',
    'Fjaerninstallationer som pumpestationer og transformerstationer skal beskyttes fysisk med alarmer, overvagning og manipulationsdetektering.',
    'Remote installations such as pump stations and transformer stations must be physically protected with alarms, surveillance, and tamper detection.',
    '7.4', null, null);

  // === Overvagning (Monitoring) ===
  add('OT-overvagning', 'IDS', 'Indtraaengningsdetektering i OT-netvaerk', 'Intrusion detection in OT networks',
    'Der skal implementeres indtraaengningsdetekteringssystemer (IDS) specifikt konfigureret til industrielle protokoller og kommunikationsmoenstre.',
    'Intrusion detection systems (IDS) specifically configured for industrial protocols and communication patterns must be implemented.',
    '8.16', 'Anvend OT-specifikke IDS der forstar industrielle protokoller som Modbus, DNP3, OPC UA og IEC 61850.', 'Krav');

  add('OT-overvagning', 'IDS', 'Anomalidetektion i procesdata', 'Anomaly detection in process data',
    'Procesdata fra OT-systemer skal overvaages for anomalier der kan indikere manipulation eller cyberangreb.',
    'Process data from OT systems must be monitored for anomalies that may indicate manipulation or cyber attacks.',
    '8.16', null, 'Anbefaling');

  add('OT-overvagning', 'Logning', 'OT-logning og audit trail', 'OT logging and audit trail',
    'Alle konfigurationsaendringer, operatoerhandlinger og sikkerhedshaendelser i OT-systemer skal logges i et centralt og beskyttet logarkiv.',
    'All configuration changes, operator actions, and security events in OT systems must be logged in a central and protected log archive.',
    '8.15', null, 'Krav');

  // === Leverandoerstyring (Supply Chain) ===
  add('OT-leverandoerstyring', 'Komponentverifikation', 'Verifikation af OT-komponenter', 'Verification of OT components',
    'Alle hardware- og softwarekomponenter til OT-systemer skal verificeres for integritet og autenticitet foer installation.',
    'All hardware and software components for OT systems must be verified for integrity and authenticity before installation.',
    '5.19', null, 'Krav');

  add('OT-leverandoerstyring', 'Komponentverifikation', 'Sikkerhedskrav til OT-leverandoerer', 'Security requirements for OT vendors',
    'Kontrakter med OT-leverandoerer skal indeholde specifikke sikkerhedskrav herunder krav til sarbarhedshandtering, patchlevering og incidentrapportering.',
    'Contracts with OT vendors must contain specific security requirements including requirements for vulnerability handling, patch delivery, and incident reporting.',
    '5.20', null, 'Krav');

  // === Sikker konfiguration (Secure Configuration) ===
  add('Sikker OT-konfiguration', 'Haerdning', 'Haerdning af OT-systemer', 'Hardening of OT systems',
    'OT-systemer skal haerdes ved at deaktivere unoedvendige tjenester, porte og protokoller. Standardadgangskoder skal aendres.',
    'OT systems must be hardened by disabling unnecessary services, ports, and protocols. Default credentials must be changed.',
    '8.9', 'Anvend leverandoerens haerdningsguider og CIS ICS benchmarks. Dokumenter alle afvigelser.', 'Krav');

  add('Sikker OT-konfiguration', 'Haerdning', 'Applikationshvidlisting', 'Application whitelisting',
    'Pa OT-systemer skal der implementeres applikationshvidlisting sa kun godkendte programmer kan koeres.',
    'On OT systems, application whitelisting must be implemented so only approved programs can run.',
    '8.9', null, 'Anbefaling');

  add('Sikker OT-konfiguration', 'Backup', 'OT-konfigurationsbackup', 'OT configuration backup',
    'Konfigurationer for alle OT-systemer inklusiv PLC-programmer, HMI-konfigurationer og netvaerksindstillinger skal sikkerhedskopieres regelmaeessigt.',
    'Configurations for all OT systems including PLC programs, HMI configurations, and network settings must be backed up regularly.',
    '8.13', 'Opbevar OT-backups offline eller i et separat sikkerhedsdomaene. Test gendannelse kvartalsmaeessigt.', 'Krav');

  // === Personalesikkerhed (Personnel Security) ===
  add('OT-personalesikkerhed', 'Uddannelse', 'OT-cybersikkerhedstraening', 'OT cybersecurity training',
    'Alt personale med adgang til OT-systemer skal modtage specialiseret cybersikkerhedstraening for industrielle kontrolsystemer.',
    'All personnel with access to OT systems must receive specialized cybersecurity training for industrial control systems.',
    '6.3', 'Inkluder OT-specifikke emner: ICS-trusler, sikker fjernbetjening, haendelsesrapportering i OT-miljoeer.', 'Krav');

  add('OT-personalesikkerhed', 'Uddannelse', 'Sikkerheds-awareness for OT-operatoerer', 'Security awareness for OT operators',
    'OT-operatoerer skal traenes i at genkende tegn pa cyberangreb i processdata og systemopfoersel.',
    'OT operators must be trained to recognize signs of cyber attacks in process data and system behavior.',
    '6.3', null, null);

  return controls;
}

async function main(): Promise<void> {
  console.log('CFCS ICS/OT Security Guidance Ingestion');
  console.log('========================================');

  const controls = generateControls();
  console.log(`Generated ${controls.length} controls`);

  mkdirSync(DATA_DIR, { recursive: true });

  const output = {
    framework: {
      id: 'cfcs-ics',
      name: 'CFCS ICS/OT Security Guidance',
      name_nl: 'CFCS Vejledning om sikkerhed i industrielle kontrolsystemer',
      issuing_body: 'Center for Cybersikkerhed (CFCS)',
      version: '2024',
      effective_date: '2024-01-01',
      scope: 'Security guidance for industrial control systems and operational technology in Danish critical infrastructure',
      scope_sectors: ['energy', 'water', 'transport', 'digital_infrastructure'],
      structure_description: 'Guidance organized by OT security domains: network isolation, remote access, vulnerability management, incident response, physical security, monitoring, supply chain, secure configuration, and personnel security.',
      source_url: 'https://www.cfcs.dk/da/forebyggelse/vejledninger/industrielle-kontrolsystemer/',
      license: 'Public sector publication',
      language: 'da+en',
    },
    controls,
    metadata: {
      ingested_at: new Date().toISOString(),
      source: 'CFCS vejledning om sikkerhed i industrielle kontrolsystemer',
      total_controls: controls.length,
    },
  };

  writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2), 'utf-8');
  console.log(`Output: ${OUTPUT_FILE} (${controls.length} controls)`);
}

main().catch((err) => { console.error('Fatal:', err); process.exit(1); });
