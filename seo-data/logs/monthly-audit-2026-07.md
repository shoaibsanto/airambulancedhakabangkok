# HiTHIUM Bangladesh — Monthly Technical SEO Audit
**Date:** 2026-07-01  
**Auditor:** Hermes SEO Agent (automated cron)  
**Site:** https://hithiumbd.com  
**Platform:** WordPress + WooCommerce + Woodmart theme  
**Previous Baseline:** 2026-06-25

---

## Health Score: 61/100

*(Baseline: not scored in June baseline — this is first numerical score)*

### Score Breakdown by Category

| Category | Status | Score | Notes |
|----------|--------|-------|-------|
| Crawlability | ⚠️ WARN | 70/100 | robots.txt OK, AI crawlers unmanaged, tel: link broken |
| Indexability | ⚠️ WARN | 60/100 | WooCommerce pages in sitemap, wishlist not noindex |
| Security | ⚠️ WARN | 55/100 | Missing HSTS/XFO/XCTO headers (same as June) |
| URL Structure | ✅ PASS | 85/100 | Clean URLs, proper canonicals, www→non-www redirect works |
| Mobile | ⚠️ WARN | 65/100 | user-scalable=no blocks zoom — accessibility issue |
| Core Web Vitals | ⚠️ WARN | 65/100 | TTFB excellent (65ms), PSI API quota exhausted — lab data unavailable |
| Structured Data | ⚠️ WARN | 55/100 | No Organization schema, SVG og:image on homepage, 2 missing og:images |
| JS Rendering | ✅ PASS | 80/100 | WordPress SSR — critical SEO elements in initial HTML |
| IndexNow | ❌ FAIL | 0/100 | Not implemented |

**Overall: 61/100**

---

## Progress Since June 2026 Baseline

### ✅ IMPROVEMENTS (confirmed this month)

1. **Post count grew: 18+ → 33 posts** — significant content expansion. New posts added up to 2026-06-30:
   - `/best-ips-under-30000-bdt-bangladesh-2026/`
   - `/lifepo4-battery-lifespan-bangladesh/`
   - `/ips-buying-guide-small-business-bangladesh/`
   - `/solar-ips-vs-normal-ips-bangladesh/`
   - `/ips-installation-guide-step-by-step-bangladesh/`

2. **llms.txt EXISTS** at https://hithiumbd.com/llms.txt — GEO signal is set up. ✅

3. **All 9 target keyword pages confirmed alive** — same as June baseline, no regressions.

4. **Product sitemap active** — 10 products indexed, freshly updated 2026-06-28.

5. **www SSL covers both apex and www** — cert verified via curl: `www.hithiumbd.com` matched. ✅

6. **www → non-www redirect works** — HTTP 301 confirmed. ✅

7. **Blog page schema includes FAQPage** — `/best-ips-in-bangladesh/` has FAQPage + WebPage schema.

8. **Article schema with wordCount:2768** on `/best-lithium-battery-for-ips-in-bangladesh/` — content depth confirmed.

### ❌ ISSUES UNCHANGED FROM JUNE (not fixed)

1. **Security headers still missing** — no HSTS, X-Frame-Options, X-Content-Type-Options, or Referrer-Policy. Only `content-security-policy: upgrade-insecure-requests` present.

2. **Keyword focus mismatch** — some Yoast focuskw don't match primary target keyword exactly (June issue #3).

3. **No IndexNow implementation** — still not installed.

### 🆕 NEW ISSUES FOUND THIS MONTH

See Critical Issues section below.

---

## Critical Issues (Fix Immediately)

### 🔴 CRITICAL-1: WooCommerce Functional Pages in Sitemap — WITH noindex Conflict

**Severity:** Critical  
**Found in:** `page-sitemap.xml`

The following WooCommerce utility pages appear in `page-sitemap.xml` and are being submitted to Google:

| Page | In Sitemap | noindex? | Notes |
|------|-----------|---------|-------|
| `/checkout/` | ✅ YES | ✅ noindex,follow | **Canonical points to /cart/ — CONFLICT** |
| `/cart/` | ✅ YES | ✅ noindex,follow | Self-canonical OK |
| `/my-account/` | ✅ YES | Unknown | Likely noindex |
| `/wishlist/` | ✅ YES | ❌ **index,follow** | **NO noindex set — being crawled and indexed by Google** |
| `/compare/` | ✅ YES | Unknown | Needs check |

**Canonical conflict on /checkout/:** `<link rel="canonical" href="https://hithiumbd.com/cart/" />` — canonical points to `/cart/` rather than self-referencing. Even on noindex pages, canonical should be self-referencing.

**Fix:**
1. Yoast → Search Appearance → Pages → exclude `/wishlist/` from sitemap AND set noindex
2. Yoast → Tools → Bulk Editor OR per-page: Set all WooCommerce pages (/cart, /checkout, /my-account, /wishlist, /compare) to noindex AND remove from sitemap
3. Fix /checkout/ canonical — change to self-referencing (`https://hithiumbd.com/checkout/`)
4. After fixes: re-submit sitemap in GSC

---

### 🔴 CRITICAL-2: Homepage OG Image is SVG — Silently Broken on All Social Platforms

**Severity:** Critical  
**Found:** `og:image` = `https://hithiumbd.com/wp-content/uploads/2021/10/alternative-energy-energy.svg`

SVG is **not supported** by Facebook, WhatsApp, LinkedIn, Twitter/X. All social shares of the homepage will show a blank/broken card. This kills social referral traffic.

**Also missing entirely:**
- `/lithium-battery-price-bangladesh/` — **no og:image at all**
- `/shop/` — **no og:image at all**

**Fix:**
1. Yoast SEO → Social → Facebook → Upload a 1200×630 JPG/PNG as the homepage social image
2. Create og:image for `/lithium-battery-price-bangladesh/` (set a featured image or Yoast social image)
3. Create og:image for `/shop/` page (WooCommerce shop archive — use Yoast or add manually)

---

### 🔴 CRITICAL-3: Broken `tel:` Link on Homepage

**Severity:** Critical for UX/conversions  
**Found:** `href="tel:%20(064)%20332-1233"`

The phone number in the homepage tap-to-call link is URL-encoded with a leading `%20` and uses a US-format number `(064) 332-1233` — this is not a valid Bangladesh phone number (BD numbers start with +880 / 01X). Mobile users who tap this link on a phone will either fail to dial or dial a wrong number entirely.

**Fix:**
- Find the phone number in the theme header/footer/widget area and replace `href="tel:%20(064)%20332-1233"` with the correct BD number, e.g. `href="tel:+8801XXXXXXXXX"`
- Also update the masked WhatsApp number in `llms.txt` (`+8****11-000000`) to a real number

---

## High Priority (Fix Within 1 Week)

### 🟠 HIGH-1: No Organization Schema on Homepage

**Found:** Homepage JSON-LD contains only: `WebPage`, `ImageObject`, `BreadcrumbList`, `WebSite`  
**Missing:** `Organization` or `LocalBusiness` schema

This is a significant E-E-A-T signal gap. Google uses Organization schema to understand the entity, display Knowledge Panels, and confirm brand identity.

**Fix:** In Yoast SEO → Company → add company name, logo URL, social profiles (Facebook, LinkedIn). This auto-generates the Organization block in the homepage JSON-LD.

---

### 🟠 HIGH-2: Viewport `user-scalable=no` — Mobile Accessibility Block

**Found in:** All pages — `<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">`

`user-scalable=no` blocks pinch-to-zoom on mobile. This:
- Violates WCAG 2.1 accessibility guidelines
- Can trigger Google Lighthouse mobile accessibility penalty
- May negatively affect Core Web Vitals INP scores

**Fix:** Remove `maximum-scale=1.0, user-scalable=no` from the viewport meta. Set in Woodmart theme options → General → Viewport, or via `functions.php`.

---

### 🟠 HIGH-3: Double H1 on `/best-ips-in-bangladesh/`

**Found:** Two `<h1>` tags on the same page:
1. `Best IPS in Bangladesh 2026 | Top 10 Picks for Home & Office`
2. `Best IPS in Bangladesh 2026 — Complete Buying Guide`

Multiple H1s confuse Googlebot about the primary topic and waste heading hierarchy.

**Fix:** Keep only ONE H1 (the page title). Convert the second H1 to an H2.

---

### 🟠 HIGH-4: About Page Meta Description Too Long (173 chars)

**Found:** `/about-hithium-bangladesh/` meta description = 173 characters  
**Limit:** 155–160 characters  
**Truncated:** Google will cut it off mid-sentence

**Fix:** Trim to ≤ 160 characters in Yoast SEO field for the About page.

---

### 🟠 HIGH-5: No AI Crawler Policy in robots.txt

**Found:** robots.txt has no rules for GPTBot, ClaudeBot, Google-Extended, PerplexityBot, Bytespider, CCBot.

**Recommendation:** Decide on AI crawler strategy. Since llms.txt is already in place (good GEO signal), consider allowing AI crawlers to reinforce brand presence in AI search. Add explicit rules either way:

```
# Allow AI search (recommended for GEO visibility)
User-agent: GPTBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

# Block training-only crawlers (optional)
User-agent: Bytespider
Disallow: /

User-agent: Google-Extended
Disallow: /
```

---

## Medium Priority (Fix Within 1 Month)

### 🟡 MED-1: Homepage Missing H1 Tag

**Found:** No `<h1>` detected in homepage HTML (Elementor-built, H1 may render client-side)  
**Impact:** Googlebot with JS may find it, but raw HTML crawl sees no H1 — weak heading signal

**Fix:** Add a server-rendered H1 to the homepage. In Woodmart/Elementor, ensure the page title element is set as H1 tag (not just styled bold).

---

### 🟡 MED-2: Shop Page OG Type = "article" (Wrong)

**Found:** `/shop/` has `og:type: article` — but it's a product archive (should be `og:type: website` or `og:type: product`)  
**Impact:** Facebook/LinkedIn may display wrong card format

**Fix:** Yoast handles OG type based on page type. Verify WooCommerce shop page is set correctly in Yoast → WooCommerce settings.

---

### 🟡 MED-3: Portfolio Sitemap with 2021 lastmod

**Found:** `portfolio-sitemap.xml` with `lastmod: 2021-08-27` — 5-year-old content still in index submission

**Check:** If the portfolio section is still active and relevant, update it. If not used, consider removing from sitemap.

---

### 🟡 MED-4: No IndexNow Implementation

**Found:** All IndexNow key file paths return 404.  
**Impact:** Slower indexing on Bing, Yandex, Naver when new content is published.

**Fix:** Install the "Yoast SEO: IndexNow" plugin (free, official Yoast extension) — automatically pings all supported engines on publish/update.

---

### 🟡 MED-5: llms.txt Has Masked WhatsApp Number

**Found in llms.txt:** `WhatsApp +8****11-000000`  
**Impact:** AI assistants citing this file will show a redacted/useless phone number to users asking for contact info

**Fix:** Replace with the real WhatsApp number (e.g. `+8801XXXXXXXXX`) in the llms.txt file.

---

### 🟡 MED-6: Security Headers Still Missing (Persistent from June)

**Missing:**
- `Strict-Transport-Security` (HSTS)
- `X-Frame-Options`
- `X-Content-Type-Options`
- `Referrer-Policy`

**Present:** `content-security-policy: upgrade-insecure-requests` only

**Fix:** Add via `.htaccess` (Apache/LiteSpeed on Hostinger):
```apache
Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
Header always set X-Frame-Options "SAMEORIGIN"
Header always set X-Content-Type-Options "nosniff"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
```

---

## Low Priority (Backlog)

### 🔵 LOW-1: Keyword Cannibalization Risk (from June baseline)
`/best-ips-in-bangladesh/` targets both "best ips brand in Bangladesh" AND "top ips brand" — monitor rankings to see if these split traffic.

### 🔵 LOW-2: Yoast Focus Keyword Mismatch  
Some Yoast focuskw fields don't match exact target keyword (e.g. "best ips brand" vs "best ips"). Not critical but worth aligning.

### 🔵 LOW-3: Homepage Page Size = 201KB (HTML only)  
Main HTML is 201,580 bytes — typical for WooCommerce/Woodmart but worth monitoring. No action needed unless TTFB degrades.

### 🔵 LOW-4: GSC Verification Tag Content Empty  
`<meta name="google-site-verification" content="">` — the verification tag has empty content. If GSC was verified via DNS instead, this is fine. Confirm GSC access is working independently.

---

## Positive Findings (Keep Doing)

| Item | Status |
|------|--------|
| SSL — apex + www coverage | ✅ |
| www → non-www 301 redirect | ✅ |
| HTTPS enforced (HTTP/2) | ✅ |
| TTFB: 65ms (homepage), 57ms (posts), 31ms (shop) | ✅ Excellent |
| Sitemap index fresh (2026-06-30) | ✅ |
| llms.txt present with structured content | ✅ |
| robots.txt valid + sitemap referenced | ✅ |
| Clean URLs throughout | ✅ |
| Canonical tags self-referencing (except /checkout/) | ✅ |
| FAQPage schema on key landing pages | ✅ |
| Article schema with wordCount on blog posts | ✅ |
| No Cloudflare robots.txt injection conflict | ✅ |
| OG tags present on 4/6 pages checked | ✅ |
| Content velocity: 15 new posts in ~5 weeks | ✅ |

---

## Priorities for Next 30 Days (July 2026)

### Week 1 (July 1–7)
1. **Fix WooCommerce pages in sitemap** — set noindex + remove /wishlist/, /checkout/ canonical fix
2. **Fix homepage og:image** — replace SVG with 1200×630 JPG in Yoast Social settings
3. **Add og:image** to `/lithium-battery-price-bangladesh/` and `/shop/`
4. **Fix broken tel: link** — correct the phone number in header/footer

### Week 2 (July 8–14)
5. **Add Organization schema** — Yoast company settings (logo, social profiles)
6. **Fix /best-ips-in-bangladesh/ double H1** — demote second H1 to H2
7. **Fix About page meta description** — trim to ≤160 chars
8. **Remove user-scalable=no** from viewport

### Week 3 (July 15–21)
9. **Install IndexNow plugin** (Yoast IndexNow extension)
10. **Update robots.txt** with explicit AI crawler rules
11. **Fix llms.txt** phone number (unmask WhatsApp number)

### Week 4 (July 22–31)
12. **Add security headers** via .htaccess
13. **Monitor sitemap in GSC** — confirm WooCommerce pages dropped out after fix
14. **Publish 3–4 new blog posts** from content backlog

---

## Technical Audit Data Summary

| Check | Result |
|-------|--------|
| HTTP Status (homepage) | 200 OK (HTTP/2) |
| TTFB (homepage) | 65ms ✅ |
| TTFB (post page) | 57ms ✅ |
| TTFB (shop) | 31ms ✅ |
| SSL Certificate | ✅ Valid, covers apex + www |
| robots.txt | ✅ Present + valid |
| Sitemap Index | ✅ Present, lastmod 2026-06-30 |
| Post count in sitemap | 33 |
| Product count in sitemap | 10 |
| llms.txt | ✅ Present |
| IndexNow | ❌ Not implemented |
| Homepage OG:image | ❌ SVG (broken on social) |
| Homepage Organization schema | ❌ Missing |
| Homepage H1 | ❌ Not in initial HTML |
| /wishlist/ noindex | ❌ Missing (indexed!) |
| /checkout/ canonical | ❌ Points to /cart/ (wrong) |
| user-scalable=no | ❌ Present (accessibility issue) |
| Security headers (HSTS/XFO/XCTO) | ❌ Missing |
| Broken tel: link | ❌ `tel:%20(064)%20332-1233` |
| CrUX field data | N/A (insufficient traffic) |
| PSI API | Quota exhausted — lab data unavailable |

---

*Report generated automatically by Hermes SEO Agent on 2026-07-01.*  
*Next audit: 2026-08-01 (automated cron).*
