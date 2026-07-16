import Head from '@docusaurus/Head';

export type SeoProps = {
  title?: string;
  description?: string;
  canonical?: string;
  image?: string;
  ogType?: 'website' | 'article' | 'profile';
  noindex?: boolean;
};

export default function Seo({ title, description, canonical, image, ogType = 'website', noindex }: SeoProps) {
  return (
    <Head>
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph / Twitter */}
      {title && <meta property="og:title" content={title} />}
      {description && <meta property="og:description" content={description} />}
      {image && <meta property="og:image" content={image} />}
      <meta property="og:type" content={ogType} />
      {image && <meta name="twitter:image" content={image} />}
      <meta name="twitter:card" content="summary_large_image" />

      {/* Indexing control */}
      {noindex && <meta name="robots" content="noindex,nofollow" />}
    </Head>
  );
}
