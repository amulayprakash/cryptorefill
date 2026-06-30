import { Helmet } from 'react-helmet-async';

export default function SEO({ title, description, canonical, type = 'website', image }) {
  const siteName = 'Mad Deals';
  const fullTitle = title || `${siteName} | Buy Gift Cards & Mobile Top Ups with Crypto`;
  const fullDescription = description || 'Spend Bitcoin, USDT, USDC, ETH and 100+ cryptocurrencies at 6,600+ brands. Buy gift cards and mobile top ups with no KYC required. Safe delivery.';
  const defaultImage = 'https://maddeals.s3-eu-west-1.amazonaws.com/images/opengraph-image-dark.jpg';

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{fullTitle}</title>
      <meta name='description' content={fullDescription} />
      {/* Canonical Link */}
      {canonical && <link rel='canonical' href={`https://maddeals.com${canonical}`} />}
      {/* OpenGraph tags */}
      <meta property='og:title' content={fullTitle} />
      <meta property='og:description' content={fullDescription} />
      <meta property='og:type' content={type} />
      <meta property='og:url' content={`https://maddeals.com${canonical || ''}`} />
      <meta property='og:image' content={image || defaultImage} />
      <meta property='og:site_name' content={siteName} />
      {/* Twitter Card tags */}
      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:site' content='@MadDeals' />
      <meta name='twitter:title' content={fullTitle} />
      <meta name='twitter:description' content={fullDescription} />
      <meta name='twitter:image' content={image || defaultImage} />
    </Helmet>
  );
}
