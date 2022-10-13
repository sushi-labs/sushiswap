// @ts-check
/** @type {import('next-seo').DefaultSeoProps} */
export default {
  titleTemplate: '%s | Sushi',
  title: 'Bridge',
  defaultTitle: 'Bridge',
  description: 'Easiest way to bridge your tokens across 7 networks.',
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
    url: 'https://www.sushi.com/bridge',
    type: 'website',
    title: 'Bridge',
    description: 'Easiest way to bridge your tokens across 7 networks.',
    images: [
      {
        url: 'https://www.sushi.com/brdige/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Bridge',
      },
    ],
    // videos: [],
    // locale: 'en_IE',
    site_name: 'Bridge',
  },
}
