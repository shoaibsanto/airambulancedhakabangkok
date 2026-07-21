// Single source of truth for the AI-crawler Markdown response feature.
// Everything tunable about the feature lives in this one file so it stays a
// one-file edit to extend (new crawler UAs, new denylisted paths, etc.).

// Rollback switch: set AI_MARKDOWN_ENABLED=false in the environment to turn
// the entire feature off (middleware + route both no-op) without touching
// any other file or redeploying a revert.
export const AI_MARKDOWN_ENABLED = process.env.AI_MARKDOWN_ENABLED !== "false";

// User-Agent substrings (case-insensitive) that should receive the Markdown
// response automatically, even without an explicit Accept header or query
// param. Add new crawlers here — one line each.
export const AI_CRAWLER_USER_AGENTS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "CCBot",
  "Bytespider",
  "Diffbot",
  "cohere-ai",
  "YouBot",
  "Meta-ExternalAgent",
  "Applebot-Extended",
  "Amazonbot",
  "DuckAssistBot",
  "Firecrawl",
  "Browserbase",
];

// Path prefixes that must NEVER receive a Markdown response, regardless of
// how many detection signals match. This is an opt-out list (not opt-in) so
// every other current and future public page gets Markdown automatically
// with zero per-page configuration.
export const MARKDOWN_DENYLIST_PREFIXES = [
  "/admin",
  "/dashboard",
  "/account",
  "/login",
  "/signup",
  "/checkout",
  "/cart",
  "/api",
  "/_next",
  "/preview",
  "/draft",
  "/ai-markdown", // internal rewrite target — never re-enter through itself
];

// Cookie names that, if present, indicate an authenticated session. Requests
// carrying any of these always fall through to normal HTML/auth handling,
// regardless of Accept header, query param, or User-Agent.
export const SESSION_COOKIE_NAMES = [
  "session",
  "next-auth.session-token",
  "__session",
  "auth_token",
];
