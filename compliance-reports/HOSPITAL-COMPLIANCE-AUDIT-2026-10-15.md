# Hospital-Exclusivity Compliance Audit — 2026-10-15

**Business rule under audit:** The company provides Air Ambulance services exclusively for Bumrungrad International Hospital, Bangkok. No other hospital is an authorized receiving-hospital destination. There is no fallback arrangement if Bumrungrad cannot accept a patient (confirmed by the owner).

This audit was run in two passes on the same day: an initial full-site pass (Round 1), followed by an independent, skeptical re-audit that deliberately did not trust Round 1's conclusions (Round 2). Round 2 found real violations Round 1 missed, mostly in metadata, JSON-LD, and files outside Round 1's highest-priority list. Both rounds' findings are consolidated below.

## A. Coverage Report

- **Total URLs discovered:** 50 (via `app/sitemap.js`, cross-checked against the live `https://airambulancedhakabangkok.com/sitemap.xml` — exact match, same 50 URLs, confirming no drift between source and production).
- **Total unique URLs inspected:** 50 of 50 (100%). Every page's full source HTML — body, `<head>` metadata, JSON-LD, image alt text — was read in two independent passes.
- **URLs successfully verified:** 50 of 50.
- **Redirected/duplicate URLs:** None found in the current sitemap. 9 redirect rules exist in `next.config.mjs`; all were reviewed (see Change Log).
- **Inaccessible pages:** None. The site is fully server-rendered static HTML (Next.js SSG) with no client-only or JS-gated content, no pagination, no tag archives, and a single flat content directory — there was no hidden or dynamically-loaded content requiring a browser/Playwright pass to discover.
- **Pages/content requiring additional access:** None for the hospital-compliance question itself. Two access gaps exist for *unrelated* verification tasks, noted under Remaining Issues: (1) no Node.js/npm in the audit environment, so `npm run build`/`next lint` could not be executed; (2) no CMS — content lives as static HTML files in the Git repository, which was the authoritative source inspected.
- **Explicit limitation:** This audit covers the website's own content and metadata. It does not cover third-party listings (Google Business Profile, directories, social media bios) that may separately reference the business — those were out of scope and not inspected.

Full machine-readable inventory: `compliance-reports/url-inventory.csv` (50 rows: URL, HTTP status, indexability, classification, notes).

## B. Violation Register

Classification key: **A** = Compliant, **B** = Non-compliant (explicit other-hospital claim), **C** = Misleading implication, **D** = Ambiguous, **E** = Legitimate contextual reference, **F** = Unverified operational claim.

### B.1 — Found and fixed in Round 1 (same day, earlier pass)

| URL | Issue | Hospitals/destinations involved | Class |
|---|---|---|---|
| 5 whole pages (deleted) | Entire landing pages selling ICU charter service to India/Myanmar/Singapore with fabricated "direct admission agreements" | Apollo, CMC Vellore, Medanta, Fortis Escorts, NUH, SGH, Mount Elizabeth, Pun Hlaing Siloam, etc. | B |
| `/` (index.html) | `MedicalBusiness.department` JSON-LD array; `FAQPage` schema naming 4 hospitals vs. 1-hospital visible FAQ | Bangkok Hospital, Samitivej, BNH, Vejthani | B |
| `/services` | FAQ schema, Step 3 description, two hospital-specific subsections ("BNH — Personalised Care", "Samitivej — Paediatric Specialist") | BNH, Samitivej, Bangkok Hospital | B |
| `/routes` | "Do You Cover Routes Other Than Bangkok?" section; 4 related-guide links | India, Singapore, Myanmar | B |
| `/bangkok-hospitals` | Meta/keywords/OG/Twitter tags | Samitivej, BNH, Bangkok Hospital, Vejthani | C |
| `/faq` | Visible + JSON-LD claim of operating routes to Singapore/Chennai/Kolkata/Kuala Lumpur, with 3 dead links | Singapore, India (Chennai), Malaysia | B |
| ~27 blog/guide files | Recurring claims of transfer/admission coordination with other hospitals; broken `tel:` links (15 files); leftover HTML comments disabling real FAQ schema (6 files, revealing further violations once un-commented); pricing/flight-time self-contradictions; a Chinese-text leak; a duplicated phrase; a corrupted meta tag; "if Bumrungrad is full, alternative hospital" fallback language (7 files) | BNH, Samitivej, Bangkok Hospital, Siriraj, St. Louis, Vejthani, Bangkok Heart Hospital, India, Singapore | B/C |
| 2 files | Unrelated client's confidential SEO data committed into this public repo | N/A (data-hygiene issue, not a hospital claim) | — |

*(Full per-file detail for Round 1 is in the PR description for commit `ce6a17e` and the follow-up no-fallback commit `cd4cbc1` on GitHub; summarized here rather than repeated to keep this register focused on what Round 2 independently found.)*

### B.2 — Found and fixed in Round 2 (independent re-audit, same day)

| URL | Exact issue found | Hospitals involved | Class | Fix applied |
|---|---|---|---|---|
| `/about` | Meta description: "...bed-to-bed transfers to **Bumrungrad, Samitivej & Bangkok Hospital**." The matching OG/Twitter tags had already been fixed in Round 1 — this one tag was missed. | Samitivej, Bangkok Hospital | B | Meta description rewritten to name Bumrungrad only. |
| `/about` | "Direct coordination with **receiving hospitals** in Bangkok" (plural) | — (implied plurality) | C | Changed to "Direct coordination with Bumrungrad International Hospital". |
| `/bangkok-hospitals` | JSON-LD `Hospital.description`: "JCI-accredited Bangkok hospitals for Bangladeshi patients — **Bumrungrad, BNH, Samitivej**." Invisible to readers, parsed by search engines. | BNH, Samitivej | B | Rewritten to describe Bumrungrad only. |
| `/cancer-treatment-bangkok` | An entire injected content block (duplicate of pricing already on the page) said twice: "the flight doctor briefs the **Bumrungrad or Bangkok Hospital** cancer team" and "verify **Bumrungrad or Bangkok Hospital** bed availability." Also contained garbled auto-link text. | Bangkok Hospital | B | Entire duplicate block removed. |
| `/air-ambulance-cost` | JSON-LD FAQ: "...facilities only available at Bumrungrad International Hospital **or another Bangkok centre**..." The matching visible FAQ text had already been fixed in Round 1; this JSON-LD copy was never synced. | — (generic "another centre") | B | Synced to match the corrected visible text. |
| `/air-ambulance-cost` | Garbled sentence: "Your chosen Bangkok hospital also influences planning — whether you are treated at Bumrungrad..." implied hospital choice. | — | C | Rewritten: "Every transfer is to Bumrungrad International Hospital." |
| `/faq` (2 instances: JSON-LD + visible) | "...the preferred receiving hospital in Bangkok (**most often** Bumrungrad International Hospital)." | — (hedge implying exceptions) | C | "Most often" hedge removed; now states Bumrungrad coordination directly. |
| `/terms` | Terms of Service: "...hospitals in Bangkok, Thailand (**most often** Bumrungrad International Hospital)." Same hedge, in a legal document. | — | C | Hedge removed. |
| `/` (index.html) | H2 heading "How Does Bed-to-Bed Transfer Work to **Bangkok's Leading Hospitals**?" (plural) immediately above a single Bumrungrad-only answer. | — | C | Heading changed to name Bumrungrad directly. |
| `/blog/air-ambulance-cardiac-patients` | "...children...transferred to Bangkok's paediatric cardiology centres such as Bumrungrad or **Queen Sirikit National Institute of Child Health**." | Queen Sirikit | B | Queen Sirikit removed; restricted to Bumrungrad's paediatric cardiology centre. |
| `/blog/air-ambulance-cardiac-patients` | "Bangkok is home to several JCI-accredited hospitals...— Bumrungrad International, **Bangkok Heart Hospital, Samitivej, and Siriraj**" immediately preceding a description of "the role of a dedicated air ambulance." | Bangkok Heart Hospital, Samitivej, Siriraj | C | List removed; explicit "exclusively with Bumrungrad" clause added. |
| `/blog/emergency-medical-evacuation-dhaka-to-bangkok` | "**Let us coordinate the hospital.** If you have a preferred Bangkok hospital, tell us; if not, we can help match the patient's condition to the right destination." This file never named Bumrungrad anywhere in its body. | — (open choice of any hospital) | B | Rewritten to name Bumrungrad explicitly; two other generic passages (Quick Answer, definitional paragraph) also updated to name Bumrungrad for the first time in this file. |
| `/blog/medical-evacuation-cost-bangladesh` | JSON-LD FAQ: "The 3.5-hour flight **covers all major Bangkok hospitals including Bumrungrad International**." Directly contradicts this file's own body text ("Bumrungrad...is our only receiving hospital"). | — (implied multiple hospitals) | B | Rewritten to Bumrungrad-only. A second FAQ answer in the same block ("depending on the destination," "domestic flights," "international routes") was also leftover multi-destination framing from before Round 1 and was fixed. |
| `/blog/post-surgery-patient-transfer-dhaka` | **Most severe single-file finding.** Two FAQ answers and one body sentence: "Bumrungrad International Hospital **and Bangkok Hospital** are the two leading destinations... **Both hospitals have direct coordination agreements with our air ambulance service**"; a cost FAQ listing "coordination with Bumrungrad International Hospital **or Bangkok Hospital**"; and "...only available at a Bangkok tertiary centre such as Bumrungrad International **or Bangkok Hospital**." | Bangkok Hospital | B | All three rewritten to name Bumrungrad exclusively. The "coordination agreements" wording was also softened to avoid conflicting with the separate "no official affiliation" disclaimer on `/bangkok-hospitals` (see Ambiguity Register, item 1). |
| `/blog/medical-visa-thailand-for-bangladeshi-patients` | FAQ: "a letter from the Thai hospital (**Bumrungrad, Bangkok Hospital, etc.**)"; and "pre-notification through the coordinating hospital (**Bumrungrad International Hospital, Bangkok Hospital**) and the air ambulance operator." | Bangkok Hospital | B | Both rewritten to name Bumrungrad only. |
| `/blog/bangkok-hospitals-comparison-bangladeshi-patients` | A section titled "Air Ambulance from Dhaka to Each Hospital" discussed ground-transfer drive times to all three hospitals in air-ambulance-relevant terms ("every minute counts, and the shorter drive to Bangkok Hospital can be a meaningful factor"), undercutting the file's own disclaimer. A "Choose Bangkok Hospital if..." bullet said "...for an unstable patient **arriving by air ambulance**." A FAQ said Bumrungrad is "the **most commonly recommended** destination," implying others are also used. | Samitivej, Bangkok Hospital | C (bordering B) | Section retitled "Air Ambulance from Dhaka to Bumrungrad"; drive-time facts kept as pure geographic background with an explicit note that they "do not factor into our air ambulance service"; "arriving by air ambulance" phrase removed from the Bangkok Hospital bullet; FAQ rewritten to state exclusive transfer to Bumrungrad. The page's legitimate comparison content (cost tables, specialty breakdowns, "choose X if..." framework) was kept — this is a whitelisted comparison article, not a violation page. |
| `/blog/bangkok-hospital-admission-bangladeshi-patients` | Meta/OG/Twitter descriptions bundled "Bumrungrad, Samitivej" directly with "air ambulance from Dhaka," implying the air ambulance serves both. | Samitivej | C | Reworded to separate the air-ambulance claim ("to Bumrungrad International Hospital") from the general hospital list. |
| `/blog/medical-tourism-thailand-bangladesh` | Same meta-description bundling pattern; also a body sentence: "The receiving hospital (**Bumrungrad, Samitivej, or Bangkok Hospital**) will issue an appointment letter..." | Samitivej, Bangkok Hospital | C/B | Meta reworded; body sentence restricted to "the receiving hospital" without naming alternatives. |
| `/blog/why-bangladeshi-patients-choose-bangkok` | Same meta-description bundling pattern. | Samitivej, Bangkok Hospital | C | Meta reworded. |
| `/blog/stroke-air-ambulance-dhaka-bumrungrad` | FAQ: "**Bangkok Hospital and Samitivej Sukhumvit also have stroke units**, but Bumrungrad's...make it the **preferred** transfer destination" — implies the others are viable alternates. | Bangkok Hospital, Samitivej | C | Rewritten: "We transfer stroke patients exclusively to Bumrungrad..." |
| `/blog/emergency-air-ambulance-when-to-call` | "Our trauma...service is specifically designed to **locate the nearest appropriate trauma centre**" — contradicted the same file's own Bumrungrad-exclusive FAQ. A second passage listed "Bumrungrad International, **Bangkok Hospital, and Samitivej Sukhumvit**" as the relevant accredited hospitals. | Bangkok Hospital, Samitivej | C/B | Both rewritten to name Bumrungrad only. |
| `/blog/index` | Comparison-article card description: "...specialties, costs, **air ambulance transfer options**" (plural, implying multiple hospital destinations). | — | C | Reworded: "...where our air ambulance service transfers to." |

### B.3 — Data-hygiene / trust findings (not hospital-destination claims, but found during the same line-by-line read and corrected)

| Finding | Scope | Fix |
|---|---|---|
| Company footer showed the **author's personal address** ("Gulshan 1, Dhaka") instead of the registered company address | 7 files | Corrected to "Ground Floor, Surecell Medical BD Ltd, Plot 2 Rd 21, Dhaka 1212" (the address used everywhere else and in `lib/site.js`, the single source of truth) |
| A related-guide link described `/bangkok-hospitals` as a "Bumrungrad vs Samitivej vs Bangkok Hospital comparison" — that page is actually Bumrungrad-only; the real comparison lives at a different URL | 1 file | Link retargeted to the actual comparison article |

## C. Ambiguity and Owner-Review Register

These were **not edited** — either removing them could remove a true statement, or resolving them requires a fact only the owner has.

1. **Contradiction about the Bumrungrad relationship itself.** `/bangkok-hospitals` states: *"We do not hold any official affiliation or partnership with Bumrungrad International Hospital."* But `/gallery` and `/` (index.html) describe Surecell Medical as an *"official medical referral partner"* / *"official referral partner"* of Bumrungrad, with "Direct hospital partnership" language, and cite named 2025 awards from Bumrungrad's Referral Office Annual Conference. **This is not a wrong-hospital violation** (both statements are about Bumrungrad, the one authorized hospital) — it's a factual inconsistency about whether a formal partnership exists at all. One of these two statements is wrong. Needs owner confirmation of which is accurate; I did not guess.
2. **Named bank loan partners** (BRAC Bank, Dutch-Bangla Bank, City Bank) on `/blog/medical-evacuation-cost-bangladesh` — plausible but unverified from the page itself.
3. **"EURAMI standards" equipment certification claim** on `/guides/air-ambulance-dhaka-bangkok` — plausible but unverified.
4. **"AMOA" (Air Medical Operators Association) membership claim** on `/author/tawhid-iqbal` — plausible but unverified.
5. **Specific awards/statistics on `/gallery`** ("500+ Safe ICU transfers," named 2025 awards, a named individual's "World Women's Summit 2026" claim) — plausible but unverified.
6. **Response-time guarantees on `/contact`** ("WhatsApp within 2–5 minutes," "Email within 30 minutes") — plausible operational commitments, not edited since changing them without knowing the real SLA could misrepresent the business in the other direction.
7. **Visa-processing figures** on `/blog/medical-visa-thailand-for-bangladeshi-patients` have an internal inconsistency (3–5 vs. 5–7 business days; "ME" vs. "MT" visa category code; BDT 4,000–6,000 vs. 4,000–5,000 fee) found during this audit. This is a factual-consistency issue, not a hospital-destination claim, so it was left for a separate editing pass rather than folded into this compliance fix.
8. **Bumrungrad's total patient-volume statistic** still varies between "over 1 million," "over 520,000" (now aligned to ~1.1M per Round 1), and "over 60,000 Bangladeshi patients annually" (a distinct, more specific figure) across different pages — the Bangladeshi-specific figure was kept as-is since it answers a different question than the hospital-wide total.

## D. Change Log

**Round 2 commits (this audit):**
- Fixed files: `about.html`, `bangkok-hospitals.html`, `cancer-treatment-bangkok.html`, `air-ambulance-cost.html`, `faq.html`, `terms.html`, `index.html`, `blog/air-ambulance-cardiac-patients.html`, `blog/emergency-medical-evacuation-dhaka-to-bangkok.html`, `blog/medical-evacuation-cost-bangladesh.html`, `blog/post-surgery-patient-transfer-dhaka.html`, `blog/medical-visa-thailand-for-bangladeshi-patients.html`, `blog/bangkok-hospitals-comparison-bangladeshi-patients.html`, `blog/bangkok-hospital-admission-bangladeshi-patients.html`, `blog/medical-tourism-thailand-bangladesh.html`, `blog/why-bangladeshi-patients-choose-bangkok.html`, `blog/stroke-air-ambulance-dhaka-bumrungrad.html`, `blog/emergency-air-ambulance-when-to-call.html`, `blog/index.html`, plus 7 files for the footer-address bug (`blog/post-surgery-patient-transfer-dhaka.html`, `blog/ventilator-patient-air-ambulance.html`, `blog/medical-tourism-thailand-bangladesh.html`, `blog/how-to-book-air-ambulance-dhaka-bumrungrad.html`, `blog/bangkok-hospitals-comparison-bangladeshi-patients.html`, `blog/bumrungrad-international-hospital-dhaka-guide.html`, `blog/air-ambulance-cost-bangladesh-2026.html`, `blog/admit-patient-bumrungrad-dhaka-guide.html`, `blog/air-ambulance-cardiac-patients.html`, `blog/bed-to-bed-transfer-dhaka-bangkok.html`, `blog/emergency-air-ambulance-when-to-call.html` — 11 files total for the address fix).
- New files added: `scripts/check-hospital-compliance.mjs` (automated regression test, see Section E), `compliance-reports/url-inventory.csv`, `compliance-reports/HOSPITAL-COMPLIANCE-AUDIT-2026-10-15.md` (this report).
- No redirects, sitemap entries, or shared components (`Header.jsx`, `Footer.jsx`, `lib/site.js`) needed changes in Round 2 — the structural fixes (sitemap, redirects, nav links) were completed in Round 1 and re-verified clean in this round.

**Round 1 commits (same day, earlier):** see GitHub `ce6a17e` (main fix, 64 files) and `cd4cbc1` (no-fallback policy confirmation, 7 files) on `shoaibsanto/airambulancedhakabangkok`.

## E. Automated Compliance Test

`scripts/check-hospital-compliance.mjs` — a repeatable regression check, built on the same `lib/content.js` routing the Next.js app itself uses (so it can never drift from the real page list).

**What it does:**
- Enumerates every real page via `getAllSlugs()`/`fileForSlug()` (currently 50 pages, same count as the sitemap).
- Scans each page's raw HTML and stripped visible text for ~30 known other-hospital names (with the ambiguous ones like "Bangkok Hospital" matched case-sensitively to avoid false-positiving on generic phrases like "a Bangkok hospital").
- Flags a sentence as a likely violation only when an other-hospital name **and** first-person operational language ("we/our...transfer/coordinate/arrange/admit/serve/operate/partner/maintain") appear in the same sentence — catching the actual pattern every real violation in this audit followed, rather than failing on every bare mention of a competitor's name.
- Hard-fails unconditionally on: a link to any of the 5 deleted violation pages, or the literal "best available option" / "alternative hospital" / "different hospital" fallback phrasing the owner has ruled out.
- Downgrades hits inside two explicitly whitelisted comparison articles to warnings (still reported, not build-failing) rather than silently ignoring them.
- Writes a timestamped JSON report plus console output; exits 1 on any hard fail (or on any warning with `--strict`).

**Run it:** `node scripts/check-hospital-compliance.mjs`

**Important limitation, stated plainly:** there is no Node.js (or any JS runtime) in the environment this audit was performed in, so **this script has not actually been executed — it has been carefully reviewed by hand instead.** Its logic was validated by manually re-implementing its core checks as `grep` commands and running those against the live repository (documented in Section F below); all four equivalent checks returned zero hits. But the script itself, as a piece of JavaScript, has not been run. **The owner should run it once** (`node scripts/check-hospital-compliance.mjs`) before relying on it in CI, in case of a typo or syntax issue that hand-review missed.

## F. Final Verification Report

**Fresh re-crawl:** Performed via two independent subagent-driven reads of all 51 content files (23 + 27, split by directory) that did not reference or trust this document's Round 1 conclusions — each file was opened and read from scratch. This is what surfaced the Section B.2 findings.

**Live-site spot check:** Fetched `https://airambulancedhakabangkok.com/sitemap.xml` and compared it byte-for-byte (URL list) against `app/sitemap.js` — exact match, confirming production reflects the repository.

**Grep-based simulation of the automated test's hard-fail logic**, run against the repository after all Round 2 fixes (exact commands and zero-result output are reproducible — this is not a paraphrase):
- No-fallback phrases ("best available option" / "alternative hospital" / "different hospital"): **0 matches** sitewide.
- Dead links to the 5 deleted pages: **0 matches** sitewide.
- Other-hospital name + first-person operational verb in the same sentence, outside the two whitelisted comparison files: **0 matches** sitewide (checked both case-insensitively for distinctive names and case-sensitively for the ambiguous "Bangkok Hospital").

**What was NOT verified:**
- `npm run build` / `next lint` — no Node.js available in this environment. (Separately: the production Vercel deployment for Round 1's changes did build and deploy successfully, confirming the repository is in a buildable state as of commit `ce6a17e`; Round 2's changes are plain HTML/text edits to already-valid files and carry the same low structural risk, but have not themselves been through a build.)
- The automated test script's actual execution (see Section E).
- Third-party listings outside this website (out of scope per Section A).
- A rendered-in-browser / Playwright pass — not available in this environment; relied on reading server-rendered source HTML directly, which for this fully-SSG site is what a browser would render (no client-only content exists per `README.md`'s own description of the architecture).

## Remaining Issues (genuine, unresolved)

1. The Bumrungrad "official partnership" contradiction (Ambiguity Register item 1) needs an owner decision.
2. Five unverified-but-plausible claims (bank partners, EURAMI, AMOA, gallery stats, contact response times) remain on the site, flagged, not edited.
3. The visa-processing figures inconsistency (Ambiguity Register item 7) is unresolved.
4. The compliance script (Section E) has not been executed in any JS runtime — needs to be run once by someone with Node.js to confirm it's free of syntax errors.
5. `package.json`'s documented `npm run build` command (`generate-ai && next build`) will currently fail if run as literally written — `scripts/generate-ai-markdown.mjs` requires a `--site=` argument that the npm script never passes, so it exits with an error before `next build` even runs. This did not affect the live deployment because `vercel.json` overrides the build command to `next build` directly, bypassing the broken script entirely — but anyone following the README's documented `npm run build` locally will hit this. Unrelated to hospital compliance; flagged because it was discovered while confirming why a build could succeed despite this issue.
6. This repo's own pre-existing autonomous SEO automation (249 commits since June, dormant since 2026-09-25) has not been reactivated or reconciled with this audit's changes — if/when it resumes, it should be made aware that `scripts/generate-ai-markdown.mjs` also contains a hardcoded configuration block for a second, unrelated business ("GetmyFollow," an SMM panel site) in the same file used to build this site's AI-markdown mirror, confirming the operator runs this pipeline across multiple clients from shared code. Recommend confirming no further cross-contamination exists.
