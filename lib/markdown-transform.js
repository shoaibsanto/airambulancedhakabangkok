// Shared HTML -> Markdown transform for the AI-crawler Markdown response
// feature. Pure function: takes the already-parsed page ({ meta, body,
// jsonLd } from lib/content.js's parsePage()) plus the page's URL path, and
// returns a Markdown document with YAML frontmatter.
//
// This never touches the rendered HTML page itself — it re-parses the same
// source `body` string that `app/[[...slug]]/page.jsx` injects via
// dangerouslySetInnerHTML, so it is guaranteed to reflect exactly what real
// visitors see, with no separate content path to drift out of sync.
import * as cheerio from "cheerio";
import TurndownService from "turndown";
import { gfm } from "turndown-plugin-gfm";
import { SITE } from "@/lib/site";

const turndownService = new TurndownService({
  headingStyle: "atx",
  hr: "---",
  bulletListMarker: "-",
  codeBlockStyle: "fenced",
  emDelimiter: "_",
});
turndownService.use(gfm);

// Elements/selectors that are noise in a Markdown response, never main
// content. `header`/`nav`/`footer` are already excluded upstream by
// parsePage() (it slices between the shared </header> and <footer>), but
// individual page bodies can still contain inline SVG icons, scripts, and
// accessibility-only or promotional widgets.
const STRIP_SELECTOR = [
  "script",
  "style",
  "noscript",
  "iframe",
  "svg",
  "nav",
  "aside",
  '[aria-hidden="true"]',
  "[data-ai-hide]",
  "[data-nomd]",
  ".cookie",
  ".popup",
  ".modal",
  ".ad",
  ".advertisement",
  ".ic", // FAQ accordion "+"/"-" toggle glyph — decorative, not content
].join(", ");

function resolveUrl(href, base) {
  if (!href) return href;
  if (/^(mailto:|tel:|#)/i.test(href)) return href;
  try {
    return new URL(href, base).toString();
  } catch {
    return href;
  }
}

function yamlString(value) {
  return `"${String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\r?\n/g, " ")}"`;
}

function yamlList(values) {
  return `[${values.map((v) => yamlString(v)).join(", ")}]`;
}

/** Parse the page's raw JSON-LD block strings into the shapes we care about. */
function extractStructuredData(jsonLd = []) {
  const result = { breadcrumb: null, articlePublished: null, articleModified: null, author: null, faq: null };
  for (const raw of jsonLd) {
    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      continue; // malformed JSON-LD is the source validator's problem, not ours
    }
    const nodes = Array.isArray(data?.["@graph"]) ? data["@graph"] : [data];
    for (const node of nodes) {
      if (!node || typeof node !== "object") continue;
      const type = node["@type"];
      if (type === "BreadcrumbList" && !result.breadcrumb) {
        result.breadcrumb = (node.itemListElement || [])
          .slice()
          .sort((a, b) => (a.position || 0) - (b.position || 0))
          .map((item) => item.name)
          .filter(Boolean);
      } else if ((type === "BlogPosting" || type === "Article" || type === "NewsArticle") && !result.articlePublished) {
        result.articlePublished = node.datePublished || null;
        result.articleModified = node.dateModified || null;
        if (node.author?.name) result.author = node.author.name;
      } else if ((type === "Person" || type === "Organization") && !result.author) {
        result.author = node.name || null;
      } else if (type === "FAQPage" && !result.faq) {
        result.faq = (node.mainEntity || [])
          .map((q) => ({ question: q.name, answer: q.acceptedAnswer?.text }))
          .filter((qa) => qa.question && qa.answer);
      }
    }
  }
  return result;
}

/**
 * @param {{ meta: object, body: string, jsonLd: string[] }} page - result of lib/content.js parsePage()
 * @param {string} urlPath - site-relative path, e.g. "/" or "/blog/some-post"
 * @returns {string} Markdown document with YAML frontmatter
 */
export function pageToMarkdown(page, urlPath) {
  const { meta, body, jsonLd } = page;
  const canonical = meta.canonical || SITE.baseUrl + urlPath;
  const structured = extractStructuredData(jsonLd);

  const $ = cheerio.load(`<div id="ai-md-root">${body}</div>`);
  $(STRIP_SELECTOR).remove();

  $("a[href]").each((_, el) => {
    const $el = $(el);
    $el.attr("href", resolveUrl($el.attr("href"), canonical));
  });
  $("img").each((_, el) => {
    const $el = $(el);
    const alt = ($el.attr("alt") || "").trim();
    if (!alt) {
      $el.remove(); // decorative image with no meaningful alt text
      return;
    }
    const src = $el.attr("src");
    if (src) $el.attr("src", resolveUrl(src, canonical));
  });

  const hasOwnHeading = $("#ai-md-root > *").is("h1") || $("#ai-md-root h1").length > 0;
  const contentHtml = $("#ai-md-root").html() || "";
  const markdownBody = turndownService.turndown(contentHtml).trim();

  const frontmatter = ["---"];
  frontmatter.push(`title: ${yamlString(meta.title)}`);
  if (meta.description) frontmatter.push(`description: ${yamlString(meta.description)}`);
  frontmatter.push(`canonical: ${yamlString(canonical)}`);
  if (structured.breadcrumb && structured.breadcrumb.length) {
    frontmatter.push(`breadcrumb: ${yamlList(structured.breadcrumb)}`);
  }
  const author = structured.author;
  if (author) frontmatter.push(`author: ${yamlString(author)}`);
  const published = structured.articlePublished || meta.articlePublished;
  if (published) frontmatter.push(`published: ${yamlString(published)}`);
  const updated = structured.articleModified || meta.articleModified;
  if (updated) frontmatter.push(`updated: ${yamlString(updated)}`);
  if (meta.keywords) {
    const tags = meta.keywords.split(",").map((t) => t.trim()).filter(Boolean);
    if (tags.length) frontmatter.push(`tags: ${yamlList(tags)}`);
  }
  frontmatter.push("---");

  const sections = [frontmatter.join("\n"), ""];
  if (!hasOwnHeading) sections.push(`# ${meta.title}`, "");
  sections.push(markdownBody);

  if (structured.faq && structured.faq.length) {
    sections.push("", "## FAQs");
    for (const { question, answer } of structured.faq) {
      sections.push("", `**Q: ${question}**`, `A: ${answer}`);
    }
  }

  return sections.join("\n").trim() + "\n";
}
