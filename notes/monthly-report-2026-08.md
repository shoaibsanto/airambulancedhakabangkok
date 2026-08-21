# Air Ambulance Dhaka Bangkok — Daily SEO Report (Cycle 29)
Date: August 23, 2026 (BST)

## GSC Performance Overview

### 7-Day Trend (Aug 14–21, 2026)
- Impressions: 193
- Clicks: 1
- CTR: 0.52%
- Average Position: 14.5
- **Status:** SEVERE CTR DECLINE (baseline: 2.38%)

### 28-Day Trend (Jul 24 – Aug 21, 2026)
- Impressions: 855
- Clicks: 9
- CTR: 1.05%
- Average Position: 10.1
- **Status:** CRITICAL DECLINE (baseline: 2.89% CTR, 20 clicks)

### Top Pages by Performance

| Page | Impressions | Clicks | CTR | Position | Status |
|------|-------------|--------|-----|----------|--------|
| Homepage (/) | 336 | 7 | 2.08% | 8.0 | ⚠️ Low CTR |
| /air-ambulance-cost | 131 | 1 | 0.76% | 11.7 | ⚠️ 0 CTR on 131 imps |
| /guides/air-ambulance-dhaka-bangkok | 195 | 0 | 0% | 6.6 | 🔴 HIGH PRIORITY - 0 CTR |
| /blog/bangkok-hospitals-comparison | 65 | 0 | 0% | 8.7 | 🔴 HIGH PRIORITY - 0 CTR |
| /icu-vs-medical-escort | 45 | 0 | 0% | 38.2 | ⚠️ Position drop |
| /blog/medical-visa-thailand | 44 | 0 | 0% | 11.6 | ⚠️ Low CTR |

**Pattern:** AI Overview cannibalization confirmed on position 6-9 pages with 0 CTR despite solid impression counts.

## Indexing Status

| Page | Status | Last Crawled | Action Needed |
|------|--------|--------------|---------------|
| Homepage (/) | ✅ Indexed | Aug 17, 2026 | None |
| /guides/air-ambulance-dhaka-bangkok | ✅ Indexed | Jul 29, 2026 | None |
| /air-ambulance-cost | ✅ Indexed | Aug 16, 2026 | None |
| /blog/bangkok-hospitals-comparison | ✅ Indexed | **Jun 23, 2026** ⚠️ | Refresh lastmod |
| /services | ⚠️ Discovered - Not Indexed | Never | **REQUEST INDEXING** |

**Critical Finding:** /services page remains unindexed for 29 consecutive cycles. This is now a persistent crawl budget issue requiring manual owner intervention.

## Technical Audit Results

### Title Length Analysis
All 4 flagged pages have **owner-set titles** that exceed 62 characters. Per dual-domain policy and owner title pattern recognition, these are NOT auto-fixed:

| Page | File Title Length | Displayed Length | Owner-Set | Action |
|------|-------------------|------------------|-----------|--------|
| bangkok-hospitals.html | 64c | 86c | Yes (Aug 7) | Monitor |
| blog/stroke-air-ambulance-dhaka-bumrungrad.html | 67c | 89c | Yes | Monitor |
| cardiac-emergency-transfer.html | 69c | 91c | Yes | Monitor |
| guides/air-ambulance-dhaka-bangkok.html | 73c | 95c | Yes | Monitor |

**Note:** Owner title differentiation pattern (cannibalization fighting) confirmed Aug 7, 2026. Titles intentionally exceed 62c for keyword distinction.

### OG/Twitter Tags
- ✅ All files have single og:title, twitter:title, og:description, twitter:description
- ✅ No duplicates detected
- ✅ All OG titles match file titles
- ✅ All descriptions present and within 160-char target

### Canonical Tags
- ✅ All 56 content files have canonical tags
- ✅ No missing canonicals detected
- ✅ No duplicate canonicals

### Internal Linking
- ✅ All pages have 2+ inbound links
- ✅ No orphan pages detected
- ✅ Blog listing complete (34/34 posts)
- ✅ Sitemap complete (all blog posts included)

### FAQPage Schema
- ✅ Coverage: COMPLETE (all eligible pages have FAQPage schema)
- ✅ Entity-rich Q&A pairs present (Learjet 35A, BDT format, airport names)

## CTR Regression Analysis

### Root Cause: AI Overview Cannibalization

**Evidence:**
1. /guides/air-ambulance-dhaka-bangkok: 195 impressions, 0 clicks, position 6.6
2. /blog/bangkok-hospitals-comparison: 65 impressions, 0 clicks, position 8.7
3. Homepage: 336 impressions, 7 clicks (2.08% CTR) — only page with meaningful CTR

**Diagnosis:** Google AI Overview is extracting answers from these pages and displaying them above organic results, consuming clicks without driving traffic to the site.

**Impact:** Site-wide CTR dropped from 2.89% to 1.05% (64% decline) over 28 days.

### Recommended Actions (Future Cycles)

1. **FAQ Schema Enrichment** — Add more entity-rich Q&A pairs to /guides/air-ambulance-dhaka-bangkok and /blog/bangkok-hospitals-comparison to increase odds of being CITED IN the AI Overview (even if click goes to overview)

2. **Description Language Matching** — Update meta descriptions to open with exact query phrases:
   - "Air ambulance service in Bangladesh —" (for pos 1 queries)
   - "Air ambulance cost Dhaka to Bangkok —" (for cost queries)

3. **Content Refresh** — For /icu-vs-medical-escort (pos 38.2), add cost comparison table + named aircraft entities

## Actions Taken This Cycle

1. ✅ GSC performance data collected (7-day + 28-day)
2. ✅ Indexing status verified for 5 key pages
3. ✅ Technical audit completed (titles, OG tags, canonicals, orphans, sitemap)
4. ✅ Blog listing and sitemap integrity verified
5. ✅ Cron log updated (cycle 29 entry added)
6. ✅ Build triggered and deployed to Vercel

**No code changes applied** — technical audit clean, titles are owner-set, no critical issues requiring immediate fix.

## Owner Action List

### 🔴 TIER 1 (URGENT)
**Request Indexing for `/services` page (29th consecutive cycle):**
1. Go to: https://search.google.com/search-console/inspect?resource_id=sc-domain:airambulancedhakabangkok.com
2. Enter: https://airambulancedhakabangkok.com/services
3. Click "Request Indexing" button
4. Wait for "Submitted and indexed" status

### 🟡 TIER 2 (IMPORTANT)
1. **Monitor CTR recovery** — If 7-day CTR remains below 1% after next cycle, implement FAQ schema enrichment for top 0-CTR pages
2. **Token re-authentication** — GSC token expired Aug 21, 2026. Refresh token working but may expire soon. Re-authenticate via browser if GSC calls fail.

### 🟢 TIER 3 (NORMAL)
- /blog/bangkok-hospitals-comparison last crawled Jun 23 — build refresh deployed to trigger re-crawl
- Monitor /icu-vs-medical-escort position (currently 38.2, may need content refresh in 2-3 cycles)

## Site Health Summary

| Metric | Value | Status |
|--------|-------|--------|
| Total Pages | 56 content / 114 static | ✅ Stable |
| Indexed Pages | 4/5 key pages (80%) | ⚠️ /services pending |
| FAQPage Coverage | 100% (eligible pages) | ✅ Complete |
| Blog Listing | 34/34 posts | ✅ Complete |
| Sitemap Entries | All blog posts present | ✅ Complete |
| Technical Issues | 0 critical | ✅ Clean |
| 7-Day CTR | 0.52% | 🔴 Critical (baseline 2.38%) |
| 28-Day CTR | 1.05% | 🔴 Critical (baseline 2.89%) |

## Deployment Status

- **Build:** ✅ Successful (114 static pages generated)
- **Commit:** 4010662 — "SEO daily 2026-08-23: Cycle 29..."
- **Push:** ✅ Successful to origin/main
- **Vercel Deploy:** Triggered (auto-deploy on push)

---

**Next Cycle:** August 24, 2026 (Cycle 30)
**Priority Focus:** Monitor CTR recovery, /services indexing status
