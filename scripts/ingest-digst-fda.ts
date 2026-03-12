// scripts/ingest-digst-fda.ts
// Digitaliseringsstyrelsen Faellesoffentlig Digital Arkitektur (FDA) security requirements

import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'data', 'extracted');
const OUTPUT_FILE = join(DATA_DIR, 'digst-fda.json');

interface Control {
  control_number: string; title: string; title_nl: string; description: string; description_nl: string;
  category: string; subcategory: string | null; level: string | null; iso_mapping: string | null;
  implementation_guidance: string | null; verification_guidance: string | null; source_url: string;
}

function generateControls(): Control[] {
  const controls: Control[] = [];
  let seq = 1;
  function add(cat: string, sub: string | null, tDa: string, tEn: string, dDa: string, dEn: string, iso: string | null, guide: string | null, level: string | null) {
    controls.push({ control_number: `FDA${seq.toString().padStart(2, '0')}`, title: tEn, title_nl: tDa, description: dEn, description_nl: dDa, category: cat, subcategory: sub, level: level ?? 'Krav', iso_mapping: iso, implementation_guidance: guide, verification_guidance: null, source_url: 'https://arkitektur.digst.dk/' });
    seq++;
  }

  // === Digital identitet (Digital Identity) ===
  add('Digital identitet', 'MitID', 'MitID-integration for offentlige tjenester', 'MitID integration for public services',
    'Offentlige digitale tjenester skal integrere med MitID som primaer identifikationsloesning for borgere og virksomheder.',
    'Public digital services must integrate with MitID as the primary identification solution for citizens and businesses.',
    '8.5', 'Anvend MitID Erhverv for virksomhedslogon. Implementer NSIS-sikringsniveauer baseret pa risikovurdering.', 'Krav');

  add('Digital identitet', 'MitID', 'NSIS-sikringsniveauer', 'NSIS assurance levels',
    'Offentlige tjenester skal vaelge NSIS-sikringsniveau (Lav, Betydelig, Hoej) baseret pa konsekvensanalyse af uberettiget adgang.',
    'Public services must select NSIS assurance level (Low, Substantial, High) based on impact analysis of unauthorized access.',
    '8.5', null, 'Krav');

  add('Digital identitet', 'Foederation', 'Foedereret identitetsstyring', 'Federated identity management',
    'Offentlige loesninger skal understotte foedereret identitetsstyring via SAML 2.0 eller OpenID Connect for single sign-on.',
    'Public solutions must support federated identity management via SAML 2.0 or OpenID Connect for single sign-on.',
    '8.5', null, 'Krav');

  add('Digital identitet', 'Fuldmagt', 'Digital fuldmagt og repraesentation', 'Digital power of attorney and representation',
    'Systemer skal understotte digital fuldmagt sa borgere og virksomheder kan repraesenteres af andre ved offentlige henvendelser.',
    'Systems must support digital power of attorney so citizens and businesses can be represented by others in public interactions.',
    '5.15', null, 'Anbefaling');

  // === Datadeling (Data Sharing) ===
  add('Datadeling', 'Sikkerhed', 'Sikkerhed i datadeling mellem myndigheder', 'Security in data sharing between authorities',
    'Datadeling mellem offentlige myndigheder skal ske via godkendte infrastrukturer med adgangskontrol, logning og kryptering.',
    'Data sharing between public authorities must use approved infrastructures with access control, logging, and encryption.',
    '8.24', null, 'Krav');

  add('Datadeling', 'Samtykke', 'Samtykkehaandtering for datadeling', 'Consent management for data sharing',
    'Systemer der deler personoplysninger pa tvaers af myndigheder skal implementere samtykkehaandtering i overensstemmelse med GDPR.',
    'Systems sharing personal data across authorities must implement consent management in accordance with GDPR.',
    '5.34', null, 'Krav');

  add('Datadeling', 'API', 'Sikre API-er til offentlige data', 'Secure APIs for public data',
    'Offentlige data-API-er skal beskyttes med autentifikation, autorisering, rate limiting og input-validering.',
    'Public data APIs must be protected with authentication, authorization, rate limiting, and input validation.',
    '8.28', null, 'Krav');

  add('Datadeling', 'Klassifikation', 'Dataklassifikation ved deling', 'Data classification for sharing',
    'Data der deles mellem myndigheder skal klassificeres og behandles i henhold til den offentlige informationsklassifikationsmodel.',
    'Data shared between authorities must be classified and handled in accordance with the public information classification model.',
    '5.12', null, 'Krav');

  // === Serviceplatform (Service Platform) ===
  add('Serviceplatform', 'Integration', 'Integration med faellesoffentlige platforme', 'Integration with common public platforms',
    'Offentlige IT-loesninger skal integrere med relevante faellesoffentlige platforme (Serviceplatformen, NemLog-in, Digital Post) via standardiserede graenseflader.',
    'Public IT solutions must integrate with relevant common public platforms (Service Platform, NemLog-in, Digital Post) via standardized interfaces.',
    '8.26', null, 'Krav');

  add('Serviceplatform', 'Integration', 'Sikkerhed i Serviceplatformen', 'Service Platform security',
    'Integrationer via Serviceplatformen skal anvende certifikatbaseret autentifikation og overholde platformens sikkerhedskrav.',
    'Integrations via the Service Platform must use certificate-based authentication and comply with the platform security requirements.',
    '8.5', null, 'Krav');

  // === Arkitektursikkerhed (Architecture Security) ===
  add('Arkitektursikkerhed', 'Principper', 'Sikkerhed som arkitekturprincip', 'Security as architectural principle',
    'Informationssikkerhed skal vaere et grundlaeggende arkitekturprincip i alle offentlige IT-loesninger fra design til drift.',
    'Information security must be a fundamental architectural principle in all public IT solutions from design to operation.',
    '8.27', null, 'Krav');

  add('Arkitektursikkerhed', 'Principper', 'Privacy by design i offentlige loesninger', 'Privacy by design in public solutions',
    'Offentlige loesninger skal designes med databeskyttelse som standard (privacy by design og by default).',
    'Public solutions must be designed with data protection by default (privacy by design and by default).',
    '5.34', null, 'Krav');

  add('Arkitektursikkerhed', 'Standarder', 'Anvendelse af aabne standarder', 'Use of open standards',
    'Offentlige IT-loesninger skal anvende aabne standarder for at sikre interoperabilitet og undga leverandoerlaas.',
    'Public IT solutions must use open standards to ensure interoperability and avoid vendor lock-in.',
    '8.26', null, 'Krav');

  add('Arkitektursikkerhed', 'Modning', 'Sikkerhedsvurdering af nye teknologier', 'Security assessment of new technologies',
    'Nye teknologier inklusiv AI og cloud skal gennemga en sikkerhedsvurdering foer adoption i offentlige loesninger.',
    'New technologies including AI and cloud must undergo a security assessment before adoption in public solutions.',
    '5.7', null, 'Krav');

  // === Kommunal integration (Municipal Integration) ===
  add('Kommunal integration', 'KomBit', 'KomBit-loesninger og sikkerhed', 'KomBit solutions and security',
    'Kommunale IT-loesninger anskaffet via KomBit skal overholde de faellesoffentlige arkitekturkrav inklusiv sikkerhedsstandarder.',
    'Municipal IT solutions procured via KomBit must comply with common public architecture requirements including security standards.',
    '5.19', null, 'Krav');

  add('Kommunal integration', 'Kommunal sikkerhed', 'Kommunal informationssikkerhed', 'Municipal information security',
    'Kommuner skal implementere informationssikkerhed i overensstemmelse med ISO 27001 og de faellesoffentlige sikkerhedsretningslinjer.',
    'Municipalities must implement information security in accordance with ISO 27001 and common public security guidelines.',
    '5.1', null, 'Krav');

  return controls;
}

async function main(): Promise<void> {
  console.log('Digst FDA Security Ingestion');
  const controls = generateControls();
  console.log(`Generated ${controls.length} controls`);
  mkdirSync(DATA_DIR, { recursive: true });
  const output = {
    framework: {
      id: 'digst-fda',
      name: 'Common Public Digital Architecture Security (FDA)',
      name_nl: 'Faellesoffentlig Digital Arkitektur - sikkerhedskrav',
      issuing_body: 'Digitaliseringsstyrelsen (Digst)',
      version: '2024',
      effective_date: '2024-01-01',
      scope: 'Security requirements for common public digital architecture in Denmark including MitID, service platforms, data sharing, and municipal integration',
      scope_sectors: ['government'],
      structure_description: 'Requirements organized by FDA security domains: digital identity, data sharing, service platform, architecture security, and municipal integration.',
      source_url: 'https://arkitektur.digst.dk/',
      license: 'CC BY 4.0',
      language: 'da+en',
    },
    controls,
    metadata: { ingested_at: new Date().toISOString(), source: 'Faellesoffentlig Digital Arkitektur (FDA) sikkerhedskrav', total_controls: controls.length },
  };
  writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2), 'utf-8');
  console.log(`Output: ${OUTPUT_FILE}`);
}

main().catch((err) => { console.error('Fatal:', err); process.exit(1); });
