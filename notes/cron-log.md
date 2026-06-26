# SEO Cycle Log

## 2026-06-26 — Cycle 1: Indexing & CTR Recovery Push

### Actions Taken

#### A. Indexing Hygiene
- GSC baseline established: 200 impressions / 7 clicks / 3.5% CTR / avg pos 7.5 over 28 days
- Sitemap status: 39 indexed URLs, 0 errors ✓
- **Critical finding**: 7+ pillar pages are "Discovered - not indexed" (services, bangkok-hospitals, cardiac-emergency-transfer, process, cancer-treatment-bangkok, icu-vs-medical-escort, guides/icu-air-ambulance-dhaka)
- `/air-ambulance-cost` — **"Unknown to Google"** (not even discovered!)
- Deployed build to update all `lastmod` dates → triggers Google re-crawl

#### B. CTR Recovery (14 pages updated)
| Page | Old Title | New Title | Issue |
|------|-----------|-----------|-------|
| `/` (89% imps) | Air Ambulance Dhaka to Bangkok \| 24/7 ICU Flights | **24/7 Air Ambulance Dhaka to Bangkok — ICU Medical Evacuation** | 3.4% CTR |
| `/trauma-accident-evacuation` | Trauma & Accident Air Ambulance \| Dhaka to Bangkok | **Trauma Air Ambulance Dhaka to Bangkok 24/7 — Call Now for ICU Evacuation** | pos 2, 0 clicks |
| `/blog/bangkok-hospital-admission-*` | Bangkok Hospital Admission for Bangladeshi Patients \| Guide | **Bangkok Hospital Admission for Bangladeshi Patients — Complete 2026 Guide** | 16 imps, 0 clicks |
| `/services` | Air Ambulance Service Dhaka to Bangkok \| ICU Charter | **Air Ambulance Service Dhaka to Bangkok 24/7 — ICU Charter & Medical Evacuation** | Not indexed |
| `/cardiac-emergency-transfer` | Cardiac Emergency Air Ambulance \| Dhaka to Bangkok ICU Jet | **Cardiac Emergency Air Ambulance Dhaka to Bangkok 24/7 — STEMI ICU Jet Transfer** | Not indexed |
| `/bangkok-hospitals` | Bangkok Hospital Transfers from Dhaka \| Bumrungrad & More | **Bangkok Hospital Transfers from Dhaka 24/7 \| Bumrungrad ICU Air Ambulance** | Not indexed |
| `/stroke-neurology-evacuation` | Stroke & Neurology Evacuation \| Dhaka to Bangkok | **Stroke & Neurology Air Ambulance Dhaka to Bangkok 24/7 — Call for ICU Evacuation** | Not indexed |
| `/guides/icu-air-ambulance-dhaka` | ICU Air Ambulance Dhaka — 2026 Critical Care Guide | **ICU Air Ambulance Dhaka — 2026 Critical Care Transfer Guide** | Not indexed |
| `/cancer-treatment-bangkok` | Cancer Patient Air Ambulance \| Dhaka to Bangkok | **Cancer Patient Air Ambulance Dhaka to Bangkok 24/7 — ICU Oncology Transfer** | Not indexed |
| `/process` | Air Ambulance Service Dhaka to Bangkok \| Process in 4 Steps | **Air Ambulance Process Dhaka to Bangkok — 4-Step ICU Transfer in Minutes** | Not indexed |
| + 4 more (air-ambulance-cost, contact, routes, guides/air-ambulance-dhaka-bangkok) | — | Expanded metas 130→155+ chars | Short descriptions |

#### C. Build & Deploy
- `npx next build`: ✅ 43/43 pages generated, 0 errors
- Pushed to `main` → Vercel auto-deploy triggered
- Verified: sitemap.xml, /services, /air-ambulance-cost all return 200

### Results Summary
- **14 content files modified** (titles + metas)
- **1 deployment** pushed (updates lastmod → crawl trigger)
- **0 new pages created** (focus was quality & indexing, not volume)

### Owner Action Needed
**Manual "Request Indexing" in GSC** (no API available):
1. https://search.google.com/search-console/inspect?resource_id=sc-domain:airambulancedhakabangkok.com → enter these URLs:
   - https://airambulancedhakabangkok.com/services
   - https://airambulancedhakabangkok.com/cardiac-emergency-transfer
   - https://airambulancedhakabangkok.com/bangkok-hospitals
   - https://airambulancedhakabangkok.com/process
   - https://airambulancedhakabangkok.com/guides/icu-air-ambulance-dhaka
   - https://airambulancedhakabangkok.com/cancer-treatment-bangkok
   - https://airambulancedhakabangkok.com/icu-vs-medical-escort
   - https://airambulancedhakabangkok.com/air-ambulance-cost  ← MOST URGENT (unknown to Google)

### Next Actions Queued
1. Monitor GSC in 7 days for indexing changes post-deploy
2. Create new content: "Dhaka to India" cluster (expansion route gap)
3. Backlink proposal: medical directories + BD healthcare portals
4. Schema check: verify MedicalBusiness + EmergencyService on all condition pages
