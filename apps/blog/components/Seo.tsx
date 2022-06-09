import Head from 'next/head'
import { FC } from 'react'

import { ComponentSharedSeo } from '../.graphclient'
import { getStrapiMedia } from '../lib/media'
import { useGlobalContext } from '../pages/_app'

interface Seo {
  seo?: ComponentSharedSeo & { article: boolean }
}

export const Seo: FC<Seo> = ({ seo }) => {
  const { defaultSeo, siteName } = useGlobalContext()
  const seoWithDefaults = {
    ...defaultSeo,
    ...seo,
  }

  const fullSeo = {
    ...seoWithDefaults,
    metaTitle: `${seoWithDefaults.metaTitle} | ${siteName}`,
    shareImage: seoWithDefaults?.shareImage?.data?.attributes?.url
      ? getStrapiMedia(seoWithDefaults?.shareImage?.data?.attributes?.url)
      : undefined,
  }

  return (
    <Head>
      <title>{fullSeo.metaTitle}</title>
      <meta property="og:title" content={fullSeo.metaTitle} />
      <meta name="twitter:title" content={fullSeo.metaTitle} />
      <meta name="description" content={fullSeo.metaDescription} />
      <meta property="og:description" content={fullSeo.metaDescription} />
      <meta name="twitter:description" content={fullSeo.metaDescription} />
      {fullSeo.shareImage && <meta property="og:image" content={fullSeo.shareImage} />}
      {fullSeo.shareImage && <meta name="twitter:image" content={fullSeo.shareImage} />}
      <meta name="image" content={fullSeo.shareImage} />
      {fullSeo.article && <meta property="og:type" content="article" />}
      <meta name="twitter:card" content="summary_large_image" />
    </Head>
  )
}
