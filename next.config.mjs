import path from "path";

/** @type {import('next').NextConfig} */
const securityHeaders = [
  // HSTS — tell browsers to always use HTTPS. preload flag allows
  // submission to Chromium's HSTS preload list for baked-in protection.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // Block MIME-type sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Prevent clickjacking
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Referrer policy — leak less on cross-origin navigations
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Restrict feature APIs
  { key: "Permissions-Policy", value: "geolocation=(), microphone=(), camera=()" },
  // Content-Security-Policy — allow GA4/GTM, Meta Pixel, WhatsApp, Google Fonts,
  // and inline scripts/styles required by Next.js SSR. 'unsafe-inline' is
  // necessary for next/script inline blocks; hash-based CSP is impractical for
  // dynamically generated JSON-LD and inline analytics snippets.
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net https://static.hotjar.com https://www.gstatic.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https: http:",
      "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net https://api.resend.com https://api.telegram.org https://wa.me https://api.whatsapp.com",
      "frame-src https://www.google.com https://maps.google.com https://www.youtube.com https://www.youtube-nocookie.com",
      "media-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self' https://wa.me https://api.whatsapp.com",
      "upgrade-insecure-requests",
    ].join("; "),
  },
  // Legacy XSS protection for older browsers
  { key: "X-XSS-Protection", value: "1; mode=block" },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  trailingSlash: false,
  outputFileTracingRoot: path.resolve(process.cwd()),
  turbopack: {
    root: path.resolve(process.cwd()),
  },
  async headers() {
    return [
      {
        source: "/assets/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      { source: "/guides", destination: "/blog", permanent: true },
      { source: "/air-ambulance-guide", destination: "/blog", permanent: true },
      { source: "/cost-and-pricing", destination: "/air-ambulance-cost", permanent: true },
      { source: "/medical-support", destination: "/services", permanent: true },
      { source: "/index", destination: "/", permanent: true },
      // Cardiac cannibalization fix: merge the older broad "cardiac & critical"
      // blog into the newer, more detailed cardiac-specific guide.
      {
        source: "/blog/air-ambulance-for-cardiac-and-critical-patients",
        destination: "/blog/air-ambulance-cardiac-patients",
        permanent: true,
      },
      // Expansion-route pages live under /blog/. Google indexed root-path
      // variants (from stale internal links in faq/routes) that 404 despite
      // earning clicks — 301 them to the real blog URLs to preserve equity.
      {
        source: "/air-ambulance-dhaka-to-chennai-india",
        destination: "/blog/air-ambulance-dhaka-to-chennai-india",
        permanent: true,
      },
      {
        source: "/air-ambulance-dhaka-to-delhi-india",
        destination: "/blog/air-ambulance-dhaka-to-delhi-india",
        permanent: true,
      },
      {
        source: "/air-ambulance-dhaka-to-singapore",
        destination: "/blog/air-ambulance-dhaka-to-singapore",
        permanent: true,
      },
      {
        source: "/air-ambulance-dhaka-to-myanmar",
        destination: "/blog/air-ambulance-dhaka-to-myanmar",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
