'use client'

import { App, AppType, MaxWidth } from '@sushiswap/ui'
import { DefaultSeo, DefaultSeoProps } from 'next-seo'

const SEO: DefaultSeoProps = {
  titleTemplate: '%s | Partner',
  defaultTitle: 'Partner',
  description: 'Sushi Partner is a platform for sushi-partner interaction.',
  //   canonical: 'https://www.sushi.com/analytics',
  //   mobileAlternate: {
  //     media: '',
  //     href: '',
  //   },
  //   languageAlternates: [{ hrefLang: "en", href: "https://www.sushi.com/analytics" }],
  twitter: {
    handle: '@sushiswap',
    site: '@sushiswap',
    cardType: 'summary_large_image',
  },
  openGraph: {
    // url: 'https://www.sushi.com/analytics',
    type: 'website',
    title: 'Partner',
    description: 'Sushi Partner is a platform for sushi-partner interaction.',
    // images: [],
    // videos: [],
    // locale: 'en_IE',
    site_name: 'Sushi',
  },
}

export default function PartnerLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <DefaultSeo {...SEO} />
      <App.Header appType={AppType.Partner} withScrollBackground />
      <div className="flex items-center justify-center w-full">{children}</div>
    </>
  )
}
