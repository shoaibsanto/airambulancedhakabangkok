// Converts downloaded raw JPEGs (scripts/raw/img-NN.bin) into optimized,
// responsive WebP variants under public/images/gallery/.
// For each source: gallery-NN.webp (1200w base) + -400 / -800 / -1200 widths.
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const RAW = path.join(process.cwd(), "scripts", "raw");
const OUT = path.join(process.cwd(), "public", "images", "gallery");
fs.mkdirSync(OUT, { recursive: true });

const WIDTHS = [400, 800, 1200];

const files = fs
  .readdirSync(RAW)
  .filter((f) => /^img-\d+\.bin$/.test(f))
  .sort();

let ok = 0;
for (const file of files) {
  const n = file.match(/(\d+)/)[1];
  const src = path.join(RAW, file);
  const base = `gallery-${n}`;
  try {
    // verify it's a real image (Drive sometimes returns HTML on failure)
    const meta = await sharp(src).metadata();
    if (!meta.width) throw new Error("no dimensions");
    for (const w of WIDTHS) {
      await sharp(src)
        .rotate() // honor EXIF orientation
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(path.join(OUT, `${base}-${w}.webp`));
    }
    // default src = 800w copy
    fs.copyFileSync(path.join(OUT, `${base}-800.webp`), path.join(OUT, `${base}.webp`));
    ok++;
    process.stdout.write(`${base} (${meta.width}x${meta.height}) ✓\n`);
  } catch (e) {
    process.stdout.write(`${base} FAILED: ${e.message}\n`);
  }
}
console.log(`\nDone: ${ok}/${files.length} images converted to WebP.`);
