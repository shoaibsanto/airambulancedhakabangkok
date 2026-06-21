// Build-time parser for the original static HTML pages.
// Each page's body content and SEO metadata are extracted verbatim so the
// Next.js build reproduces the source site 1:1 while server-rendering everything.
import fs from "node:fs";
import path from "node:path";

const CONTENT_DIR = path.join(process.cwd(), "content");

function decodeEntities(str = "") {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
}

function metaContent(html, attr, value) {
  // matches <meta name="x" content="..."> or <meta property="x" content="...">
  const re = new RegExp(
    `<meta[^>]*${attr}=["']${value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["'][^>]*content=["']([^"']*)["']`,
    "i"
  );
  const m = html.match(re);
  return m ? decodeEntities(m[1]) : undefined;
}

function linkHref(html, rel) {
  const re = new RegExp(`<link[^>]*rel=["']${rel}["'][^>]*href=["']([^"']*)["']`, "i");
  const m = html.match(re);
  return m ? m[1] : undefined;
}

// Map a slug array (from the catch-all route) to a content file path.
export function fileForSlug(slug) {
  const parts = Array.isArray(slug) ? slug : [];
  if (parts.length === 0) return path.join(CONTENT_DIR, "index.html");
  if (parts.length === 1 && parts[0] === "blog") return path.join(CONTENT_DIR, "blog", "index.html");
  return path.join(CONTENT_DIR, ...parts) + ".html";
}

// Enumerate every routable page (used by generateStaticParams).
export function getAllSlugs() {
  const slugs = [];
  for (const entry of fs.readdirSync(CONTENT_DIR)) {
    if (entry === "404.html") continue;
    if (entry.endsWith(".html")) {
      slugs.push(entry === "index.html" ? [] : [entry.replace(/\.html$/, "")]);
    }
  }
  // Nested content sections (blog, author, guides) — enumerate one level deep.
  for (const section of ["blog", "author", "guides"]) {
    const dir = path.join(CONTENT_DIR, section);
    if (!fs.existsSync(dir)) continue;
    for (const entry of fs.readdirSync(dir)) {
      if (!entry.endsWith(".html")) continue;
      slugs.push(entry === "index.html" ? [section] : [section, entry.replace(/\.html$/, "")]);
    }
  }
  return slugs;
}

// Parse a single page file into { meta, body, jsonLd }.
export function parsePage(slug) {
  const file = fileForSlug(slug);
  if (!fs.existsSync(file)) return null;
  const html = fs.readFileSync(file, "utf8");

  const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
  const meta = {
    title: titleMatch ? decodeEntities(titleMatch[1].trim()) : SITE_DEFAULT_TITLE,
    description: metaContent(html, "name", "description"),
    keywords: metaContent(html, "name", "keywords"),
    robots: metaContent(html, "name", "robots"),
    canonical: linkHref(html, "canonical"),
    ogType: metaContent(html, "property", "og:type"),
    ogTitle: metaContent(html, "property", "og:title"),
    ogDescription: metaContent(html, "property", "og:description"),
    ogUrl: metaContent(html, "property", "og:url"),
    ogImage: metaContent(html, "property", "og:image"),
    ogImageAlt: metaContent(html, "property", "og:image:alt"),
    ogSiteName: metaContent(html, "property", "og:site_name"),
    twitterTitle: metaContent(html, "name", "twitter:title"),
    twitterDescription: metaContent(html, "name", "twitter:description"),
    twitterImage: metaContent(html, "name", "twitter:image"),
    articlePublished: metaContent(html, "property", "article:published_time"),
    articleModified: metaContent(html, "property", "article:modified_time"),
  };

  // JSON-LD blocks (preserved verbatim).
  const jsonLd = [];
  const ldRe = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = ldRe.exec(html)) !== null) jsonLd.push(m[1].trim());

  // Body content = everything between the shared header and the shared footer.
  let body = "";
  const afterHeader = html.split(/<\/header>/i)[1] ?? html;
  body = afterHeader.split(/<footer class="footer">/i)[0] ?? afterHeader;
  // 404 page (no header/footer) — fall back to the inner <body>.
  if (!/<\/header>/i.test(html)) {
    const b = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    body = b ? b[1] : html;
  }

  return { meta, body: body.trim(), jsonLd };
}

const SITE_DEFAULT_TITLE = "Air Ambulance Dhaka to Bangkok";
