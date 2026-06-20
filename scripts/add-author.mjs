// Adds Tawhid Iqbal as the visible author bio + BlogPosting Person author on
// every blog post. Idempotent: skips files that already have the author box.
import fs from "node:fs";
import path from "node:path";

const BLOG = path.join(process.cwd(), "content", "blog");

const PERSON =
  '"author":{"@type":"Person","name":"Tawhid Iqbal",' +
  '"url":"https://www.linkedin.com/in/tawhid-iqbal/",' +
  '"sameAs":["https://www.linkedin.com/in/tawhid-iqbal/"],' +
  '"email":"tawhidiqbal@gmail.com",' +
  '"jobTitle":"Air Ambulance & Medical Travel Coordinator",' +
  '"worksFor":{"@type":"Organization","name":"Air Ambulance Dhaka to Bangkok"}}';

// Visible author box — matches the requested screenshot layout.
const BOX = `<section class="section author-section" aria-label="About the author"><div class="container"><div class="author-box"><img class="author-avatar" src="/images/author/tawhid-iqbal.webp" srcset="/images/author/tawhid-iqbal-160.webp 160w, /images/author/tawhid-iqbal-320.webp 320w" sizes="96px" width="96" height="96" loading="lazy" alt="Tawhid Iqbal — author and air ambulance coordinator, Dhaka to Bangkok" /><div class="author-meta"><span class="author-name">Tawhid Iqbal</span><ul class="author-details"><li>Email: <a href="mailto:tawhidiqbal@gmail.com">tawhidiqbal@gmail.com</a></li><li>Address: Gulshan 1, Dhaka</li><li>Name: Tawhid Iqbal</li><li>Phone number: <a href="tel:+8801881245953">+880 1881-245953</a></li></ul><a class="author-linkedin" href="https://www.linkedin.com/in/tawhid-iqbal/" target="_blank" rel="noopener author" aria-label="Tawhid Iqbal on LinkedIn"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V24h-4V8zm7.5 0h3.77v2.18h.05c.525-.996 1.81-2.05 3.725-2.05 3.985 0 4.72 2.62 4.72 6.03V24h-4v-6.66c0-1.59-.03-3.63-2.21-3.63-2.215 0-2.555 1.73-2.555 3.515V24h-4V8z"/></svg></a></div></div></div></section>\n`;

// Match the Organization author object regardless of whitespace.
const AUTHOR_RE =
  /"author":\s*\{\s*"@type":\s*"Organization",\s*"name":\s*"Air Ambulance Dhaka to Bangkok"\s*\}/;

let changed = 0;
for (const f of fs.readdirSync(BLOG)) {
  if (!f.endsWith(".html") || f === "index.html") continue;
  const file = path.join(BLOG, f);
  let html = fs.readFileSync(file, "utf8");
  if (html.includes("author-box")) {
    console.log(`${f}: already has author box — skipped`);
    continue;
  }
  let touched = false;

  if (AUTHOR_RE.test(html)) {
    html = html.replace(AUTHOR_RE, PERSON);
    touched = true;
  } else {
    console.log(`${f}: WARNING author pattern not found`);
  }

  const footerIdx = html.indexOf('<footer class="footer">');
  if (footerIdx !== -1) {
    html = html.slice(0, footerIdx) + BOX + html.slice(footerIdx);
    touched = true;
  } else {
    console.log(`${f}: WARNING no footer anchor`);
  }

  if (touched) {
    fs.writeFileSync(file, html);
    changed++;
    console.log(`${f}: author added`);
  }
}
console.log(`\nDone: ${changed} blog posts updated.`);
