// @ts-check
/** @type {import('next-seo').DefaultSeoProps} */
export default {
  titleTemplate: '%s | Sushi',
  title: 'SushiSwap',
  defaultTitle: 'SushiSwap',
  description: 'Easiest way to trade your tokens and supported by 22 networks.',
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
    url: 'https://www.sushi.com/swap',
    type: 'website',
    title: 'SushiSwap',
    description: 'Easiest way to trade your tokens and supported by 22 networks.',
    images: [
      {
        url: 'https://www.sushi.com/swap/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'SushiSwap',
      },
    ],
    site_name: 'Sushi',
    // locale: 'en_IE',
  },
}
