// @ts-check
/** @type {import('next-seo').DefaultSeoProps} */
export default {
  titleTemplate: '%s | Sushi',
  title: 'Widget',
  defaultTitle: 'Widget',
  description: 'Easiest way to integrate Sushi products.',
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
    url: 'https://www.sushi.com/widget',
    type: 'website',
    title: 'Widget',
    description: 'Easiest way to integrate Sushi products.',
    images: [
      {
        url: 'https://www.sushi.com/brdige/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Widget',
      },
    ],
    // videos: [],
    // locale: 'en_IE',
    site_name: 'Widget',
  },
}
