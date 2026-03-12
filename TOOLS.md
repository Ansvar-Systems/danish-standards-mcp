# Tools -- Danish Standards MCP

> 11 tools across 4 categories: search, lookup, comparison, and meta

---

## Search Tools

### `search_controls`

Full-text search across all Danish cybersecurity controls using FTS5. Returns controls ranked by relevance from the combined CFCS, Digitaliseringsstyrelsen, Statens ISO 27001, D-maerket, Datatilsynet, and SDS datasets. Use this when you need to find controls by keyword without knowing the framework.

**Parameters:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `query` | string | Yes | Search terms, e.g. `"adgangsstyring"`, `"encryption"`, `"incident response"` |
| `framework_id` | string | No | Restrict results to one framework, e.g. `"cfcs-vejledning"`, `"statens-iso27001"` |
| `category` | string | No | Filter by control category, e.g. `"Netvaerkssikkerhed"` |
| `language` | `"da"` \| `"en"` | No | Preferred display language for titles. Defaults to Danish (`"da"`). Controls without an English title always show Danish. |
| `limit` | integer | No | Maximum results to return. Default: `20`. |
| `offset` | integer | No | Pagination offset. Default: `0`. |

**Returns:** A Markdown table with columns `ID`, `Control`, `Title`, `Framework`, `Category`, `Level` plus a `total_results` count above the table.

**Example:**
```
"Which Danish government controls address access management?"
-> search_controls({ query: "adgangsstyring", language: "da" })

"Find CFCS controls on encryption"
-> search_controls({ query: "kryptering", framework_id: "cfcs-vejledning" })
```

**Data sources:** All 6 frameworks

**Limitations:**
- FTS5 phrase search: special characters (`"`, `^`, `*`, `-`, `:`) are stripped from the query before matching
- Searches bilingual content -- a Danish-only query may miss English-only descriptions in the same control
- Does not support wildcard or regex patterns
- Relevance ranking is FTS5 rank, not semantic similarity

---

### `search_by_sector`

Returns frameworks applicable to a specific sector, optionally filtered by a keyword query within those frameworks. Use this to scope a compliance review to a particular industry before drilling into controls.

**Parameters:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `sector` | string | Yes | One of: `government`, `healthcare`, `finance`, `energy`, `telecom`, `transport`, `water`, `digital_infrastructure`, `education` |
| `query` | string | No | Optional keyword search within the sector's frameworks |

**Returns:** A Markdown table of matching frameworks (ID, name, issuing body, version, control count, language). If `query` is provided, a second table lists matching controls within those frameworks (top 10 per framework, ranked by FTS5 relevance).

**Example:**
```
"What security frameworks apply to Danish healthcare organizations?"
-> search_by_sector({ sector: "healthcare" })

"Which healthcare controls cover patient data encryption?"
-> search_by_sector({ sector: "healthcare", query: "kryptering" })
```

**Data sources:** Framework `scope_sectors` metadata + FTS5 on controls

**Limitations:**
- Sector taxonomy is fixed to the 9 values listed above
- A framework appears only if it was ingested with sector metadata
- Query within sector does not cross-search frameworks not assigned to that sector

---

## Lookup Tools

### `get_control`

Retrieves the full record for a single control by its database ID. Returns the complete bilingual description, implementation guidance, verification guidance, ISO 27001/27002 mapping, and source URL. Use this after `search_controls` or `list_controls` to get the full text of a specific control.

**Parameters:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `control_id` | string | Yes | The control's database ID, e.g. `"cfcs-vejledning:N01"`, `"statens-iso27001:A.5.1"`, `"sds-sundhed:SDS01"` |

**Returns:** A structured Markdown document with control number, Danish and English titles, framework and issuing body, category, level, ISO mapping, Danish description (`Beskrivelse`), English description, implementation guidance, verification guidance, and source URL.

**Example:**
```
"Give me the full text of CFCS network segmentation control"
-> get_control({ control_id: "cfcs-vejledning:N01" })
```

**Data sources:** `controls` table joined to `frameworks`

**Limitations:**
- Returns a `NO_MATCH` error if the ID does not exist -- use `search_controls` or `list_controls` to discover valid IDs
- Implementation guidance and verification guidance may be absent for some controls
- Not all controls have English descriptions -- Danish is always present

---

### `get_framework`

Returns metadata for a single framework: issuing body, version, effective date, language, scope, control count, category breakdown, and source URL. Use this to understand what a framework covers before listing its controls.

**Parameters:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `framework_id` | string | Yes | Framework identifier, e.g. `"cfcs-vejledning"`, `"statens-iso27001"`, `"sds-sundhed"` |

**Returns:** A Markdown document with framework name (Danish and English), issuing body, version, language, control count, effective date, sectors, scope description, structure description, license, and a category breakdown table.

**Example:**
```
"What is the CFCS cybersecurity guidance and how many controls does it have?"
-> get_framework({ framework_id: "cfcs-vejledning" })
```

**Data sources:** `frameworks` table, `controls` aggregate

**Limitations:**
- Does not return the controls themselves -- use `list_controls` to enumerate them
- Sector and scope fields depend on ingestion quality; some frameworks may have incomplete metadata

---

## Comparison Tools

### `list_controls`

Lists all controls in a framework, with optional filtering by category. Returns a paginated table. Use this to browse a complete framework or to enumerate controls within a specific control category.

**Parameters:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `framework_id` | string | Yes | Framework identifier, e.g. `"cfcs-vejledning"`, `"statens-iso27001"` |
| `category` | string | No | Filter to one category, e.g. `"Netvaerkssikkerhed"` |
| `level` | string | No | Filter by level (framework-specific) |
| `language` | `"da"` \| `"en"` | No | Preferred display language for titles. Defaults to Danish. |
| `limit` | integer | No | Maximum results. Default: `50`. |
| `offset` | integer | No | Pagination offset. Default: `0`. |

**Returns:** A Markdown table with columns `ID`, `Control`, `Title`, `Category`, `Level` plus a `total_results` count.

**Example:**
```
"List all CFCS network security controls"
-> list_controls({ framework_id: "cfcs-vejledning", category: "Netvaerkssikkerhed" })

"Show me all Statens ISO 27001 access control requirements"
-> list_controls({ framework_id: "statens-iso27001", category: "Adgangsstyring" })
```

**Data sources:** `controls` table

**Limitations:**
- Category and level values must match exactly as stored in the database -- use `get_framework` to see the available categories first
- Default limit of 50 may truncate large frameworks (CFCS has 58 controls, Statens ISO 27001 has 55)

---

### `compare_controls`

Searches the same keyword query across 2-4 frameworks simultaneously and shows the top 5 matching controls per framework side by side. Use this to compare how different Danish standards treat the same topic.

**Parameters:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `query` | string | Yes | Topic to compare, e.g. `"adgangsstyring"`, `"logning"`, `"kryptering"` |
| `framework_ids` | string[] | Yes | 2 to 4 framework IDs, e.g. `["cfcs-vejledning", "statens-iso27001"]` |

**Returns:** A Markdown section per framework showing the control number, title, and a 150-character snippet of the Danish description for up to 5 matching controls.

**Example:**
```
"How do CFCS and Statens ISO 27001 differ in their approach to access control?"
-> compare_controls({ query: "adgangsstyring", framework_ids: ["cfcs-vejledning", "statens-iso27001"] })

"Compare incident response requirements across CFCS, Datatilsynet, and D-maerket"
-> compare_controls({ query: "haendelse", framework_ids: ["cfcs-vejledning", "datatilsynet-dk", "d-maerket"] })
```

**Data sources:** FTS5 on `controls` filtered by `framework_id`

**Limitations:**
- Returns at most 5 controls per framework -- not a full comparison of all matching controls
- Snippets are truncated at 150 characters; use `get_control` for full text
- Both frameworks must be in the database; passing an unknown ID silently returns zero results for that framework

---

### `get_iso_mapping`

Returns all Danish controls that map to a specific ISO 27001/27002 control number. Use this to find which Danish standards implement a given ISO requirement, or to check Danish compliance coverage for an ISO audit.

**Parameters:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `iso_control` | string | Yes | ISO 27001/27002 control reference, e.g. `"A.5.1"`, `"8.22"`, `"5.15"` |

**Returns:** A Markdown table grouped by framework, listing each Danish control mapped to that ISO reference (ID, control number, title).

**Example:**
```
"Which Danish controls implement ISO 27001 Annex A.5.1 (Information security policies)?"
-> get_iso_mapping({ iso_control: "A.5.1" })

"Show me all Danish framework controls that map to ISO 27002 8.22"
-> get_iso_mapping({ iso_control: "8.22" })
```

**Data sources:** `controls.iso_mapping` field

**Limitations:**
- Only returns controls with an exact `iso_mapping` match -- controls without ISO mapping are not included
- ISO mapping coverage varies by framework: Statens ISO 27001 has extensive mapping; other frameworks have varying coverage
- Does not support partial matches or range queries (e.g. `"A.5.x"` will not match)

---

## Meta Tools

### `list_frameworks`

Returns a summary table of all frameworks in the database. No parameters required. Use this to discover which frameworks are available before calling `get_framework` or `list_controls`.

**Parameters:** None

**Returns:** A Markdown table listing framework ID, name, issuing body, version, control count, language, and sectors for each framework in the database.

**Example:**
```
"What Danish cybersecurity frameworks does this MCP cover?"
-> list_frameworks()
```

**Data sources:** `frameworks` table joined to control counts

**Limitations:**
- Lists only frameworks loaded in the current database build -- reflects ingestion coverage
- Sector data may be empty for frameworks ingested without sector metadata

---

### `about`

Returns server metadata: version, category, schema version, database build date, and coverage statistics (framework count, control count, database size). Use this to check the current version and data state of the MCP.

**Parameters:** None

**Returns:** A Markdown document with server name, version, category, schema version, database build date, and a coverage metrics table (frameworks, controls, database size in MB).

**Example:**
```
"What version of the Danish Standards MCP is running and when was it last updated?"
-> about()
```

**Data sources:** `db_metadata` table

**Limitations:**
- Database build date reflects when the SQLite database was compiled, not the publication date of the source standards
- Call `check_data_freshness` for per-source freshness status

---

### `list_sources`

Returns the data provenance table: for each source, the authority, standard name, retrieval method, and license. Use this to understand where the data comes from before relying on it in a compliance decision.

**Parameters:** None

**Returns:** A Markdown table with columns `ID`, `Authority`, `Standard / Document`, `Retrieval method`, `License`. Includes a disclaimer note about verifying against authoritative sources.

**Example:**
```
"Where does this MCP get its data from, and what are the licenses?"
-> list_sources()
```

**Data sources:** Hardcoded provenance list (sourced from `sources.yml`)

**Limitations:**
- Does not show per-source item counts or last-refresh dates -- use `check_data_freshness` for that

---

### `check_data_freshness`

Reports how current each data source is against its expected refresh schedule. Returns a per-source status: `Current`, `Due in N days`, or `OVERDUE (N days)`. Use this to verify the database is not stale before using it for compliance decisions.

**Parameters:** None

**Returns:** A Markdown table with columns `Source`, `Last fetched`, `Refresh window`, `Status`. Includes a summary of any overdue or due-soon sources and instructions to trigger a data update.

**Example:**
```
"Is the Danish Standards MCP data up to date?"
-> check_data_freshness()
```

**Data sources:** `data/coverage.json` (generated by `npm run coverage:update`)

**Limitations:**
- Returns a "no coverage data" message if `coverage.json` has not been generated yet -- run `npm run coverage:update` after first build
- Status is based on the `last_fetched` date in `coverage.json`, not a live check of upstream sources
- `OVERDUE` status means the data is past its scheduled refresh window, not necessarily that the data has changed

---

## Danish Cybersecurity Glossary

This glossary covers terms used in Danish government cybersecurity standards that appear as parameters, category names, or framework identifiers in the tools above.

| Term | Expansion | Meaning |
|------|-----------|---------|
| **CFCS** | Center for Cybersikkerhed | The Danish national cybersecurity authority, part of the Defence Intelligence Service (Forsvarets Efterretningstjeneste). Issues cybersecurity guidance for public and private sectors. |
| **Digitaliseringsstyrelsen** | Agency for Digital Government | The Danish government agency responsible for digitization, including IT security standards for government. Part of the Ministry of Finance. |
| **Statens IT** | The State's IT | Shared IT service center for Danish government agencies. Implements ISO 27001 for state institutions. |
| **Datatilsynet** | Danish Data Protection Authority | The Danish supervisory authority for personal data protection. Issues security measures required under GDPR. |
| **Sundhedsdatastyrelsen (SDS)** | Danish Health Data Authority | Responsible for IT security requirements in Danish healthcare data systems. |
| **D-maerket** | Digital Trust Label | Danish digital trust certification covering IT security, data protection, and responsible practices. Administered by Erhvervsstyrelsen (Danish Business Authority). |
| **Informationssikkerhed** | -- | Information security. The primary Danish term used across all frameworks. |
| **Adgangsstyring** | -- | Access control. Used as a control category in multiple frameworks. |
| **Sarbarhedsstyring** | -- | Vulnerability management. Used for patch management and vulnerability scanning controls. |
| **Haendelseshandtering** | -- | Incident handling/response. Used for security incident detection, reporting, and recovery controls. |
| **Logning og overvagning** | -- | Logging and monitoring. Used for centralized log collection, SIEM, and alerting controls. |
| **Kryptering** | -- | Encryption. Used for data-at-rest and data-in-transit encryption controls. |
| **Netvaerkssikkerhed** | -- | Network security. Used for segmentation, firewall, VPN, and DNS security controls. |
| **Beredskab** | -- | Preparedness/continuity. Used for business continuity and disaster recovery controls. |
| **Sikker udvikling** | -- | Secure development. Used for secure coding, code review, and penetration testing controls. |
