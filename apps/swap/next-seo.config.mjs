// @ts-check
/** @type {import('next-seo').DefaultSeoProps} */
const config = {
  titleTemplate: '%s | Sushi',
  title: 'Swap',
  defaultTitle: 'Swap',
  description: 'Easiest way to trade your tokens and supported by 22 networks.',
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
    url: 'https://www.sushi.com/swap',
    type: 'website',
    title: 'Swap',
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
export default config
