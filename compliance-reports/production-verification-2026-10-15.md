# Production Verification — 2026-10-15

Commit verified: `96b46e5` ("Round 5: fix shared-footer multi-destination claim + detector gaps")
Deploy verified live at https://airambulancedhakabangkok.com on the same day, minutes after push.

## Scope

- All 49 sitemap URLs fetched live (rendered HTML, not source files).
- Each page checked for: new exclusive footer text, absence of the old multi-destination
  footer, absence of the `Bumrungrad/BH` abbreviation, absence of the corrected
  multi-hospital phrasings, and absence of every name in `OTHER_HOSPITALS` +
  `HOSPITAL_ABBREVIATIONS` in visible text.
- The exact committed detector rules (`check-hospital-compliance.mjs`, including the new
  multi-destination / multi-hospital-set / abbreviation rules) were executed against the
  live production HTML of all 49 pages using the same per-element unit methodology
  the script uses: **0 findings**.
  (A first pass over whole-document stripped text produced one apparent hit on /services;
  it was a header+body merge artifact of that ad-hoc pass, not of production content —
  the per-element pass, which is the committed script's methodology, is clean.)

## Results

- HTTP 200 on 49/49 sitemap URLs; 0 fetch errors.
- New exclusive footer ("...for Bumrungrad International Hospital.") present on 49/49 pages.
- Old footer ("Bangkok, Thailand and beyond") present on: 0 pages.
- `Bumrungrad/BH` abbreviation present on: 0 pages.
- Corrected phrasings ("work directly with Bangkok hospitals including", "Compare Bangkok's
  top hospitals", "Bangkok hospitals have partnerships") present on: 0 pages.
- Other-hospital names (Samitivej, Vejthani, Vellore, Apollo, BNH, BH, ... ) in visible text: 0 pages.
- /bangkok-hospitals: owner-approved agreement statement present; old contradiction absent.
- Removed hospital pages (Chennai/Delhi/Singapore/Myanmar/Vellore slugs) still redirect to
  /routes — not the homepage.
- robots.txt, llms.txt, ai-sitemap.xml: 200; no other-destination references.

## Known limits of this verification

- Verified against live HTML of all sitemap URLs plus the redirect sources checked above;
  any route not linked from the sitemap and not a known redirect source was not crawled.
- External copies (Google cache, archived snapshots, third-party mirrors) are outside
  repo control and were not modified.
- Search-engine indexes will update on their own schedule; the corrections affect the
  deployed HTML as of this run.
