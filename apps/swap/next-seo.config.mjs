// @ts-check
/** @type {import('next-seo').DefaultSeoProps} */
export default {
  titleTemplate: '%s | Sushi',
  title: 'SushiSwap',
  defaultTitle: 'SushiSwap',
  description: 'Easiest way to trade your tokens.',
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
    description: 'Easiest way to trade your tokens',
    site_name: 'Sushi',
    // images: [],
    videos: [
      {
        url: 'https://www.sushi.com/swap/og-video.mp4',
        width: 1920,
        height: 1080,
        alt: 'SushiSwap',
      },
    ],
    // locale: 'en_IE',
  },
}
