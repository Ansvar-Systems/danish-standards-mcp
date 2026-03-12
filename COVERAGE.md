# Coverage -- Danish Standards MCP

> Last verified: 2026-03-12 | Database version: 1.0.0

This document declares exactly what data the Danish Standards MCP contains, what it does not contain, and the limitations of each source. It is the contract with users.

---

## What's Included

| Source | Authority | Items | Version / Date | Completeness | Refresh |
|--------|-----------|-------|----------------|-------------|---------|
| CFCS Cybersikkerhedsvejledning | Center for Cybersikkerhed (CFCS) | 58 controls | 2024 | Full | Annual |
| Digitaliseringsstyrelsens sikkerhedsvejledning | Digitaliseringsstyrelsen | 36 controls | 2023 | Full | Annual |
| Statens implementering af ISO 27001 | Digitaliseringsstyrelsen / Statens IT | 55 controls | 2023 | Full | Annual |
| D-maerket | Erhvervsstyrelsen / D-maerket | 27 criteria | 2024 | Full | Annual |
| Datatilsynets sikkerhedsforanstaltninger | Datatilsynet (Danish DPA) | 30 measures | 2023 | Full | Annual |
| Sundhedsdatastyrelsens IT-sikkerhedskrav | Sundhedsdatastyrelsen (SDS) | 21 requirements | 2023 | Full | Annual |

**Total:** 11 tools, 227 controls/requirements, database built from 6 authoritative Danish sources.

---

## What's NOT Included

| Gap | Reason | Planned? |
|-----|--------|----------|
| SikkerDigital.dk citizen/SME cybersecurity guidance | Mixed HTML/PDF format; requires structured extraction from multiple pages | Yes -- v1.1 |
| Finanstilsynet IT security requirements | Requires extraction from supervisory notices and guidance documents | Yes -- v1.1 |
| Energistyrelsen cybersecurity requirements | Sector-specific guidance; requires scoping | Yes -- v1.2 |
| Cybersikkerhedsloven (NIS2 transposition) | Danish NIS2 transposition -- not yet fully enacted as of database build date (2026-03-12) | Yes -- once enacted |
| Center for Cybersikkerhed trusselsvurderinger | Threat assessments are analysis documents, not control catalogs | No |
| DS/ISO 27001:2022 full text | Commercial Dansk Standard / ISO license; cross-references available via `get_iso_mapping` | No |
| Sundhedsloven patient data requirements | Law-level requirements; operationalized through SDS IT security standards already included | No |
| Persondataloven / GDPR full text | Law text available via Denmark Law MCP; Datatilsynet measures here operationalize the security requirements | No |
| Telestyrelsen telecom security requirements | Historical regulatory body; superseded by current CFCS and sector guidance | No |

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
| Digitaliseringsstyrelsen | Annual | 2026-03-12 | 2027-03-12 |
| Statens ISO 27001 | Annual | 2026-03-12 | 2027-03-12 |
| D-maerket | Annual | 2026-03-12 | 2027-03-12 |
| Datatilsynet | Annual | 2026-03-12 | 2027-03-12 |
| Sundhedsdatastyrelsen | Annual | 2026-03-12 | 2027-03-12 |

To check current freshness status programmatically, call the `check_data_freshness` tool.

The ingestion pipeline (`ingest.yml`) runs automatically on the most frequent source schedule. The `check-updates.yml` workflow runs daily and creates a GitHub issue if any source is overdue.

---

## Regulatory Mapping

This table maps Danish regulations and laws to the frameworks in this MCP that implement or operationalize them.

| Regulation / Law | Relevant Frameworks | Notes |
|-----------------|---------------------|-------|
| Persondataforordningen (GDPR) | Datatilsynet, D-maerket | Security of personal data -- Article 32 technical measures |
| Sundhedsloven | SDS Sundhed | Electronic health records and patient data security |
| Cybersikkerhedsloven (NIS2 transposition) | CFCS Vejledning, Digst Sikkerhed | Applies to operators of essential and important services |
| Bekendtgorelse om informationssikkerhed i staten | Digst Sikkerhed, Statens ISO 27001 | Mandatory for all Danish government bodies |
| Lov om Digital Post | Digst Sikkerhed | Government digital communication security |
| Databeskyttelsesloven | Datatilsynet | Danish supplement to GDPR |

---

## Sector-Specific Coverage

### Government (Statslige myndigheder, kommuner, regioner)

- **Included:** CFCS Vejledning, Digitaliseringsstyrelsen, Statens ISO 27001, D-maerket, Datatilsynet
- **Gap:** Kommunernes IT-sikkerhedskrav not separately covered (operationalized through Digst/Statens)

### Healthcare (Sundhedssektoren)

- **Included:** SDS Sundhed, D-maerket, Datatilsynet
- **Gap:** Sundhedsdatanettet-specific access controls not separately itemized
- **Gap:** Regional IT-sikkerhedspolitikker not included

### Financial Services (Finanssektoren)

- **Included:** D-maerket, Datatilsynet (applicable to financial data)
- **Gap:** Finanstilsynet IT security requirements not included
- **Gap:** DORA implementation guidance not included (EU-level; see EU Regulations MCP)

### Critical Infrastructure (Energi, vand, telekommunikation, transport)

- **Included:** CFCS Vejledning (covers all critical infrastructure sectors)
- **Gap:** Energistyrelsen sector-specific cybersecurity requirements not included
- **Gap:** Trafikstyrelsen transport cybersecurity requirements not included
