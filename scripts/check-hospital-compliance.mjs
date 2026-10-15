#!/usr/bin/env node

/**
 * Hospital-Exclusivity Compliance Check
 *
 * Run: node scripts/check-hospital-compliance.mjs [--strict] [--json=<path>]
 *
 * Business rule: the company provides Air Ambulance service EXCLUSIVELY for
 * Bumrungrad International Hospital, Bangkok. No page may state or imply
 * that the company transfers patients to, coordinates admission with,
 * maintains a partnership with, or offers a fallback/alternative to any
 * other hospital or country.
 *
 * This is a detector, not a perfect classifier — it combines hospital/
 * destination name matching with nearby first-person operational language,
 * plus a few unambiguous hard-fail patterns (dead links to pages removed
 * for this exact reason; the "we'll find an alternative hospital" fallback
 * phrasing the owner has explicitly disallowed). Legitimate editorial/
 * comparison mentions of other hospitals (e.g. a "Bumrungrad vs Samitivej
 * vs Bangkok Hospital" article that never claims the company serves the
 * other two) are expected and are downgraded to warnings in whitelisted
 * files rather than failing the build — a human still reviews every hit,
 * this script just sorts them by how likely they are to be real.
 *
 * Exit code: 1 if any HARD_FAIL finding exists (or, with --strict, if any
 * WARN finding exists), 0 otherwise.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getAllSlugs, fileForSlug } from "../lib/content.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// Files where comparing Bumrungrad to other named Bangkok hospitals is the
// page's actual, legitimate purpose. Hits here are reported but don't fail
// the build by default — they still need a human to confirm the page never
// crosses from "here's how they differ" into "we transfer you to either."
// The Bumrungrad-vs-others comparison article was removed on 2026-10-15 (it
// marketed other Bangkok hospitals as equivalent destinations). Only the
// admission guide remains whitelisted, and only for its residual editorial
// framing — it must never claim the company serves another hospital.
const COMPARISON_WHITELIST = new Set([
  "blog/bangkok-hospital-admission-bangladeshi-patients",
]);

// Names that collide with generic phrasing ("a Bangkok hospital", "the
// receiving hospital's cardiac/heart team") unless matched with their exact
// capitalization as a proper noun. Matched case-sensitively.
const CASE_SENSITIVE_HOSPITALS = ["Bangkok Hospital", "Bangkok Heart Hospital"];

// Other hospitals/clinics that have appeared in past violations on this
// site. Not exhaustive — extend this list if a new name surfaces. These are
// distinctive enough names that case-insensitive matching is safe.
const OTHER_HOSPITALS = [
  "BNH Hospital", "BNH",
  "Samitivej",
  "Siriraj", "St. Louis Hospital", "St Louis Hospital", "Vejthani",
  "Queen Sirikit",
  "CMC Vellore", "Vellore", "Apollo Hospital", "Apollo Chennai", "Apollo",
  "MIOT International", "MIOT", "Medanta", "Fortis Escorts", "Fortis",
  "Max Hospital", "AIIMS", "Tata Memorial", "Global Hospital",
  "National University Hospital", "NUH", "Singapore General Hospital", "SGH",
  "Mount Elizabeth", "Gleneagles", "Raffles Hospital",
  "Pun Hlaing Siloam", "Yangon General", "Mandalay General", "Asia Royal",
];

// Destination countries/cities that, on their own, are weaker signals (a
// page can legitimately mention "India" in passing) but combined with
// operational language below are worth a human's attention.
const OTHER_DESTINATIONS = [
  "India", "Singapore", "Myanmar", "Chennai", "Delhi", "Kolkata", "Mumbai",
  "Yangon", "Mandalay", "Kuala Lumpur",
];

const OPERATIONAL_VERB_RE =
  /\b(we|our)\b[^.?!\n]{0,100}\b(transfer|transfers|transferred|coordinate|coordinates|coordinating|arrange|arranges|arranging|admit|admits|serve|serves|operate|operates|partner|partnership|maintain|maintains|work directly|direct relationship|receiving hospital|receiving hospitals)\b/i;

// Phrasing the owner has explicitly ruled out: there is no fallback hospital
// if Bumrungrad cannot accept a patient. Any occurrence is a hard fail.
const NO_FALLBACK_PATTERNS = [
  /best available option/i,
  /alternative hospital/i,
  /alternative,?\s+JCI-accredited/i,
  /different hospital/i,
  /another hospital/i,
];

// Sentences that name another country/hospital but are NOT service claims.
// These are either (a) explicit disclaimers the owner asked us to keep, or
// (b) aviation-logistics facts about the flight path (overflight/ATC
// clearances), which do not represent any other hospital as a destination.
// Kept deliberately narrow so a real claim can't hide behind them.
const EXEMPT_SENTENCE_PATTERNS = [
  /we do not operate/i,
  /do not (?:have|hold|maintain) (?:any )?(?:affiliation|partnership|agreement)/i,
  /not a substitute for (?:professional )?medical advice/i,
  /\b(?:ATC|airspace|overflight|route clearance|flight path|flight-plan|flight plan)\b/i,
  /general information about/i,
];

// The five pages deleted for advertising service to India/Myanmar/
// Singapore. Any remaining link to these slugs is a dead link pointing at
// a page that existed specifically to violate this rule.
const DELETED_SLUGS = [
  "air-ambulance-dhaka-to-chennai-india",
  "air-ambulance-dhaka-to-delhi-india",
  "air-ambulance-dhaka-to-india-vellore-chennai-delhi",
  "air-ambulance-dhaka-to-myanmar",
  "air-ambulance-dhaka-to-singapore",
];

function stripTags(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&").replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function splitSentences(text) {
  return text.split(/(?<=[.!?])\s+/);
}

function slugFromFile(file) {
  return path
    .relative(path.join(ROOT, "content"), file)
    .replace(/\\/g, "/")
    .replace(/\.html$/, "")
    .replace(/\/index$/, "")
    || "/";
}

function checkFile(file) {
  const slug = slugFromFile(file);
  const html = fs.readFileSync(file, "utf8");
  const text = stripTags(html);
  const findings = [];
  const whitelisted = COMPARISON_WHITELIST.has(slug);

  // Hard fail: dead links to a deleted violation page.
  for (const deadSlug of DELETED_SLUGS) {
    if (html.includes(`/blog/${deadSlug}`) || html.includes(`/${deadSlug}"`)) {
      findings.push({
        severity: "HARD_FAIL",
        rule: "dead-link-to-removed-violation-page",
        detail: `References deleted page "${deadSlug}"`,
      });
    }
  }

  // Hard fail: disallowed fallback phrasing, anywhere in the raw HTML
  // (catches JSON-LD and meta text too, not just visible body).
  for (const re of NO_FALLBACK_PATTERNS) {
    const m = html.match(re);
    if (m) {
      findings.push({
        severity: "HARD_FAIL",
        rule: "no-fallback-policy-violation",
        detail: `Matched "${m[0]}" — owner has confirmed no alternative-hospital fallback exists`,
      });
    }
  }

  // Entity + operational-language proximity check, sentence by sentence,
  // over both the visible text and the raw HTML (so JSON-LD/meta text is
  // covered too).
  for (const sourceText of [text, html]) {
    for (const sentence of splitSentences(sourceText)) {
      const hospitalHit =
        OTHER_HOSPITALS.find((h) => sentence.toLowerCase().includes(h.toLowerCase())) ||
        CASE_SENSITIVE_HOSPITALS.find((h) => sentence.includes(h));
      if (!hospitalHit) continue;
      if (!OPERATIONAL_VERB_RE.test(sentence)) continue;
      if (EXEMPT_SENTENCE_PATTERNS.some((re) => re.test(sentence))) continue;

      findings.push({
        severity: whitelisted ? "WARN" : "HARD_FAIL",
        rule: "operational-claim-for-other-hospital",
        detail: `Mentions "${hospitalHit}" alongside first-person service language: "${sentence.trim().slice(0, 220)}"`,
      });
    }
  }

  // Weaker signal: destination countries/cities + operational language.
  // Always a WARN (needs a human to read the sentence) — too noisy to
  // hard-fail on, since "the Thai medical tourism market also serves
  // patients from X" is a legitimate educational sentence.
  for (const sentence of splitSentences(text)) {
    const destHit = OTHER_DESTINATIONS.find((d) =>
      new RegExp(`\\b${d}\\b`, "i").test(sentence)
    );
    if (!destHit) continue;
    if (!OPERATIONAL_VERB_RE.test(sentence)) continue;
    if (EXEMPT_SENTENCE_PATTERNS.some((re) => re.test(sentence))) continue;
    findings.push({
      severity: "WARN",
      rule: "operational-claim-for-other-destination",
      detail: `Mentions "${destHit}" alongside first-person service language: "${sentence.trim().slice(0, 220)}"`,
    });
  }

  // Dedupe identical findings (the text/html double-pass above can repeat
  // a hit that appears in both visible text and raw markup).
  const seen = new Set();
  const deduped = findings.filter((f) => {
    const key = `${f.severity}|${f.rule}|${f.detail}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return { slug, path: `/${slug === "index" ? "" : slug}`, whitelisted, findings: deduped };
}

function main() {
  const args = process.argv.slice(2);
  const strict = args.includes("--strict");
  const jsonArg = args.find((a) => a.startsWith("--json="));
  const jsonOut = jsonArg
    ? path.resolve(ROOT, jsonArg.split("=")[1])
    : path.join(ROOT, "compliance-reports", `hospital-compliance-${new Date().toISOString().slice(0, 10)}.json`);

  const slugs = getAllSlugs();
  const results = slugs
    .map((slugParts) => fileForSlug(slugParts))
    .filter((file) => fs.existsSync(file))
    .map(checkFile);

  const allFindings = results.flatMap((r) =>
    r.findings.map((f) => ({ url: r.path, ...f }))
  );
  const hardFails = allFindings.filter((f) => f.severity === "HARD_FAIL");
  const warnings = allFindings.filter((f) => f.severity === "WARN");

  console.log(`\nHospital-exclusivity compliance check — ${results.length} pages scanned\n`);

  for (const r of results) {
    if (r.findings.length === 0) continue;
    console.log(`${r.path}${r.whitelisted ? "  (comparison-article whitelist)" : ""}`);
    for (const f of r.findings) {
      console.log(`  [${f.severity}] ${f.rule}: ${f.detail}`);
    }
  }

  console.log(`\n${hardFails.length} hard fail(s), ${warnings.length} warning(s) across ${results.length} pages.\n`);

  fs.mkdirSync(path.dirname(jsonOut), { recursive: true });
  fs.writeFileSync(
    jsonOut,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        pagesScanned: results.length,
        hardFailCount: hardFails.length,
        warnCount: warnings.length,
        results,
      },
      null,
      2
    )
  );
  console.log(`Full report written to ${path.relative(ROOT, jsonOut)}\n`);

  const failed = hardFails.length > 0 || (strict && warnings.length > 0);
  process.exit(failed ? 1 : 0);
}

main();
