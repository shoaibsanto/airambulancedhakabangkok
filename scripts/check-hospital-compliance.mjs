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

// Abbreviations are why a name-based audit is not sufficient on its own.
// "Bangkok (Bumrungrad/BH, approx. USD)" named a second hospital in a table
// header using two letters, which no name list and no plain-text grep for
// "Bangkok Hospital" could catch. Separate list so it can be tightened
// without touching the proper-noun rules.
const HOSPITAL_ABBREVIATIONS = ["BH", "Bumrungrad/BH"];

// Abbreviations cannot use .includes(): "BH" would match inside "BHMC" and
// inside any word containing those two letters. Match on a word-boundary
// regex instead. Only the short form is matched, so a line carrying both
// "BH" and "Bumrungrad/BH" is reported once.
function findAbbreviation(line) {
  return HOSPITAL_ABBREVIATIONS.find((a) => new RegExp("\\b" + a + "\\b").test(line)) || null;
}

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

// Nouns that place a hospital inside our service offering even when the
// sentence carries no first-person verb: "as backup", "receiving hospital",
// "air ambulance to X". Deliberately excludes generic words like "hospital"
// on its own, which would flag every editorial comparison on the site.
// NOTE: this is a detection aid, not an authorisation list — a hit here is a
// HARD_FAIL for human review, not an automatic verdict.
const SERVICE_NOUN_RE =
  /backup|fall\s?-?back|alternative|receiving hospital|referring hospital|air ambulance|medical flight|ICU (?:jet|flight)|bed-to-bed|evacuation|transfer (?:to|destination)/i;

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
  /not a substitute for (?:professional )?medical advice/i,
  /\b(?:ATC|airspace|overflight|route clearance|flight path|flight-plan|flight plan)\b/i,
  /general information about/i,
];

// The owner has confirmed an official agreement with Bumrungrad International
// Hospital exists. Any sentence denying an affiliation/partnership/agreement
// with Bumrungrad therefore contradicts a verified business fact and must be
// removed from the site. This used to sit in EXEMPT_SENTENCE_PATTERNS (where
// it suppressed the very contradiction it should have caught); it is now its
// own rule so the contradiction can never be silently ignored again.
const AGREEMENT_CONTRADICTION_PATTERNS = [
  /do not (?:have|hold|maintain|possess) (?:any )?(?:official )?(?:affiliation|partnership|agreement|relationship|association|connection)/i,
  /no (?:official )?(?:affiliation|partnership|agreement|relationship|association|connection) (?:with|to|exists)/i,
  /(?:not|never) (?:affiliated|partnered|associated|formally recognized)/i,
  /(?:merely|only) (?:an )?(?:informal|unofficial|personal)/i,
  /(?:without|lacking) (?:any )?(?:official )?(?:affiliation|partnership|agreement)/i,
  /(?:are|is) (?:not|independent of) (?:officially )?(?:affiliated|partnered)/i,
  /do(?:es)? not (?:hold|have|maintain) any official/i,
];

// Approved, accurate wording for the verified agreement. A sentence matching
// one of these is a correct statement of the relationship and is never
// flagged. Keep these in sync with the owner's confirmed facts.
//
// Each pattern is NEGATION-AWARE. A naive /partnership with Bumrungrad/ would
// also match the contradiction we are hunting ("We do not hold any ... ... partnership
// with Bumrungrad International Hospital"), because the denial sentence still
// contains the same keywords. So every pattern below either (a) asserts the
// agreement affirmatively, or (b) explicitly requires the absence of a
// negating phrase such as "do not hold" / "no official" / "not affiliated"
// anywhere earlier in the same sentence. Without this guard the exemption
// silently swallowed the contradiction and reported a false clean bill of
// health — which is exactly the failure mode this check exists to prevent.
const NEGATION_GUARD =
  /\b(?:do not|don't|does not|doesn't|did not|didn't|no|not|never|without|lacking|den(?:y|ies|ied)|refuse[sd]?|disclaim(?:s|ed)?|independent of)\b/i;

const AGREEMENT_CONFIRMED_PATTERNS = [
  /we (?:have|hold|maintain|keep) (?:an? )?(?:official )?(?:agreement|partnership|arrangement) with Bumrungrad/i,
  /official (?:agreement|partnership|arrangement) with Bumrungrad/i,
  /(?:agreement|partnership|arrangement) (?:with|to transfer to) Bumrungrad/i,
  /Bumrungrad International Hospital — our role is to coordinate/i,
];

// A confirmed-pattern match only counts if the sentence carries no negation.
// This is what stops the exemption from whitelisting the very contradiction
// the rule is designed to catch.
function isConfirmedAgreement(sentence) {
  if (NEGATION_GUARD.test(sentence)) return false;
  return AGREEMENT_CONFIRMED_PATTERNS.some((re) => re.test(sentence));
}

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

// Decode the handful of HTML entities that appear in meta attribute values.
// Deliberately minimal — this only needs to make attribute text comparable to
// the hospital-name list, not be a general HTML parser.
function decodeEntities(str) {
  return String(str)
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

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

// Split the raw HTML into coherent text units BEFORE sentence splitting.
//
// Why this exists: the previous implementation ran splitSentences() directly
// over the raw markup. Markup carries almost no sentence punctuation, so one
// "sentence" could span an entire <footer>, dragging the SVG path data, the
// tel:/wa.me links and every unrelated string into a single blob. Two failure
// modes followed, both reproduced by the 2026-10-15 injection tests:
//   1. A hospital name and a first-person service verb could land in the same
//      blob even though they are unrelated elements — false positive.
//   2. The verb regex is anchored on \b(we|our)\b within 100 chars BEFORE the
//      verb; when the blob's leading markup consumed that window, a genuine
//      violation sitting at the end of the document was silently missed —
//      false negative. That is the dangerous direction.
// So: terminate every block/inline boundary with a newline, then strip tags,
// then normalise. The result is one text run per element.
function htmlToUnits(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "\n")
    .replace(/<style[\s\S]*?<\/style>/gi, "\n")
    .replace(/<!--[\s\S]*?-->/g, "\n")
    .replace(/<\/[a-zA-Z][^>]*>/g, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/[ \t]+/g, " ")
    .split(/\n+/)
    .map((u) => u.trim())
    .filter((u) => u.length > 0);
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

  // Section 10: agreement contradiction. The owner has confirmed an official
  // agreement with Bumrungrad exists, so any sentence denying that
  // affiliation/partnership is a verified factual contradiction. This is
  // checked BEFORE the other-hospital rule and independently of it, because
  // these sentences name Bumrungrad (the permitted hospital) and so would
  // otherwise slip past a rule keyed on OTHER_HOSPITALS.
  for (const sentence of splitSentences(text)) {
    if (isConfirmedAgreement(sentence)) continue;
    const re = AGREEMENT_CONTRADICTION_PATTERNS.find((r) => r.test(sentence));
    if (re) {
      // .find() returns the RegExp itself, not a match array — call .exec()
      // to recover the matched text. (.source is the pattern source, which is
      // not the same thing as the matched string a human needs to see.)
      const matched = re.exec(sentence)?.[0] ?? re.source;
      findings.push({
        severity: "HARD_FAIL",
        rule: "contradicts-official-agreement",
        detail: `Denies an official Bumrungrad affiliation/partnership ("${matched}"), contradicting the owner-confirmed agreement: "${sentence.trim().slice(0, 200)}"`,
      });
    }
  }

  // Entity + operational-language proximity check.
  //
  // Text units come from htmlToUnits(), NOT from splitSentences(html): the
  // latter produces cross-element blobs and provably missed a real
  // violation in the 2026-10-15 injection test. Each unit is a single
  // element's text, so "hospital name" and "first-person service verb" must
  // genuinely co-occur in the same element to be flagged.
  // JSON-LD and <meta> text are covered by their own dedicated rules below.
  const seenText = new Set();
  for (const unit of htmlToUnits(html)) {
    for (const sentence of splitSentences(unit)) {
      if (!sentence || seenText.has(sentence)) continue;
      seenText.add(sentence);
      const hospitalHit =
        OTHER_HOSPITALS.find((h) => sentence.toLowerCase().includes(h.toLowerCase())) ||
        CASE_SENSITIVE_HOSPITALS.find((h) => sentence.includes(h)) ||
        findAbbreviation(sentence);
      if (!hospitalHit) continue;
      if (EXEMPT_SENTENCE_PATTERNS.some((re) => re.test(sentence))) continue;

      // Branch A: first-person service language ("we transfer to …", "our …
      // service"). Requires (we|our) BEFORE the verb within 100 chars, so a
      // hospital named only in an unrelated neighbour element cannot match.
      if (OPERATIONAL_VERB_RE.test(sentence)) {
        findings.push({
          severity: whitelisted ? "WARN" : "HARD_FAIL",
          rule: "operational-claim-for-other-hospital",
        detail: `Mentions "${hospitalHit}" alongside first-person service language: "${sentence.trim().slice(0, 220)}"`,
      });
      continue;
    }

    // Branch B: no first-person verb, but the sentence still pairs an
    // unauthorized hospital with an air-ambulance service noun. This is the
    // "with BNH as backup" / "through Samitivej Hospital" shape, which the
    // (we|our) rule structurally cannot see. Confirmed by the 2026-10-15
    // injection test: a page stating a non-Bumrungrad hospital "as backup"
    // is a fallback-destination claim and must never pass silently.
    const svcNoun = sentence.match(SERVICE_NOUN_RE);
    if (svcNoun) {
      findings.push({
        severity: whitelisted ? "WARN" : "HARD_FAIL",
        rule: "other-hospital-in-service-context",
        detail: `Names "${hospitalHit}" next to service noun "${svcNoun[0]}" without first-person wording — verify this is not a fallback/alternative-destination claim: "${sentence.trim().slice(0, 220)}"`,
      });
    }
    }
  }

  // ── Structured/SEO fields: <meta> descriptions and JSON-LD ──────────────
  // These are NOT reachable from the sentence pass above. `stripTags` removes
  // every <meta ...> tag outright, so a hospital name that lives only in a
  // description/og:*/twitter:* attribute is invisible to the visible-text
  // pass; and in the raw-HTML pass the meta tag's text sits before the first
  // sentence boundary of the document blob, so the operational-verb regex
  // (which requires we/our BEFORE the verb) never fires. The same is true of
  // JSON-LD script bodies. Verified by injection test 2026-10-15: a meta
  // description naming Samitivej + Apollo with "transfers" passed at 0/0.
  //
  // A hospital named in metadata is a machine-readable service claim, so it
  // is a HARD_FAIL regardless of whether a human-visible sentence is nearby.
  // Exemptions still apply (editorial mentions, ATC/flight-path facts).
  for (const m of html.matchAll(/<meta\b[^>]*>/gi)) {
    const tag = m[0];
    const desc = tag.match(/(?:name|property)=["'](?:description|og:(?:description|title)|twitter:(?:description|title))["']/i);
    if (!desc) continue;
    const val = tag.match(/content=["']([^"']*)["']/i)?.[1];
    if (!val) continue;
    const sentence = decodeEntities(val);
    if (EXEMPT_SENTENCE_PATTERNS.some((re) => re.test(sentence))) continue;
    const hospitalHit =
      OTHER_HOSPITALS.find((h) => sentence.toLowerCase().includes(h.toLowerCase())) ||
      CASE_SENSITIVE_HOSPITALS.find((h) => sentence.includes(h)) ||
      findAbbreviation(sentence);
    if (!hospitalHit) continue;
    findings.push({
      severity: whitelisted ? "WARN" : "HARD_FAIL",
      rule: "other-hospital-in-metadata",
      detail: `SEO metadata names "${hospitalHit}": "${sentence.trim().slice(0, 220)}"`,
    });
  }

  for (const m of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    const raw = m[1].trim();
    if (!raw) continue;
    let nodes = [];
    try {
      const parsed = JSON.parse(raw);
      nodes = Array.isArray(parsed) ? parsed : [parsed];
    } catch (_) {
      continue; // unparseable JSON-LD is a separate validator's concern
    }
    const walk = (node, trail) => {
      if (node === null || node === undefined) return;
      if (Array.isArray(node)) return node.forEach((v, i) => walk(v, `${trail}[${i}]`));
      if (typeof node === "object") {
        return Object.entries(node).forEach(([k, v]) => walk(v, `${trail}.${k}`));
      }
      if (typeof node !== "string") return;
      if (EXEMPT_SENTENCE_PATTERNS.some((re) => re.test(node))) return;
      const hospitalHit =
        OTHER_HOSPITALS.find((h) => node.toLowerCase().includes(h.toLowerCase())) ||
        CASE_SENSITIVE_HOSPITALS.find((h) => node.includes(h)) ||
        findAbbreviation(node);
      if (!hospitalHit) return;
      findings.push({
        severity: whitelisted ? "WARN" : "HARD_FAIL",
        rule: "other-hospital-in-json-ld",
        detail: `JSON-LD ${trail} names "${hospitalHit}": "${node.trim().slice(0, 200)}"`,
      });
    };
    nodes.forEach((n, i) => walk(n, `block[${i}]`));
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

  // Multi-destination / multi-hospital claims. Deliberately separate from the
  // other-hospital rules above: this branch fires on phrasing that names no
  // second hospital at all, which is the exact shape of the violation that
  // reached production. Exempt patterns are NOT applied here — a "beyond
  // Bangkok" service claim is not made acceptable by an overflight note.
  //
  // Two structural points, both learned the hard way:
  //
  // 1. Units, not splitSentences(text). `text` is stripTags(html) collapsed
  //    to a single line, so <head> merges with the first body paragraph and a
  //    title like "Air Ambulance Service Dhaka to Bangkok" ended up in the
  //    same sentence as "Home Services" from the navigation — and "Services"
  //    satisfied the \s+(?:leading|...) quantifier in MULTI_HOSPITAL_SET_RE.
  //    htmlToUnits() already exists to prevent exactly this.
  //
  // 2. No whitelist skip. COMPARISON_WHITELIST covers pages that legitimately
  //    discuss how Bumrungrad compares with staying in Bangladesh. The
  //    /bangkok-hospitals page carries the owner's corrected statement — "our
  //    own air ambulance coordination and bed-to-bed admission service is
  //    exclusively with Bumrungrad International Hospital" — and downgrading
  //    that page to WARN would silence the site's single most important
  //    compliance sentence. An exclusivity claim is not a comparison.
  const seenUnit = new Set();
  for (const unit of htmlToUnits(html)) {
    if (seenUnit.has(unit)) continue;
    seenUnit.add(unit);
    for (const sentence of splitSentences(unit)) {
      if (!SERVICE_CONTEXT_RE.test(sentence)) continue;
      const mdHit = MULTI_DESTINATION_PATTERNS.find((re) => re.test(sentence));
      const setHit = !mdHit && MULTI_HOSPITAL_SET_RE.test(sentence);
      if (!mdHit && !setHit) continue;
      // Pointing at our own /bangkok-hospitals explainer is not a claim to
      // serve those hospitals; that page argues the opposite.
      if (!mdHit && SELF_PAGE_REFERENCE_RE.test(sentence)) continue;
      findings.push({
        severity: "HARD_FAIL",
        rule: mdHit ? "multi-destination-service-claim" : "multi-hospital-set-claim",
        detail: `Implies service beyond Bumrungrad-only: "${sentence.trim().slice(0, 220)}"`,
      });
    }
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

// Shared render paths + public discovery files. These are not reachable via
// getAllSlugs(), so a separate scan is required.
const SHARED_SURFACES = [
  "components/Header.jsx",
  "components/Footer.jsx",
  "components/Topbar.jsx",
  "components/Fab.jsx",
  "components/MobileCallBar.jsx",
  "components/Analytics.jsx",
  "components/ClientScripts.jsx",
  "app/layout.jsx",
  "app/not-found.jsx",
  "app/sitemap.js",
  "app/robots.js",
  "lib/site.js",
  "lib/markdown-transform.js",
  "lib/markdown-config.js",
  "public/llms.txt",
  "public/ai-sitemap.xml",
  "next.config.mjs",
];

// Bumrungrad mentions in shared surfaces are legitimate and expected (the
// layout description, the footer, the sitemap), so they are recorded but
// never flagged. Only OTHER hospitals are findings here.
// An other-hospital token that appears ONLY inside a URL slug is not a public
// claim that we serve that hospital — it is the pathname of a page that was
// removed for exactly this reason, retained purely so the old URL keeps
// resolving. Confirmed in production: each of these sources answers 308 with
// `Location: /routes` and follows to a 200, so the slug never renders as text.
// These are recorded as INFO so the redirects stay covered by the report
// without inflating the violation count.
const REDIRECT_SOURCE_SLUGS = [
  "/air-ambulance-dhaka-to-chennai-india",
  "/blog/air-ambulance-dhaka-to-chennai-india",
  "/air-ambulance-dhaka-to-delhi-india",
  "/blog/air-ambulance-dhaka-to-delhi-india",
  "/blog/air-ambulance-dhaka-to-india-vellore-chennai-delhi",
  "/air-ambulance-dhaka-to-singapore",
  "/blog/air-ambulance-dhaka-to-singapore",
  "/air-ambulance-dhaka-to-myanmar",
  "/blog/air-ambulance-dhaka-to-myanmar",
];

function isRedirectSourceOnly(line) {
  return REDIRECT_SOURCE_SLUGS.some((slug) => line.includes(slug));
}

// A multi-destination claim is a violation that names NO other hospital, which
// is precisely why it survived earlier audits: every rule below keys off an
// other-hospital token, so phrasing that implies a wider scope than
// Bumrungrad-only passes all of them. "Dhaka to Bangkok and beyond" claims
// destinations we do not serve; "Bangkok hospitals including Bumrungrad"
// claims a partner set. Both state, and neither names, a second hospital.
// This shipped to production in components/Footer.jsx — a file that was
// scanned on every run and reported clean, because no rule could match it.
const MULTI_DESTINATION_PATTERNS = [
  /\band\s+(?:further|beyond|more)\b/i,
  /\bbeyond\s+Bangkok\b/i,
  /\b(?:any|other|various|multiple)\s+Thai\s+(?:hospitals?|clinics?|facilities)\b/i,
  // Singular required on purpose: the compliant form on this site is "the
  // Bangkok hospital" / "a Bangkok hospital" (one facility = Bumrungrad).
  // "Bangkok hospital and cannot fly" is that same singular noun followed by
  // an ordinary conjunction — it is NOT a multi-hospital claim, and matching
  // `hospitals?` here flagged it. Plural only.
  /\bBangkok\s+hospitals\s+(?:including|such as|and)\b/i,
  /\bhospitals?\s+(?:including|such as)\s+[^.?!]{0,80}Bumrungrad/i,
  // \s+ swallows the possessive, so without the lookahead "across Bangkok's
  // hospitals" matches as "across Bangkok" — a possessive is a reference to
  // the city's institutions, not a destination we fly to. A real destination
  // claim names the city outright: "and beyond Bangkok", "across Bangkok".
  // A negative lookahead rejects the possessive in either quote style; an
  // ASCII-only version would miss the curly apostrophe this site uses.
  /\b(?:across|throughout|all(?:\s+over)?)\s+(?:Thailand|Bangkok|South-?East Asia)(?!['\u2019]s\b)/i,
];

// The PLURAL is the violation and the SINGULAR is compliant. This distinction
// is the whole rule. "We transfer the patient to the Bangkok hospital" names
// one facility — that is exactly the Bumrungrad-only wording we want, since
// the site never names the receiving hospital in running prose. "Many Bangkok
// hospitals, including Bumrungrad" asserts a set of destinations and is not.
//
// Each branch is QUANTIFIER-FIRST on purpose. Without a quantifier this
// matched the site's own compliant copy ("Bangkok's hospital landscape",
// "Bangkok's hospitals offer depth") and produced 60+ false positives. A
// violation asserts a SET of alternatives the patient could choose between,
// and that always arrives with a determiner: many/several/other/various/
// multiple/leading/top/major/flagship.
//
// The possessive branch carries its OWN determiner rather than borrowing one
// from the front. Two earlier attempts at this, both wrong in instructive
// ways:
//   1. A bare possessive (no determiner) matched the site's own compliant
//      copy — "Bangkok's hospitals offer depth across exactly the
//      specialties..." — so it had to go.
//   2. Guarding it with a negative lookahead for but/however/although/whereas
//      cannot work here, and not just because those words are rare: this
//      rule is evaluated per SENTENCE (see the splitSentences loop above),
//      and the contrast on this page sits in the NEXT sentence —
//      "…landscape across Bangkok's hospitals; our own air ambulance
//      coordination…is exclusively with Bumrungrad International Hospital."
//      A lookahead anchored at the possessive can only ever see the rest of
//      its own sentence.
// So the discriminant has to live inside the phrase. The possessive form
// asserts a set only when it quantifies the set itself: "Bangkok's MANY
// hospitals", "Bangkok's TOP hospitals". Both apostrophe forms are matched —
// the site mixes ASCII and curly.
const MULTI_HOSPITAL_SET_RE = /\b(?:(?:many|several|multiple|various|other|most|all|leading|major|top|flagship|numerous|nearby)\s+(?:Bangkok|Thai|Thailand)[- ]?(?:based\s+)?(?:hospitals?|clinics?|facilities?)|Bangkok['\u2019]s\s+(?:many|several|multiple|various|other|leading|major|top|flagship|numerous|nearby)\s+hospitals|(?:leading|major|top|flagship|several|many|various|multiple|other)\s+Thai\s+hospitals)\b/i;

// Only decisive in a first-person service sentence. Deliberately narrow: the
// earlier broad form matched "admission"/"receiving"/"we" in almost every
// paragraph on the site, which is what turned a quiet check into 62 hits.
const SERVICE_CONTEXT_RE =
  /\b(?:we|our|us)\b[^.?!]{0,90}\b(?:transfer(?:s|red)?|coordinate(?:s|d)?|arrange(?:s|d)?|admit(?:s|ted)?|partner(?:s|ed)?|operate(?:s|d)?|serve(?:s|d)?|work(?:ing)?\s+with|send(?:s)?\s+(?:patients?|the\s+patient))\b|\b(?:air\s+ambulance|medical\s+flight|bed-to-bed)\b[^.?!]{0,60}\b(?:to|for|into)\b/i;

// A sentence that only points at our own explanatory page about the
// exclusivity is not a claim about serving other hospitals.
const SELF_PAGE_REFERENCE_RE =
  /\b(?:our\s+)?(?:Bangkok\s+hospitals\s+page|Bangkok\s+hospitals\s+guide|Bangkok\s+hospitals\s+transfer\s+page|guide\s+to\s+Bangkok\s+hospitals)\b/i;

function scanSharedSurfaces() {
  const out = [];
  for (const rel of SHARED_SURFACES) {
    const file = path.join(ROOT, rel);
    if (!fs.existsSync(file)) continue;
    const src = fs.readFileSync(file, "utf8");
    // Strip JSX/HTML comments and string-free noise minimally; we only need
    // line-level context to report a hit.
    const lines = src.split("\n");
    lines.forEach((line, i) => {
      // Shared surfaces are line-level and JSX has no sentence boundaries, so
      // strip comment markers before testing to avoid matching prose that
      // explains the rule itself.
      const code = line.replace(/^\s*\{?\/\*|\*\/\}?\s*$|^\s*\/\/\s*/g, "");

      // Multi-destination phrasing. This must be checked BEFORE the
      // other-hospital branch and must not return early on it, because a
      // single line can contain both a Bumrungrad mention (harmless, and
      // skipped by the name branch below) and a destination claim (harmful).
      for (const re of MULTI_DESTINATION_PATTERNS) {
        if (!re.test(code)) continue;
        out.push({
          severity: "HARD_FAIL",
          rule: "multi-destination-in-shared-surface",
          detail: `${rel}:${i + 1} claims service beyond Bumrungrad-only across every route: "${code.trim().slice(0, 180)}"`,
        });
        break;
      }

      const hospitalHit =
        OTHER_HOSPITALS.find((h) => line.toLowerCase().includes(h.toLowerCase())) ||
        CASE_SENSITIVE_HOSPITALS.find((h) => line.includes(h)) ||
        findAbbreviation(line);
      if (!hospitalHit) return;
      if (EXEMPT_SENTENCE_PATTERNS.some((re) => re.test(line))) return;
      // Redirect sources are logged as INFO, not violations: the token lives
      // in a pathname that 308s to /routes and never renders as page text.
      if (isRedirectSourceOnly(line)) {
        out.push({
          severity: "INFO",
          rule: "redirect-source-mention",
          detail: `${rel}:${i + 1} mentions "${hospitalHit}" only as a redirect source path (308 → /routes, never rendered as text): "${line.trim().slice(0, 180)}"`,
        });
        return;
      }
      out.push({
        severity: "HARD_FAIL",
        rule: "other-hospital-in-shared-surface",
        detail: `${rel}:${i + 1} names "${hospitalHit}" in a component/discovery file rendered across every route: "${line.trim().slice(0, 180)}"`,
      });
    });
  }
  return out;
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
  // Shared surfaces are site-wide, so they carry no single URL — report them
  // under a stable synthetic label that makes the scope obvious.
  for (const f of scanSharedSurfaces()) allFindings.push({ url: "[shared]", ...f });
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

  // Shared-surface findings are aggregated separately from per-URL results
  // because they are published on every route rather than one page. They must
  // still be printed and persisted — otherwise the counts above are non-zero
  // while the report shows no findings at all (a silent, non-actionable run).
  const sharedFindings = allFindings.filter((f) => f.url === "[shared]");
  if (sharedFindings.length) {
    console.log(`[shared] — rendered across every one of the ${results.length} routes:`);
    for (const f of sharedFindings) {
      console.log(`  [${f.severity}] ${f.rule}: ${f.detail}`);
    }
    console.log("");
  }

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
        sharedFindings,
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
