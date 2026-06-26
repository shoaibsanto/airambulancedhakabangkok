# Master Autonomous SEO Strategy — airambulancedhakabangkok.com

## MISSION
Get every commercial and informational keyword in this niche onto Google page 1, then climb toward top 3 — autonomously. Optimize for **leads** (calls, WhatsApp, form), not vanity rankings.

## GSC Property
`sc-domain:airambulancedhakabangkok.com` (siteOwner)

## Key URLs
- Site root: /root/airambulancedhakabangkok
- Content: /root/airambulancedhakabangkok/content/*.html
- Sitemap: /root/airambulancedhakabangkok/app/sitemap.js
- Blog listing: /root/airambulancedhakabangkok/content/blog/index.html
- Site config: /root/airambulancedhakabangkok/lib/site.js
- Cycle log: /root/airambulancedhakabangkok/notes/cron-log.md

## TARGET KEYWORD CLUSTERS
1. **Core commercial** — air ambulance Dhaka to Bangkok, ICU air ambulance Bangladesh, medical evacuation Dhaka
2. **Service / condition** — cardiac / stroke / trauma / cancer / neonatal air ambulance + transfer
3. **Cost / comparison** — air ambulance cost Bangladesh, ICU vs medical escort, commercial medical flight
4. **Destination / logistics** — Bumrungrad admission, Bangkok hospitals for Bangladeshi patients, insurance / visa
5. **Expansion routes** — Dhaka to India / Singapore / Chennai / Vellore / Delhi, air ambulance Thailand / Myanmar

## OPERATING LOOP
**A. Indexing hygiene (every run).** Inspect sitemap URLs; find discovered-but-not-indexed. Confirm every money page is in sitemap.xml + reachable by a crawlable link from an indexed page. Keep lastmod fresh. List URLs needing "Request indexing" for owner.

**B. Technical & CWV (weekly).** Audit changed/key pages. Triage CWV field data. Verify schema (MedicalBusiness/EmergencyService + Service + FAQPage + BreadcrumbList) on every template.

**C. CTR recovery (weekly, quick wins).** Mine GSC for pages with impressions but low/zero clicks. Rewrite title + meta to emergency intent ("24/7", "ICU", "today", phone). Re-measure in 2 weeks.

**D. Content velocity & topical coverage (the engine — every cycle).** Find next uncovered cluster node. Brief → draft a genuinely useful, accurate, E-E-A-T-strong page. Internal-link into its silo. Add to sitemap. Protect existing pos 1-5 winners.

**E. Authority / off-page (propose, don't auto-execute).** Build NAP citations. Identify guest/PR/link targets. Draft outreach → queue for owner approval.

**F. Measure & report.** Weekly: short cycle entry to notes/cron-log.md. Monthly: full 6-section report.

## GUARDRAILS
- Never fabricate medical facts, certifications, aircraft specs, prices, hospital claims
- Confirm before spending or publishing externally
- No black-hat
- Ground truth = Google

## DEPLOYMENT
```bash
cd /root/airambulancedhakabangkok
npx next build
git add -A && git commit -m "SEO Update: $(date +%Y-%m-%d)" && git push origin main
# Wait ~40s then verify:
curl -sI https://airambulancedhakabangkok.com/sitemap.xml | head -3
```
