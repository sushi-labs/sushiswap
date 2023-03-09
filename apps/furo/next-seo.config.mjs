// @ts-check
/** @type {import('next-seo').DefaultSeoProps} */
export default {
  titleTemplate: '%s | Furo',
  defaultTitle: 'Furo',
  description: 'Automate your DAO salaries and vesting schedules while earning interest from yield strategies.',
  //   canonical: 'https://www.sushi.com/furo',
  //   mobileAlternate: {
  //     media: '',
  //     href: '',
  //   },
  //   languageAlternates: [{ hrefLang: "en", href: "https://www.sushi.com/furo" }],
  twitter: {
    handle: '@sushiswap',
    site: '@sushiswap',
    cardType: 'summary_large_image',
  },
  openGraph: {
    url: 'https://www.sushi.com/furo',
    type: 'website',
    title: 'Furo',
    description: 'Automate your DAO salaries and vesting schedules while earning interest from yield strategies.',
    images: [
      {
        url: 'https://www.sushi.com/furo/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Furo',
      },
    ],
    // videos: [],
    // locale: 'en_IE',
    site_name: 'Sushi',
  },
}
