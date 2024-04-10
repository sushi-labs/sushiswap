import type { DefaultSeoProps } from 'next-seo'

const seo = {
  titleTemplate: '%s | Sushi',
  title: 'Blog',
  defaultTitle: 'Blog',
  description: 'Trade on 30+ chains with Sushi',
  twitter: {
    handle: '@sushiswap',
    site: '@sushiswap',
    cardType: 'summary_large_image',
  },
  openGraph: {
    url: 'https://www.sushi.com/blog',
    type: 'website',
    title: 'Blog',
    description:
      'A leading multi-chain DEX deployed on over 30 blockchains, featuring a unique cross-chain swap - SushiXSwap.',
    images: [
      {
        url: 'https://cdn.sushi.com/image/upload/v1712761011/Sushi_Logo_Colour_400_4f103bce2e.png',
        width: 400,
        height: 432,
        alt: 'Sushi',
      },
    ],
    site_name: 'Sushi',
    // locale: 'en_IE',
  },
} as const satisfies DefaultSeoProps

export default seo
