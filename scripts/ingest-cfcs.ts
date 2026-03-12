// scripts/ingest-cfcs.ts
// Generates CFCS (Center for Cybersikkerhed) cybersecurity guidelines.
// Source: Center for Cybersikkerhed under Forsvarets Efterretningstjeneste
// These are Danish government cybersecurity guidelines for government and critical infrastructure.

import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'data', 'extracted');
const OUTPUT_FILE = join(DATA_DIR, 'cfcs-vejledning.json');

interface CfcsControl {
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

function generateControls(): CfcsControl[] {
  const controls: CfcsControl[] = [];
  let seq = 1;

  function addControl(
    cat: string,
    subcat: string | null,
    titleDa: string,
    titleEn: string,
    descDa: string,
    descEn: string,
    iso: string | null,
    guidanceDa: string | null,
    level: string | null,
  ) {
    const num = `N${seq.toString().padStart(2, '0')}`;
    controls.push({
      control_number: num,
      title: titleEn,
      title_nl: titleDa,
      description: descEn,
      description_nl: descDa,
      category: cat,
      subcategory: subcat,
      level: level ?? 'Anbefaling',
      iso_mapping: iso,
      implementation_guidance: guidanceDa,
      verification_guidance: null,
      source_url: 'https://www.cfcs.dk/da/forebyggelse/vejledninger/',
    });
    seq++;
  }

  // === Netvaerkssikkerhed (Network Security) ===
  const netCat = 'Netvaerkssikkerhed';

  addControl(netCat, 'Segmentering', 'Segmentering af netvaerk', 'Network segmentation',
    'Organisationen skal segmentere netvaerk i sikkerhedszoner baseret pa klassifikation og risiko. Kritiske systemer skal vaere isoleret fra det generelle kontornetvaerk.',
    'The organization must segment networks into security zones based on classification and risk. Critical systems must be isolated from the general office network.',
    '8.22', 'Implementer VLAN-segmentering og firewall-regler mellem zoner. Dokumenter netvaerksarkitekturen.', 'Krav');

  addControl(netCat, 'Segmentering', 'Mikrosegmentering af kritiske systemer', 'Micro-segmentation of critical systems',
    'Kritiske systemer og databaser skal beskyttes med mikrosegmentering, sa kommunikation kun er tilladt fra autoriserede kilder.',
    'Critical systems and databases must be protected with micro-segmentation so that communication is only permitted from authorized sources.',
    '8.22', 'Anvend host-baserede firewalls eller SDN-baseret mikrosegmentering for servere med folsomme data.', null);

  addControl(netCat, 'Firewall', 'Firewall-konfiguration og haerdning', 'Firewall configuration and hardening',
    'Alle firewalls skal konfigureres efter princippet om mindste rettigheder. Kun nodvendig trafik ma tillades.',
    'All firewalls must be configured following the principle of least privilege. Only necessary traffic may be allowed.',
    '8.20', 'Implementer default-deny politikker. Gennemga firewallregler mindst halvarsligt.', 'Krav');

  addControl(netCat, 'Firewall', 'Centraliseret firewall-administration', 'Centralized firewall management',
    'Firewalls skal administreres centralt med logning af alle regelaendringer og mulighed for hurtig udrulning af noedregler.',
    'Firewalls must be managed centrally with logging of all rule changes and the ability to quickly deploy emergency rules.',
    '8.20', null, null);

  addControl(netCat, 'Fjernadgang', 'Sikker fjernadgang via VPN', 'Secure remote access via VPN',
    'Fjernadgang til organisationens netvaerk skal ske via krypteret VPN-forbindelse med flerfaktorautentifikation.',
    'Remote access to the organization network must use an encrypted VPN connection with multi-factor authentication.',
    '8.20', 'Anvend IPsec eller WireGuard VPN. Krav om MFA for alle fjernadgangsbrugere.', 'Krav');

  addControl(netCat, 'Fjernadgang', 'Sessionsstyring ved fjernadgang', 'Remote access session management',
    'Fjernadgangssessioner skal have automatisk timeout og genautentifikation efter en defineret inaktivitetsperiode.',
    'Remote access sessions must have automatic timeout and re-authentication after a defined period of inactivity.',
    '8.5', null, null);

  addControl(netCat, 'DNS', 'DNS-sikkerhed og filtrering', 'DNS security and filtering',
    'Organisationen skal implementere DNS-sikkerhedsforanstaltninger, herunder DNSSEC-validering og filtrering af kendte ondsindede domaener.',
    'The organization must implement DNS security measures including DNSSEC validation and filtering of known malicious domains.',
    '8.20', 'Konfigurer DNS-resolvere med DNSSEC-validering. Implementer DNS-filtrering via threat intelligence feeds.', null);

  addControl(netCat, 'Tradlos', 'Tradlos netvaerkssikkerhed', 'Wireless network security',
    'Tradlose netvaerk skal anvende WPA3 eller tilsvarende kryptering. Gaestenetvaerk skal vaere separeret fra interne netvaerk.',
    'Wireless networks must use WPA3 or equivalent encryption. Guest networks must be separated from internal networks.',
    '8.20', 'WPA3-Enterprise med RADIUS-autentifikation for virksomhedsnetvaerk.', null);

  addControl(netCat, 'DDoS', 'DDoS-beskyttelse', 'DDoS protection',
    'Organisationen skal have DDoS-beskyttelse for internetvendte tjenester og en beredskabsplan for DDoS-angreb.',
    'The organization must have DDoS protection for internet-facing services and a contingency plan for DDoS attacks.',
    '8.6', 'Implementer anti-DDoS tjenester hos ISP eller cloud-udbyder. Test beredskabsplanen arligt.', null);

  addControl(netCat, 'DDoS', 'Trafikovervagning og anomalidetektion', 'Traffic monitoring and anomaly detection',
    'Netvaerkstrafik skal overrages kontinuerligt for at identificere usoedvanlige moenstre der kan indikere angreb eller uautoriseret adgang.',
    'Network traffic must be monitored continuously to identify unusual patterns that may indicate attacks or unauthorized access.',
    '8.16', null, null);

  addControl(netCat, 'E-mail', 'E-mail-sikkerhed og anti-phishing', 'Email security and anti-phishing',
    'Organisationen skal implementere SPF, DKIM og DMARC for alle e-mail-domaener samt avanceret anti-phishing-filtrering.',
    'The organization must implement SPF, DKIM, and DMARC for all email domains as well as advanced anti-phishing filtering.',
    '8.23', 'Konfigurer DMARC med p=reject politik. Implementer sandboxing af vedhaeeftede filer.', 'Krav');

  // === Identitetsstyring (Identity Management) ===
  const idCat = 'Identitetsstyring';

  addControl(idCat, 'MFA', 'Flerfaktorautentifikation', 'Multi-factor authentication',
    'Alle brugere skal anvende flerfaktorautentifikation (MFA) ved adgang til organisationens systemer og data.',
    'All users must use multi-factor authentication (MFA) when accessing the organization systems and data.',
    '8.5', 'Implementer MFA med hardware-tokens eller autentifikationsapps. SMS-baseret MFA anses for utilstraekkelig.', 'Krav');

  addControl(idCat, 'MFA', 'Phishing-resistent autentifikation', 'Phishing-resistant authentication',
    'For systemer med hoej risiko skal organisationen anvende phishing-resistent autentifikation sasom FIDO2/WebAuthn.',
    'For high-risk systems the organization must use phishing-resistant authentication such as FIDO2/WebAuthn.',
    '8.5', null, 'Anbefaling');

  addControl(idCat, 'Privilegeret adgang', 'Privilegeret adgangsstyring (PAM)', 'Privileged access management (PAM)',
    'Privilegerede konti skal administreres saerskilt med tidsbegraeenset adgang, sessionovervagning og automatisk rotation af adgangskoder.',
    'Privileged accounts must be managed separately with time-limited access, session monitoring, and automatic credential rotation.',
    '8.2', 'Implementer PAM-loesning med just-in-time adgangsforvaltning.', 'Krav');

  addControl(idCat, 'Privilegeret adgang', 'Separate administratorkonti', 'Separate administrator accounts',
    'Administrative opgaver skal udfoeres med dedikerede administratorkonti der er adskilt fra brugernes daglige konti.',
    'Administrative tasks must be performed with dedicated administrator accounts that are separate from users daily accounts.',
    '8.2', null, 'Krav');

  addControl(idCat, 'Adgangskontrol', 'Adgangskontrol baseret pa roller', 'Role-based access control',
    'Adgang til systemer og data skal tildeles baseret pa brugerens rolle og efter princippet om mindste rettigheder.',
    'Access to systems and data must be granted based on the user role and following the principle of least privilege.',
    '5.15', 'Definer roller og tilknyttede rettigheder. Gennemga adgangstildelinger kvartalsmaeessigt.', 'Krav');

  addControl(idCat, 'Adgangskontrol', 'Automatisk deprovisionering', 'Automatic deprovisioning',
    'Nar en medarbejder fratreeder eller skifter rolle, skal alle adgangsrettigheder automatisk tilbagekaldes eller justeres.',
    'When an employee leaves or changes role, all access rights must be automatically revoked or adjusted.',
    '5.18', null, 'Krav');

  addControl(idCat, 'Brugerstyring', 'Brugerkontoadministration', 'User account management',
    'Der skal vaere en formel proces for oprettelse, aendring og sletning af brugerkonti med godkendelse fra den ansvarliges leder.',
    'There must be a formal process for creating, modifying, and deleting user accounts with approval from the responsible manager.',
    '5.16', null, null);

  addControl(idCat, 'Brugerstyring', 'Adgangsrevision', 'Access review',
    'Alle brugeradgange skal gennemgas mindst halvarsligt for at sikre, at rettigheder fortsat er nodvendige og passende.',
    'All user accesses must be reviewed at least semi-annually to ensure that rights remain necessary and appropriate.',
    '5.18', null, null);

  // === Logging og overvagning (Logging and Monitoring) ===
  const logCat = 'Logging og overvagning';

  addControl(logCat, 'Logindsamling', 'Central logindsamling', 'Central log collection',
    'Alle sikkerhedsrelevante loghaendelser skal indsamles centralt i et SIEM-system eller tilsvarende logindsamlingsloesning.',
    'All security-relevant log events must be collected centrally in a SIEM system or equivalent log collection solution.',
    '8.15', 'Implementer centralt SIEM med logindsamling fra alle kritiske systemer.', 'Krav');

  addControl(logCat, 'Logindsamling', 'Struktureret logformat', 'Structured log format',
    'Loghaendelser skal anvende et standardiseret og struktureret format der muliggor automatisk analyse og korrelation.',
    'Log events must use a standardized and structured format that enables automated analysis and correlation.',
    '8.15', null, null);

  addControl(logCat, 'Overvagning', 'Sikkerhedsovervagning i realtid', 'Real-time security monitoring',
    'Organisationen skal have kapacitet til sikkerhedsovervagning i realtid, enten internt eller via en ekstern SOC-tjeneste.',
    'The organization must have capacity for real-time security monitoring, either internally or via an external SOC service.',
    '8.16', 'Etabler SOC-funktion med 24/7 overvagning af kritiske systemer.', 'Krav');

  addControl(logCat, 'Overvagning', 'Korrelation og trusselsanalyse', 'Correlation and threat analysis',
    'Logdata skal korreleres pa tvares af systemer for at identificere avancerede trusler og angrebsmoenstre.',
    'Log data must be correlated across systems to identify advanced threats and attack patterns.',
    '8.16', null, null);

  addControl(logCat, 'Alarmering', 'Automatisk alarmering', 'Automatic alerting',
    'Kritiske sikkerhedshaendelser skal udloese automatiske alarmer til sikkerhedspersonale med definerede eskaleringsfrister.',
    'Critical security events must trigger automatic alerts to security personnel with defined escalation deadlines.',
    '8.16', null, 'Krav');

  addControl(logCat, 'Alarmering', 'Prioritering og triagering af alarmer', 'Alert prioritization and triage',
    'Alarmer skal prioriteres baseret pa risiko og pavirkning. Der skal vaere klare procedurer for triagering og opfoelgning.',
    'Alerts must be prioritized based on risk and impact. There must be clear procedures for triage and follow-up.',
    '8.16', null, null);

  addControl(logCat, 'Logbeskyttelse', 'Beskyttelse af logdata mod manipulation', 'Protection of log data against tampering',
    'Logdata skal beskyttes mod uautoriseret aendring eller sletning ved brug af skrivebeskyttede arkiver og integritetsverifikation.',
    'Log data must be protected against unauthorized modification or deletion using write-protected archives and integrity verification.',
    '8.15', 'Anvend WORM-lagring eller kryptografisk signering af logfiler.', 'Krav');

  addControl(logCat, 'Logbeskyttelse', 'Logopbevaring og retention', 'Log retention and storage',
    'Logdata skal opbevares i mindst 12 maneder i henhold til lovkrav og organisationens sikkerhedspolitik.',
    'Log data must be retained for at least 12 months in accordance with legal requirements and the organization security policy.',
    '8.15', null, null);

  // === Haendelseshandtering (Incident Management) ===
  const incCat = 'Haendelseshandtering';

  addControl(incCat, 'Registrering', 'Haendelsesregistrering og klassifikation', 'Incident registration and classification',
    'Alle sikkerhedshaendelser skal registreres i et centralt system med en defineret klassifikationsmodel baseret pa alvorsgrad.',
    'All security incidents must be registered in a central system with a defined classification model based on severity.',
    '5.25', 'Implementer ticketsystem med automatisk klassifikation af haendelsestyper.', 'Krav');

  addControl(incCat, 'Registrering', 'Haendelsesdetektering og rapportering', 'Incident detection and reporting',
    'Medarbejdere skal uddannes i at genkende og rapportere sikkerhedshaendelser. Der skal vaere en klar rapporteringskanal.',
    'Employees must be trained to recognize and report security incidents. There must be a clear reporting channel.',
    '6.8', null, 'Krav');

  addControl(incCat, 'Eskalering', 'Eskaleringsprocedurer', 'Escalation procedures',
    'Der skal vaere klare eskaleringsprocedurer baseret pa haendelsens alvorsgrad, inklusiv tidsfrister og ansvarlige roller.',
    'There must be clear escalation procedures based on incident severity, including deadlines and responsible roles.',
    '5.26', null, 'Krav');

  addControl(incCat, 'Eskalering', 'Rapportering til CFCS', 'Reporting to CFCS',
    'Kritiske sikkerhedshaendelser i statslige myndigheder og kritisk infrastruktur skal rapporteres til CFCS inden for 24 timer.',
    'Critical security incidents in government authorities and critical infrastructure must be reported to CFCS within 24 hours.',
    '5.26', 'Folg CFCS rapporteringsvejledning. Brug den formelle rapporteringskanal pa cfcs.dk.', 'Krav');

  addControl(incCat, 'Kommunikation', 'Krisekommunikation', 'Crisis communication',
    'Organisationen skal have en plan for krisekommunikation ved alvorlige sikkerhedshaendelser, inklusiv intern og ekstern kommunikation.',
    'The organization must have a crisis communication plan for serious security incidents, including internal and external communication.',
    '5.26', null, null);

  addControl(incCat, 'Kommunikation', 'Koordinering med myndigheder', 'Coordination with authorities',
    'Ved alvorlige haendelser skal der koordineres med relevante myndigheder, herunder CFCS, politiet og Datatilsynet.',
    'In serious incidents there must be coordination with relevant authorities, including CFCS, the police, and the Data Protection Authority.',
    '5.5', null, null);

  addControl(incCat, 'Genopretning', 'Genopretning efter sikkerhedshaendelse', 'Recovery after security incident',
    'Organisationen skal have dokumenterede procedurer for genopretning efter sikkerhedshaendelser, inklusiv backup-gendannelse og systemverifikation.',
    'The organization must have documented procedures for recovery after security incidents, including backup restoration and system verification.',
    '5.29', null, 'Krav');

  addControl(incCat, 'Genopretning', 'Laering af sikkerhedshaendelser', 'Learning from security incidents',
    'Efter afslutning af haendelseshandteringen skal der gennemfores en evaluering med henblik pa forbedring af procedurer og forebyggelse.',
    'After incident handling is complete, an evaluation must be conducted to improve procedures and prevention.',
    '5.27', null, null);

  // === Sikker udvikling (Secure Development) ===
  const devCat = 'Sikker udvikling';

  addControl(devCat, 'Kodning', 'Sikker kodningspraksis', 'Secure coding practices',
    'Alle udviklere skal folge organisationens retningslinjer for sikker kodning, herunder input-validering, output-encoding og fejlhandtering.',
    'All developers must follow the organization guidelines for secure coding, including input validation, output encoding, and error handling.',
    '8.28', 'Folg OWASP Secure Coding Practices. Inkluder sikkerhedstraening i onboarding af udviklere.', 'Krav');

  addControl(devCat, 'Kodning', 'Brug af sikre biblioteker og frameworks', 'Use of secure libraries and frameworks',
    'Udviklere skal anvende godkendte og opdaterede biblioteker og frameworks. Tredjepartskomponenter skal scannes for kendte sarbarheder.',
    'Developers must use approved and up-to-date libraries and frameworks. Third-party components must be scanned for known vulnerabilities.',
    '8.28', null, null);

  addControl(devCat, 'Kodegennemgang', 'Sikkerhedskodegennemgang', 'Security code review',
    'Al kode skal gennemga en sikkerhedskodegennemgang for idriftsaettelse, enten via peerreview eller automatiserede SAST-vaerktojer.',
    'All code must undergo a security code review before deployment, either via peer review or automated SAST tools.',
    '8.25', null, 'Krav');

  addControl(devCat, 'Kodegennemgang', 'Automatisk statisk kodeanalyse', 'Automatic static code analysis',
    'Organisationen skal anvende automatiske SAST-vaerktojer i CI/CD-pipelinen til at identificere sikkerhedsfejl.',
    'The organization must use automatic SAST tools in the CI/CD pipeline to identify security defects.',
    '8.25', null, null);

  addControl(devCat, 'Sikkerhedstest', 'Penetrationstest', 'Penetration testing',
    'Kritiske applikationer og systemer skal underkastes regelmaeessig penetrationstest af kvalificerede testere.',
    'Critical applications and systems must undergo regular penetration testing by qualified testers.',
    '8.29', 'Gennemfor arlig penetrationstest af alle internetvendte systemer.', 'Krav');

  addControl(devCat, 'Sikkerhedstest', 'Dynamisk applikationstest (DAST)', 'Dynamic application testing (DAST)',
    'Webapplikationer skal testes med DAST-vaerktojer for at identificere runtime-sarbarheder for produktionsudrulning.',
    'Web applications must be tested with DAST tools to identify runtime vulnerabilities before production deployment.',
    '8.29', null, null);

  addControl(devCat, 'Sarbarhedshandtering', 'Sarbarhedsscanning og patch-styring', 'Vulnerability scanning and patch management',
    'Alle systemer skal scannes regelmaeessigt for kendte sarbarheder. Kritiske sarbarheder skal patches inden for 72 timer.',
    'All systems must be scanned regularly for known vulnerabilities. Critical vulnerabilities must be patched within 72 hours.',
    '8.8', 'Implementer ugentlig sarbarhedsscanning. Definer SLA for patching baseret pa CVSS-score.', 'Krav');

  addControl(devCat, 'Sarbarhedshandtering', 'Ansvarlig saerbarhedsrapportering', 'Responsible vulnerability disclosure',
    'Organisationen skal have en proces for at modtage og handtere sarbarhedsrapporter fra eksterne sikkerhedsforskere.',
    'The organization must have a process for receiving and handling vulnerability reports from external security researchers.',
    '8.8', null, null);

  // === Sikkerhedsarkitektur (Security Architecture) ===
  const archCat = 'Sikkerhedsarkitektur';

  addControl(archCat, 'Design', 'Zero Trust-arkitektur', 'Zero Trust architecture',
    'Organisationen skal bevaege sig mod en Zero Trust-arkitektur hvor alle adgangsforsoeg verificeres uanset netvaerksplacering.',
    'The organization should move toward a Zero Trust architecture where all access attempts are verified regardless of network location.',
    '8.27', null, 'Anbefaling');

  addControl(archCat, 'Design', 'Sikkerhedsarkitektur-dokumentation', 'Security architecture documentation',
    'Den overordnede sikkerhedsarkitektur skal vaere dokumenteret og holdes opdateret. Dokumentationen skal daekke netvaerk, dataflow og tillidsgraenser.',
    'The overall security architecture must be documented and kept up to date. Documentation must cover network, data flow, and trust boundaries.',
    '8.27', null, 'Krav');

  addControl(archCat, 'Kryptering', 'Kryptering af data i transit', 'Encryption of data in transit',
    'Al datakommunikation skal krypteres med TLS 1.2 eller nyere. Aeldre krypteringsprotokoller skal deaktiveres.',
    'All data communication must be encrypted with TLS 1.2 or newer. Older encryption protocols must be disabled.',
    '8.24', 'Konfigurer webservere og API-endpoints med TLS 1.2+ og staerke ciphersuites.', 'Krav');

  addControl(archCat, 'Kryptering', 'Kryptering af data i hvile', 'Encryption of data at rest',
    'Folsomme data skal krypteres nar de opbevares pa disk, i databaser og i backup-medier.',
    'Sensitive data must be encrypted when stored on disk, in databases, and on backup media.',
    '8.24', null, 'Krav');

  addControl(archCat, 'Kryptering', 'Noeglehandtering', 'Key management',
    'Krypteringsnoegler skal genereres, opbevares og roteres i overensstemmelse med organisationens krypteringspolitik.',
    'Encryption keys must be generated, stored, and rotated in accordance with the organization encryption policy.',
    '8.24', null, null);

  addControl(archCat, 'Haerdning', 'Systemhaerdning', 'System hardening',
    'Alle systemer skal haerdes i henhold til organisationens haerdningsguider baseret pa CIS Benchmarks eller tilsvarende.',
    'All systems must be hardened according to the organization hardening guides based on CIS Benchmarks or equivalent.',
    '8.9', null, 'Krav');

  addControl(archCat, 'Haerdning', 'Sikker konfigurationsstyring', 'Secure configuration management',
    'Systemkonfigurationer skal styres centralt med versionsstyring og automatisk compliance-kontrol.',
    'System configurations must be managed centrally with version control and automatic compliance checking.',
    '8.9', null, null);

  addControl(archCat, 'Backup', 'Backup og gendannelse', 'Backup and recovery',
    'Organisationen skal have en backup-strategi med regelmaeessig test af gendannelsesprocedurer. Backups skal opbevares offline eller air-gapped.',
    'The organization must have a backup strategy with regular testing of recovery procedures. Backups must be stored offline or air-gapped.',
    '8.13', 'Implementer 3-2-1 backup-strategi. Test gendannelse kvartalsmaeessigt.', 'Krav');

  // === Personalesikkerhed (Personnel Security) ===
  const persCat = 'Personalesikkerhed';

  addControl(persCat, 'Uddannelse', 'Sikkerhedsbevidsthedstraening', 'Security awareness training',
    'Alle medarbejdere skal gennemfore arlig sikkerhedsbevidsthedstraening der daekker phishing, social engineering og datahygiejne.',
    'All employees must complete annual security awareness training covering phishing, social engineering, and data hygiene.',
    '6.3', 'Gennemfor kvartalsvis phishing-simulation og arlig sikkerhedstraening.', 'Krav');

  addControl(persCat, 'Uddannelse', 'Specialiseret sikkerhedstraening for IT-personale', 'Specialized security training for IT staff',
    'IT-personale med sikkerhedsansvar skal modtage specialiseret teknisk sikkerhedstraening og certificering.',
    'IT staff with security responsibilities must receive specialized technical security training and certification.',
    '6.3', null, null);

  addControl(persCat, 'Ansaettelse', 'Sikkerhedsscreening ved ansaettelse', 'Security screening at employment',
    'Ansaettelsesprocessen skal inkludere sikkerhedsscreening proportional med adgangsniveauet til folsomme systemer og data.',
    'The hiring process must include security screening proportional to the level of access to sensitive systems and data.',
    '6.1', null, 'Krav');

  addControl(persCat, 'Ansaettelse', 'Ansaettelsesvilkar og fortrolighedsaftaler', 'Terms of employment and confidentiality agreements',
    'Alle medarbejdere skal underskrive fortrolighedsaftaler der specificerer deres ansvar for informationssikkerhed.',
    'All employees must sign confidentiality agreements specifying their responsibilities for information security.',
    '6.2', null, null);

  // === Beredskab (Continuity) ===
  const contCat = 'Beredskab';

  addControl(contCat, 'Planer', 'IT-beredskabsplan', 'IT contingency plan',
    'Organisationen skal have en dokumenteret IT-beredskabsplan der sikrer fortsat drift eller hurtig genopretning ved alvorlige IT-haendelser.',
    'The organization must have a documented IT contingency plan that ensures continued operations or rapid recovery in case of serious IT incidents.',
    '5.30', 'Dokumenter RTO og RPO for alle kritiske systemer. Test planen arligt.', 'Krav');

  addControl(contCat, 'Planer', 'Beredskabsoevelser', 'Contingency exercises',
    'Beredskabsplaner skal testes mindst arligt gennem oeevelser der simulerer realistiske scenarier.',
    'Contingency plans must be tested at least annually through exercises that simulate realistic scenarios.',
    '5.30', null, 'Krav');

  addControl(contCat, 'Forretningskontinuitet', 'Business Impact Analyse', 'Business impact analysis',
    'Organisationen skal gennemfore en Business Impact Analyse (BIA) for at identificere kritiske forretningsprocesser og deres afhaengighed af IT-systemer.',
    'The organization must conduct a Business Impact Analysis (BIA) to identify critical business processes and their dependence on IT systems.',
    '5.29', null, null);

  return controls;
}

async function main(): Promise<void> {
  console.log('CFCS Vejledning Ingestion Script');
  console.log('=================================');

  const controls = generateControls();
  console.log(`Generated ${controls.length} CFCS controls`);

  // Validate
  let errors = 0;
  for (const c of controls) {
    if (!c.control_number) { console.error(`Missing control_number`); errors++; }
    if (!c.title_nl) { console.error(`Missing title_nl for ${c.control_number}`); errors++; }
    if (!c.description_nl) { console.error(`Missing description_nl for ${c.control_number}`); errors++; }
  }
  if (errors > 0) { console.error(`${errors} validation errors`); process.exit(1); }

  // Category distribution
  const catCount: Record<string, number> = {};
  for (const c of controls) { catCount[c.category] = (catCount[c.category] || 0) + 1; }
  console.log('\nCategory distribution:');
  for (const [cat, count] of Object.entries(catCount).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${cat}: ${count}`);
  }

  mkdirSync(DATA_DIR, { recursive: true });

  const output = {
    framework: {
      id: 'cfcs-vejledning',
      name: 'CFCS Cybersecurity Guidelines',
      name_nl: 'CFCS Cybersikkerhedsvejledning',
      issuing_body: 'Center for Cybersikkerhed (CFCS)',
      version: '2024',
      effective_date: '2024-01-01',
      scope: 'Cybersecurity guidelines for Danish government authorities and critical infrastructure operators',
      scope_sectors: ['government', 'digital_infrastructure', 'energy', 'telecom', 'transport', 'water'],
      structure_description: 'Guidelines organized by security domain: network security, identity management, logging and monitoring, incident management, secure development, security architecture, personnel security, and continuity.',
      source_url: 'https://www.cfcs.dk/da/forebyggelse/vejledninger/',
      license: 'Public sector publication',
      language: 'da+en',
    },
    controls,
    metadata: {
      ingested_at: new Date().toISOString(),
      source: 'CFCS vejledninger (compiled from published guidance)',
      total_controls: controls.length,
    },
  };

  writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2), 'utf-8');
  console.log(`\nOutput: ${OUTPUT_FILE} (${controls.length} controls)`);
}

main().catch((err) => { console.error('Fatal:', err); process.exit(1); });
