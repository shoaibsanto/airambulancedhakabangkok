// Surgically removes corrupted stub lines from the <head> of each content file.
// Preserves <title>, the real description meta, valid <link>s, and ALL JSON-LD.
// The head is discarded at render time (Next generates the real head), so this is
// pure source hygiene — it must not alter title/description, which the parser reads.
import fs from "node:fs";
import path from "node:path";

const dirs = ["content", "content/blog"];
const files = [];
for (const d of dirs) {
  const full = path.join(process.cwd(), d);
  if (!fs.existsSync(full)) continue;
  for (const f of fs.readdirSync(full)) {
    if (f.endsWith(".html")) files.push(path.join(full, f));
  }
}

function isBroken(line) {
  const t = line.trim();
  if (t === "") return false;
  // empty-value self-closing stub: <meta name=" />, <link rel=" />, etc.
  if (/=["']\s*\/>/.test(t)) return true;
  // stray text fragment: doesn't open with '<' but ends with '/>'
  if (!t.startsWith("<") && /\/>\s*$/.test(t)) return true;
  return false;
}

let changed = 0;
for (const file of files) {
  const html = fs.readFileSync(file, "utf8");
  const hs = html.indexOf("<head>");
  // Use the LAST </head> — some files contain the literal "</head>" inside an
  // HTML comment, which would otherwise truncate the cleaned region early.
  const he = html.lastIndexOf("</head>");
  if (hs === -1 || he === -1) continue;

  const before = html.slice(0, hs + "<head>".length);
  const head = html.slice(hs + "<head>".length, he);
  const after = html.slice(he);

  const lines = head.split("\n");
  const kept = lines.filter((l) => !isBroken(l));
  // ensure a clean charset + viewport lead the head (real ones were stubs)
  const hasCharset = kept.some((l) => /<meta\s+charset/i.test(l));
  const hasViewport = kept.some((l) => /name=["']viewport["']/i.test(l));
  const lead = [];
  if (!hasCharset) lead.push('<meta charset="utf-8" />');
  if (!hasViewport) lead.push('<meta name="viewport" content="width=device-width, initial-scale=1" />');

  const removed = lines.length - kept.length;
  if (removed === 0 && lead.length === 0) continue;

  const newHead = "\n" + [...lead, ...kept.map((l) => l).filter((l, i, a) => !(l.trim() === "" && a[i - 1]?.trim() === ""))].join("\n");
  fs.writeFileSync(file, before + newHead + after);
  changed++;
  console.log(`${path.relative(process.cwd(), file)}: removed ${removed} broken line(s)`);
}
console.log(`\nCleaned ${changed} files.`);
