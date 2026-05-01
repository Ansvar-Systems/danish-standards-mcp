# Coverage -- Danish Standards MCP

> Last verified: 2026-05-01 | Database version: 1.0.0

This document declares exactly what data the Danish Standards MCP contains, what it does not contain, and the limitations of each source. It is the contract with users.

---

## What's Included

| Source | Authority | Items | Version / Date | Completeness | Refresh |
|--------|-----------|-------|----------------|-------------|---------|
| CFCS Cybersikkerhedsvejledning | Center for Cybersikkerhed (CFCS) | 58 controls | 2024 | Full | Annual |
| CFCS ICS/OT-sikkerhedsvejledning | Center for Cybersikkerhed (CFCS) | 25 controls | 2024 | Full | Annual |
| CFCS Ransomware-beskyttelse | Center for Cybersikkerhed (CFCS) | 18 controls | 2024 | Full | Annual |
| CFCS Cloudsikkerhedsvejledning | Center for Cybersikkerhed (CFCS) | 19 controls | 2024 | Full | Annual |
| CFCS Leverandoerstyring | Center for Cybersikkerhed (CFCS) | 17 controls | 2024 | Full | Annual |
| CFCS Sikker softwareudvikling | Center for Cybersikkerhed (CFCS) | 18 controls | 2024 | Full | Annual |
| Digitaliseringsstyrelsens sikkerhedsvejledning | Digitaliseringsstyrelsen | 36 controls | 2024 | Full | Annual |
| Faellesoffentlig Digital Arkitektur (FDA) | Digitaliseringsstyrelsen | 16 controls | 2024 | Full | Annual |
| Statens implementering af ISO 27001 | Digitaliseringsstyrelsen / Statens IT | 55 controls | 2014 | Full | Annual |
| D-maerket | Erhvervsstyrelsen / D-maerket | 27 criteria | 2024 | Full | Annual |
| Datatilsynets sikkerhedsforanstaltninger | Datatilsynet (Danish DPA) | 30 measures | 2024 | Full | Annual |
| Sundhedsdatastyrelsens IT-sikkerhedskrav | Sundhedsdatastyrelsen (SDS) | 21 requirements | 2024 | Full | Annual |
| MedCom standarder | MedCom | 17 standards | 2024 | Full | Annual |
| Finanstilsynets IKT-krav | Finanstilsynet (Danish FSA) | 24 requirements | 2025 | Full | Annual |
| NIS2 dansk implementering (L 111) | Forsvarsministeriet | 21 requirements | 2025 | Full | Annual |
| Sikkerhedscirkulaeret | Justitsministeriet / PET / CFCS | 21 requirements | 2014 | Full | Annual |
| Energistyrelsens cybersikkerhedskrav | Energistyrelsen | 15 requirements | 2025 | Full | Annual |
| Trafikstyrelsens IKT-sikkerhedskrav | Trafikstyrelsen | 12 requirements | 2025 | Full | Annual |
| KL Kommunernes sikkerhedsvejledning | KL (Kommunernes Landsforening) | 14 guidelines | 2024 | Full | Annual |
| DS 484 Dansk Standard | Dansk Standard (DS) | 18 controls | 2024 | Full | Annual |

**Total:** 11 tools, 482 controls/requirements, database built from 20 authoritative Danish sources.

---

## What's NOT Included

| Gap | Reason | Planned? |
|-----|--------|----------|
| SikkerDigital.dk citizen/SME cybersecurity guidance | Mixed HTML/PDF format; requires structured extraction from multiple pages | Yes -- v1.1 |
| CFCS Trusselsvurdering (annual threat assessment) | Threat assessments are analysis documents, not control catalogs | No |
| DS/ISO 27001:2022 full text | Commercial Dansk Standard / ISO license; cross-references available via `get_iso_mapping` | No |
| Sundhedsloven patient data requirements | Law-level requirements; operationalized through SDS IT security standards already included | No |
| Persondataloven / GDPR full text | Law text available via Denmark Law MCP; Datatilsynet measures here operationalize the security requirements | No |
| Danske Regioner IT-sikkerhed | Regional government IT policies vary by region; KL guidance covers the municipal level | Yes -- v1.2 |
| RSI (Regional Sundheds-IT) standarder | Regional health IT varies by implementation; MedCom and SDS cover the national level | No |
| Erhvervsstyrelsens generelle krav | Covered indirectly through D-maerket and NIS2 frameworks | No |
| Slots- og Kulturstyrelsen krav | Narrow scope; cultural heritage digitization security is not a high-impact gap | No |
| TDC NET/Energinet infrastructure specifics | Operator-specific internal standards; not publicly structured as control frameworks | No |

---

## Limitations

- **Snapshot data, not live.** The database is a point-in-time extract. Standards may be updated between database rebuilds. The `check_data_freshness` tool reports the last-fetched date for each source.
- **Danish as primary language.** All controls have Danish titles and descriptions (`title_nl`, `description_nl` columns). English translations are provided where available but may be absent for some controls.
- **ISO mapping is partial.** Not all controls have `iso_mapping` populated. Statens ISO 27001 has the most complete mapping; other frameworks have varying coverage. `get_iso_mapping` only returns controls with an explicit mapping.
- **No case law or guidance letters.** The database contains normative controls only, not interpretive guidance, enforcement decisions, or Datatilsynet letters.
- **Sector metadata may be incomplete.** Frameworks are tagged with `scope_sectors` values during ingestion. If a framework's sector coverage is broader than what's tagged, `search_by_sector` may not surface it.
- **Not a legal opinion.** Compliance with these standards is not verified by this tool. The tool provides structured access to control text -- whether a specific system or process meets a control requires qualified assessment.

---

## Data Freshness Schedule

| Source | Refresh Schedule | Last Refresh | Next Expected |
|--------|-----------------|-------------|---------------|
| CFCS Cybersikkerhedsvejledning | Annual | 2026-03-12 | 2027-03-12 |
| CFCS ICS/OT | Annual | 2026-03-12 | 2027-03-12 |
| CFCS Ransomware | Annual | 2026-03-12 | 2027-03-12 |
| CFCS Cloud | Annual | 2026-03-12 | 2027-03-12 |
| CFCS Supply Chain | Annual | 2026-03-12 | 2027-03-12 |
| CFCS Secure Dev | Annual | 2026-03-12 | 2027-03-12 |
| Digitaliseringsstyrelsen | Annual | 2026-03-12 | 2027-03-12 |
| FDA (Digst) | Annual | 2026-03-12 | 2027-03-12 |
| Statens ISO 27001 | Annual | 2026-03-12 | 2027-03-12 |
| D-maerket | Annual | 2026-03-12 | 2027-03-12 |
| Datatilsynet | Annual | 2026-03-12 | 2027-03-12 |
| Sundhedsdatastyrelsen | Annual | 2026-03-12 | 2027-03-12 |
| MedCom | Annual | 2026-03-12 | 2027-03-12 |
| Finanstilsynet | Annual | 2026-03-12 | 2027-03-12 |
| NIS2 (L 111) | Annual | 2026-03-12 | 2027-03-12 |
| Sikkerhedscirkulaeret | Annual | 2026-03-12 | 2027-03-12 |
| Energistyrelsen | Annual | 2026-03-12 | 2027-03-12 |
| Trafikstyrelsen | Annual | 2026-03-12 | 2027-03-12 |
| KL | Annual | 2026-03-12 | 2027-03-12 |
| DS 484 | Annual | 2026-03-12 | 2027-03-12 |

To check current freshness status programmatically, call the `check_data_freshness` tool.

The ingestion pipeline (`ingest.yml`) runs automatically on the most frequent source schedule. The `check-updates.yml` workflow runs daily and creates a GitHub issue if any source is overdue.

---

## Regulatory Mapping

This table maps Danish regulations and laws to the frameworks in this MCP that implement or operationalize them.

| Regulation / Law | Relevant Frameworks | Notes |
|-----------------|---------------------|-------|
| Persondataforordningen (GDPR) | Datatilsynet, D-maerket | Security of personal data -- Article 32 technical measures |
| Sundhedsloven | SDS Sundhed, MedCom | Electronic health records and patient data security |
| Cybersikkerhedsloven / NIS2 (L 111) | NIS2-DK, CFCS Vejledning, Digst Sikkerhed | Applies to operators of essential and important services |
| Bekendtgorelse om informationssikkerhed i staten | Digst Sikkerhed, Statens ISO 27001 | Mandatory for all Danish government bodies |
| Lov om Digital Post | Digst Sikkerhed, Digst FDA | Government digital communication security |
| Databeskyttelsesloven | Datatilsynet | Danish supplement to GDPR |
| Sikkerhedscirkulaeret | Sikkerhedscirkulaeret | Handling of classified government information |
| Lov om finansiel virksomhed | Finanstilsynet IKT | IT requirements for financial companies |
| DORA (EU 2022/2554) | Finanstilsynet IKT | Digital operational resilience for financial entities |
| Beredskabsloven (energy sector) | Energistyrelsen, CFCS ICS | Cybersecurity for energy operators |

---

## Sector-Specific Coverage

### Government (Statslige myndigheder, kommuner, regioner)

- **Included:** CFCS Vejledning, CFCS Cloud, CFCS Supply Chain, CFCS Secure Dev, CFCS Ransomware, Digitaliseringsstyrelsen, Digst FDA, Statens ISO 27001, D-maerket, Datatilsynet, Sikkerhedscirkulaeret, KL, NIS2-DK, DS 484
- **Note:** KL guidance covers municipal-specific requirements; Sikkerhedscirkulaeret covers classified information handling

### Healthcare (Sundhedssektoren)

- **Included:** SDS Sundhed, MedCom, D-maerket, Datatilsynet, CFCS Ransomware, CFCS Cloud, NIS2-DK
- **Note:** MedCom covers messaging and integration security standards; SDS covers IT security requirements

### Financial Services (Finanssektoren)

- **Included:** Finanstilsynet IKT (including DORA), D-maerket, Datatilsynet, CFCS Vejledning, CFCS Ransomware, CFCS Cloud, CFCS Supply Chain, NIS2-DK, DS 484
- **Note:** Finanstilsynet IKT covers ICT governance, risk management, outsourcing, and DORA implementation

### Energy (Energisektoren)

- **Included:** Energistyrelsen, CFCS Vejledning, CFCS ICS, CFCS Supply Chain, NIS2-DK
- **Note:** Energistyrelsen covers SCADA, smart grid, and SektorCERT integration requirements

### Transport (Transportsektoren)

- **Included:** Trafikstyrelsen IKT, CFCS Vejledning, CFCS ICS, NIS2-DK
- **Note:** Trafikstyrelsen covers railway, aviation, maritime, and road transport cybersecurity

### Critical Infrastructure (OT/ICS)

- **Included:** CFCS ICS, CFCS Vejledning, Energistyrelsen, NIS2-DK
- **Note:** CFCS ICS is the primary OT/ICS security guidance covering all critical infrastructure sectors
