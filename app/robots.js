import { SITE } from "@/lib/site";

// AI / answer-engine crawlers explicitly welcomed (AEO / GEO), mirroring robots.txt.
const AI_BOTS = [
  "Googlebot",
  "Bingbot",
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "Amazonbot",
  "Applebot",
  "Applebot-Extended",
  "cohere-ai",
  "Bytespider",
  "CCBot",
  "Mistral",
  "DeepSeek",
  "QwenBot",
  "MetaBot",
  "GoogleOther",
  "ia_archiver",
  "Scoop.it",
];

export default function robots() {
  return {
    rules: [
      // Block dynamic/preview helpers and API endpoints from indexing.
      // (The static OG image lives at /assets/img/og-image.jpg — keep crawlable.)
      { userAgent: "*", allow: "/", disallow: ["/api/"] },
      ...AI_BOTS.map((userAgent) => ({ userAgent, allow: "/" })),
    ],
    sitemap: `${SITE.baseUrl}/sitemap.xml`,
    host: SITE.baseUrl,
  };
}
