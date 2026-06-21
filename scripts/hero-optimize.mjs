import sharp from "sharp";
import path from "node:path";
const SRC = path.join(process.cwd(), "scripts", "raw", "hero-src.jpg");
const OUT = path.join(process.cwd(), "public", "images");
const base = "hero-air-ambulance-dhaka-bangkok";
const widths = [480, 800, 1200, 1600];
const meta = await sharp(SRC).metadata();
console.log(`source: ${meta.width}x${meta.height}`);
for (const w of widths) {
  const f = path.join(OUT, `${base}-${w}.webp`);
  const info = await sharp(SRC)
    .rotate()
    .resize({ width: w, withoutEnlargement: true })
    .webp({ quality: 82, effort: 5 })
    .toFile(f);
  console.log(`${base}-${w}.webp -> ${info.width}x${info.height} ${(info.size/1024).toFixed(0)}KB`);
}
// default base (= 1200w)
await sharp(SRC).rotate().resize({ width: 1200, withoutEnlargement: true }).webp({ quality: 82, effort: 5 }).toFile(path.join(OUT, `${base}.webp`));
console.log("done");
