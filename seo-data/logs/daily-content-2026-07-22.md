# Daily Content Log — 2026-07-22

## Published Post
- **Title:** IPS Cable Size Guide for Bangladesh Homes
- **Post ID:** 35698
- **URL:** https://hithiumbd.com/ips-cable-size-home-bangladesh/
- **Primary keyword:** IPS cable size
- **Category:** IPS & Battery (ID 233)
- **Word count:** 1,716 words
- **Language:** English

## SEO Metadata
- **Yoast title:** IPS Cable Size Guide for BD Homes | HiTHIUM
- **Meta description:** Choose the right IPS cable size for Bangladesh homes. Learn BDT cost, amp load, wire gauge, safety tips, and when to call an electrician.
- **Focus keyphrase:** IPS cable size
- **Slug:** ips-cable-size-home-bangladesh

## Content Summary
Published a practical safety and installation guide for Bangladeshi homeowners choosing IPS wiring/cable size. The post covers:
- Why IPS cable size affects safety and backup performance
- Quick copper cable size table for 600VA, 1000VA, 1500VA, and 2000VA+ systems
- Step-by-step load/current calculation process
- Home-type recommendations: small apartment, family flat, office/large home
- Copper vs aluminium comparison
- MCB, earthing, changeover, and distribution-board safety
- 2026 Bangladesh installation cost considerations
- 6-question FAQ section using Yoast-compatible `schema-faq` HTML format

## Internal Links Added
- `/best-lithium-ips-bangladesh/`
- `/best-ips-in-bangladesh/`
- `/best-ips-dhaka-office-capacity-cost-bangladesh/`
- `/ips-earthing-guide-bangladesh/`
- `/ips-fault-troubleshooting-error-codes-bangladesh/`
- `/ips-installation-guide-step-by-step-bangladesh/`
- `/shop/`

## Pre-Publish Checks
- Existing post inventory fetched via WordPress REST API: 51 posts.
- Cannibalization check: no existing post found for cable/wiring/wire topic.
- Sitemap index reachable: HTTP 200.
- Homepage health: HTTP 200.

## Verification
- Publish API response: HTTP 201.
- Frontend URL renders: verified.
- Frontend `<title>` matches Yoast title.
- Frontend meta description matches submitted description.
- FAQ schema class present in content.
- No `application/ld+json` inside `<article>` content.
- Internal links checked after publication.

## Issue Found and Fixed
Initial verification found two internal links returning 404 because older notes used non-current slugs:
- `/best-ips-for-dhaka-office-capacity-cost-recommendations/` → fixed to `/best-ips-dhaka-office-capacity-cost-bangladesh/`
- `/ips-earthing-grounding-guide-bangladeshi-homes/` → fixed to `/ips-earthing-guide-bangladesh/`

After patching post content, both links returned HTTP 200. The only remaining non-200 link discovered by the generic checker was `/xmlrpc.php` returning 405, which is expected/security-related and not a content broken link.

## Content Plan Update
Marked completed in `/root/airambulancedhakabangkok/seo-data/content-plan.md`:
- How to choose IPS cable size for home ← published 2026-07-22 (Post ID 35698)

## Remaining Late July Topics
7 unchecked items remain in the current replenishment batch.
