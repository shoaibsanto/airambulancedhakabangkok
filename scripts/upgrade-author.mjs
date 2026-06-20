// Replaces the first-pass author box on every blog post with an upgraded,
// YMYL/E-E-A-T author bio: role, experience-based bio, reviewed-by signal,
// contact, LinkedIn and a link to the dedicated author page. Idempotent.
import fs from "node:fs";
import path from "node:path";

const BLOG = path.join(process.cwd(), "content", "blog");

const NEW_BOX = `<section class="section author-section" aria-label="About the author"><div class="container"><div class="author-box"><img class="author-avatar" src="/images/author/tawhid-iqbal.webp" srcset="/images/author/tawhid-iqbal-160.webp 160w, /images/author/tawhid-iqbal-320.webp 320w" sizes="96px" width="96" height="96" loading="lazy" alt="Tawhid Iqbal — author and air ambulance coordinator, Dhaka to Bangkok" /><div class="author-meta"><span class="author-eyebrow">Written &amp; reviewed by</span><a class="author-name" href="/author/tawhid-iqbal">Tawhid Iqbal</a><span class="author-role">Air Ambulance &amp; Medical-Travel Coordinator · Dhaka</span><p class="author-bio">Tawhid Iqbal helps Bangladeshi families arrange ICU air ambulance transfers, medical escorts and hospital admissions in Bangkok. He writes from hands-on experience coordinating bed-to-bed aeromedical evacuations from Dhaka to Bumrungrad and other Bangkok hospitals.</p><ul class="author-details"><li>Email: <a href="mailto:tawhidiqbal@gmail.com">tawhidiqbal@gmail.com</a></li><li>Address: Gulshan 1, Dhaka</li><li>Phone: <a href="tel:+8801881245953">+880 1881-245953</a></li></ul><div class="author-actions"><a class="author-linkedin" href="https://www.linkedin.com/in/tawhid-iqbal/" target="_blank" rel="noopener author" aria-label="Tawhid Iqbal on LinkedIn"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V24h-4V8zm7.5 0h3.77v2.18h.05c.525-.996 1.81-2.05 3.725-2.05 3.985 0 4.72 2.62 4.72 6.03V24h-4v-6.66c0-1.59-.03-3.63-2.21-3.63-2.215 0-2.555 1.73-2.555 3.515V24h-4V8z"/></svg> LinkedIn</a><a class="author-profile-link" href="/author/tawhid-iqbal">View full profile &rarr;</a></div></div></div><p class="author-disclaimer"><strong>Medically reviewed</strong> by our in-house medical coordination team. This guide is general information about medical transport, not a substitute for professional medical advice — always consult a qualified clinician for diagnosis and treatment.</p></div></section>`;

// Match the existing author-section block (from add-author.mjs), non-greedy.
const OLD_RE = /<section class="section author-section"[\s\S]*?<\/section>/;

let changed = 0;
for (const f of fs.readdirSync(BLOG)) {
  if (!f.endsWith(".html") || f === "index.html") continue;
  const file = path.join(BLOG, f);
  let html = fs.readFileSync(file, "utf8");
  if (!OLD_RE.test(html)) {
    console.log(`${f}: no author-section found — skipped`);
    continue;
  }
  html = html.replace(OLD_RE, NEW_BOX);
  fs.writeFileSync(file, html);
  changed++;
  console.log(`${f}: author box upgraded`);
}
console.log(`\nDone: ${changed} blog posts upgraded.`);
