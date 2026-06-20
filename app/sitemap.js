import { SITE } from "@/lib/site";

export default function sitemap() {
  const now = new Date().toISOString().split("T")[0];
  const ENTRIES = [
    ["/", "daily", 1.0],
    ["/services", "weekly", 0.9],
    ["/process", "weekly", 0.8],
    ["/routes", "weekly", 0.8],
    ["/air-ambulance-cost", "weekly", 0.9],
    ["/icu-vs-medical-escort", "weekly", 0.8],
    ["/bangkok-hospitals", "weekly", 0.8],
    ["/about", "weekly", 0.7],
    ["/faq", "weekly", 0.8],
    ["/contact", "weekly", 0.9],
    ["/blog", "daily", 0.8],
    ["/blog/what-is-an-air-ambulance", "weekly", 0.7],
    ["/blog/air-ambulance-vs-commercial-medical-flight", "weekly", 0.7],
    ["/blog/emergency-medical-evacuation-dhaka-to-bangkok", "weekly", 0.7],
    ["/blog/why-bangladeshi-patients-choose-bangkok", "weekly", 0.7],
    ["/blog/air-ambulance-for-cardiac-and-critical-patients", "weekly", 0.7],
    ["/blog/medical-repatriation-to-bangladesh", "weekly", 0.7],
    ["/blog/air-ambulance-dhaka-bangkok-bumrungrad-cost", "weekly", 0.7],
    ["/blog/what-to-expect-dhaka-bumrungrad-air-ambulance", "weekly", 0.7],
    ["/cardiac-emergency-transfer", "weekly", 0.8],
    ["/stroke-neurology-evacuation", "weekly", 0.8],
    ["/cancer-treatment-bangkok", "weekly", 0.8],
    ["/trauma-accident-evacuation", "weekly", 0.8],
    ["/insurance-coverage", "weekly", 0.7],
    ["/blog/icu-flight-bangladesh-to-bumrungrad-bangkok", "weekly", 0.7],
    ["/privacy", "monthly", 0.3],
    ["/terms", "monthly", 0.3],
  ];
  return ENTRIES.map(([path, changeFrequency, priority]) => ({
    url: `${SITE.baseUrl}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));
}
