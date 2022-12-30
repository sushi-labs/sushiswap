// @ts-check
/** @type {import('next-seo').DefaultSeoProps} */
export default {
  titleTemplate: '%s | Sushi',
  title: 'SushiSwap',
  defaultTitle: 'SushiXSwap',
  description: 'Easiest way to trade your tokens across 7 networks.',
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
    url: 'https://www.sushi.com/xswap',
    type: 'website',
    title: 'SushiXSwap',
    description: 'Easiest way to trade your tokens across 7 networks.',
    images: [
      {
        url: 'https://www.sushi.com/xswap/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'SushiXSwap',
      },
    ],
    // videos: [],
    // locale: 'en_IE',
    site_name: 'Sushi',
  },
}
