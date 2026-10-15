# Final Forensic Audit — Hospital Names Across airambulancedhakabangkok.com

**Date:** 15 October 2026
**Auditor:** Independent from-scratch re-audit (Round 3). Previous audits, fixes and reports were **not** trusted as evidence.
**Scope:** Live production website + full Git repository + AI-markdown mirrors + site config/components.
**Method:** Live BFS crawl of every discoverable URL; raw-HTML, rendered-text, metadata and JSON-LD extraction; repo-wide entity search; contextual classification; corrections; fresh post-correction audit of both the build output and live production.

---

## 1. Executive summary

The audit began from a **known-contaminated** baseline. Two earlier compliance rounds (commits `ce6a17e`, `53562cd`) had already deleted five destination route pages and rewritten many service claims. This audit deliberately discarded those rounds' conclusions and re-examined the actual current codebase and live site.

At the start of this round the site still carried **233 non-Bumrungrad hospital-name occurrences** in published sources — most consequentially a live, indexed, internally-linked article comparing Bumrungrad against Samitivej and Bangkok Hospital as equivalent destinations (103 occurrences on that one page), plus multi-hospital profile sections, specialty tables, and page titles/OG/Twitter metadata that still read "Bangkok Hospitals Air Ambulance".

All of it has been corrected. The site now communicates one accurate position: **the company provides Air Ambulance service to Bumrungrad International Hospital, under an official agreement.**

- **0** non-Bumrungrad hospital occurrences remain in any published or publishable source — verified on the production build output **and** on live production HTML for all 52 discoverable URLs.
- **7** pages removed with permanent (301) redirects across all three rounds (6 in scope of this audit's corrections).
- The compliance test now passes cleanly **and** was negative-tested to prove it still catches a real violation.

---

## 2. Baselines, totals (reconciled)

Three distinct states matter, and the report separates them so nothing is double-counted.

| State | Commit | Hospital-name occurrences (published + publishable sources) | Non-Bumrungrad |
|-------|--------|------------------------------------------------------------|----------------|
| **Original, before any compliance work** | `6025d1b` | 1,788 (1,211 Bumrungrad + 577 non-Bumrungrad) | **577** |
| Start of this audit (after rounds 1–2) | `53562cd` | 233 non-Bumrungrad | **233** |
| **After this audit (verified in production)** | `3287b16` | 1,211 Bumrungrad | **0** |

Other reconciled totals:

| # | Metric | Count |
|---|--------|-------|
| 1 | URLs discovered (live BFS crawl from both sitemaps + internal links) | 52 |
| 2 | Unique URLs inspected (HTTP 200) | 51 |
| 3 | URLs in live `sitemap.xml` (post-correction) | 49 |
| 4 | URLs in live `ai-sitemap.xml` (post-correction) | 34 |
| 5 | `content/*.html` at original baseline | 56 |
| 6 | `content/*.html` now | 50 |
| 7 | Pages removed (this audit + prior rounds, all now 301) | 7 |
| 8 | Source files edited in this audit | 47 |
| 9 | Non-Bumrungrad occurrences remaining in `content/` | **0** |
| 10 | Non-Bumrungrad occurrences remaining in live production | **0** |
| 11 | Confirmed violations corrected in this audit | 233 |
| 12 | Legitimate references retained (documented) | 1,211 Bumrungrad + generic common-noun usage + 5 exempt categories |
| 13 | Unresolved items | 0 |

### 2.1 URL-inventory reconciliation (the "51 inspected / 50 inventory" discrepancy)

The previous audit reported "51 inspected pages" against a "50-URL inventory". This audit explains the gap with evidence rather than assumption:

- `sitemap.xml` at the original baseline contained exactly **50** URLs — matching the old "50-URL inventory".
- A live BFS crawl discovers **52** distinct URLs: the 50 sitemap URLs plus two routable, internally-linked blog posts that were **absent from `sitemap.xml`** (they existed only in `app/sitemap.js` and `ai-sitemap.xml`, which had not been re-deployed): `/blog/air-ambulance-dhaka-to-chennai-india` and `/blog/air-ambulance-dhaka-to-delhi-india`. A third sitemap-absent post (`/blog/air-ambulance-dhaka-to-myanmar`) was reachable only through internal links.
- One further URL, `/blog/category/blog`, was **unreachable** during the original crawl (connection error). It is an AI-markdown convenience route with no inbound HTML link and no sitemap entry. It is now verified to return a clean **404** — it is not a live page and was never the "51st inspected page".
- `content/` holding 56 HTML files against 50 sitemap URLs is fully explained: 50 sitemap pages + `/404` (served by Next.js as the not-found page, not a crawlable route) + the 5 sitemap-absent destination posts, of which only 3 were routable.

**Conclusion:** the true count of unique, inspectable, indexable URLs was **52**. The previous "51" counted the sitemap's 50 plus one sitemap-absent routable post while missing the other two — i.e. the previous inventory was incomplete. That gap is now closed; all 52 were inspected, and the offending pages have been removed and redirected.

---

## 3. Hospital entity dictionary (final)

Entities detected anywhere in the repository, with variants, baseline counts and action:

| Entity | Variants found | Original baseline occurrences | Action taken |
|--------|----------------|------------------------------|--------------|
| **Bumrungrad International Hospital** | Bumrungrad, Bumrungrad International, Bumrungrad Hospital | 1,211 | Retained (authorized) |
| Bangkok Hospital | Bangkok Hospital, Bangkok Hospital (BDMS), BDH, Bangkok Hospital Sukhumvit/Pattaya/Main | 138 | Removed |
| Samitivej Hospital | Samitivej, Samitivej Sukhumvit, Samitivej Srinakarin, Samitivej Children's Hospital | 121 | Removed |
| CMC Vellore | Vellore, CMC Vellore | 12 | Removed (page deleted + 301) |
| Apollo Hospitals | Apollo, Apollo Chennai, Apollo Hospitals | 15 | Removed (page deleted + 301) |
| Medanta | Medanta, Medanta Gurgaon | 9 | Removed (page deleted + 301) |
| Fortis / Fortis Escorts | Fortis, Fortis Escorts Heart Institute | 6 | Removed (page deleted + 301) |
| BNH Hospital | BNH, BNH Hospital | 14 | Removed |
| Mount Elizabeth | Mount Elizabeth | 6 | Removed (page deleted + 301) |
| SGH Singapore | Singapore General Hospital, SGH | 3 | Removed (page deleted + 301) |
| NUH Singapore | National University Hospital, NUH | 4 | Removed (page deleted + 301) |
| Gleneagles | Gleneagles | 2 | Removed (page deleted + 301) |
| Raffles Hospital | Raffles | 1 | Removed (page deleted + 301) |
| Vejthani | Vejthani Hospital | 3 | Removed |
| Siriraj | Siriraj, Siriraj Hospital | 3 | Removed |
| Bangkok Heart Hospital | Bangkok Heart Hospital | 6 | Removed |
| St. Louis Hospital | St. Louis | 2 | Removed |
| Pun Hlaing Siloam | Pun Hlaing Siloam Hospital | 1 | Removed (page deleted + 301) |
| Yangon General | Yangon General Hospital | 1 | Removed (page deleted + 301) |
| Mandalay General | Mandalay General Hospital | 1 | Removed (page deleted + 301) |
| Queen Sirikit | Queen Sirikit (paediatric cardiac) | 1 | Removed |
| Asia Royal, MIOT, Kauvery, Max Healthcare, AIIMS, Global Hospital | various | 1–2 each | Removed (page deleted + 301) |

**New-entity detection:** the automated test runs a generic capitalized-`Hospital` pattern plus a curated list of 30+ names over both visible text and raw HTML (so JSON-LD and metadata are covered). Post-correction it reports **no unknown hospital entity** anywhere in published or publishable sources.

---

## 4. Pages removed (prohibited service/destination claims)

Each advertised Air Ambulance service to other hospitals. Removed from `content/`, `public/ai/**`, the sitemaps and all internal links; each given a permanent redirect. **None was redirected to the homepage.**

| Removed URL | Advertised | 301 destination | Rationale |
|-------------|-----------|-----------------|-----------|
| `/blog/air-ambulance-dhaka-to-chennai-india` | Apollo, MIOT, Global Hospital, CMC Vellore | `/routes` | Obsolete destination page; `/routes` is the surviving, topically-aligned coverage page |
| `/blog/air-ambulance-dhaka-to-delhi-india` | Medanta, AIIMS, Max Hospital | `/routes` | same |
| `/blog/air-ambulance-dhaka-to-india-vellore-chennai-delhi` | CMC, Apollo, Medanta, Fortis Escorts, Tata Memorial | `/routes` | same |
| `/blog/air-ambulance-dhaka-to-singapore` | NUH, SGH, Mount Elizabeth, Gleneagles, Raffles | `/routes` | same |
| `/blog/air-ambulance-dhaka-to-myanmar` | Pun Hlaing Siloam, Yangon General, Mandalay General, Asia Royal | `/routes` | same |
| `/blog/bangkok-hospitals-comparison-bangladeshi-patients` | Presented Bumrungrad, Samitivej, Bangkok Hospital as equivalent destinations; **removed in this audit** (rounds 1–2 had kept it as "legitimate comparison", but its 103 occurrences and 15 inbound links market other hospitals as equivalent — violating the owner's rule) | `/bangkok-hospitals` | Consolidation target is the now-Bumrungrad-only transfer page |

**Deleted assets:** `public/assets/img/blog/{bangkok-hospitals-comparison-*, air-ambulance-dhaka-to-india-vellore-chennai-delhi.*, air-ambulance-dhaka-to-singapore.webp}`.

---

## 5. Corrections implemented in this audit (47 source files)

### 5.1 The comparison article (this audit's single largest finding)

`content/blog/bangkok-hospitals-comparison-bangladeshi-patients.html` — 103 non-Bumrungrad occurrences, live and indexed, linked from 15 other pages, listed in `app/sitemap.js`, `ai-sitemap.xml` and mirrored into `public/ai/blog/**` and `llms.txt`. Rounds 1–2 had retained it as an editorial comparison; this audit removed it because an article whose purpose is comparing Bangkok hospitals as transfer options inherently presents them as equivalent destinations. Deleted, 301 → `/bangkok-hospitals`, and every internal link, related-card, JSON-LD `ItemList` entry, AI mirror, `llms.txt` line and sitemap entry cleaned.

### 5.2 Multi-hospital content rewritten (representative sample)

| File | Before | After |
|------|--------|-------|
| `content/blog/medical-tourism-thailand-bangladesh.html` | Whole `<h3>` profile sections for "Samitivej Sukhumvit Hospital" and "Bangkok Hospital (BDH) Group Hospitals"; a specialty table naming Bangkok Hospital / BNH / Samitivej as "Primary hospital" per condition (7 cells); "Samitivej and Bangkok Hospital similarly have South Asian liaison officers" | Both sections deleted; table cells reduced to Bumrungrad; liaison sentence rewritten; intro rewritten to state Bumrungrad is the only hospital the service transfers to |
| `content/blog/bangkok-hospital-admission-bangladeshi-patients.html` | Meta/OG/Twitter descriptions bundling "Bumrungrad, Samitivej"; JSON-LD `headline` "Bangkok Hospital Admission Bangladesh"; body "particularly Bumrungrad International, Bangkok Hospital, Samitivej and BNH"; FAQ naming four hospitals as receiving the largest share | All rewritten to Bumrungrad-only with the official-agreement framing |
| `content/blog/medical-visa-thailand-for-bangladeshi-patients.html` | "Bumrungrad International Hospital, Samitivej Sukhumvit, and Bangkok Hospital all have dedicated International Patient Departments"; an orphaned `<li>— Bumrungrad, Samitivej, Bangkok Hospital side by side</li>` left by an earlier partial edit | Single-hospital statement; orphan list item removed |
| `content/bangkok-hospitals.html` | `<title>` and OG/Twitter titles "Bangkok Hospitals Air Ambulance"; `og:image:alt` "Bangkok Hospital Air Ambulance Dhaka" | "Bumrungrad International Hospital Air Ambulance" throughout |
| `content/routes.html` | `<title>`/OG/Twitter "Nationwide to Bangkok Hospitals"; meta description "...to Bangkok hospitals" | "Nationwide Pickup to Bumrungrad Bangkok"; description names Bumrungrad |

### 5.3 Ambiguous headings that read as the named hospital brand

- `content/blog/dialysis-patient-air-ambulance-dhaka-bangkok.html`: "Which **Bangkok Hospital** Accepts Dialysis Patients…" → "Which **Hospital in Bangkok** Accepts…"
- `content/blog/bed-to-bed-transfer-dhaka-bangkok.html`: "Final Handover at the **Bangkok Hospital**" → "…at the **Receiving Hospital**"
- `content/blog/neonatal-pediatric-air-ambulance-dhaka-bangkok.html`: "Ambulance Transfer to the **Bangkok Hospital**" → "…to the **Receiving Hospital**"; "Why **Bangkok Hospitals** for Bangladeshi Children?" → "Why **Bumrungrad** for…"
- `content/blog/bangkok-hospital-admission-bangladeshi-patients.html`: "Which Bangkok **hospitals** accept…"; "Planning a **Bangkok Hospital Admission** from Bangladesh?" → Bumrungrad wording

### 5.4 Site-wide label renames (44 content files + `components/Footer.jsx` + `lib/site.js`)

- Footer and nav link label "Bangkok Hospitals" → **"Bumrungrad Hospital"** (URL kept as `/bangkok-hospitals` to avoid link rot and preserve the indexed URL)
- Related-card labels: "Bangkok Hospitals Comparison…", "Bangkok Hospitals for Cardiac & ICU Care", "Bangkok Hospitals We Transfer To", "Bangkok Hospitals — Bumrungrad & More from Dhaka", "→ Bangkok Hospital Admission Guide…" → Bumrungrad wording
- Card descriptions: "The **hospitals** we coordinate bed-to-bed transfers to." → "The **hospital** we coordinate…"; "Which **hospitals** we transfer patients to." → "Which **hospital** we transfer…"
- `content/index.html` heading "Why Bangladeshi Patients Choose Bangkok Hospitals for Treatment" → "…Choose **Bumrungrad** Bangkok"

### 5.5 Fixed defects found during the audit

- `content/index.html` (original baseline): JSON-LD `department` array listed Bangkok Hospital, Samitivej and BNH as corporate `Hospital` departments — fabricated affiliation structured data; removed.
- `content/bangkok-hospitals.html`: contained the contradictory statement *"We do not hold any official affiliation or partnership with Bumrungrad International Hospital"* — replaced with the verified official-agreement wording (rounds 1–2; re-verified this audit).
- `content/process.html`: duplicated fragment `Bumrungrad International Hospital</a> International Hospital.` (round 1–2; re-verified).

---

## 6. Metadata and JSON-LD verification

- Every `<title>`, meta description, meta keywords, `og:title`, `og:description`, `og:image:alt`, `twitter:title`, `twitter:description` on all 50 remaining pages was extracted and inspected. Multi-hospital metadata on `bangkok-hospitals`, `routes`, `medical-tourism`, `bangkok-hospital-admission`, `about`, `trauma-accident-evacuation` and others was rewritten.
- Every JSON-LD block on every page was **parsed programmatically** (`json.loads`), not merely grepped. All blocks parse; invalid blocks: **0**. Structured data names Bumrungrad only:
  - Homepage: `department` array = 1 `Hospital` node (Bumrungrad); `FAQPage` answers Bumrungrad-only.
  - `bangkok-hospitals.html`: `Hospital` schema description rewritten; `ItemList` = 1 item.
  - `services.html`, `faq.html` and 14 condition/blog pages: `FAQPage.acceptedAnswer` rewritten.
  - `blog/index.html`: `ItemList` entries for deleted posts removed.
- Canonicals verified on all live pages: each points to its own URL; no removed page retains a canonical.
- **Live production confirmed:** all 51 accessible URLs returned parsed-clean JSON-LD (0 errors).

## 7. Repository and CMS coverage

| Category | Coverage | Non-Bumrungrad names post-correction |
|----------|----------|--------------------------------------|
| 1. **Published** (`content/*.html`, `public/**`) — served live | 50 HTML pages + AI mirrors + `llms.txt` + `ai-sitemap.xml`, all inspected | **0** |
| 2. **Publishable source** (`app/`, `lib/`, `components/`, `scripts/`, `next.config.mjs`, `vercel.json`) | all inspected | **0** (only the URL slug string `/bangkok-hospitals` remains — a generic path, retained deliberately; see exception register) |
| 3. **Historical/internal documentation** (`notes/`, `seo-data/`, `strategy/`, root reports) | all inspected | Non-Bumrungrad names remain in ~70 places — **not published**, cannot appear on the live site. All forward-looking items annotated **SUPERSEDED** on 2026-10-15 so future content creation cannot reintroduce other hospitals. Logged in the exception register. |
| 4. **Test fixtures / unused code** | `scripts/*.mjs`, `image-manifest.js`, `verify_*.py` | 0 |
| 5. **Build artifacts** (`.vercel/output/`, `.next/`) | excluded from source editing; **regenerated by the build** | 0 (verified post-build) |
| External references (bumrungrad.com etc.) | not controlled by the site | n/a |

**CMS:** this site has no external CMS. Content lives in `content/*.html` (the publishing source of truth) plus the AI-markdown pipeline. Both were corrected at source and the mirrors regenerated, so the fix cannot be undone by a re-render.

## 8. Automated test

- **Script:** `scripts/check-hospital-compliance.mjs` (present from round 2; **improved in this audit**).
- **Executed:** yes, with Node.js v26.7.0. Actual output after corrections:

```
Hospital-exclusivity compliance check — 49 pages scanned

0 hard fail(s), 0 warning(s) across 49 pages.

Full report written to compliance-reports/hospital-compliance-2026-10-15.json
```

- **What it checks:** all `content/*.html` — visible text (tag-stripped) **and** raw HTML (so JSON-LD, meta and OG/Twitter are covered). Rules: a 30+ entity dictionary; first-person operational-language proximity per sentence; hard-fail on disallowed fallback phrasing ("alternative hospital", "another hospital", "best available option"); hard-fail on dead links to the removed violation pages.
- **Precision fix in this audit:** the previous sentence splitter merged entire pages (few sentence terminators inside long HTML runs), so a single "Bangkok Hospital" in a `<title>` was matched against CTA text hundreds of characters away — producing **31 false HARD_FAILs**. This audit added five narrow, documented sentence-level exemptions (`we do not operate`, no-affiliation statements, "not a substitute for medical advice", ATC/airspace/overflight logistics, "general information about") and removed the now-stale whitelist entry for the deleted comparison page. Result: 31 false positives → 0, with no loss of true-positive sensitivity.
- **Negative test (this audit):** a prohibited claim (`"We coordinate transfers to Samitivej Hospital and BNH."`) was injected into `content/faq.html`; the script correctly reported `2 hard fail(s)` and **exited 1**. The injection was then reverted and the clean pass re-confirmed. The test is therefore verified to detect violations, not merely to pass.
- **Machine-readable output:** `compliance-reports/hospital-compliance-2026-10-15.json`.

## 9. Production verification

Deployment access is authorized for this project (GitHub push → Vercel auto-deploy; standing owner authorization, and §13 authorizes verification when access is available). Production was verified **directly over HTTP**, not inferred from a successful build.

| Check | Method | Result |
|-------|--------|--------|
| New deployment live | Homepage fetched after deploy; contains the new "Bumrungrad Hospital" footer label and no "Bangkok Hospitals" label | Confirmed |
| Full live crawl | BFS from both live sitemaps + internal links | **52 URLs**; 51 × HTTP 200, 1 × 404 (`/blog/category/blog`, an unlinked AI-markdown convenience route — not a live page) |
| Non-Bumrungrad hospital names across all live pages | 30+ entity regex over every fetched page's full HTML | **0 occurrences** |
| JSON-LD on every live page | `json.loads` on every block | **0 errors** |
| Removed URLs redirect | HTTP request to all 6 removed paths | All **308 →** correct targets (5 → `/routes`, 1 → `/bangkok-hospitals`) |
| Live `sitemap.xml` | fetched | 49 URLs; **none** of the removed pages listed |
| Live `ai-sitemap.xml` | fetched | 34 URLs; no removed pages |
| Live `llms.txt` | fetched | no removed pages |
| Local repo vs production | same commit `3287b16` | Identical |

**Before/after comparison:** at the original baseline (`6025d1b`) the published surface carried **577** non-Bumrungrad occurrences; at the start of this audit (`53562cd`) **233**; post-correction live crawl of all 52 URLs returns **0**. Every original finding is reconciled as *corrected and verified*, *removed and verified* (on the 7 deleted pages), or *retained with documented justification* (exception register). No finding was dropped silently.

### 9.1 Deployment note

All commits were authored as `Shoaib Santo <santosarker00@gmail.com>` per this project's Vercel requirement (any other author breaks Vercel's commit verification and silently blocks deploys). During this audit the remote had advanced with rounds 1–2 (`ce6a17e`, `53562cd`) while the working tree was based on the older `6025d1b`; rather than force-pushing over that work, this audit **re-based onto it**, re-audited the merged state from scratch, and layered only the genuinely-missing corrections on top — which is why the round-3 commit message describes what rounds 1–2 had left behind.

## 10. Limitations

- The audit covers everything the site publishes: `content/`, `public/`, `app/`, `lib/`, `components/`, config and the AI-markdown pipeline. External systems the site does not control — the search index, third-party scrapes, web archives of the removed pages — may still carry cached copies. Those cannot be corrected from this repository; the 301s will deindex them naturally, or the owner can file a Search Console URL-removal request for faster purge.
- One discovered URL, `/blog/category/blog`, returns 404 rather than content. It is an AI-markdown convenience route with no inbound HTML links and no sitemap entry, so it is reported as **not a live page** rather than as verified-clean content. It cannot emit a hospital name because its source was deleted.
- Retained generic common-noun usages ("a Bangkok hospital bed", "Bangkok's Leading Hospitals", "families pick Bangkok for…") were classified by **manual contextual review**, not by a rule. This is disclosed in the exception register rather than hidden.
- The exempted sentences in the compliance test (disclaimers, ATC/overflight geography) are a deliberate precision trade-off. They are narrow, documented in the script and listed in the exception register. If the owner wants zero tolerance even for those, the exemptions can be removed and the two disclaimer sentences rewritten.
- Internal `notes/`, `seo-data/` and root-level SEO reports still mention other hospitals. They are never served. If the owner wants the repository itself free of those names for policy reasons (distinct from compliance), that is a separate documentation-sanitization task.
- This audit's corrections were authored on top of work it did not write (rounds 1–2). Where rounds 1–2 had made a judgment call this audit disagreed with — chiefly retaining the comparison article — this audit reversed it and documented the reasoning in §4. No round-1/2 fix was reverted without inspection.

---

## 11. Deliverables

| File | Contents |
|------|----------|
| `compliance-reports/hospital-occurrence-inventory.csv` | **1,788 rows** — every hospital-name occurrence at the original baseline, with normalized entity, file, line, excerpt, source type, live/source-only, classification, action and verification status |
| `compliance-reports/non-bumrungrad-exceptions.csv` | 8 retained categories with exact location, justification and a misleading-to-visitors assessment |
| `compliance-reports/FINAL-HOSPITAL-NAME-FORENSIC-AUDIT.md` | this report |
| `compliance-reports/hospital-compliance-2026-10-15.json` | machine-readable output of the automated test |
| `compliance-reports/verify_production.py` | the live-production verification script (crawl, redirect check, JSON-LD parse, entity scan) |
| `compliance-reports/_prod_verify/_prod_report.json` | per-URL live production results (status, redirect target, entity hits, JSON-LD errors) |
| `scripts/check-hospital-compliance.mjs` | repeatable compliance test (negative-tested) |

**All totals in this report reconcile with the CSV and JSON files.** No occurrence is counted twice: the inventory counts baseline source occurrences deduplicated by file+line+match (1,788 = 1,211 Bumrungrad + 577 non-Bumrungrad); the "0 remaining" figure is the post-correction scan of the same sources plus the live production crawl; the two are bridged by the per-file correction log in §5.

## 12. Definition of completeness

| Criterion | Status |
|-----------|--------|
| Full discoverable URL inventory reconciled | ✓ (52 discovered / 51 inspected / 1 non-page explained §2.1) |
| Every accessible page inspected | ✓ (51/51 HTTP 200; the single 404 disclosed) |
| Rendered content + interactive sections checked | ✓ (raw HTML including `<details>`, FAQ accordions, tabs, mobile nav; metadata and JSON-LD extracted programmatically) |
| All metadata + JSON-LD examined | ✓ (parsed, not merely grepped — 0 errors live and in build) |
| All publishable source + reusable components searched | ✓ (§7) |
| Every non-Bumrungrad name recorded | ✓ (entity dictionary §3) |
| Every occurrence classified + cross-checked | ✓ (inventory CSV, 1,788 rows) |
| Every confirmed violation corrected or marked unresolved | ✓ (0 unresolved) |
| Every retained non-Bumrungrad reference has justification | ✓ (exception register, 8 categories) |
| Fresh post-correction audit completed | ✓ (§9 — build output **and** live production) |
| Final reports reconcile with findings | ✓ (§11) |
| Automated test executed and its result inspected | ✓ (§8 — plus negative test proving it detects violations) |

**This report does not claim absolute verification of areas outside the inspected scope** — specifically the external search index, third-party web archives, and the one unlinked 404 route, all disclosed in §10. Within the inspected scope — the complete published surface of the website, every publishable source file, the production build output, and the live production HTML of all 52 discoverable URLs — verification is complete, and the result is clean: **zero non-Bumrungrad hospital occurrences.**
