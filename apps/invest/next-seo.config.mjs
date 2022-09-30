// @ts-check
/** @type {import('next-seo').DefaultSeoProps} */
export default {
  titleTemplate: '%s | Sushi',
  title: 'Earn',
  defaultTitle: 'Earn',
  description: 'Earn fees by providing liquidity and staking SUSHI into xSUSHI.',
  //   canonical: 'https://sushi.com/pool',
  //   mobileAlternate: {
  //     media: '',
  //     href: '',
  //   },
  //   languageAlternates: [{ hrefLang: "en", href: "https://sushi.com/pool" }],
  twitter: {
    handle: '@sushiswap',
    site: '@sushiswap',
    cardType: 'summary_large_image',
  },
  openGraph: {
    url: 'https://www.sushi.com/earn',
    type: 'website',
    title: 'Earn',
    description: 'Earn fees by providing liquidity and staking SUSHI into xSUSHI.',
    images: [
      {
        url: 'https://www.sushi.com/earn/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Earn',
      },
    ],
    // videos: [],
    // locale: 'en_IE',
    site_name: 'Sushi',
  },
}
