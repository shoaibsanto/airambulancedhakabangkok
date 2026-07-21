// Detects requests that should receive the Markdown response instead of the
// normal HTML page, and rewrites them internally to the dedicated
// app/ai-markdown/[[...slug]]/route.js handler. Normal HTML visitors are
// completely unaffected — they hit NextResponse.next() immediately and take
// the exact same rendering path they always did.
//
// Next.js 16 renamed the `middleware.js` file convention to `proxy.js`
// (exporting a `proxy` function instead of `middleware`) — this file follows
// the current convention.
import { NextResponse } from "next/server";
import {
  AI_MARKDOWN_ENABLED,
  AI_CRAWLER_USER_AGENTS,
  MARKDOWN_DENYLIST_PREFIXES,
  SESSION_COOKIE_NAMES,
} from "@/lib/markdown-config";

export const config = {
  // Run on every route except static assets, _next internals, the API
  // routes, and the internal markdown route itself. Individual denylisted
  // paths (admin/checkout/etc.) are still re-checked inside the function
  // below as defense in depth.
  matcher: ["/((?!_next/static|_next/image|ai-markdown|api|favicon\\.ico).*)"],
};

const STATIC_ASSET_RE = /\.(?:svg|png|jpe?g|gif|webp|avif|ico|css|js|mjs|txt|xml|json|woff2?|ttf|otf|map|pdf)$/i;

function isDenylisted(pathname) {
  return MARKDOWN_DENYLIST_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

function hasSessionCookie(request) {
  return SESSION_COOKIE_NAMES.some((name) => request.cookies.has(name));
}

function matchesAiCrawlerUA(userAgent) {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return AI_CRAWLER_USER_AGENTS.some((needle) => ua.includes(needle.toLowerCase()));
}

// Accept-header negotiation: text/markdown or text/plain qualifies unless
// text/html is explicitly requested with a strictly higher q-value.
function wantsMarkdownByAccept(acceptHeader) {
  if (!acceptHeader) return false;
  let htmlQ = -1;
  let mdQ = -1;
  for (const entry of acceptHeader.split(",")) {
    const parts = entry.split(";").map((s) => s.trim());
    const type = parts[0];
    const qParam = parts.find((p) => p.startsWith("q="));
    const q = qParam ? parseFloat(qParam.slice(2)) : 1;
    if (type === "text/html") htmlQ = Math.max(htmlQ, Number.isNaN(q) ? 1 : q);
    if (type === "text/markdown" || type === "text/plain") mdQ = Math.max(mdQ, Number.isNaN(q) ? 1 : q);
  }
  if (mdQ < 0) return false;
  if (htmlQ < 0) return true;
  return mdQ >= htmlQ;
}

export function proxy(request) {
  if (!AI_MARKDOWN_ENABLED) return NextResponse.next();

  const { pathname, searchParams } = request.nextUrl;

  if (STATIC_ASSET_RE.test(pathname)) return NextResponse.next();
  if (isDenylisted(pathname)) return NextResponse.next();
  // Any authenticated-looking request always gets normal HTML/auth handling,
  // regardless of Accept header, query param, or User-Agent.
  if (hasSessionCookie(request)) return NextResponse.next();

  let targetPath = pathname;
  let wantsMarkdown = false;

  if (pathname !== "/" && pathname.endsWith(".md")) {
    targetPath = pathname.slice(0, -3) || "/";
    wantsMarkdown = true;
  } else if (searchParams.get("format") === "markdown") {
    wantsMarkdown = true;
  } else if (wantsMarkdownByAccept(request.headers.get("accept"))) {
    wantsMarkdown = true;
  } else if (matchesAiCrawlerUA(request.headers.get("user-agent"))) {
    wantsMarkdown = true;
  }

  if (!wantsMarkdown) return NextResponse.next();
  // Re-check the denylist against the resolved target path — relevant for
  // the `.md` suffix form, where stripping the suffix can change the path.
  if (isDenylisted(targetPath)) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = targetPath === "/" ? "/ai-markdown" : `/ai-markdown${targetPath}`;
  url.search = "";
  return NextResponse.rewrite(url);
}
