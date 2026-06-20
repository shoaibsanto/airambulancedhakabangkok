// Moves the author bio box to immediately after the article content —
// i.e. right before the Related Guides section (the single section--soft block) —
// instead of at the very bottom after Related Guides + CTA band. Idempotent.
import fs from "node:fs";
import path from "node:path";

const BLOG = path.join(process.cwd(), "content", "blog");
const AUTHOR_RE = /\n?<section class="section author-section"[\s\S]*?<\/section>/;
const ANCHOR = '<section class="section section--soft">';

let changed = 0;
for (const f of fs.readdirSync(BLOG)) {
  if (!f.endsWith(".html") || f === "index.html") continue;
  const file = path.join(BLOG, f);
  let html = fs.readFileSync(file, "utf8");

  const m = html.match(AUTHOR_RE);
  if (!m) {
    console.log(`${f}: no author-section — skipped`);
    continue;
  }
  const box = m[0].trim();

  // Remove from current location (remove + re-insert is idempotent).
  html = html.replace(AUTHOR_RE, "");

  // Insert right before the Related Guides (section--soft) block.
  const idx = html.indexOf(ANCHOR);
  if (idx === -1) {
    console.log(`${f}: WARNING no section--soft anchor — left at original spot`);
    continue;
  }
  html = html.slice(0, idx) + box + "\n\n" + html.slice(idx);
  fs.writeFileSync(file, html);
  changed++;
  console.log(`${f}: author box moved after content`);
}
console.log(`\nDone: ${changed} blog posts updated.`);
