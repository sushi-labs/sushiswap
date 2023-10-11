import { ArticleJsonLd, NextSeo } from 'next-seo'
import { FC } from 'react'

import { Maybe, Product } from '../../../.mesh'
import { getOptimizedMedia, isMediaVideo } from '../../../lib/media'

interface ProductSeo {
  product?: Maybe<Product> | undefined
}

export const ProductSeo: FC<ProductSeo> = ({ product }) => {
  if (!product) return <></>

  const cover = getOptimizedMedia({
    metadata: product.shareImage?.data?.attributes?.provider_metadata,
  })
  const coverAlt = product.shareImage?.data?.attributes?.alternativeText

  return (
    <>
      <NextSeo
        title={product.name ?? ''}
        description={product.description ?? ''}
        openGraph={{
          ...(isMediaVideo(
            product.shareImage?.data?.attributes?.provider_metadata,
          )
            ? {
                videos: [{ url: cover }],
              }
            : {
                images: [{ url: cover, alt: coverAlt || '' }],
              }),
          article: {
            publishedTime: product.createdAt,
            modifiedTime: product.updatedAt,
            authors: ['Sushi'],
          },
        }}
        twitter={{
          cardType: isMediaVideo(
            product.shareImage?.data?.attributes?.provider_metadata,
          )
            ? 'player'
            : 'summary_large_image',
        }}
      />
      <ArticleJsonLd
        type="Article"
        url={`https://www.sushi.com/academy/products/${product.slug}`}
        title={product.name ?? ''}
        description={product.description ?? ''}
        authorName="Sushi"
        images={[cover]}
        datePublished={product.createdAt}
        dateModified={product.updatedAt}
      />
    </>
  )
}
