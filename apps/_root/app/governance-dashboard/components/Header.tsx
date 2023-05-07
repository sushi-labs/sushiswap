'use client'

import { GlobalNav } from '@sushiswap/ui/future/components/GlobalNav'
import { DefaultSeo, DefaultSeoProps } from 'next-seo'
import React from 'react'

const SEO: DefaultSeoProps = {
  titleTemplate: '%s | Governance Dashboard',
  defaultTitle: 'Governance Dashboard',
  description: 'Sushi Governance Dashboard is where transparency is visible.',
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
    title: 'Governance Dashboard',
    description: 'Sushi Governance Dashboard is where transparency is visible.',
    // images: [],
    // videos: [],
    // locale: 'en_IE',
    site_name: 'Sushi',
  },
}

export function Header() {
  return (
    <>
      <DefaultSeo {...SEO} />
      <GlobalNav />
    </>
  )
}
