// Serves the Markdown twin of every public page, reached only via the
// middleware rewrite (or a direct /ai-markdown/* request carrying the same
// public content). It calls the SAME lib/content.js#parsePage() used by
// app/[[...slug]]/page.jsx directly — no HTTP self-fetch, no recursion risk —
// and pipes page.body through the shared transform in lib/markdown-transform.js.
//
// Fully static: this route is prerendered at build time for every known slug
// (mirroring the main catch-all's generateStaticParams/dynamicParams=false),
// so it never needs the `content/` directory to be traced into a runtime
// serverless function, and it is served/cached exactly like a static asset.
import crypto from "node:crypto";
import { getAllSlugs, parsePage } from "@/lib/content";
import { pageToMarkdown } from "@/lib/markdown-transform";
import { AI_MARKDOWN_ENABLED } from "@/lib/markdown-config";

export const dynamicParams = false;
export const dynamic = "force-static";

// Computed once when this module is loaded during the build's static
// generation pass — a stable stand-in for "when this Markdown content was
// last produced" (the underlying `content/*.html` source doesn't carry its
// own per-file modified timestamp). Reading request headers (e.g. to honor
// If-None-Match ourselves) would opt this route out of static rendering, so
// conditional 304 handling is left to the hosting platform's CDN, which
// negotiates it against the ETag below using its own cached copy of this
// static response — the same as it does for every other static asset here.
const BUILD_TIME = new Date().toUTCString();

export function generateStaticParams() {
  if (!AI_MARKDOWN_ENABLED) return [];
  return getAllSlugs().map((slug) => ({ slug: slug.length ? slug : undefined }));
}

function canonicalPath(slug) {
  const parts = Array.isArray(slug) ? slug : [];
  return parts.length ? "/" + parts.join("/") : "/";
}

export async function GET(_request, { params }) {
  if (!AI_MARKDOWN_ENABLED) {
    return new Response("Not Found", { status: 404 });
  }

  const { slug } = await params;
  const page = parsePage(slug);
  if (!page) {
    return new Response("Not Found", { status: 404 });
  }

  const markdown = pageToMarkdown(page, canonicalPath(slug));
  const etag = `"${crypto.createHash("sha256").update(markdown).digest("hex").slice(0, 32)}"`;

  return new Response(markdown, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
      ETag: etag,
      "Last-Modified": BUILD_TIME,
      Vary: "Accept, User-Agent",
    },
  });
}
