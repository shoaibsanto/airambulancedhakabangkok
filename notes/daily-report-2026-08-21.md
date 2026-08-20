## Daily SEO Report — 2026-08-21 (Cycle 18)

### GSC Performance Overview (Last 7 Days: Aug 13–20)
- Impressions: 190
- Clicks: 1
- CTR: 0.53%
- Average Position: 15.2

**Comparison to Baseline (Jul 17 cycle 12):**
- 7-day baseline was ~168 imps / 4 clicks / 2.38% CTR
- Current: 190 imps / 1 click / 0.53% CTR
- Impressions stable (+13%), but clicks dropped -75% (4→1), CTR dropped from 2.38% to 0.53%

**28-Day Page Data (Jul 23 – Aug 20):**
- Top page: Homepage — 339 imps, 7 clicks, pos 7.8
- 2nd: /guides/air-ambulance-dhaka-bangkok — 193 imps, 0 clicks, pos 6.6
- 3rd: /air-ambulance-cost — 131 imps, 1 click, pos 11.9
- /blog/bangkok-hospitals-comparison — 63 imps, 0 clicks, pos 8.8
- /icu-vs-medical-escort — 44 imps, 0 clicks, pos 37.8
- /blog/medical-visa-thailand — 45 imps, 0 clicks, pos 11.3

### Indexing Status (5 Key Pages Inspected)
| Page | Status | Last Crawled |
|------|--------|--------------|
| Homepage (/) | ✅ Indexed | Aug 17, 2026 |
| /services | 🔴 Unknown to Google | Never |
| /guides/air-ambulance-dhaka-bangkok | ✅ Indexed | Jul 29, 2026 |
| /air-ambulance-cost | ✅ Indexed | Aug 16, 2026 |
| /bangkok-hospitals | ✅ Indexed | Jul 21, 2026 |

**Sitemap:** Valid, 55 indexed URLs, 0 errors

### Technical Audit Results
- **Titles >62c:** 3 pages (bangkok-hospitals 64c, stroke blog 67c, cardiac-emergency 69c) — owner-initiated titles from Aug 7 commit, NOT fixing per skill rules
- **OG/Twitter duplicates:** None found
- **Missing canonicals:** None
- **Long descriptions:** None
- **Root-path blog links:** Clean (no stale /slug links)
- **Low-link pages:** None (all content pages have 2+ inbound links)
- **FAQPage coverage:** 46/56 pages (10 non-content pages correctly excluded: 404, about, author, blog/index, contact, gallery, privacy, process, routes, terms)

### Key Observations

1. **Clicks dropped significantly** — From 4 clicks/7days (Jul baseline) to 1 click/7days (Aug). CTR dropped from 2.38% to 0.53%. Impressions remained stable at ~190. This suggests AI Overview or rich results are consuming more clicks.

2. **AI Overview Cannibalization Pattern Continues:**
   - "air ambulance dhaka" — pos 1, 0 CTR (1 imp in 7d)
   - "air ambulance in bangladesh" — pos 2.1, 0 CTR (21 imps in 28d)
   - "air ambulance service in bangladesh" — pos 2, 0 CTR (18 imps in 28d)
   - "air ambulance bangladesh" — pos 4, 0 CTR (23 imps in 28d)
   
   These pos 1-4 queries with 0 CTR confirm AI Overview is stealing clicks. FAQ schema already present on homepage — next step would be matching description language to query exact phrases.

3. **Guides pillar page (pos 6.6, 193 imps, 0 clicks):** High impressions but zero clicks — likely AI Overview citing content without sending traffic. Monitor for 2 more cycles before content refresh.

4. **/services still unknown to Google (18th consecutive cycle):** Despite 5+ static body links from homepage, Google has never crawled this URL. Owner must manually Request Indexing.

5. **Chennai India page performing best** — 6.45% CTR, pos 5.8. Only page with strong CTR outside homepage.

### Owner Action Required

**Tier 1 — URGENT (Request Indexing in GSC):**
1. https://airambulancedhakabangkok.com/services ← **18 cycles waiting**
   GSC Inspect: https://search.google.com/search-console/inspect?resource_id=sc-domain:airambulancedhakabangkok.com

**Tier 2 — Monitor (No action needed yet):**
- /guides/air-ambulance-dhaka-bangkok — 193 imps, 0 clicks, pos 6.6 (AI Overview cannibalization)
- /icu-vs-medical-escort — pos 37.8 (monitor, content refresh if still pos 30+ after 2 more cycles)

### Actions Taken This Cycle
- GSC pulse: Captured 7-day and 28-day performance data
- Indexing audit: Inspected 5 key pages
- Technical audit: Verified titles, OG/Twitter tags, canonicals, FAQ coverage
- No file changes required (owner titles preserved, no critical issues found)
- Build: 54 pages generated successfully

### Sitemap & Blog Listing Integrity
- All 33 blog posts present in sitemap.js ✅
- All 33 blog posts listed in blog/index.html ✅
- Blog index.html has proper OG/Twitter tags ✅
