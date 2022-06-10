import Head from 'next/head'
import { FC } from 'react'

import { getOptimizedMedia, isMediaVideo } from '../lib/media'
import { useGlobalContext } from '../pages/_app'
import { Seo as SeoType } from '../types'

interface Seo {
  seo?: SeoType
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
    shareMedia: getOptimizedMedia({ metadata: seoWithDefaults.shareImage.data.attributes.provider_metadata }),
    shareMediaAsImage: getOptimizedMedia({
      metadata: seoWithDefaults.shareImage.data.attributes.provider_metadata,
      asImage: true,
    }),
    shareMediaWidth: Math.floor(
      seoWithDefaults.shareImage.data.attributes.width *
        (Math.max(seoWithDefaults.shareImage.data.attributes.height, 1280) / 1280)
    ),
    shareMediaHeight: Math.max(seoWithDefaults.shareImage.data.attributes.height, 1280),
    shareMediaAlt: seoWithDefaults.shareImage.data.attributes.alternativeText,
    twitterCardType: isMediaVideo(seoWithDefaults.shareImage.data.attributes.provider_metadata)
      ? 'player'
      : 'summary_large_image',
  }

  console.log(seoWithDefaults.shareImage)
  return (
    <Head>
      <title>{fullSeo.metaTitle}</title>
      <meta name="description" content={fullSeo.metaDescription} />

      {fullSeo.article && <meta property="og:type" content="article" />}
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:title" content={fullSeo.metaTitle} />
      <meta property="og:description" content={fullSeo.metaDescription} />

      {!isMediaVideo(seoWithDefaults.shareImage.data.attributes.provider_metadata) && (
        <>
          <meta name="image" content={fullSeo.shareMedia} />
          <meta property="og:image" content={fullSeo.shareMedia} />
          <meta property="og:image:type" content="image/jpeg" />
          <meta property="og:image:width" content={`${fullSeo.shareMediaWidth}`} />
          <meta property="og:image:height" content={`${fullSeo.shareMediaHeight}`} />
          <meta property="og:image:alt" content={`${fullSeo.shareMediaAlt}`} />
        </>
      )}

      <meta name="twitter:title" content={fullSeo.metaTitle} />
      <meta name="twitter:site" content="@sushiswap" />
      <meta name="twitter:url" content={`https://sushi.com/blog/${fullSeo.slug}`} />
      <meta name="twitter:card" content={fullSeo.twitterCardType} />
      <meta name="twitter:image" content={fullSeo.shareMediaAsImage} />
      <meta name="twitter:image:alt" content={fullSeo.shareMediaAlt} />
      <meta name="twitter:description" content={fullSeo.metaDescription} />

      {isMediaVideo(seoWithDefaults.shareImage.data.attributes.provider_metadata) && (
        <>
          <meta name="twitter:player" content={fullSeo.shareMedia} />
          <meta name="twitter:player:width" content={`${fullSeo.shareMediaWidth}`} />
          <meta name="twitter:player:height" content={`${fullSeo.shareMediaHeight}`} />

          <meta property="og:video" content={fullSeo.shareMedia} />
          <meta property="og:video:type" content="video/webm" />
          <meta property="og:video:width" content={`${fullSeo.shareMediaWidth}`} />
          <meta property="og:video:height" content={`${fullSeo.shareMediaHeight}`} />
          {fullSeo.tags.map((tag, i) => (
            <meta key={i} property="og:video:tag" content={tag} />
          ))}
        </>
      )}
    </Head>
  )
}
