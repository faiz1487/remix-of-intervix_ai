import { Helmet } from "react-helmet-async";

const BASE_URL = "https://intervixa.online";
const DEFAULT_OG_IMAGE =
  "https://storage.googleapis.com/gpt-engineer-file-uploads/7hpWrsKoUcU5WVDBGYkgF5PEQiX2/social-images/social-1773404300150-Screenshot_11-3-2026_191154_intervixa.lovable.app.webp";

interface SeoProps {
  title: string;
  description: string;
  path: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  noindex?: boolean;
  /** Open Graph object type — use "article" for guides/blog content. */
  ogType?: "website" | "article";
  /** Absolute https URL of a page-specific social image. */
  image?: string;
  /** ISO date, only meaningful when ogType is "article". */
  publishedTime?: string;
  /** ISO date, only meaningful when ogType is "article". */
  modifiedTime?: string;
}

export const Seo = ({
  title,
  description,
  path,
  jsonLd,
  noindex,
  ogType = "website",
  image,
  publishedTime,
  modifiedTime,
}: SeoProps) => {
  const url = `${BASE_URL}${path}`;
  const ogImage = image || DEFAULT_OG_IMAGE;
  const blocks = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:site_name" content="Intervixa AI" />
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      {ogType === "article" && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {ogType === "article" && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      {blocks.map((block, i) => (
        <script type="application/ld+json" key={i}>
          {JSON.stringify(block)}
        </script>
      ))}
    </Helmet>
  );
};

export default Seo;
