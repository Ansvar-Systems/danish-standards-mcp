# Danish Standards MCP

[![npm version](https://img.shields.io/npm/v/@ansvar/danish-standards-mcp)](https://www.npmjs.com/package/@ansvar/danish-standards-mcp)
[![CI](https://github.com/Ansvar-Systems/danish-standards-mcp/actions/workflows/ci.yml/badge.svg)](https://github.com/Ansvar-Systems/danish-standards-mcp/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue)](LICENSE)
[![MCP Registry](https://img.shields.io/badge/MCP%20Registry-ansvar.ai%2Fmcp-blue)](https://ansvar.ai/mcp)

Structured access to 20 Danish government cybersecurity standards and frameworks: CFCS guidance (general, ICS/OT, ransomware, cloud, supply chain, secure development), Digitaliseringsstyrelsen (security + FDA), Statens ISO 27001, D-maerket, Datatilsynet, Sundhedsdatastyrelsen, MedCom, Finanstilsynet IKT/DORA, NIS2 Danish implementation, Sikkerhedscirkulaeret, Energistyrelsen, Trafikstyrelsen, KL municipal guidance, and DS 484. 482 controls, bilingual Danish/English, FTS search, ISO 27001/27002 cross-references, and sector-based filtering.

Part of the [Ansvar MCP Network](https://ansvar.ai/mcp) -- specialist MCP servers for compliance and security intelligence.

---

## Quick Start

### Remote endpoint (no installation)

Add to your MCP client config:

```json
{
  "mcpServers": {
    "danish-standards": {
      "url": "https://danish-standards-mcp.vercel.app/mcp"
    }
  }
}
```

### Local (stdio via npx)

**Claude Desktop** -- edit `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "danish-standards": {
      "command": "npx",
      "args": ["-y", "@ansvar/danish-standards-mcp"]
    }
  }
}
```

**Cursor** -- edit `.cursor/mcp.json` in your project:

```json
{
  "mcpServers": {
    "danish-standards": {
      "command": "npx",
      "args": ["-y", "@ansvar/danish-standards-mcp"]
    }
  }
}
```

**VS Code / GitHub Copilot** -- add to `.vscode/mcp.json`:

```json
{
  "servers": {
    "danish-standards": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@ansvar/danish-standards-mcp"]
    }
  }
}
```

---


### Public Endpoint (Streamable HTTP)

Connect from any MCP client (Claude Desktop, ChatGPT, Cursor, VS Code, GitHub Copilot):

```
https://mcp.ansvar.eu/standards-dk/mcp
```

**Claude Code:**
```bash
claude mcp add standards-dk --transport http https://mcp.ansvar.eu/standards-dk/mcp
```

**Claude Desktop / Cursor** (`claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "standards-dk": {
      "type": "url",
      "url": "https://mcp.ansvar.eu/standards-dk/mcp"
    }
  }
}
```

No authentication required. See [all Ansvar MCP endpoints](https://github.com/Ansvar-Systems/Ansvar-Architecture-Documentation/blob/main/docs/mcp-remote-access.md).
## What's Included

| Source | Authority | Items | Language | Refresh |
|--------|-----------|-------|----------|---------|
| CFCS Cybersikkerhedsvejledning | Center for Cybersikkerhed (CFCS) | 58 controls | DA+EN | Annual |
| CFCS ICS/OT-sikkerhedsvejledning | Center for Cybersikkerhed (CFCS) | 25 controls | DA+EN | Annual |
| CFCS Ransomware-beskyttelse | Center for Cybersikkerhed (CFCS) | 18 controls | DA+EN | Annual |
| CFCS Cloudsikkerhedsvejledning | Center for Cybersikkerhed (CFCS) | 19 controls | DA+EN | Annual |
| CFCS Leverandoerstyring | Center for Cybersikkerhed (CFCS) | 17 controls | DA+EN | Annual |
| CFCS Sikker softwareudvikling | Center for Cybersikkerhed (CFCS) | 18 controls | DA+EN | Annual |
| Digitaliseringsstyrelsens sikkerhedsvejledning | Digitaliseringsstyrelsen | 36 controls | DA+EN | Annual |
| Faellesoffentlig Digital Arkitektur (FDA) | Digitaliseringsstyrelsen | 16 controls | DA+EN | Annual |
| Statens implementering af ISO 27001 | Digitaliseringsstyrelsen / Statens IT | 55 controls | DA+EN | Annual |
| D-maerket | Erhvervsstyrelsen / D-maerket | 27 criteria | DA+EN | Annual |
| Datatilsynets sikkerhedsforanstaltninger | Datatilsynet (Danish DPA) | 30 measures | DA+EN | Annual |
| Sundhedsdatastyrelsens IT-sikkerhedskrav | Sundhedsdatastyrelsen (SDS) | 21 requirements | DA+EN | Annual |
| MedCom standarder | MedCom | 17 standards | DA+EN | Annual |
| Finanstilsynets IKT-krav | Finanstilsynet (Danish FSA) | 24 requirements | DA+EN | Annual |
| NIS2 dansk implementering (L 111) | Forsvarsministeriet | 21 requirements | DA+EN | Annual |
| Sikkerhedscirkulaeret | Justitsministeriet / PET / CFCS | 21 requirements | DA+EN | Annual |
| Energistyrelsens cybersikkerhedskrav | Energistyrelsen | 15 requirements | DA+EN | Annual |
| Trafikstyrelsens IKT-sikkerhedskrav | Trafikstyrelsen | 12 requirements | DA+EN | Annual |
| KL Kommunernes sikkerhedsvejledning | KL (Kommunernes Landsforening) | 14 guidelines | DA+EN | Annual |
| DS 484 Dansk Standard | Dansk Standard (DS) | 18 controls | DA+EN | Annual |

**Total:** 482 controls and requirements across 20 Danish cybersecurity frameworks.

For full coverage details, see [COVERAGE.md](COVERAGE.md).

---

## What's NOT Included

| Gap | Status |
|-----|--------|
| SikkerDigital.dk citizen/SME guidance | Planned for v1.1 |
| Danske Regioner IT-sikkerhed | Planned for v1.2 |
| CFCS Trusselsvurdering (annual threat assessment) | Not planned -- threat assessments, not control catalogs |
| DS/ISO 27001:2022 full text | Excluded -- commercial ISO license; ISO cross-references available via `get_iso_mapping` |
| Persondataloven / GDPR full text | Available via Denmark Law MCP; Datatilsynet measures here operationalize the security requirements |

For the complete gap list, see [COVERAGE.md -- What's NOT Included](COVERAGE.md#whats-not-included).

---

## Available Tools

| Tool | Category | Description |
|------|----------|-------------|
| `search_controls` | Search | Full-text search across all 20 frameworks. Returns controls ranked by FTS5 relevance. |
| `search_by_sector` | Search | Returns frameworks for a sector (`government`, `healthcare`, `finance`, etc.), optionally filtered by keyword. |
| `get_control` | Lookup | Full record for a single control: bilingual description, implementation guidance, ISO mapping. |
| `get_framework` | Lookup | Metadata for a framework: issuing body, version, control count, category breakdown. |
| `list_controls` | Lookup | All controls in a framework, filterable by category. Paginated. |
| `compare_controls` | Comparison | Side-by-side comparison of the same topic across 2-4 frameworks. |
| `get_iso_mapping` | Comparison | All Danish controls mapped to a given ISO 27001/27002 control reference. |
| `list_frameworks` | Meta | Lists all frameworks in the database with summary stats. |
| `about` | Meta | Server version, build date, and coverage statistics. |
| `list_sources` | Meta | Data provenance: authority, standard name, retrieval method, license for each source. |
| `check_data_freshness` | Meta | Per-source freshness status against the expected refresh schedule. |

For full parameter documentation, return formats, and examples, see [TOOLS.md](TOOLS.md).

---

## Data Sources & Freshness

| Source | Last Refresh | Refresh Schedule |
|--------|-------------|-----------------|
| CFCS Cybersikkerhedsvejledning | 2026-03-12 | Annual |
| CFCS ICS/OT | 2026-03-12 | Annual |
| CFCS Ransomware | 2026-03-12 | Annual |
| CFCS Cloud | 2026-03-12 | Annual |
| CFCS Supply Chain | 2026-03-12 | Annual |
| CFCS Secure Dev | 2026-03-12 | Annual |
| Digitaliseringsstyrelsen | 2026-03-12 | Annual |
| FDA (Digst) | 2026-03-12 | Annual |
| Statens ISO 27001 | 2026-03-12 | Annual |
| D-maerket | 2026-03-12 | Annual |
| Datatilsynet | 2026-03-12 | Annual |
| Sundhedsdatastyrelsen | 2026-03-12 | Annual |
| MedCom | 2026-03-12 | Annual |
| Finanstilsynet | 2026-03-12 | Annual |
| NIS2 (L 111) | 2026-03-12 | Annual |
| Sikkerhedscirkulaeret | 2026-03-12 | Annual |
| Energistyrelsen | 2026-03-12 | Annual |
| Trafikstyrelsen | 2026-03-12 | Annual |
| KL | 2026-03-12 | Annual |
| DS 484 | 2026-03-12 | Annual |

The `ingest.yml` workflow runs automatically on the most frequent source schedule. The `check-updates.yml` workflow runs daily and creates a GitHub issue if any source is overdue.

To check freshness at runtime, call `check_data_freshness`. Full source provenance and licenses: [sources.yml](sources.yml).

---

## Security

This repository runs 6-layer automated security scanning on every push and weekly:

| Layer | Tool | What it checks |
|-------|------|----------------|
| Static analysis | CodeQL | Code vulnerabilities |
| SAST | Semgrep | Security anti-patterns |
| Container / dependency scan | Trivy | Known CVEs in dependencies |
| Secret detection | Gitleaks | Leaked credentials |
| Supply chain | OSSF Scorecard | Repository security posture |
| Dependency updates | Dependabot | Automated dependency PRs |

---

## Disclaimer

**THIS TOOL IS NOT PROFESSIONAL ADVICE.**

This MCP provides structured access to Danish cybersecurity standards sourced from authoritative publications. It is provided for informational and research purposes only.

- Verify critical compliance decisions against the original standards
- Data is a snapshot -- sources update, and there may be a delay between upstream changes and database refresh
- See [DISCLAIMER.md](DISCLAIMER.md) for the full disclaimer and no-warranty statement

---

## Ansvar MCP Network

This server is part of the [Ansvar MCP Network](https://ansvar.ai/mcp) -- 276+ specialist MCP servers covering legislation, compliance frameworks, and cybersecurity standards.

| Category | Servers | Coverage |
|----------|---------|----------|
| Law MCPs | 108 | 119 countries, 668K+ laws |
| EU Regulations | 1 | 61 regulations, 4,054 articles |
| Security frameworks | 1 | 262 frameworks, 1,451 SCF controls |
| Domain-specific | ~48 | CVE, STRIDE, sanctions, OWASP, healthcare, financial, and more |

Browse the full directory at [ansvar.ai/mcp](https://ansvar.ai/mcp).

---

## Development

### Branch strategy

`feature-branch -> PR to dev -> verify on dev -> PR to main -> deploy`

Never push directly to `main`. `main` triggers npm publish and Vercel deployment.

### Setup

```bash
git clone https://github.com/Ansvar-Systems/danish-standards-mcp.git
cd danish-standards-mcp
npm install
npm run build
npm test
```

### Ingestion

```bash
# Full pipeline: fetch -> diff -> build DB -> update coverage
npm run ingest:full

# Individual steps
npm run ingest:fetch     # Download latest data from upstream sources
npm run ingest:diff      # Check for changes against current DB
npm run build:db         # Rebuild SQLite database
npm run coverage:update  # Regenerate coverage.json and COVERAGE.md

# Check freshness
npm run freshness:check
```

### Pre-deploy verification

```bash
npm run build            # Gate 1: build
npm run lint             # Gate 2: TypeScript strict
npm test                 # Gate 3: unit tests
npm run test:contract    # Gate 4: golden contract tests
sqlite3 data/standards.db "PRAGMA integrity_check;"   # Gate 5: DB integrity
npm run coverage:verify  # Gate 6: coverage consistency
```

---

## License & Data Licenses

**Code:** [Apache-2.0](LICENSE)

**Data licenses by source:**

| Source | License |
|--------|---------|
| CFCS Cybersikkerhedsvejledning | Public sector publication |
| Digitaliseringsstyrelsen | CC BY 4.0 |
| Statens ISO 27001 | Public sector publication |
| D-maerket | Public sector publication |
| Datatilsynet | Public sector publication |
| Sundhedsdatastyrelsen | Public sector publication |

All data is extracted from publicly available authoritative publications. Zero AI-generated content in the database. See [sources.yml](sources.yml) for complete provenance.
