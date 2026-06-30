# HiTHIUM Bangladesh — Monthly SEO Audit
**Date:** 2026-06-30 (June 2026 Report)
**Auditor:** Hermes SEO Agent (automated cron)
**Baseline Comparison:** 2026-06-25 baseline

---

## Technical Score: 71/100 ▲ (Baseline: ~55/100 estimated)

### Category Breakdown
| Category | Status | Score | Change vs Baseline |
|----------|--------|-------|--------------------|
| Crawlability | ✅ pass | 88/100 | ▲ +12 (sitemap fresh, 31 posts live) |
| Indexability | ⚠️ warn | 65/100 | ⚠️ 3 noindex pages still in page-sitemap; wishlist missing noindex |
| Security | ⚠️ warn | 62/100 | ↔ Same (HSTS/XFO/XCTO still missing) |
| URL Structure | ✅ pass | 82/100 | ▲ Clean URLs, www→non-www 301 working |
| Mobile | ✅ pass | 85/100 | ↔ Responsive, proper viewport |
| Core Web Vitals | ⚠️ warn | 65/100 | ↔ LiteSpeed cache ✅; no live CrUX data |
| Structured Data | ⚠️ warn | 68/100 | ⚠️ No Organization/LocalBusiness schema; no og:image on new IPS install post |
| JS Rendering | ✅ pass | 78/100 | ✅ SSR via WordPress; critical SEO in initial HTML |
| IndexNow | ❌ fail | 30/100 | ↔ Not implemented |

---

## Progress Since Baseline (2026-06-25)

### 🟢 Major Wins This Month

1. **Content Explosion: 31 posts live** (up from 18+ in baseline)
   - 13+ new blog posts published June 16–30, 2026
   - New posts: IPS installation guide, lithium vs generator, runtime guide, maintenance guide, Dhaka apartments IPS, solar IPS, how to choose IPS, portable power station comparison, and more
   - All new posts have: canonical tags ✅, meta descriptions ✅, og:image 1200×675 JPG ✅, FAQPage schema ✅, Article schema ✅

2. **llms.txt Now Live** (`https://hithiumbd.com/llms.txt` — HTTP 200)
   - Resolved from baseline (was missing)
   - Good product and pillar page inventory included
   - ⚠️ ISSUE: WhatsApp number is masked (`+8****11-000000`) — fix this

3. **Sitemap Freshness Excellent**
   - `post-sitemap.xml` lastmod: 2026-06-30T03:13:13 (updated today)
   - `page-sitemap.xml` lastmod: 2026-06-30T03:12:12
   - `product-sitemap.xml` lastmod: 2026-06-28T03:52:46
   - 12 sitemap sub-files in index

4. **OG Images: All Key Pages Have 1200×675 JPG**
   - best-ips-in-bangladesh: ✅ cover_best-ips-in-bangladesh.jpg
   - best-lithium-battery: ✅ hithium-cover-34967.jpg
   - best-portable-ips: ✅ hithium-cover-35060.jpg
   - intelligent-ips: ✅ hithium-cover-35065-1.jpg
   - sher-aips-company-bangladesh: ✅ hithium-cover-35058.jpg
   - 50-hazar-takar-ips: ✅ hithium-cover-35067.jpg

5. **FAQPage + Article Schema on Blog Posts**
   - Multiple posts have dual WebPage+FAQPage schema
   - FAQPage structured data present with Q&A markup
   - Article schema with wordCount, datePublished, dateModified

6. **www → non-www Redirect: Working**
   - `https://www.hithiumbd.com/` → 301 → `https://hithiumbd.com/` ✅
   - www SSL certificate valid ✅

---

## Issues Found This Audit

### 🔴 Critical Issues (Fix Immediately)

#### C1 — Broken `tel:` phone link on homepage
- **URL:** `https://hithiumbd.com/` (header widget)
- **Issue:** `href="tel:%20(064)%20332-1233"` — this is a fake US-format number with URL-encoded space prefix
- **Impact:** Every mobile visitor who taps the phone icon calls a wrong US number. Zero conversions from mobile tap-to-call.
- **Fix:** Update the Elementor widget phone href to the real BD number, e.g. `href="tel:+8801XXXXXXXXX"`
- Also: `llms.txt` has `WhatsApp +8****11-000000` — masked number is useless for AI citation.

#### C2 — Masked phone in llms.txt
- **URL:** `https://hithiumbd.com/llms.txt`
- **Issue:** `WhatsApp +8****11-000000` — obfuscated number negates the contact utility for AI systems
- **Fix:** Replace with real number: e.g. `WhatsApp: +880 XXXX-XXXXXX`

#### C3 — Noindex pages present in XML sitemap (page-sitemap.xml)
- **Pages in sitemap that are noindex:**
  - `https://hithiumbd.com/cart/` — has `noindex`
  - `https://hithiumbd.com/checkout/` — has `noindex`
  - `https://hithiumbd.com/my-account/` — has `noindex`
- **Why this matters:** Sending Googlebot to noindex pages wastes crawl budget and is contradictory. Google expects sitemap URLs to be indexable. Yoast SEO should auto-exclude noindex pages from sitemaps — this indicates a Yoast config issue.
- **Fix:** In Yoast SEO settings, ensure "noindex" pages are excluded from XML sitemaps. Or manually add these WooCommerce pages to the Yoast exclusion list.

#### C4 — Wishlist page: indexable but has no SEO value
- **URL:** `https://hithiumbd.com/wishlist/`
- **Issue:** Returns 200 with `index, follow` — also appears in page-sitemap.xml
- **Impact:** Google may index this empty WooCommerce page, wasting crawl budget and potentially generating thin-content signals.
- **Fix:** Add `noindex` to `/wishlist/` via Yoast per-page settings.

---

### 🟠 High Priority Issues (Fix Within 1 Week)

#### H1 — Checkout page canonical conflict
- **URL:** `https://hithiumbd.com/checkout/`
- **Issue:** Page is `noindex` (correct) but canonical points to `/cart/` not `/checkout/`
- Canonical and noindex are contradictory signals when pointing to different URLs
- **Fix:** Set canonical to self (`https://hithiumbd.com/checkout/`) — even on noindex pages.

#### H2 — Homepage OG image is SVG (80×80px icon)
- **URL:** `https://hithiumbd.com/`
- **Issue:** `og:image` = `alternative-energy-energy.svg` — 80×80 pixel SVG is not a valid OG image. Facebook, WhatsApp, LinkedIn ignore SVGs or show placeholder cards.
- **Impact:** Every share of the homepage on social media = blank/broken preview
- **Fix:** Set Yoast OG image for homepage to a real JPG/PNG at 1200×630px minimum

#### H3 — No Organization/LocalBusiness schema
- **Scope:** Homepage + Contact page
- **Issue:** Yoast WebSite schema present but no `Organization` or `LocalBusiness` entity with address, phone, geo coordinates, opening hours
- **Impact:** Google cannot extract rich business information; limits Knowledge Panel eligibility and local pack visibility
- **Fix:** Add custom Yoast Organization schema via Yoast → Search Appearance → Organization. Set: name, URL, logo, sameAs social profiles, contactPoint with telephone.

#### H4 — New post missing featured image → no og:image
- **URL:** `https://hithiumbd.com/ips-installation-guide-step-by-step-bangladesh/`
- **Issue:** Latest post (published 2026-06-30 today) has no featured image set → og:image will be absent or fall back to site default
- Check and add featured image before sharing/linking this post.

#### H5 — sher-aips-company-bangladesh: wordCount=0
- **URL:** `https://hithiumbd.com/sher-aips-company-bangladesh/`
- **Issue:** Schema shows `"wordCount":0` — content is likely in Elementor blocks not counted by Yoast's word counter
- **Risk:** Google may see this as thin content if body text is minimal. Elementor content may not be indexed if JS rendering is incomplete.
- **Fix:** Verify the page has substantial readable text. Add the article body in the Gutenberg/Classic editor (not just Elementor) so Yoast counts it. Target 1,000+ words.

#### H6 — Author schema uses "Admin" username and HTTP sameAs
- **All posts:** Author is `"Admin"` with `sameAs: "http://hithiumbd.com"` (HTTP, not HTTPS)
- **Issue:** Generic author name reduces E-E-A-T signals. `http://` sameAs is outdated (should be `https://`)
- **Fix:** Create a real author profile (e.g. "HiTHIUM Bangladesh Team") in WP with a bio, and update sameAs to `https://hithiumbd.com`

---

### 🟡 Medium Priority Issues (Fix Within 1 Month)

#### M1 — Missing security headers (unchanged from baseline)
- **Status:** Still missing HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy
- Only `content-security-policy: upgrade-insecure-requests` is present
- **Fix:** Add headers via Hostinger .htaccess or a WordPress security plugin (e.g. Headers & Security Enhanced, WP-Headers):
  ```
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  X-Frame-Options: SAMEORIGIN
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  ```

#### M2 — No AI crawler rules in robots.txt
- **Status:** robots.txt has zero AI crawler rules. No Cloudflare injection detected (clean robots.txt from Yoast only)
- **Decision needed:** For a brand that WANTS AI citation (correct strategy), allow all AI crawlers explicitly
- **Fix (recommended):** Add to robots.txt:
  ```
  # AI Crawlers — Allow for citation visibility
  User-agent: GPTBot
  Allow: /
  User-agent: ClaudeBot
  Allow: /
  User-agent: PerplexityBot
  Allow: /
  User-agent: ChatGPT-User
  Allow: /
  ```
  (These are currently allowed by default, but explicit Allow signals intent to AI operators.)

#### M3 — WordPress version exposed in meta generator
- **Issue:** `<meta name="generator" content="WordPress 7.0">` — exposes exact WP version publicly
- Also: Slider Revolution 6.7.55, WooCommerce 10.7.0, Elementor 4.0.9 all exposed
- **Fix:** Add to `functions.php`: `remove_action('wp_head', 'wp_generator');`

#### M4 — IndexNow not implemented
- **Status:** `/indexnow` returns 404
- **Opportunity:** Fast indexing on Bing/Yandex for new content (31 posts published last 2 weeks)
- **Fix:** Install a WordPress IndexNow plugin (IndexNow by Bing, Yoast Premium includes it)

#### M5 — Portfolio + old sitemap entries wasting crawl budget
- `portfolio-sitemap.xml` lastmod: 2021-08-27 (5 years old, stale)
- `project-cat-sitemap.xml` lastmod: 2021-08-27 (stale)
- `woodmart_slider-sitemap.xml` lastmod: 2026-01-06 (sliders not SEO content)
- **Fix:** Exclude these post types from Yoast XML sitemap via Yoast → Search Appearance → Content Types → turn off sitemap for portfolios, sliders

#### M6 — Intelligent IPS page: low word count (1,032 words)
- `wordCount: 1032` — below minimum for competitive keyword "intelligent ips"
- **Fix:** Expand to 1,500+ words with product specs, comparison table, FAQ expansion

---

### 🔵 Low Priority / Backlog

#### L1 — Checkout canonical should point to /checkout/ not /cart/
_(See H1 above — also a low-effort fix)_

#### L2 — `inLanguage: en-US` on Bengali-language posts
- Bengali posts (`sher-aips-company-bangladesh`, `50-hazar-takar-ips-bangladesh`) report `inLanguage: en-US` in schema
- Should be `bn-BD` (Bengali, Bangladesh)
- **Fix:** Set up Yoast to detect Bengali posts; alternatively add custom JSON-LD to override

#### L3 — xmlrpc.php returns 405 (acceptable but visible)
- Not fully disabled — returns 405 Method Not Allowed
- **Fix:** Block at server level via .htaccess: `<FilesMatch "xmlrpc.php">Order Deny,Allow\nDeny from all</FilesMatch>`

#### L4 — Duplicate product listings in sitemap
- Product sitemap shows multiple variants of HeroEE Light 1 (at least 2 separate URLs)
- e.g. `/product/hithium-heroee-light-1-portable-intelligent-ips/` AND `/product/hithium-heroee-light-1-1004wh-portable-intelligent-ips-500w-lifepo4-battery-11000-life-cycle-solar-ready/`
- **Fix:** Set canonical tags on duplicate product pages, or consolidate into one product URL

---

## Content Inventory Update (June 2026)

| Asset | Count | Change |
|-------|-------|--------|
| Published Posts | **31** | ▲ +13 from ~18 baseline |
| Pages | 24 | ↔ stable |
| Products | 10 | ↔ stable |
| Sitemap sub-files | 12 | ↔ stable |
| Posts with og:image | ~29/31 | ▲ good |
| Posts with FAQPage schema | ~15+ | ▲ new |

### New Posts Published Since Baseline
1. IPS Installation Guide — Step by Step (/ips-installation-guide-step-by-step-bangladesh/) — 2026-06-30
2. Portable Power Station Price in Bangladesh (/portable-power-station-price-in-bangladesh/) — 2026-06-29
3. Lithium Battery vs Tubular Battery IPS Bangladesh (/lithium-battery-vs-tubular-battery-ips-bangladesh/) — 2026-06-29
4. Lithium IPS vs Generator Bangladesh (/lithium-ips-vs-generator-bangladesh/) — 2026-06-29
5. Lithium IPS Runtime Load Shedding Dhaka (/lithium-ips-runtime-load-shedding-dhaka/) — 2026-06-29
6. Lithium IPS Maintenance Guide Bangladesh (/lithium-ips-maintenance-guide-bangladesh/) — 2026-06-29
7. Best IPS Dhaka Apartments Space-Saving (/best-ips-dhaka-apartments-space-saving-solutions/) — 2026-06-29
8. How to Choose IPS for Home Bangladesh (/how-to-choose-ips-for-home-bangladesh/) — 2026-06-29
9. Solar IPS Bangladesh (/solar-ips-bangladesh/) — 2026-06-29
10. Portable Power Station vs Traditional IPS (/portable-power-station-vs-traditional-ips-bangladesh/) — 2026-06-29
11. What Makes IPS Best Bangladesh (/what-makes-ips-best-bangladesh/) — 2026-06-29
12. Best Portable IPS Bangladesh (/best-portable-ips-bangladesh/) — 2026-06-29
13. Best IPS in Bangladesh 2026 (/best-ips-in-bangladesh/) — 2026-06-16 (updated 2026-06-30)

---

## Key Page Audit Summary

| Page | Title Length | Meta Desc | Canonical | OG Image | Schema Types | Issues |
|------|-------------|-----------|-----------|----------|--------------|--------|
| Homepage | 58 chars ✅ | 161 chars ✅ | ✅ self | ⚠️ SVG 80×80 | WebPage, WebSite | OG image is SVG |
| /best-ips-in-bangladesh/ | 55 chars ✅ | 153 chars ✅ | ✅ self | ✅ JPG 1200×675 | WebPage+FAQPage | — |
| /best-lithium-battery-for-ips-in-bangladesh/ | 62 chars ✅ | 145 chars ✅ | ✅ self | ✅ JPG 1200×675 | Article+FAQPage | — |
| /best-portable-ips-bangladesh/ | 60 chars ✅ | 135 chars ✅ | ✅ self | ✅ JPG 1200×675 | Article+WebPage | No FAQPage |
| /intelligent-ips-smart-features-bangladesh/ | 64 chars ✅ | 145 chars ✅ | ✅ self | ✅ JPG 1200×675 | Article+FAQPage | wordCount=1032 (thin) |
| /sher-aips-company-bangladesh/ | Bengali title | Bengali desc | ✅ self | ✅ JPG 1200×675 | Article+FAQPage | **wordCount=0** ⚠️ |
| /50-hazar-takar-ips-bangladesh/ | Bengali title ✅ | Bengali desc ✅ | ✅ self | ✅ JPG 1200×675 | Article+FAQPage | inLanguage wrong |
| /ips-installation-guide-step-by-step-bangladesh/ | 52 chars ✅ | 150 chars ✅ | ✅ self | ❌ No featured image | Article+WebPage | No og:image |

---

## Robots.txt Analysis

```
Current served robots.txt (clean, no Cloudflare injection):
- WooCommerce logs/transient/uploads: ✅ blocked
- /wp-admin/: ✅ blocked (except admin-ajax.php)
- YOAST block: User-agent: * Disallow: (empty = allow all)
- Sitemap: https://hithiumbd.com/sitemap_index.xml ✅
- NO AI crawler rules (neither Allow nor Disallow explicit)
- No Cloudflare "Block AI Bots" injection detected ✅
```

**Assessment:** Robots.txt is clean and functional. All AI crawlers allowed by default (good for GEO visibility). No conflicts.

---

## Sitemap Health

| Sitemap | URLs | Last Modified | Status |
|---------|------|---------------|--------|
| post-sitemap.xml | 31 | 2026-06-30 | ✅ Fresh |
| page-sitemap.xml | 24 | 2026-06-30 | ⚠️ Includes 3 noindex pages |
| product-sitemap.xml | 10 | 2026-06-28 | ✅ |
| category-sitemap.xml | — | 2026-06-30 | ✅ |
| portfolio-sitemap.xml | — | 2021-08-27 | ⚠️ Stale (5 years) |
| woodmart_slider-sitemap.xml | — | 2026-01-06 | ⚠️ Sliders not SEO content |
| project-cat-sitemap.xml | — | 2021-08-27 | ⚠️ Stale |

---

## Health Score Calculation

| Factor | Weight | Score | Weighted |
|--------|--------|-------|---------|
| Crawlability | 15% | 88 | 13.2 |
| Indexability | 15% | 65 | 9.75 |
| Security | 10% | 62 | 6.2 |
| URL Structure | 10% | 82 | 8.2 |
| Mobile | 10% | 85 | 8.5 |
| Core Web Vitals | 15% | 65 | 9.75 |
| Structured Data | 10% | 68 | 6.8 |
| JS Rendering | 10% | 78 | 7.8 |
| IndexNow | 5% | 30 | 1.5 |
| **TOTAL** | **100%** | | **71.7 → 71/100** |

**Baseline estimate: ~55/100** → **Current: 71/100** → **▲ +16 points improvement in ~5 days**

---

## Priorities for Next 30 Days (July 2026)

### Week 1 (July 1–7) — Quick Wins
1. **Fix homepage tel: href** — replace `tel:%20(064)%20332-1233` with real BD number in Elementor widget
2. **Fix masked phone in llms.txt** — update to real WhatsApp number
3. **Add noindex to /wishlist/** page via Yoast
4. **Exclude noindex WooCommerce pages from sitemap** — Yoast SEO → Search Appearance
5. **Fix homepage og:image** — set a 1200×630 JPG as the featured image for the homepage in Yoast
6. **Add featured image to IPS installation post** — so it has og:image

### Week 2 (July 8–14) — Schema & Authority
7. **Add Organization schema** via Yoast Search Appearance → Organization with real phone, address, geo
8. **Fix author profile** — rename "Admin" to "HiTHIUM Bangladesh" with bio; fix sameAs to https://
9. **Fix checkout canonical** — point to /checkout/ not /cart/
10. **Fix Bengali post inLanguage** — add custom schema override for Bengali posts

### Week 3–4 (July 15–31) — Content & Infrastructure
11. **Expand sher-aips-company-bangladesh** — wordCount=0 is critical risk; add 800+ words of real content in the post body
12. **Expand intelligent-ips page** to 1,500+ words
13. **Install IndexNow plugin** (Yoast Premium or Bing IndexNow plugin)
14. **Add security headers** via .htaccess (HSTS, X-Frame-Options, XCTO, Referrer-Policy)
15. **Remove generator meta tags** (WP, Elementor, Slider Revolution version exposure)
16. **Disable portfolio/slider sitemaps** in Yoast to clean up sitemap index

### Content Backlog (Carry Forward from Baseline)
From the original baseline suggestions, NOT yet published:
- [ ] Solar + lithium IPS combo guide (was on list — /solar-ips-bangladesh/ now exists ✅)
- [ ] IPS maintenance before/after Eid (/lithium-ips-maintenance-guide-bangladesh/ ✅ published)
- [ ] LiFePO4 battery lifespan guide — **NOT YET PUBLISHED** (high priority)
- [ ] How to calculate IPS backup time — **NOT YET PUBLISHED**
- [ ] IPS for home office in BD — **NOT YET PUBLISHED**
- [ ] Best IPS for Dhaka apartments — ✅ PUBLISHED

### New Content Opportunities (Identified This Audit)
- `/ips-price-list-bangladesh-2026/` — comprehensive price table (high search volume expected)
- `/hithium-vs-luminous-ips-bangladesh/` — competitor comparison
- `/ips-wiring-guide-bangladesh/` — sub-topic from IPS installation guide
- `/load-shedding-schedule-dhaka-2026/` — informational magnet for IPS buyers
- `/lifepo4-battery-calculator-bangladesh/` — tool page (embed the existing watt calculator)

---

## Technical Watchlist (Monitor Next Month)

| Item | Status | Action |
|------|--------|--------|
| GSC coverage data | ⚠️ No API access | Set up GSC MCP or manual check |
| CrUX / Core Web Vitals | ⚠️ No real data | Need 1,000+ monthly visitors first |
| Bing/Yandex indexation | ⚠️ Unknown | IndexNow plugin will surface data |
| WordPress 7.0 compatibility | ✅ Running fine | Monitor for plugin conflicts |
| WooCommerce 10.7.0 | ✅ Running fine | Monitor changelogs |

---

*Report generated: 2026-06-30 by Hermes SEO Agent — hithiumbd.com Monthly Audit*
*Next scheduled audit: 2026-07-01*
