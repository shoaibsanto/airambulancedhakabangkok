import { notFound } from "next/navigation";
import { SITE } from "@/lib/site";
import { getAllSlugs, parsePage } from "@/lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
  // [] (home) must be expressed as { slug: undefined } for an optional catch-all.
  return getAllSlugs().map((slug) => ({ slug: slug.length ? slug : undefined }));
}

function canonicalPath(slug) {
  const parts = Array.isArray(slug) ? slug : [];
  return parts.length ? "/" + parts.join("/") : "/";
}

/** Build BreadcrumbList JSON-LD for the current page path */
function breadcrumbJsonLd(slug) {
  const parts = Array.isArray(slug) ? slug : [];
  const crumbs = [{ name: "Home", path: "/" }];
  let current = "";
  for (const p of parts) {
    current += "/" + p;
    crumbs.push({ name: p.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()), path: current });
  }
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: SITE.baseUrl + c.path,
    })),
  });
}

/**
 * Check whether a JSON-LD block already contains a BreadcrumbList
 * (either as a top-level @type or anywhere inside a @graph array).
 * Used to avoid duplicating BreadcrumbList when the source HTML
 * already provides one.
 */
function blockHasBreadcrumb(block) {
  if (!block) return false;
  try {
    const data = JSON.parse(block);
    if (data["@type"] === "BreadcrumbList") return true;
    if (Array.isArray(data["@graph"])) {
      return data["@graph"].some((n) => n && n["@type"] === "BreadcrumbList");
    }
  } catch (_) {
    /* ignore parse errors — the source validator handles them */
  }
  return false;
}

export async function generateMetadata({ params }) {
  const { slug = [] } = await params;
  const page = parsePage(slug);
  if (!page) return {};
  const { meta } = page;
  const path = canonicalPath(slug);
  const noindex = (meta.robots || "").includes("noindex");

  const ogImage = meta.ogImage || SITE.baseUrl + SITE.ogImage;
  const isArticle = meta.ogType === "article";

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    alternates: {
      canonical: path,
      languages: {
        en: SITE.baseUrl + path,
        "x-default": SITE.baseUrl + path,
      },
    },
    robots: noindex
      ? { index: false, follow: true }
      : {
          index: true,
          follow: true,
          "max-image-preview": "large",
          "max-snippet": -1,
          "max-video-preview": -1,
        },
    openGraph: {
      type: isArticle ? "article" : "website",
      title: meta.ogTitle || meta.title,
      description: meta.ogDescription || meta.description,
      url: path,
      siteName: meta.ogSiteName || SITE.name,
      locale: "en_US",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: meta.ogImageAlt || meta.title,
        },
      ],
      ...(isArticle && meta.articlePublished
        ? { publishedTime: meta.articlePublished, modifiedTime: meta.articleModified }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: meta.twitterTitle || meta.ogTitle || meta.title,
      description: meta.twitterDescription || meta.ogDescription || meta.description,
      images: [meta.twitterImage || ogImage],
    },
  };
}

export default async function Page({ params }) {
  const { slug = [] } = await params;
  const page = parsePage(slug);
  if (!page) notFound();

  return (
    <>
      <main dangerouslySetInnerHTML={{ __html: page.body }} />
      {page.jsonLd.map((block, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: block }}
        />
      ))}
      {/* BreadcrumbList — added programmatically only when the source HTML
          doesn't already provide one. Avoids duplicate BreadcrumbList blocks
          which inflate schema bloat and provide no extra ranking signal. */}
      {!page.jsonLd.some(blockHasBreadcrumb) && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: breadcrumbJsonLd(slug) }}
        />
      )}
    </>
  );
}
