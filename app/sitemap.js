import { promises as fs } from "fs";
import path from "path";
import { SITE } from "@/lib/site";

export default async function sitemap() {
  const projectRoot = process.cwd();

  // Map URL paths to the underlying content/*.html source files so we can
  // derive an honest lastModified date from file mtimes instead of the
  // current date. Hardcoded "today" makes every URL look freshly edited
  // (and dilutes the signal for static pages like /privacy and /terms).
  const SOURCE_FOR_PATH = {
    "/": "content/index.html",
    "/services": "content/services.html",
    "/process": "content/process.html",
    "/routes": "content/routes.html",
    "/air-ambulance-cost": "content/air-ambulance-cost.html",
    "/icu-vs-medical-escort": "content/icu-vs-medical-escort.html",
    "/bangkok-hospitals": "content/bangkok-hospitals.html",
    "/about": "content/about.html",
    "/faq": "content/faq.html",
    "/contact": "content/contact.html",
    "/blog": "content/blog/index.html",
    "/cardiac-emergency-transfer": "content/cardiac-emergency-transfer.html",
    "/stroke-neurology-evacuation": "content/stroke-neurology-evacuation.html",
    "/cancer-treatment-bangkok": "content/cancer-treatment-bangkok.html",
    "/trauma-accident-evacuation": "content/trauma-accident-evacuation.html",
    "/insurance-coverage": "content/insurance-coverage.html",
    "/privacy": "content/privacy.html",
    "/terms": "content/terms.html",
    "/author/tawhid-iqbal": "content/author/tawhid-iqbal.html",
  };

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
    ["/blog/air-ambulance-insurance-payment-dhaka-bumrungrad", "weekly", 0.7],
    ["/blog/bangkok-hospital-admission-bangladeshi-patients", "weekly", 0.7],
    ["/author/tawhid-iqbal", "monthly", 0.5],
    ["/privacy", "monthly", 0.3],
    ["/terms", "monthly", 0.3],
  ];

  // Pre-compute mtimes in one pass so a missing file falls back gracefully.
  const mtimeCache = new Map();
  for (const rel of new Set(Object.values(SOURCE_FOR_PATH))) {
    try {
      const stat = await fs.stat(path.join(projectRoot, rel));
      mtimeCache.set(rel, stat.mtime);
    } catch {
      // Source file missing — sitemap will fall back to today's date.
    }
  }

  const fallback = new Date();

  return ENTRIES.map(([urlPath, changeFrequency, priority]) => {
    const sourcePath = SOURCE_FOR_PATH[urlPath];
    let lastModified = fallback;
    if (sourcePath) {
      const direct = mtimeCache.get(sourcePath);
      if (direct) {
        lastModified = direct;
      } else if (urlPath.startsWith("/blog/")) {
        // Blog posts share content/blog/ — use the directory's mtime as
        // a reasonable proxy so a freshly-edited post still shows "today".
        try {
          const dirStat = require("fs").statSync(
            path.join(projectRoot, "content/blog")
          );
          lastModified = dirStat.mtime;
        } catch {
          /* keep fallback */
        }
      }
    }
    return {
      url: `${SITE.baseUrl}${urlPath}`,
      lastModified,
      changeFrequency,
      priority,
    };
  });
}