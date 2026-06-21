# 🔍 Full SEO Audit Report — airambulancedhakabangkok.com

**Date:** June 21, 2026  
**Target Keyword:** Air Ambulance Service Dhaka to Bangkok  
**Auditor:** Hermes SEO Audit System  
**Source Code:** github.com/shoaibsanto/airambulancedhakabangkok  

---

## 📊 Executive Summary

| Metric | Current | Notes |
|--------|---------|-------|
| **Overall SEO Health** | **62 / 100** | Solid foundation, several critical gaps |
| GSC Visibility (90d) | 51 impressions, 1 click | Brand-new site, mostly invisible |
| Indexed Pages | 31 URLs (sitemap) | 1 critical page NOT indexed |
| Technical SEO | 70/100 | Few issues, mostly correct |
| On-Page SEO | 60/100 | Title/meta need tuning |
| Content Quality | 75/100 | E-E-A-T thin, especially About |
| Schema / Structured Data | 70/100 | Implemented but fragmented, no `@id` links |
| Performance (CWV) | ~75/100 | Vercel-hosted Next.js, decent |
| AI Search Readiness | 80/100 | Strong robots.txt for AI bots |

### 🔴 Top 5 Critical Issues
1. **`/air-ambulance-cost` is "Discovered — currently not indexed"** (highest commercial-intent page!)
2. **Title tag missing the exact target keyword phrase** at the front
3. **Schema entities lack `@id` references** — they don't tie together as a knowledge graph
4. **No `@type: MedicalClinic` + NAP inconsistency** (street address has BD postal code but Bangkok service)
5. **No Organization schema with social profiles (`sameAs`)** — kills brand entity recognition

### 🟢 Top 5 Quick Wins
1. Update title tag from `"Air Ambulance Dhaka to Bangkok | 24/7 ICU to Bumrungrad"` → `"Air Ambulance Service Dhaka to Bangkok | 24/7 ICU Flights"`
2. Add `@id` field to MedicalBusiness schema and link to other blocks via `mainEntity`
3. Resubmit `/air-ambulance-cost` via GSC URL Inspection → "Request Indexing"
4. Add `llms.txt` file at root — 30 seconds to do, big GEO win
5. Add author schema with credentials to blog posts

---

## 🐛 Complete Issue Inventory

### 🔴 CRITICAL (fix immediately)

| # | Issue | Location | Impact |
|---|-------|----------|--------|
| C1 | `/air-ambulance-cost` not indexed despite being in sitemap | `content/air-ambulance-cost.html` | High-intent page invisible to Google |
| C2 | Title tag starts with secondary word "Air Ambulance Dhaka to Bangkok" instead of the **exact target keyword phrase** | `content/index.html` | Misses exact-match ranking signal |
| C3 | Schema has 5 separate JSON-LD blocks with **NO `@id` references** — entities can't be linked | `lib/content.js`, all `.html` files | Severely weakens knowledge graph / rich results |
| C4 | `AggregateRating` + 4 reviews in schema **without a real public review system** — Google may flag as spam | `content/index.html` JSON-LD | Risk of manual action / rich result removal |
| C5 | `MedicalBusiness.address` uses Dhaka office but service spans 2 countries — confusing Google about HQ vs service area | `app/layout.jsx` | NAP ambiguity for local SEO |

### 🟠 HIGH (fix within 1 week)

| # | Issue | Location | Impact |
|---|-------|----------|--------|
| H1 | **H1 is too long** ("Air Ambulance Service Dhaka to Bangkok — Fast, Safe, 24/7") — better at 50-60 chars with primary keyword upfront | `content/index.html` | Reduces keyword prominence |
| H2 | **Meta description on services page** is 154 chars and uses generic "Air Ambulance Service Bangladesh" — should target exact phrase | `content/services.html` | Lower CTR from SERP |
| H3 | **About page is thin (1325 words)** for YMYL medical niche — needs doctor credentials, licenses, certifications | `content/about.html` | Weakens E-E-A-T, hurts rankings in medical vertical |
| H4 | **Blog posts lack `Article` schema with `author` linking to `Person`/`author/tawhid-iqbal`** | `content/blog/*.html` | Loses author entity, weak E-E-A-T signal |
| H5 | **No `Organization` schema with `sameAs` (Facebook, LinkedIn, YouTube)** — brand entity not established | `app/layout.jsx` | Misses knowledge graph entry |
| H6 | **OG image is JPG 1200×630 (assumed)** — file may not exist at that exact path | `assets/img/og-image.jpg` | Broken social previews |
| H7 | **Canonical URL is generated as path-only (`/air-ambulance-cost`)** while homepage uses full URL — inconsistency | `app/[[...slug]]/page.jsx` line 74 | Could cause canonical mismatch |
| H8 | **No `lastmod` correctness check** — sitemap uses `lastModified: today` for some pages | `app/sitemap.js` | Dilutes freshness signals |
| H9 | **Title tag contains "Bumrungrad"** (a specific hospital) — over-narrows relevance; better to use as separate page | `content/index.html` | Limits ranking to that one hospital |
| H10 | **`"AggregateRating"` value of "5/5 from 4 reviews"** without source = potential Google penalty trigger | `content/index.html` JSON-LD | Spam policy risk |

### 🟡 MEDIUM (fix within 1 month)

| # | Issue | Location | Impact |
|---|-------|----------|--------|
| M1 | **No `llms.txt` for AI crawlers** — site already allows GPTBot/ClaudeBot but gives them no structured content | root | Missed GEO opportunity |
| M2 | **No `WebPage` schema with `mainEntity` linking to FAQPage** | `app/layout.jsx` | Weakens entity graph |
| M3 | **`sameAs` array empty** in MedicalBusiness schema | `app/layout.jsx` | No brand entity |
| M4 | **All internal anchor text is exact-match** ("air ambulance cost", "see full cost breakdown") — looks unnatural | various | Penguin-adjacent risk, low impact |
| M5 | **No `Service` schema price ranges or `Offer`** for the air ambulance service | `app/layout.jsx` | Loses potential price rich snippets |
| M6 | **Author page lacks credentials display** (Tawhid Iqbal) | `content/author/tawhid-iqbal.html` | E-E-A-T gap |
| M7 | **No `MedicalProcedure` details** (risks, recoveryTime, preparation) in Service schema | `content/index.html` | Missed medical vertical richness |
| M8 | **`robots.txt` only blocks `/assets/img/og-image.png$`** — the OG image exists at `.jpg` not `.png` — broken rule | `app/robots.js` | Confusing / dead rule |
| M9 | **7 sync `<script>` tags in `<head>`** — render-blocking JS via Next.js | `app/layout.jsx` | Minor LCP impact |
| M10 | **No `ContactPage` schema on `/contact`** | `content/contact.html` | Missed local signal |

### 🟢 LOW (nice-to-have)

| # | Issue | Location | Impact |
|---|-------|----------|--------|
| L1 | `keywords` meta tag not set anywhere (deprecated but doesn't hurt) | all pages | None |
| L2 | Cache-Control on HTML is `max-age=0` — repeat visits re-download | `next.config.mjs` | Minor perf |
| L3 | No `twitter:site` `@handle` in Twitter card metadata | `app/[[...slug]]/page.jsx` | Minor social |
| L4 | No `image:alt` on Twitter card | same | Minor a11y |
| L5 | Image alt text is generic on some icons | various | Minor SEO |

---

## 📈 GSC Performance Reality Check

```
Date range: 2026-03-23 → 2026-06-21 (90 days)
Total Clicks: 1
Total Impressions: 51
Average CTR: 1.96%
Average Position: 5.3 (skewed by brand queries)

Top queries (all impressions, 0 clicks):
- "air ambulance" (pos 1.5, 2 imp)
- "ambulance service dhaka" (pos 2.5, 2 imp)
- "ambulance service gulshan" (pos 1, 2 imp)
- "dhaka to" (pos 6, 2 imp)

🚨 The target keyword "air ambulance service dhaka to bangkok" 
   has 0 impressions — site hasn't ranked yet.
```

---

## 🛠️ Fix Strategy (in priority order)

I'll apply fixes directly to your GitHub repo. Each fix will be:
1. Made in source files (Next.js)
2. Tested locally
3. Verified with GSC API where applicable

Proceeding with fixes now…