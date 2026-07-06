// One-off: compress + generate responsive WebP variants for the award images.
// Source JPEGs live in scripts/award-src/, output goes to public/images/awards/.
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const SRC = path.join(process.cwd(), "scripts", "award-src");
const OUT = path.join(process.cwd(), "public", "images", "awards");
fs.mkdirSync(OUT, { recursive: true });

// src file (in award-src) -> SEO slug (no year numbers per project rule)
const MAP = [
  ["src-01.jpg", "best-campaign-award-bumrungrad-surecell-medical-trophies-certificate"],
  ["src-02.jpg", "best-campaign-award-bumrungrad-surecell-medical-desk"],
  ["src-03.jpg", "best-campaign-award-bumrungrad-surecell-medical-trophies"],
  ["src-04.jpg", "best-campaign-award-bumrungrad-trophy-closeup"],
  ["src-05.jpg", "best-brand-development-award-bumrungrad-surecell-medical-certificate"],
  ["src-06.jpg", "best-brand-development-award-bumrungrad-surecell-medical-trophies"],
  ["src-07.jpg", "best-performance-award-bumrungrad-surecell-medical-certificate"],
  ["src-08.jpg", "best-performance-award-bumrungrad-surecell-medical-trophies"],
  ["src-09.jpg", "best-performance-award-bumrungrad-surecell-medical-certificate-closeup"],
  ["src-10.jpg", "nusrat-mahbub-borney-bumrungrad-bangladesh-excellence-healthcare-client-relations"],
  ["src-11.jpg", "best-brand-development-award-bumrungrad-surecell-medical-thai-medi-xpress"],
  ["src-12.jpg", "best-campaign-award-bumrungrad-surecell-medical-thai-medi-xpress"],
];

const WIDTHS = [400, 800, 1200, 1600];

const results = [];
for (const [srcName, slug] of MAP) {
  const srcPath = path.join(SRC, srcName);
  const meta = await sharp(srcPath).metadata();
  const made = [];
  for (const w of WIDTHS) {
    // withoutEnlargement: never upscale beyond the source width
    const target = Math.min(w, meta.width);
    const out = path.join(OUT, `${slug}-${w}.webp`);
    await sharp(srcPath)
      .resize({ width: target, withoutEnlargement: true })
      .webp({ quality: 80, effort: 6 })
      .toFile(out);
    made.push(`${w}:${fs.statSync(out).size}`);
  }
  // Base .webp used as the <img src> — ~1000px cap, good default.
  const base = path.join(OUT, `${slug}.webp`);
  await sharp(srcPath)
    .resize({ width: Math.min(1000, meta.width), withoutEnlargement: true })
    .webp({ quality: 80, effort: 6 })
    .toFile(base);
  results.push({ slug, w: meta.width, h: meta.height, base: fs.statSync(base).size, made });
}

for (const r of results) {
  console.log(`${r.slug}  (${r.w}x${r.h})  base=${(r.base / 1024).toFixed(0)}KB  ${r.made.join(" ")}`);
}
console.log(`\nDone: ${results.length} images -> ${OUT}`);
