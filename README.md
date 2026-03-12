# Danish Standards MCP

[![npm version](https://img.shields.io/npm/v/@ansvar/danish-standards-mcp)](https://www.npmjs.com/package/@ansvar/danish-standards-mcp)
[![CI](https://github.com/Ansvar-Systems/danish-standards-mcp/actions/workflows/ci.yml/badge.svg)](https://github.com/Ansvar-Systems/danish-standards-mcp/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue)](LICENSE)
[![MCP Registry](https://img.shields.io/badge/MCP%20Registry-ansvar.ai%2Fmcp-blue)](https://ansvar.ai/mcp)

Structured access to Danish government cybersecurity standards: CFCS Cybersikkerhedsvejledning, Digitaliseringsstyrelsen security guidance, Statens ISO 27001 implementation, D-maerket digital trust label, Datatilsynet security measures, and Sundhedsdatastyrelsen IT security requirements. Bilingual Danish/English with FTS search, ISO 27001/27002 cross-references, and sector-based filtering.

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

## What's Included

| Source | Authority | Items | Language | Refresh |
|--------|-----------|-------|----------|---------|
| CFCS Cybersikkerhedsvejledning | Center for Cybersikkerhed (CFCS) | 58 controls | DA+EN | Annual |
| Digitaliseringsstyrelsens sikkerhedsvejledning | Digitaliseringsstyrelsen | 36 controls | DA+EN | Annual |
| Statens implementering af ISO 27001 | Digitaliseringsstyrelsen / Statens IT | 55 controls | DA+EN | Annual |
| D-maerket | Erhvervsstyrelsen / D-maerket | 27 criteria | DA+EN | Annual |
| Datatilsynets sikkerhedsforanstaltninger | Datatilsynet (Danish DPA) | 30 measures | DA+EN | Annual |
| Sundhedsdatastyrelsens IT-sikkerhedskrav | Sundhedsdatastyrelsen (SDS) | 21 requirements | DA+EN | Annual |

**Total:** 227 controls and requirements across 6 Danish cybersecurity frameworks.

For full coverage details, see [COVERAGE.md](COVERAGE.md).

---

## What's NOT Included

| Gap | Status |
|-----|--------|
| SikkerDigital.dk citizen/SME guidance | Planned for v1.1 |
| Finanstilsynet IT security requirements | Planned for v1.1 |
| Energistyrelsen cybersecurity requirements | Planned for v1.2 |
| NIS2 Danish transposition (Cybersikkerhedsloven) | Planned once enacted |
| ISO/IEC 27001:2022 full text | Excluded -- commercial ISO license; ISO cross-references available via `get_iso_mapping` |

For the complete gap list, see [COVERAGE.md -- What's NOT Included](COVERAGE.md#whats-not-included).

---

## Available Tools

| Tool | Category | Description |
|------|----------|-------------|
| `search_controls` | Search | Full-text search across all 6 frameworks. Returns controls ranked by FTS5 relevance. |
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
| Digitaliseringsstyrelsen | 2026-03-12 | Annual |
| Statens ISO 27001 | 2026-03-12 | Annual |
| D-maerket | 2026-03-12 | Annual |
| Datatilsynet | 2026-03-12 | Annual |
| Sundhedsdatastyrelsen | 2026-03-12 | Annual |

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

This server is part of the [Ansvar MCP Network](https://ansvar.ai/mcp) -- 149 specialist MCP servers covering legislation, compliance frameworks, and cybersecurity standards.

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
