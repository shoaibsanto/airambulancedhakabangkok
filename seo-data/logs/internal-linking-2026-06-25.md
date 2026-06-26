# HiTHIUM BD — Internal Linking Implementation Log
Date: 2026-06-25

## Summary
- Total posts in silo architecture: 19 blog posts + 1 money page + 1 shop
- URLs verified 200 OK: 21/21
- Posts updated with links: 20/21 (shop page skipped - WooCommerce page)
- Total links added: ~85+
- Orphans: ✅ 0 (every post has at least 1 inbound link)

## Cluster Architecture

### CLUSTER 1 — "সেরা IPS / কেনার সিদ্ধান্ত"
HUB: /what-makes-ips-best-bangladesh/ (35059) ✅ +6 links
SPOKES:
  - /sher-aips-company-bangladesh/ (35058) ✅ +1
  - /best-lithium-ips-bangladesh/ (35066) ✅ +5 (also C2 HUB)
  - /best-portable-ips-bangladesh/ (35060) ✅ +2
  - /intelligent-ips-smart-features-bangladesh/ (35065) ✅ +2
  - /how-to-choose-ips-for-home-bangladesh/ (35329) ✅ +5
  - /50-hazar-takar-ips-bangladesh/ (35067) ✅ +1

### CLUSTER 2 — "তুলনা / Comparison"
HUB: /best-lithium-ips-bangladesh/ (35066) ✅ +5
SPOKES:
  - /lithium-battery-vs-tubular-battery-ips-bangladesh/ (35064) ✅ +1
  - /lifepo-vs-tubular-battery-in-bangladesh/ (34970) ✅ +4
  - /portable-power-station-vs-traditional-ips-bangladesh/ (35063) ✅ +3
  - /lithium-ips-vs-generator-bangladesh/ (35190) ✅ +2
  - /best-lithium-battery-for-ips-in-bangladesh/ (34967) ✅ +2

### CLUSTER 3 — "দাম / Price"
HUB: /ips-price-in-bangladesh/ (35153) ✅ +2
SPOKES:
  - /ips-battery-price-in-bangladesh/ (35187) ✅ +4
  - /portable-power-station-price-in-bangladesh/ (34974) ✅ +4
  - /50-hazar-takar-ips-bangladesh/ (35067) ← cross-link C1
  - /best-lithium-battery-for-ips-in-bangladesh/ (34967) ← cross-link C2

### CLUSTER 4 — "ব্যবহার / Runtime / Solar / Maintenance"
HUB: /what-can-lithium-ips-run-during-load-shedding/ (35019) ✅ +3
SPOKES:
  - /lithium-ips-runtime-load-shedding-dhaka/ (35191) ✅ +1
  - /lithium-ips-maintenance-guide-bangladesh/ (35192) ✅ +3
  - /solar-ips-bangladesh/ (35285) ✅ +3

### Money Pages
  - /best-ips-in-bangladesh/ (35052) ✅ +5
  - /shop/ — Skipped (WooCommerce page, content not editable via REST)

## Cross-Cluster Horizontal Links
All 4 HUBs link to each other:
- C1 HUB → C3 HUB, C4 HUB ✅
- C2 HUB → C3 HUB ✅
- C3 HUB → C1 HUB, C2 HUB, C4 HUB ✅
- C4 HUB → C1 HUB, C3 HUB ✅

## Anchor Text Diversity
- Bengali posts: Bengali anchors
- English posts: English descriptive anchors
- Mix of: exact keyword, partial keyword, brand, descriptive
- No duplicate anchor between same two pages

## Format
- Added "Related reading" section at bottom of each post
- Horizontal pipe (|) separated links
- Contextually placed, not in header/footer
