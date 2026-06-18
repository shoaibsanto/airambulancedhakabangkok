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
    alternates: { canonical: path },
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
    </>
  );
}
