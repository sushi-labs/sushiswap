// @ts-check
/** @type {import('next-seo').DefaultSeoProps} */
const config = {
  titleTemplate: '%s | Sushi',
  title: 'Pools',
  defaultTitle: 'Pools',
  description: 'Provide liquidity and earn fees.',
  //   canonical: 'https://www.sushi.com/pool',
  //   mobileAlternate: {
  //     media: '',
  //     href: '',
  //   },
  //   languageAlternates: [{ hrefLang: "en", href: "https://www.sushi.com/pool" }],
  twitter: {
    handle: '@sushiswap',
    site: '@sushiswap',
    cardType: 'summary_large_image',
  },
  openGraph: {
    url: 'https://www.sushi.com/pools',
    type: 'website',
    title: 'Pools',
    description: 'Provide liquidity and earn fees.',
    images: [
      {
        url: 'https://www.sushi.com/pools/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Pools',
      },
    ],
    // videos: [],
    // locale: 'en_IE',
    site_name: 'Sushi',
  },
}
export default config
