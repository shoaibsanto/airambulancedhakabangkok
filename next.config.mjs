/** @type {import('next').NextConfig} */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "geolocation=(), microphone=(), camera=()" },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  trailingSlash: false,
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
    ];
  },
};

export default nextConfig;
