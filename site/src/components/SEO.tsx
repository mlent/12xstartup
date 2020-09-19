import React from 'react';
import { Helmet } from 'react-helmet';
import { graphql, useStaticQuery } from 'gatsby';
import { SiteMetadata } from '../types/SiteMetadata';

type Data = {
  site: {
    siteMetadata: SiteMetadata;
  };
};

const injectGoogleAnalytics = (measurementId: string) => `
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); };
  gtag('js', new Date());
  gtag('config', '${measurementId}', { anonymize_ip: true, allowAdFeatures: false });
`;

export const SEO = ({
  title,
  seoTitle,
  description,
  seoDescription,
  image,
  socialSharingImage,
  siteUrl,
  pathname,
  isArticle = false,
  noIndex = false,
  publishedDate
}: {
  title?: string;
  seoTitle?: string;
  description?: string;
  seoDescription?: string;
  image?: string;
  socialSharingImage?: string;
  siteUrl: string;
  pathname?: string;
  isArticle?: boolean;
  noIndex?: boolean;
  publishedDate?: string;
}) => {
  const data: Data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
          htmlLang
          contentLang
          description
          siteUrl
          siteName
          faviconUrl
          facebookUrl
          socialSharingImageUrl
          titleTemplate
          googleTagManagerId
          googleAnalyticsMeasurementId
        }
      }
    }
  `);

  const {
    htmlLang,
    contentLang,
    title: defaultTitle,
    description: defaultDescription,
    siteUrl: defaultUrl,
    titleTemplate,
    faviconUrl,
    facebookUrl,
    socialSharingImageUrl: defaultSocialSharingImageUrl,
    googleTagManagerId,
    googleAnalyticsMeasurementId,
    siteName
  } = data.site.siteMetadata;

  const img = socialSharingImage || image || defaultSocialSharingImageUrl;

  const seo = {
    title: title || defaultTitle,
    description: description || defaultDescription,
    image: `${siteUrl}${img}`,
    url: `${siteUrl || defaultUrl}${pathname ? `/${pathname}` : '/'}`
  };

  return (
    <>
      <Helmet
        title={seoTitle || seo.title}
        titleTemplate={
          seo.title !== defaultTitle && !isArticle ? titleTemplate : '%s'
        }
      >
        <html lang={htmlLang} />
        <meta charSet="utf-8" />
        <meta name="description" content={seoDescription || seo.description} />
        <meta name="image" content={seo.image} />
        {noIndex && <meta name="robots" content="noindex" />}
        <meta httpEquiv="content-language" content={contentLang} />
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Pattaya&display=swap"
          rel="stylesheet"
        />
        <meta property="og:site_name" content={siteName} />
        {seo.url && <meta property="og:url" content={seo.url} />}
        {isArticle && <meta property="og:type" content="article" />}
        {isArticle && <meta property="article:author" content={facebookUrl} />}
        {isArticle && (
          <meta property="article:published_time" content={publishedDate} />
        )}

        {seo.title && <meta property="og:title" content={seo.title} />}
        {seo.description && (
          <meta property="og:description" content={seo.description} />
        )}
        {seo.image && <meta property="og:image" content={seo.image} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="" />
        {seo.title && <meta name="twitter:title" content={seo.title} />}
        {seo.description && (
          <meta name="twitter:description" content={seo.description} />
        )}
        {seo.image && <meta name="twitter:image" content={seo.image} />}
        <link rel="shortcut icon" href={faviconUrl} />
        <link rel="canonical" href={seo.url} />
        {googleTagManagerId && (
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${googleTagManagerId}`}
          />
        )}
        {googleAnalyticsMeasurementId && (
          <script>{injectGoogleAnalytics(googleAnalyticsMeasurementId)}</script>
        )}
      </Helmet>
    </>
  );
};
