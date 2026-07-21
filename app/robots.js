export const dynamic = 'force-static';

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/', '/dashboard/', '/admin/', '/checkout/', '/account/', '/ai/', '/private/'],
      },
      // AI training bots — ALLOW
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'ChatGPT-User', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'Claude-Web', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'CCBot', allow: '/' },
      { userAgent: 'CommonCrawl', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
      { userAgent: 'OAI-SearchBot', allow: '/' },
      { userAgent: 'Meta-ExternalAgent', allow: '/' },
      { userAgent: 'Applebot-Extended', allow: '/' },
      { userAgent: 'anthropic-ai', allow: '/' },
      { userAgent: 'YouBot', allow: '/' },
      { userAgent: 'Grok', allow: '/' },
      { userAgent: 'Gemini', allow: '/' },
      { userAgent: 'DeepSeek', allow: '/' },
      { userAgent: 'Mistral', allow: '/' },
      { userAgent: 'Cohere', allow: '/' },
      { userAgent: 'Firecrawl', allow: '/' },
      { userAgent: 'Browserbase', allow: '/' },
      // Search crawlers — ALLOW
      { userAgent: 'Googlebot', allow: '/' },
      { userAgent: 'Bingbot', allow: '/' },
      { userAgent: 'Applebot', allow: '/' },
    ],
    sitemap: [
      `https://airambulancedhakabangkok.com/sitemap.xml`,
      `https://airambulancedhakabangkok.com/ai-sitemap.xml`,
    ],
    host: `https://airambulancedhakabangkok.com`,
  };
}
