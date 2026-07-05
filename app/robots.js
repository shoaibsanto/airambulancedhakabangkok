import { SITE } from "@/lib/site";

export default function robots() {
  return {
    rules: [
      // All crawlers — allow everything except internal routes
      { userAgent: "*", allow: "/", disallow: ["/api/"] },

      // ─── AI TRAINING bots — ALLOW (opened for AI training presence) ───
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "CCBot", allow: "/" },
      { userAgent: "Amazonbot", allow: "/" },
      { userAgent: "Bytespider", allow: "/" },
      { userAgent: "Diffbot", allow: "/" },
      { userAgent: "FacebookBot", allow: "/" },
      { userAgent: "Meta-ExternalAgent", allow: "/" },
      { userAgent: "ia_archiver", allow: "/" },

      // ─── TRAINING-ONLY extensions — ALLOW ───
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "Applebot-Extended", allow: "/" },

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
      { userAgent: "Googlebot", allow: "/" },
      { userAgent: "Bingbot", allow: "/" },
      { userAgent: "Applebot", allow: "/" },
      { userAgent: "GoogleOther", allow: "/" },
    ],
    sitemap: `${SITE.baseUrl}/sitemap.xml`,
    host: SITE.baseUrl,
  };
}
