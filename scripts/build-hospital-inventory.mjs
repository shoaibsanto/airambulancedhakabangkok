#!/usr/bin/env node
/**
 * Exhaustive hospital-mention inventory builder.
 *
 * Independent of scripts/check-hospital-compliance.mjs: this only ENUMERATES
 * every mention of any hospital entity across every publishable surface and
 * classifies it. It makes no pass/fail judgement, so the inventory cannot be
 * silently narrowed by the detector's own assumptions.
 *
 * Surfaces covered:
 *   - every file under content/  (rendered pages: text, meta, JSON-LD, alt)
 *   - shared render path: components/, app/layout.jsx, app/not-found.jsx
 *   - discovery files: public/llms.txt, public/ai-sitemap.xml, public/robots.txt
 *   - route config: app/sitemap.js, app/robots.js, next.config.mjs
 *   - media metadata: <img alt>, SVG <title>/<desc>, filename tokens
 *
 * Output: compliance-reports/hospital-mention-inventory.csv (regenerated)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getAllSlugs, fileForSlug } from "../lib/content.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// ── Entity dictionary ────────────────────────────────────────────────────────
// Key = canonical entity name. `include` = every spelling/alias/brand/translit
// variant we accept as referring to that entity. Case-insensitive unless
// `sensitive` is true (needed for "Bangkok Hospital", which collides with the
// generic phrase "a Bangkok hospital").
const ENTITIES = [
  { canonical: "Bumrungrad International Hospital", authorized: true,
    include: ["Bumrungrad", "Bumrungrad International", "Bumrungrad International Hospital",
              "Bumrungrad Hospital", "BIH"] },

  { canonical: "Bangkok Hospital (BDMS)", authorized: false, sensitive: true,
    include: ["Bangkok Hospital", "Bangkok Hospital Medical Center", "BDMS",
              "Bangkok Hospital Group"] },
  { canonical: "Bangkok Heart Hospital", authorized: false, sensitive: true,
    include: ["Bangkok Heart Hospital"] },
  { canonical: "Samitivej Hospital", authorized: false,
    include: ["Samitivej", "Samitivej Srinakarin", "Samitivej Hospital"] },
  { canonical: "BNH Hospital", authorized: false,
    include: ["BNH", "BNH Hospital", "Bangkok Nursing Home"] },
  { canonical: "Vejthani Hospital", authorized: false, include: ["Vejthani"] },
  { canonical: "Siriraj Hospital", authorized: false, include: ["Siriraj"] },
  { canonical: "Chulalongkorn Hospital", authorized: false, include: ["Chulalongkorn"] },
  { canonical: "Ramathibodi Hospital", authorized: false, include: ["Ramathibodi"] },
  { canonical: "Medanta", authorized: false, include: ["Medanta"] },
  // "Fortis Escorts" (Indian chain, Fortis Healthcare + Escorts Heart Institute).
  // The bare alias "Escorts" is deliberately NOT tracked: the site publishes
  // legitimate uses of the common noun "escorts" — e.g. "air-ambulance-escort
  // cost" and medical-escort flights where a clinician accompanies a patient
  // on a commercial flight. A bare "Escorts" alias matched those in 21 places
  // on 2026-10-15 and produced pure noise. Track only forms that name the
  // hospital; "Fortis" alone is specific enough to keep.
  { canonical: "Fortis Escorts", authorized: false, include: ["Fortis", "Fortis Escorts"] },
  { canonical: "Apollo Hospitals", authorized: false, include: ["Apollo"] },
  { canonical: "MIOT International", authorized: false, include: ["MIOT"] },
  { canonical: "Tata Memorial Hospital", authorized: false, include: ["Tata Memorial"] },
  { canonical: "CMC Vellore", authorized: false, include: ["CMC Vellore", "Vellore", "Christian Medical College"] },
  { canonical: "Global Hospital", authorized: false, include: ["Global Hospital"] },
  { canonical: "Max Healthcare", authorized: false, include: ["Max Hospital", "Max Healthcare"] },
  { canonical: "AIIMS", authorized: false, include: ["AIIMS"] },
  { canonical: "Singapore General Hospital", authorized: false, include: ["Singapore General Hospital", "SGH"] },
  { canonical: "National University Hospital Singapore", authorized: false, include: ["National University Hospital", "NUH"] },
  { canonical: "Mount Elizabeth Hospital", authorized: false, include: ["Mount Elizabeth"] },
  { canonical: "Gleneagles Hospital", authorized: false, include: ["Gleneagles"] },
  { canonical: "Raffles Hospital", authorized: false, include: ["Raffles Hospital"] },
  { canonical: "Pun Hlaing Siloam Hospital", authorized: false, include: ["Pun Hlaing", "Siloam"] },
  { canonical: "Yangon General Hospital", authorized: false, include: ["Yangon General"] },
  { canonical: "Mandalay General Hospital", authorized: false, include: ["Mandalay General"] },
  { canonical: "Asia Royal Hospital", authorized: false, include: ["Asia Royal"] },
  { canonical: "Queen Sirikit Hospital", authorized: false, include: ["Queen Sirikit"] },
  { canonical: "St. Louis Hospital Bangkok", authorized: false, include: ["St. Louis Hospital", "St Louis Hospital"] },
];

// Countries/destinations that imply a service geography outside the
// authorised Dhaka -> Bangkok / Bumrungrad corridor.
const DESTINATIONS = ["India", "Singapore", "Myanmar", "Chennai", "Delhi",
  "Kolkata", "Mumbai", "Vellore", "Yangon", "Mandalay", "Kuala Lumpur", "Thailand and beyond"];

// ── Extraction ───────────────────────────────────────────────────────────────
function decodeEntities(s) {
  return s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ");
}

// Split a file's source into labelled, independently-scannable surfaces.
// Keeping surfaces separate is the whole point: a hospital name in a meta
// description must be classifiable without borrowing context from body text.
function surfaces(rel, src) {
  const out = [];
  const isHtml = rel.endsWith(".html") || rel.endsWith(".jsx") || rel.endsWith(".js");

  // 1. visible text (scripts/styles/comments removed, tags stripped)
  if (isHtml) {
    const text = src
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<!--[\s\S]*?-->/g, " ")
      .replace(/<[^>]+>/g, " ");
    out.push({ kind: "visible-text", text: decodeEntities(text) });
  } else {
    out.push({ kind: "file-text", text: src });
  }

  // 2. <title>
  for (const m of src.matchAll(/<title[^>]*>([\s\S]*?)<\/title>/gi))
    out.push({ kind: "title", text: decodeEntities(m[1]) });

  // 3. meta description / og:* / twitter:*
  for (const m of src.matchAll(/<meta\b[^>]*>/gi)) {
    const tag = m[0];
    if (!/(name|property)\s*=\s*["'](description|og:(title|description)|twitter:(title|description))["']/i.test(tag)) continue;
    const c = tag.match(/content\s*=\s*["']([^"']*)["']/i);
    if (c) out.push({ kind: "meta", text: decodeEntities(c[1]), raw: tag.trim() });
  }

  // 4. every JSON-LD block, node by node (flattened to key:path -> value)
  for (const m of src.matchAll(/<script[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    const raw = m[1].trim();
    if (!raw) continue;
    let parsed; try { parsed = JSON.parse(raw); } catch { parsed = null; }
    if (!parsed) { out.push({ kind: "json-ld-unparsed", text: raw }); continue; }
    const stack = [["$", parsed]];
    while (stack.length) {
      const [key, node] = stack.pop();
      if (node === null || node === undefined) continue;
      if (Array.isArray(node)) { node.forEach((v, i) => stack.push([`${key}[${i}]`, v])); continue; }
      if (typeof node === "object") { for (const [k, v] of Object.entries(node)) stack.push([`${key}.${k}`, v]); continue; }
      if (typeof node === "string") out.push({ kind: "json-ld", text: decodeEntities(node), path: key });
    }
  }

  // 5. image alt / SVG <title>/<desc> (screen-reader + AI-visible text)
  for (const m of src.matchAll(/<img\b[^>]*>/gi)) {
    const a = m[0].match(/alt\s*=\s*["']([^"']*)["']/i);
    if (a && a[1].trim()) out.push({ kind: "img-alt", text: decodeEntities(a[1]) });
  }
  for (const m of src.matchAll(/<(?:title|desc)[^>]*>([\s\S]*?)<\/(?:title|desc)>/gi))
    out.push({ kind: "svg-label", text: decodeEntities(m[1]) });

  return out;
}

// Classify one mention. `ctx` is the sentence-ish window around the match.
function classify(entity, ctx, kind) {
  const lower = ctx.toLowerCase();
  // Explicit denial of service to that destination is compliant.
  if (/\b(do not|don't|does not|doesn't|never|no longer|not available|cannot|can't)\b/.test(lower)
      && /\b(transfer|fly|operate|serve|provide|offer|route|coordinate)\b/.test(lower))
    return "compliant-denial";
  // Bumrungrad: still flag if it sits in a fallback/alternative construction.
  // The 2026-10-15 run showed a plain "instead of"/"fallback" test also
  // catches benign sentences ("see our cost page ... instead of guessing"),
  // so require the alternative to be expressed as a thing being replaced.
  if (entity.authorized) {
    if (/\b(fallback|backup|other option)\b/i.test(lower))
      return "UNAUTHORIZED-fallback-pairing";
    if (/\b(alternative|rather than|instead of)\b\s*(?:to\s+|than\s+)?(?:a\s+|the\s+|an\s+)?(hospital|clinic|provider|facility|destination|centre|center)\b/i.test(lower))
      return "UNAUTHORIZED-fallback-pairing";
    return "authorized-bumrungrad";
  }
  // Non-Bumrungrad inside first-person operational language = the core risk.
  if (/\b(we|our|us)\b[^.?!]{0,120}\b(transfer|transfer[sd]?|coordinate|arrange|admit|serve|operate|book|dispatch|partner)\b/i.test(ctx))
    return "UNAUTHORIZED-operational-claim";
  if (/\b(air ambulance|medical flight|icu flight|bed-to-bed|receiving hospital|transfer to|evacuation to)\b/i.test(ctx))
    return "UNAUTHORIZED-service-context";
  if (/\b(compare|comparison|vs\.?|versus|difference between|option|choose|select)\b/i.test(lower))
    return "UNAUTHORIZED-comparison-as-option";
  return "REVIEW-editorial";
}

// ── Build ────────────────────────────────────────────────────────────────────
// Build a matcher for one entity variant.
//
// Token boundaries matter. Substring containment produced two classes of
// false positive that the 2026-10-15 inventory run exposed:
//   - "BNH" matched inside "DBNHL" — a different Bangkok hospital's acronym.
//   - "Fortis Escorts" matched the common noun "escorts" (medical-escort
//     flights). That alias has since been removed from ENTITIES, but the
//     word boundary is what makes any remaining multi-word variant safe.
// Latin-script variants therefore anchor on word boundaries. Variants
// containing spaces or non-ASCII characters still anchor, but \b is unreliable
// around non-ASCII, so those keep plain substring semantics.
function variantRe(variant, sensitive) {
  const flags = sensitive ? "g" : "gi";
  const esc = variant.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const latinWord = /^[A-Za-z][A-Za-z .'-]*$/.test(variant);
  // NOTE: "\b" must be built by concatenation. Inside a template literal,
  // `"\b"` is a backspace character (U+0008), NOT the regex word-boundary
  // anchor — which silently makes every Latin-word variant match nothing and
  // collapsed the whole inventory to 0 mentions before this comment existed.
  return new RegExp(latinWord ? "\\b" + esc + "\\b" : esc, flags);
}

function* walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === "node_modules" || e.name === ".git" || e.name === ".next") continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else yield p;
  }
}

// A page's URL, derived the same way the app derives it.
function urlForSlug(slugParts) {
  return slugParts.length ? "/" + slugParts.join("/") : "/";
}

function build() {
  const rows = [];

  // Every routable page, from the same source of truth the app uses.
  const pageFiles = new Set();
  for (const slugParts of getAllSlugs()) {
    const f = fileForSlug(slugParts);
    pageFiles.add(path.resolve(f));
    scanFile(f, urlForSlug(slugParts), "published-page", rows);
  }

  // Shared render path + discovery + route config. These are NOT routable
  // pages, so they are labelled by their own scope.
  for (const rel of SHARED_SURFACES) {
    const f = path.join(ROOT, rel);
    if (!fs.existsSync(f)) continue;
    if (pageFiles.has(path.resolve(f))) continue;
    const scope = rel.startsWith("public/") ? "discovery-file"
      : rel.startsWith("components/") || rel.includes("layout") || rel.includes("not-found")
        ? "shared-render-path" : "route-config";
    scanFile(f, rel, scope, rows);
  }

  // Orphan media: files under public/ that no routable page references.
  // These are still publicly fetchable, so they are in scope.
  const publicDir = path.join(ROOT, "public");
  if (fs.existsSync(publicDir)) {
    for (const f of walk(publicDir)) {
      const rel = path.relative(ROOT, f).split(path.sep).join("/");
      if (/^public\/(llms\.txt|ai-sitemap\.xml|robots\.txt|site\.webmanifest)$/.test(rel)) continue;
      const src = fs.readFileSync(f, "utf8");
      for (const entity of ENTITIES) {
        for (const variant of entity.include) {
          const re = variantRe(variant, entity.sensitive);
          for (const m of src.matchAll(re)) {
            rows.push({ entity: entity.canonical, matched: m[0], url: "/" + rel.replace(/^public\//, ""),
              surface: "media-filename-or-asset", authorized: entity.authorized,
              classification: "REVIEW-media-asset", context: rel });
          }
        }
      }
    }
  }

  return rows;
}

function scanFile(file, label, scope, rows) {
  let src; try { src = fs.readFileSync(file, "utf8"); } catch { return; }
  const rel = path.relative(ROOT, file).split(path.sep).join("/");

  for (const { kind, text, path: jpath } of surfaces(rel, src)) {
  if (!text) continue;
  for (const entity of ENTITIES) {
    for (const variant of entity.include) {
      const re = variantRe(variant, entity.sensitive);
        for (const m of text.matchAll(re)) {
          const ctx = text.slice(Math.max(0, m.index - 160), m.index + m[0].length + 160).replace(/\s+/g, " ").trim();
          rows.push({
            entity: entity.canonical, matched: m[0], url: label, surface: `${scope}:${kind}`,
            authorized: entity.authorized, classification: classify(entity, ctx, kind),
            context: ctx, ...(jpath ? { jsonPath: jpath } : {}),
          });
        }
      }
    }
  }
}

const SHARED_SURFACES = [
  "components/Header.jsx", "components/Footer.jsx", "components/Topbar.jsx",
  "components/Fab.jsx", "components/MobileCallBar.jsx", "components/Analytics.jsx",
  "components/ClientScripts.jsx", "app/layout.jsx", "app/not-found.jsx",
  "app/sitemap.js", "app/robots.js", "lib/site.js", "lib/markdown-transform.js",
  "lib/markdown-config.js", "public/llms.txt", "public/ai-sitemap.xml", "next.config.mjs",
];

// ── CSV ──────────────────────────────────────────────────────────────────────
function csvEscape(v) {
  const s = v === undefined || v === null ? "" : String(v);
  return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}

const rows = build();
const cols = ["entity", "matched", "authorized", "url", "surface", "classification", "jsonPath", "context"];
const csv = [cols.join(",")]
  .concat(rows.map((r) => cols.map((c) => csvEscape(r[c])).join(",")))
  .join("\r\n");

const OUT = path.join(ROOT, "compliance-reports", "hospital-mention-inventory.csv");
fs.writeFileSync(OUT, "\ufeff" + csv, "utf8"); // BOM: opens correctly in Excel

// Console summary
const byClass = {};
for (const r of rows) byClass[r.classification] = (byClass[r.classification] || 0) + 1;
const unauthorized = rows.filter((r) => r.classification.startsWith("UNAUTHORIZED"));
const review = rows.filter((r) => r.classification === "REVIEW-editorial" || r.classification === "REVIEW-media-asset");

console.log(`hospital-mention-inventory.csv — ${rows.length} mentions`);
console.log("\nBy classification:");
for (const [k, v] of Object.entries(byClass).sort((a, b) => b[1] - a[1]))
  console.log(`  ${String(v).padStart(5)}  ${k}`);
console.log(`\nUNAUTHORIZED: ${unauthorized.length}   REVIEW: ${review.length}`);
if (unauthorized.length) {
  console.log("\n--- UNAUTHORIZED detail ---");
  for (const r of unauthorized.slice(0, 60))
    console.log(`  [${r.classification}] ${r.url} (${r.surface})\n      "${r.matched}" :: ${r.context.slice(0, 150)}`);
  if (unauthorized.length > 60) console.log(`  ... ${unauthorized.length - 60} more`);
}
