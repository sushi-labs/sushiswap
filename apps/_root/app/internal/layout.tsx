'use client'

import { DefaultSeo, DefaultSeoProps } from 'next-seo'
import { GlobalNav, NavLink, SubNav, SubNavLink } from '@sushiswap/ui/future/components/GlobalNav'

const SEO: DefaultSeoProps = {
  titleTemplate: '%s | Internal',
  defaultTitle: 'Internal',
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
    title: 'Internal',
    // images: [],
    // videos: [],
    // locale: 'en_IE',
    site_name: 'Sushi',
  },
}

export default function InternalLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <DefaultSeo {...SEO} />
      <GlobalNav>
        <NavLink title="Dashboard" href="/internal" />
        <SubNav title="Bentobox">
          <SubNavLink title="Overview" href="/internal/bentobox" />
          <SubNavLink title="Strategies" href="/internal/bentobox/strategies" />
        </SubNav>
        <NavLink title="Tokens" href="/internal/tokens" />
        <NavLink title="Subgraphs" href="/internal/subgraphs" />
      </GlobalNav>
      <div className="flex items-center justify-center w-full my-10">{children}</div>
    </>
  )
}
