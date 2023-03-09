// @ts-check
/** @type {import('next-seo').DefaultSeoProps} */
export default {
  titleTemplate: '%s | Sushi',
  title: 'Sushi',
  defaultTitle: 'Sushi',
  description:
    'Swap, earn, stack yields, lend, borrow & leverage, all on one decentralized, community driven platform. Welcome home to DeFi.',
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
    url: 'https://www.sushi.com',
    type: 'website',
    title: 'Sushi',
    description:
      'Swap, earn, stack yields, lend, borrow & leverage, all on one decentralized, community driven platform. Welcome home to DeFi.',
    images: [
      {
        url: 'https://www.sushi.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Sushi',
      },
    ],
    // videos: [],
    // locale: 'en_IE',
    site_name: 'Sushi',
  },
}
