import { SITE } from "@/lib/site";

export default function robots() {
  return {
    rules: [
      // All crawlers — allow everything except internal routes
      { userAgent: "*", allow: "/", disallow: ["/api/"] },

      // ─── AI TRAINING bots — BLOCK (pure training, no search impact) ───
      { userAgent: "GPTBot", disallow: "/" },
      { userAgent: "CCBot", disallow: "/" },
      { userAgent: "Amazonbot", disallow: "/" },
      { userAgent: "Bytespider", disallow: "/" },
      { userAgent: "Diffbot", disallow: "/" },
      { userAgent: "FacebookBot", disallow: "/" },
      { userAgent: "Meta-ExternalAgent", disallow: "/" },
      { userAgent: "ia_archiver", disallow: "/" },

      // ─── TRAINING-ONLY extensions — BLOCK (search remains unaffected) ───
      // Google confirmed: Google-Extended disallow has ZERO ranking impact
      { userAgent: "Google-Extended", disallow: "/" },
      // Apple confirmed: Applebot-Extended only affects AI training, not search
      { userAgent: "Applebot-Extended", disallow: "/" },

      // ─── AI SEARCH bots — ALLOW (GEO/AEO visibility) ───
      { userAgent: "OAI-SearchBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Perplexity-User", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "Claude-Web", allow: "/" },
      { userAgent: "anthropic-ai", allow: "/" },
      { userAgent: "cohere-ai", allow: "/" },
      { userAgent: "YouBot", allow: "/" },

      // ─── SEARCH crawlers — ALLOW (critical: never block these) ───
      // Cloudflare Sept 15 2026: dual-purpose bots (search + training).
      // Keep open here; Google-Extended above handles training-only block.
      { userAgent: "Googlebot", allow: "/" },
      { userAgent: "Bingbot", allow: "/" },
      { userAgent: "Applebot", allow: "/" },
      { userAgent: "GoogleOther", allow: "/" },
    ],
    sitemap: `${SITE.baseUrl}/sitemap.xml`,
    host: SITE.baseUrl,
  };
}
