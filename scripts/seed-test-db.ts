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
