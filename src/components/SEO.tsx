import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  noindex?: boolean;
  lang?: string;
  translations?: Record<string, string>; // code -> url
  structuredData?: any;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  canonical,
  ogType = 'website',
  ogImage,
  twitterCard = 'summary_large_image',
  noindex = false,
  lang = 'pl',
  translations,
  structuredData,
}) => {
  const siteName = 'Pulse News';
  const fullTitle = title ? `${title} — Pulse News` : 'Pulse News — Najświeższe wiadomości ze świata';
  const metaDescription = description || 'Bądź na bieżąco z najnowszymi informacjami. Technologia, Rozrywka, Świat i Niesamowite historie w jednym miejscu.';
  const currentUrl = canonical || window.location.href;
  const defaultImage = 'https://picsum.photos/seed/pulse-news/1200/630';
  const image = ogImage || defaultImage;

  return (
    <Helmet>
      {/* 1. Title tag */}
      <title>{fullTitle}</title>

      {/* 2. Meta description */}
      <meta name="description" content={metaDescription} />

      {/* 3. Canonical URL */}
      <link rel="canonical" href={currentUrl} />

      {/* 4. Hreflang */}
      {translations && Object.entries(translations).map(([code, url]) => (
        <link key={code} rel="alternate" hrefLang={code} href={url} />
      ))}
      <link rel="alternate" hrefLang="x-default" href={`${window.location.origin}/`} />

      {/* 5. Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:locale" content={lang === 'pl' ? 'pl_PL' : 'en_US'} />
      <meta property="og:site_name" content={siteName} />

      {/* 6. Twitter Card */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={image} />

      {/* 7. Robots meta */}
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />

      {/* 8. Viewport i charset (already in index.html usually, but good to have) */}
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
