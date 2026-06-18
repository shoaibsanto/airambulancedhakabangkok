import { SITE } from "@/lib/site";

const LASTMOD = "2026-06-18";

// Mirrors the original sitemap.xml (path, changefreq, priority).
const ENTRIES = [
  ["/", "weekly", 1.0],
  ["/services", "monthly", 0.9],
  ["/process", "monthly", 0.8],
  ["/routes", "monthly", 0.8],
  ["/air-ambulance-cost", "monthly", 0.9],
  ["/icu-vs-medical-escort", "monthly", 0.8],
  ["/bangkok-hospitals", "monthly", 0.8],
  ["/about", "monthly", 0.7],
  ["/faq", "monthly", 0.8],
  ["/contact", "monthly", 0.9],
  ["/blog", "weekly", 0.8],
  ["/blog/what-is-an-air-ambulance", "monthly", 0.7],
  ["/blog/air-ambulance-vs-commercial-medical-flight", "monthly", 0.7],
  ["/blog/emergency-medical-evacuation-dhaka-to-bangkok", "monthly", 0.7],
  ["/blog/why-bangladeshi-patients-choose-bangkok", "monthly", 0.7],
  ["/blog/air-ambulance-for-cardiac-and-critical-patients", "monthly", 0.7],
  ["/blog/medical-repatriation-to-bangladesh", "monthly", 0.7],
  ["/blog/air-ambulance-dhaka-bangkok-bumrungrad-cost", "monthly", 0.7],
  ["/cardiac-emergency-transfer", "monthly", 0.8],
  ["/stroke-neurology-evacuation", "monthly", 0.8],
  ["/cancer-treatment-bangkok", "monthly", 0.8],
  ["/trauma-accident-evacuation", "monthly", 0.8],
  ["/insurance-coverage", "monthly", 0.7],
];

export default function sitemap() {
  return ENTRIES.map(([path, changeFrequency, priority]) => ({
    url: `${SITE.baseUrl}${path}`,
    lastModified: LASTMOD,
    changeFrequency,
    priority,
  }));
}
