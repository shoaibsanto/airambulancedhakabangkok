# Air Ambulance Dhaka to Bangkok — Next.js

SEO-optimized **Next.js 16 (App Router)** conversion of the original static
`airambulancedhakabangkok` website. Every page is server-rendered as static HTML
(SSG), preserving the original content, design, and SEO metadata 1:1.

## How it works

The original page bodies live as plain HTML under [`content/`](./content). A
build-time parser ([`lib/content.js`](./lib/content.js)) extracts each page's
body and SEO metadata, and a single catch-all route renders them all:

- `app/[[...slug]]/page.jsx` — one route renders all 17 pages. `generateMetadata`
  emits per-page `<title>`, description, canonical, Open Graph, Twitter, and
  robots tags via the Next Metadata API. JSON-LD structured data is preserved
  verbatim and server-rendered.
- Shared chrome (`Topbar`, `Header`, `Footer`, `Fab`) lives in
  [`components/`](./components). The header uses `usePathname` for active links;
  `ClientScripts` reproduces the original `main.js` behavior (FAQ accordion,
  scroll-reveal, WhatsApp inquiry form).
- `app/sitemap.js`, `app/robots.js` — generated `sitemap.xml` and `robots.txt`
  (including AI/answer-engine crawler rules).
- Fonts are self-hosted via `next/font/google` (Inter + Plus Jakarta Sans).
- Security headers + asset caching are set in `next.config.mjs`.

## SEO features preserved / improved

- Server-rendered HTML for every route (fully crawlable, no client-only content)
- Per-page title, meta description, canonical, Open Graph & Twitter cards
- All JSON-LD schema (MedicalBusiness, Service, FAQPage, WebSite, BlogPosting…)
- `sitemap.xml`, `robots.txt`, `site.webmanifest`, `llms.txt`
- Clean URLs (no `.html`), no trailing slash, self-hosted fonts (better LCP/CLS)

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (static export of all pages)
npm start        # serve the production build
```
