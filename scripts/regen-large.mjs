// Re-downloads the 8 displayed gallery sources and emits a 1600w "full" WebP
// for the lightbox (large view). Source IDs come from image-manifest.js order.
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import sharp from "sharp";
import { GALLERY_IMAGES } from "../image-manifest.js";

const OUT = path.join(process.cwd(), "public", "images", "gallery");
const TMP = path.join(process.cwd(), "scripts", "tmp-large");
fs.mkdirSync(TMP, { recursive: true });

// gallery-NN (1-based) -> manifest index NN-1
const NUMS = [1, 15, 20, 22, 30, 36, 43, 47];

for (const nn of NUMS) {
  const id = GALLERY_IMAGES[nn - 1];
  const pad = String(nn).padStart(2, "0");
  const bin = path.join(TMP, `${pad}.bin`);
  execSync(
    `curl -sL "https://drive.google.com/uc?export=download&id=${id}" -o "${bin}"`,
    { stdio: "ignore" }
  );
  await sharp(bin)
    .rotate()
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(path.join(OUT, `gallery-${pad}-1600.webp`));
  const sz = fs.statSync(path.join(OUT, `gallery-${pad}-1600.webp`)).size;
  console.log(`gallery-${pad}-1600.webp  ${Math.round(sz / 1024)}KB`);
}
fs.rmSync(TMP, { recursive: true, force: true });
console.log("done");
