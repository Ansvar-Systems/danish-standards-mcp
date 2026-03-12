// scripts/seed-test-db.ts
// Builds a minimal test database at data/standards.db for development and testing.
// Uses @ansvar/mcp-sqlite (WASM-based, CommonJS loaded via createRequire).

import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, '..', 'data', 'standards.db');

// Ensure the data directory exists
mkdirSync(join(__dirname, '..', 'data'), { recursive: true });

const require = createRequire(import.meta.url);
const { Database } = require('@ansvar/mcp-sqlite');
const db = new Database(DB_PATH);

db.exec(`
CREATE TABLE IF NOT EXISTS frameworks (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_nl TEXT,
  issuing_body TEXT NOT NULL,
  version TEXT NOT NULL,
  effective_date TEXT,
  scope TEXT,
  scope_sectors TEXT,
  structure_description TEXT,
  source_url TEXT,
  license TEXT,
  language TEXT NOT NULL DEFAULT 'da'
);

CREATE TABLE IF NOT EXISTS controls (
  id TEXT PRIMARY KEY,
  framework_id TEXT NOT NULL REFERENCES frameworks(id),
  control_number TEXT NOT NULL,
  title TEXT,
  title_nl TEXT NOT NULL,
  description TEXT,
  description_nl TEXT NOT NULL,
  category TEXT,
  subcategory TEXT,
  level TEXT,
  iso_mapping TEXT,
  implementation_guidance TEXT,
  verification_guidance TEXT,
  source_url TEXT
);

CREATE VIRTUAL TABLE IF NOT EXISTS controls_fts USING fts5(
  id,
  title,
  title_nl,
  description,
  description_nl,
  category,
  content='controls',
  content_rowid='rowid'
);

CREATE TABLE IF NOT EXISTS db_metadata (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
`);

const insertFramework = db.prepare(
  'INSERT OR REPLACE INTO frameworks (id, name, name_nl, issuing_body, version, effective_date, scope, scope_sectors, structure_description, source_url, license, language) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
);

insertFramework.run('cfcs-vejledning', 'CFCS Cybersecurity Guidance', 'CFCS Cybersikkerhedsvejledning', 'Center for Cybersikkerhed (CFCS)', '2024', '2024-01-01', 'National cybersecurity guidance for Danish public and private sectors', '["government","finance","energy","telecom","transport","water","digital_infrastructure"]', 'Organized by security domains: network, identity, logging, incident response, secure development, architecture, personnel, preparedness', 'https://www.cfcs.dk/da/forebyggelse/vejledninger/', 'Public sector publication', 'da+en');

insertFramework.run('digst-sikkerhed', 'Digitaliseringsstyrelsen Security Guidance', 'Digitaliseringsstyrelsens sikkerhedsvejledning', 'Digitaliseringsstyrelsen', '2023', '2023-01-01', 'IT security requirements for Danish government digital services', '["government"]', 'Aligned with ISO 27001, organized by ISMS domains', 'https://digst.dk/sikkerhed/', 'CC BY 4.0', 'da+en');

insertFramework.run('statens-iso27001', 'State ISO 27001 Implementation', 'Statens implementering af ISO 27001', 'Digitaliseringsstyrelsen / Statens IT', '2023', '2023-06-01', 'Danish government ISO 27001 Annex A controls implementation guidance', '["government"]', 'Controls organized by ISO 27001 Annex A domains (A.5 through A.18)', 'https://statens-it.dk/', 'Public sector publication', 'da+en');

insertFramework.run('d-maerket', 'D-maerket Digital Trust Label', 'D-maerket', 'Erhvervsstyrelsen / D-maerket', '2024', '2024-01-01', 'Danish digital trust label criteria for IT security, data protection, and responsible practices', '["government","healthcare","finance","education"]', 'Three pillars: IT-sikkerhed, Databeskyttelse, Ansvarlighed', 'https://d-maerket.dk/', 'Public sector publication', 'da+en');

insertFramework.run('datatilsynet-dk', 'Datatilsynet Security Measures', 'Datatilsynets sikkerhedsforanstaltninger', 'Datatilsynet (Danish DPA)', '2023', '2023-01-01', 'Technical and organizational security measures required under GDPR as specified by the Danish DPA', '["government","healthcare","finance","education"]', 'Organized by security domains: access control, encryption, logging, vulnerability management, backup, deletion, network, physical, breach response, vendor management, privacy by design', 'https://www.datatilsynet.dk/', 'Public sector publication', 'da+en');

insertFramework.run('sds-sundhed', 'SDS Healthcare IT Security', 'Sundhedsdatastyrelsens IT-sikkerhedskrav', 'Sundhedsdatastyrelsen (SDS)', '2023', '2023-01-01', 'IT security requirements for Danish healthcare data systems', '["healthcare"]', 'Organized by domains: patient data protection, system security, availability, physical security, governance', 'https://sundhedsdatastyrelsen.dk/', 'Public sector publication', 'da+en');

// New frameworks
insertFramework.run('cfcs-ics', 'CFCS ICS/OT Security Guidance', 'CFCS Vejledning om sikkerhed i industrielle kontrolsystemer', 'Center for Cybersikkerhed (CFCS)', '2024', '2024-01-01', 'Security guidance for industrial control systems and operational technology in Danish critical infrastructure', '["energy","water","transport","digital_infrastructure"]', 'OT security domains: network isolation, remote access, vulnerability management, incident response, monitoring', 'https://www.cfcs.dk/da/forebyggelse/vejledninger/industrielle-kontrolsystemer/', 'Public sector publication', 'da+en');

insertFramework.run('cfcs-ransomware', 'CFCS Ransomware Protection Guidance', 'CFCS Vejledning om beskyttelse mod ransomware', 'Center for Cybersikkerhed (CFCS)', '2024', '2024-01-01', 'Guidance for preventing, detecting, and responding to ransomware attacks', '["government","healthcare","finance","energy","education","digital_infrastructure"]', 'Defense phases: prevention, detection, backup and recovery, response', 'https://www.cfcs.dk/da/forebyggelse/vejledninger/ransomware/', 'Public sector publication', 'da+en');

insertFramework.run('cfcs-cloud', 'CFCS Cloud Security Guidance', 'CFCS Vejledning om cloudsikkerhed', 'Center for Cybersikkerhed (CFCS)', '2024', '2024-01-01', 'Security guidance for Danish organizations adopting cloud services', '["government","healthcare","finance","energy","education"]', 'Cloud security domains: risk assessment, identity, configuration, monitoring, vendor management', 'https://www.cfcs.dk/da/forebyggelse/vejledninger/cloudsikkerhed/', 'Public sector publication', 'da+en');

insertFramework.run('cfcs-supply-chain', 'CFCS Supply Chain Security Guidance', 'CFCS Vejledning om leverandoerstyring', 'Center for Cybersikkerhed (CFCS)', '2024', '2024-01-01', 'Guidance for managing cybersecurity risks in the supply chain', '["government","healthcare","finance","energy","digital_infrastructure"]', 'Supply chain domains: vendor assessment, contracts, access, monitoring, software supply chain', 'https://www.cfcs.dk/da/forebyggelse/vejledninger/leverandoerstyring/', 'Public sector publication', 'da+en');

insertFramework.run('cfcs-secure-dev', 'CFCS Secure Software Development Guidance', 'CFCS Vejledning om sikker softwareudvikling', 'Center for Cybersikkerhed (CFCS)', '2024', '2024-01-01', 'Guidance for secure software development practices', '["government","healthcare","finance","digital_infrastructure"]', 'Secure development domains: SDLC, coding, review, CI/CD, vulnerability management', 'https://www.cfcs.dk/da/forebyggelse/vejledninger/sikker-softwareudvikling/', 'Public sector publication', 'da+en');

insertFramework.run('digst-fda', 'Common Public Digital Architecture Security (FDA)', 'Faellesoffentlig Digital Arkitektur - sikkerhedskrav', 'Digitaliseringsstyrelsen (Digst)', '2024', '2024-01-01', 'Security requirements for common public digital architecture in Denmark', '["government"]', 'FDA security domains: digital identity, data sharing, service platform, architecture security', 'https://arkitektur.digst.dk/', 'CC BY 4.0', 'da+en');

insertFramework.run('finanstilsynet-ikt', 'Finanstilsynet ICT Requirements', 'Finanstilsynets IKT-krav', 'Finanstilsynet (Danish FSA)', '2025', '2025-01-17', 'ICT security and risk management requirements for Danish financial companies including DORA', '["finance"]', 'Domains: ICT governance, risk management, security, outsourcing, incident management, DORA', 'https://www.finanstilsynet.dk/lovgivning/', 'Public sector publication', 'da+en');

insertFramework.run('nis2-dk', 'Danish NIS2 Implementation (L 111)', 'Dansk NIS2-implementering', 'Forsvarsministeriet / Sektormyndigheder', '2025', '2025-01-01', 'Network and information security requirements for essential and important entities in Denmark', '["energy","transport","finance","healthcare","water","digital_infrastructure","government"]', 'NIS2 obligations: governance, risk management (Art. 21), incident reporting (Art. 23)', 'https://www.retsinformation.dk/eli/lta/2024/1705', 'Public sector publication', 'da+en');

insertFramework.run('sikkerhedscirkulaeret', 'Government Security Circular', 'Sikkerhedscirkul aeret', 'Justitsministeriet / PET / CFCS', '2014', '2014-11-17', 'Requirements for handling classified government information', '["government"]', 'Domains: classification, personnel security, physical security, IT security, transport', 'https://www.retsinformation.dk/eli/retsinfo/2014/10338', 'Public sector publication', 'da+en');

insertFramework.run('medcom-standarder', 'MedCom Healthcare Messaging Security Standards', 'MedCom standarder for sundhedsmeddelelser', 'MedCom', '2024', '2024-01-01', 'Security standards for healthcare messaging and integration', '["healthcare"]', 'Domains: message security, access control, Health Data Network, audit and logging', 'https://www.medcom.dk/standarder/', 'Public sector publication', 'da+en');

insertFramework.run('energistyrelsen-cyber', 'Danish Energy Agency Cybersecurity Requirements', 'Energistyrelsens cybersikkerhedskrav', 'Energistyrelsen', '2025', '2025-01-01', 'Cybersecurity requirements for Danish energy sector operators', '["energy"]', 'Domains: governance, OT security, incident management, supply security', 'https://ens.dk/ansvarsomraader/cybersikkerhed/', 'Public sector publication', 'da+en');

insertFramework.run('trafikstyrelsen-ikt', 'Danish Transport Authority ICT Security', 'Trafikstyrelsens IKT-sikkerhedskrav', 'Trafikstyrelsen', '2025', '2025-01-01', 'ICT security requirements for Danish transport sector', '["transport"]', 'Domains: governance, operational security per mode, incident management, safety/security', 'https://www.trafikstyrelsen.dk/', 'Public sector publication', 'da+en');

insertFramework.run('kl-sikkerhed', 'KL Municipal Information Security Guidance', 'KL Kommunernes sikkerhedsvejledning', 'KL (Kommunernes Landsforening)', '2024', '2024-01-01', 'Information security guidance for Danish municipalities', '["government"]', 'Domains: ISMS, citizen data, employee security, IT operations, NIS2 compliance', 'https://www.kl.dk/it-og-digitalisering/informationssikkerhed/', 'Public sector publication', 'da+en');

insertFramework.run('ds484', 'Danish Code of Practice for Information Security', 'DS 484 Dansk Standard for informationssikkerhed', 'Dansk Standard (DS)', '2024', '2024-01-01', 'Danish code of practice for information security management based on ISO 27001/27002', '["government","healthcare","finance","education"]', 'Traditional ISO domains with Danish regulatory adaptations', 'https://www.ds.dk/da/standarder/informationssikkerhed/', 'Public sector publication', 'da+en');

const insertControl = db.prepare(
  'INSERT OR REPLACE INTO controls (id, framework_id, control_number, title, title_nl, description, description_nl, category, subcategory, level, iso_mapping, implementation_guidance, verification_guidance, source_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
);

// CFCS controls
insertControl.run('cfcs-vejledning:N01', 'cfcs-vejledning', 'N01', 'Network segmentation', 'Netvaerkssegmentering', 'Segment networks into security zones with controlled traffic between zones. Use firewalls and access control lists to enforce separation.', 'Opdel netvaerk i sikkerhedszoner med kontrolleret trafik mellem zoner. Brug firewalls og adgangskontrollister til at gennemtvinge separation.', 'Netvaerkssikkerhed', 'Segmentering', null, '8.22', 'Define network zones based on data classification. Deploy next-gen firewalls between zones.', 'Verify network diagrams, firewall rules, and zone separation testing results.', 'https://www.cfcs.dk/da/forebyggelse/vejledninger/');

insertControl.run('cfcs-vejledning:N12', 'cfcs-vejledning', 'N12', 'DNS security', 'DNS-sikkerhed', 'Implement DNS security measures including DNSSEC validation, DNS filtering, and protection against DNS-based attacks.', 'Implementer DNS-sikkerhedsforanstaltninger herunder DNSSEC-validering, DNS-filtrering og beskyttelse mod DNS-baserede angreb.', 'Netvaerkssikkerhed', 'DNS', null, '8.22', 'Deploy DNSSEC, configure DNS filtering, and monitor DNS queries for anomalies.', 'Test DNSSEC validation, review DNS filtering policies.', null);

insertControl.run('cfcs-vejledning:I01', 'cfcs-vejledning', 'I01', 'Multi-factor authentication', 'Multifaktorautentificering', 'Implement multi-factor authentication for all remote access, privileged accounts, and access to sensitive systems.', 'Implementer multifaktorautentificering for al fjernadgang, privilegerede konti og adgang til folsomme systemer.', 'Identitetsstyring', 'Autentificering', null, '8.5', 'Deploy MFA for VPN, admin accounts, and cloud services. Use hardware tokens or authenticator apps.', 'Verify MFA enforcement on all critical entry points.', null);

insertControl.run('cfcs-vejledning:L01', 'cfcs-vejledning', 'L01', 'Centralized logging', 'Central logning', 'Establish centralized log collection for all security-relevant events across infrastructure and applications.', 'Etabler central logindsamling for alle sikkerhedsrelevante haendelser pa tvaers af infrastruktur og applikationer.', 'Logging og overvagning', 'Logindsamling', null, '8.15', 'Deploy SIEM or centralized log management. Define retention policies per data classification.', 'Verify log sources are connected, retention policies enforced, and alerts configured.', null);

// Statens ISO 27001 controls
insertControl.run('statens-iso27001:A.5.1', 'statens-iso27001', 'A.5.1', 'Policies for information security', 'Politikker for informationssikkerhed', 'A set of policies for information security shall be defined, approved by management, published, communicated to, and acknowledged by relevant personnel and interested parties.', 'Et saet af politikker for informationssikkerhed skal defineres, godkendes af ledelsen, offentliggoeres, kommunikeres til og anerkendes af relevant personale og interesserede parter.', 'Organisatoriske kontroller', 'Sikkerhedspolitikker', null, 'A.5.1', 'Develop and maintain an ISMS policy document. Ensure annual review and management sign-off.', 'Verify policy documents exist, are current, and staff have acknowledged them.', null);

insertControl.run('statens-iso27001:A.9.1', 'statens-iso27001', 'A.9.1', 'Access control policy', 'Adgangsstyringspolitik', 'An access control policy shall be established, documented and reviewed based on business and information security requirements.', 'En adgangsstyringspolitik skal etableres, dokumenteres og gennemgas baseret pa forretnings- og informationssikkerhedskrav.', 'Adgangsstyring', 'Politik', null, 'A.9.1', 'Define access control policy covering user registration, privilege management, and review cycles.', 'Review access control policy, user provisioning records, and access review logs.', null);

insertControl.run('statens-iso27001:A.12.6', 'statens-iso27001', 'A.12.6', 'Technical vulnerability management', 'Teknisk sarbarhedsstyring', 'Information about technical vulnerabilities of information systems shall be obtained, the exposure evaluated, and appropriate measures taken.', 'Information om tekniske sarbarheder i informationssystemer skal indhentes, eksponeringen vurderes, og passende foranstaltninger ivaerksaettes.', 'Driftssikkerhed', 'Sarbarhedsstyring', null, 'A.12.6', 'Implement vulnerability scanning, patch management, and risk-based remediation processes.', 'Review scan reports, patch compliance, and remediation timelines.', null);

// SDS controls
insertControl.run('sds-sundhed:SDS01', 'sds-sundhed', 'SDS01', 'Patient data encryption at rest', 'Kryptering af patientdata i hvile', 'All patient-identifiable health data must be encrypted at rest using approved encryption algorithms.', 'Alle patientidentificerbare sundhedsdata skal krypteres i hvile ved hjaelp af godkendte krypteringsalgoritmer.', 'Patientdatabeskyttelse', 'Kryptering', null, '8.24', 'Use AES-256 or equivalent for all stored patient data. Manage encryption keys in a dedicated key management system.', 'Verify encryption is active on all storage containing patient data.', null);

// Datatilsynet controls
insertControl.run('datatilsynet-dk:DT01', 'datatilsynet-dk', 'DT01', 'Role-based access control', 'Rollebaseret adgangsstyring', 'Access to personal data shall be restricted based on documented roles and the principle of least privilege.', 'Adgang til personoplysninger skal begraenses baseret pa dokumenterede roller og princippet om mindst mulig adgang.', 'Adgangsstyring', 'Rollebaseret adgang', null, '5.15', 'Define access roles based on job functions. Implement RBAC in all systems processing personal data.', 'Review role definitions, access matrices, and access review records.', null);

// D-maerket controls
insertControl.run('d-maerket:DM01', 'd-maerket', 'DM01', 'Penetration testing', 'Penetrationstest', 'The organization shall conduct regular penetration testing of internet-facing systems and document remediation actions.', 'Organisationen skal gennemfore regelmassig penetrationstest af internetvendte systemer og dokumentere udbedring.', 'IT-sikkerhed', 'Test', null, '8.8', 'Conduct annual penetration tests by qualified external testers. Track and remediate findings within defined timelines.', 'Verify penetration test reports, remediation status, and retest results.', null);

// Digst controls
insertControl.run('digst-sikkerhed:DS01', 'digst-sikkerhed', 'DS01', 'ISMS establishment', 'Etablering af ISMS', 'The organization shall establish, implement, maintain and continually improve an information security management system.', 'Organisationen skal etablere, implementere, vedligeholde og lobende forbedre et ledelsessystem for informationssikkerhed.', 'ISMS', 'Ledelsessystem', null, 'A.5.1', 'Establish ISMS scope, policy, risk assessment methodology, and statement of applicability.', 'Verify ISMS documentation, management commitment, and continuous improvement records.', null);

// CFCS ICS control
insertControl.run('cfcs-ics:ICS01', 'cfcs-ics', 'ICS01', 'Separation of IT and OT networks', 'Adskillelse af IT- og OT-netvaerk', 'Industrial control systems must be physically or logically separated from the corporate IT network.', 'Industrielle kontrolsystemer skal vaere fysisk eller logisk adskilt fra virksomhedens IT-netvaerk.', 'Netvaerksisolering', 'OT/IT-separation', 'Krav', '8.22', null, null, null);

// CFCS Ransomware control
insertControl.run('cfcs-ransomware:RW01', 'cfcs-ransomware', 'RW01', 'Email filtering against ransomware', 'E-mail-filtrering mod ransomware', 'The organization must implement advanced email filtering that blocks executable attachments.', 'Organisationen skal implementere avanceret e-mail-filtrering der blokerer eksekverbare vedhaeftninger.', 'Forebyggelse', 'E-mail', 'Krav', '8.23', null, null, null);

// CFCS Cloud control
insertControl.run('cfcs-cloud:CL01', 'cfcs-cloud', 'CL01', 'Risk assessment before cloud adoption', 'Risikovurdering foer cloud-adoption', 'The organization must conduct a risk assessment before cloud migration.', 'Organisationen skal gennemfoere en risikovurdering foer migration til cloud.', 'Risikovurdering', 'Klassifikation', 'Krav', '5.7', null, null, null);

// CFCS Supply Chain control
insertControl.run('cfcs-supply-chain:SC01', 'cfcs-supply-chain', 'SC01', 'Vendor risk assessment', 'Risikovurdering af leverandoerer', 'The organization must conduct a risk assessment of all vendors with access to systems.', 'Organisationen skal gennemfoere en risikovurdering af alle leverandoerer med adgang til systemer.', 'Leverandoervurdering', 'Risiko', 'Krav', '5.19', null, null, null);

// CFCS Secure Dev control
insertControl.run('cfcs-secure-dev:SD01', 'cfcs-secure-dev', 'SD01', 'Secure software development lifecycle (SSDLC)', 'Sikker softwareudviklingslivscyklus', 'The organization must implement a secure software development lifecycle.', 'Organisationen skal implementere en sikker softwareudviklingslivscyklus.', 'Sikker udviklingsproces', 'SDLC', 'Krav', '8.25', null, null, null);

// Digst FDA control
insertControl.run('digst-fda:FDA01', 'digst-fda', 'FDA01', 'MitID integration for public services', 'MitID-integration for offentlige tjenester', 'Public digital services must integrate with MitID as primary identification solution.', 'Offentlige digitale tjenester skal integrere med MitID som primaer identifikationsloesning.', 'Digital identitet', 'MitID', 'Krav', '8.5', null, null, null);

// Finanstilsynet control
insertControl.run('finanstilsynet-ikt:FT01', 'finanstilsynet-ikt', 'FT01', 'Board responsibility for ICT risk management', 'Bestyrelsens ansvar for IKT-risikostyring', 'The board must approve and regularly review the ICT risk management strategy.', 'Bestyrelsen skal godkende og regelmaeessigt gennemga IKT-risikostyringsstrategi.', 'IKT-governance', 'Ledelsesansvar', 'Krav', '5.1', null, null, null);

// NIS2-DK control
insertControl.run('nis2-dk:NIS01', 'nis2-dk', 'NIS01', 'Management responsibility for cybersecurity (NIS2 Art. 20)', 'Ledelsens ansvar for cybersikkerhed', 'Management of essential and important entities must approve and supervise cybersecurity measures.', 'Ledelsen i vaesentlige og vigtige enheder skal godkende og foeere tilsyn med cybersikkerhedsforanstaltninger.', 'Governance', 'Ledelsesansvar', 'Krav', '5.1', null, null, null);

// Sikkerhedscirkul aeret control
insertControl.run('sikkerhedscirkulaeret:SIK01', 'sikkerhedscirkulaeret', 'SIK01', 'Classification levels for information', 'Klassifikationsniveauer for information', 'Government information must be classified at four levels: TOP SECRET, SECRET, CONFIDENTIAL, RESTRICTED.', 'Statslig information skal klassificeres i fire niveauer: YDERST HEMMELIGT, HEMMELIGT, FORTROLIGT og TIL TJENESTEBRUG.', 'Klassifikation', 'Niveauer', 'Krav', '5.12', null, null, null);

// MedCom control
insertControl.run('medcom-standarder:MC01', 'medcom-standarder', 'MC01', 'Encryption of health messages', 'Kryptering af sundhedsmeddelelser', 'All electronic health messages containing patient-identifiable information must be encrypted during transmission.', 'Alle elektroniske sundhedsmeddelelser der indeholder patientidentificerbare oplysninger skal krypteres under transmission.', 'Beskedsikkerhed', 'Kryptering', 'Krav', '8.24', null, null, null);

// Energistyrelsen control
insertControl.run('energistyrelsen-cyber:EN01', 'energistyrelsen-cyber', 'EN01', 'Management responsibility for cybersecurity in energy sector', 'Ledelsesansvar for cybersikkerhed i energisektoren', 'Management in energy companies must approve and monitor cybersecurity measures.', 'Ledelsen i energivirksomheder skal godkende og overvaage cybersikkerhedsforanstaltninger.', 'Governance', 'Ledelse', 'Krav', '5.1', null, null, null);

// Trafikstyrelsen control
insertControl.run('trafikstyrelsen-ikt:TS01', 'trafikstyrelsen-ikt', 'TS01', 'Cybersecurity policy for transport companies', 'Cybersikkerhedspolitik for transportvirksomheder', 'Transport companies covered by NIS2 must have an approved cybersecurity policy.', 'Transportvirksomheder omfattet af NIS2 skal have en godkendt cybersikkerhedspolitik.', 'Governance', 'Politik', 'Krav', '5.1', null, null, null);

// KL control
insertControl.run('kl-sikkerhed:KL01', 'kl-sikkerhed', 'KL01', 'Municipal ISMS based on ISO 27001', 'Kommunalt ISMS baseret pa ISO 27001', 'Municipalities must establish an ISMS based on ISO 27001.', 'Kommuner skal etablere et ISMS baseret pa ISO 27001.', 'ISMS', 'Ledelsessystem', 'Krav', '5.1', null, null, null);

// DS 484 control
insertControl.run('ds484:DS01', 'ds484', 'DS01', 'Management commitment to information security', 'Ledelsesforpligtelse til informationssikkerhed', 'Management must demonstrate commitment to information security.', 'Ledelsen skal demonstrere forpligtelse til informationssikkerhed.', 'Organisatorisk sikkerhed', 'Ledelse', 'Krav', '5.1', null, null, null);

db.exec("INSERT INTO controls_fts(controls_fts) VALUES('rebuild')");

const insertMeta = db.prepare('INSERT OR REPLACE INTO db_metadata (key, value) VALUES (?, ?)');
insertMeta.run('schema_version', '1.0');
insertMeta.run('category', 'domain_intelligence');
insertMeta.run('mcp_name', 'Danish Standards MCP');
insertMeta.run('database_built', new Date().toISOString().split('T')[0]);
insertMeta.run('database_version', '0.1.0');

db.pragma('journal_mode=DELETE');
db.exec('VACUUM');
db.close();

console.log('Test database seeded at data/standards.db');
