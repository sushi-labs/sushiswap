import { DefaultSeo as NextDefaultSeo } from 'next-seo'
import { FC } from 'react'

import { Global } from '.mesh'

interface DefaultSeo {
  seo: Global
}

export const DefaultSeo: FC<DefaultSeo> = ({ seo }) => (
  <NextDefaultSeo
    title={seo.defaultSeo?.metaTitle}
    titleTemplate={`%s | ${seo.siteName}`}
    defaultTitle={seo.siteName}
    description={seo.defaultSeo?.metaDescription}
    openGraph={{
      site_name: seo.siteName,
      locale: 'en_US',
      title: seo.defaultSeo?.metaTitle,
      description: seo.defaultSeo?.metaDescription,
      images: [
        {
          url: seo.defaultSeo?.shareImage?.data?.attributes?.url || '',
          width: seo.defaultSeo?.shareImage?.data?.attributes?.width,
          height: seo.defaultSeo?.shareImage?.data?.attributes?.height,
          type: 'image/jpeg',
          alt: seo.defaultSeo?.metaDescription,
        },
      ],
    }}
    twitter={{
      handle: '@sushiswap',
      cardType: 'summary_large_image',
    }}
  />
)

export default DefaultSeo
