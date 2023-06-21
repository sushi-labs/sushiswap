import { LinkIcon } from '@heroicons/react/24/outline'
import { classNames, Container } from '@sushiswap/ui'
import {
  ProductArticles,
  ProductBackground,
  ProductCards,
  ProductFaq,
  ProductHero,
  ProductInfoImages,
  ProductTechnicalDoc,
} from 'common/components'
import { DEFAULT_SIDE_PADDING } from 'common/helpers'
import { PRODUCTS_DATA } from 'common/productsData'
import { getLatestAndRelevantArticles, getProducts } from 'lib/api'
import { GetStaticProps, InferGetStaticPropsType } from 'next'
import React, { FC } from 'react'
import useSWR from 'swr'

import { ArticleEntity } from '.mesh'

const PRODUCT_SLUG = 'trident'
const { color, productStats, cards, faq } = PRODUCTS_DATA[PRODUCT_SLUG]

export const getStaticProps: GetStaticProps = async () => {
  const data = await getProducts({ filters: { slug: { eq: PRODUCT_SLUG } } })
  const product = data?.products?.data?.[0]?.attributes
  if (!product) throw new Error('Product not found')
  return { props: product, revalidate: 60 }
}

const ProductPage: FC<InferGetStaticPropsType<typeof getStaticProps>> = ({
  name,
  url,
  description,
  slug,
  relevantArticleIds,
}) => {
  const { data, isValidating } = useSWR(
    ['/trident-articles'],
    async () => await getLatestAndRelevantArticles(slug, relevantArticleIds),
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
    }
  )

  const latestArticles: ArticleEntity[] = data?.articles?.data ?? []
  const relevantArticles: ArticleEntity[] = data?.relevantArticles?.data ?? []

  return (
    <Container maxWidth="6xl" className={classNames('mx-auto pt-10 pb-24', DEFAULT_SIDE_PADDING)}>
      <ProductBackground color={color} />
      <ProductHero
        productName={
          <h1 className="text-4xl sm:text-6xl sm:leading-[78px] text-center max-w-5xl">
            <strong>Trident</strong>
            <p>
              A Future-Proof Framework for Building <strong>AMMs</strong>
            </p>
          </h1>
        }
        productDescription={description}
        productUrl={url}
        buttonIcon={<LinkIcon width={20} height={20} strokeWidth={2} />}
        productStats={productStats}
      />
      <ProductCards
        name={name}
        description="An extensible framework for building and scaling AMMs, powered by the BentoBox. Live on the following networks: Polygon, Kava, Optimism & Metis."
        cards={cards}
        gradientBorderColor={color}
      />
      <ProductArticles
        title="Articles"
        subtitle="Read more about the latest releases"
        articles={latestArticles}
        productName={PRODUCT_SLUG}
        isLoading={isValidating}
      />
      <ProductInfoImages
        color="#FEC464"
        secondaryColor="#84E9DD"
        infoSections={[
          {
            title: 'The BentoBox',
            description:
              "All of the funds on Trident are also available to be applied to approved strategies in the BentoBox. This feature is made possible by Bento's empirical accounting method.",
          },
          {
            title: 'The Tines Router',
            description:
              'Tines is a Smart Ordering Router (SOR) that is responsible for managing all the swaps on Trident. When the final phase of Trident is complete, Tines will be the only router in existence.',
          },
          {
            title: 'The IPool interface',
            description:
              'The IPool interface was developed by the Sushi team in the process of building Trident, which is a system of contracts that supports the four most canonical types of liquidity in DeFi: Constant Product Pool, Stable Swap Pool, Concentrated Liquidity Pool, Index Pool.',
          },
        ]}
      />
      <ProductArticles
        title={`Learn about ${name}`}
        subtitle="Check out our tutorials and explainers"
        articles={relevantArticles}
        productName={PRODUCT_SLUG}
        isLoading={isValidating}
      />
      <ProductTechnicalDoc
        color={color}
        secondaryColor="#FEC464"
        url="https://dev.sushi.com/docs/Developers/Trident/TridentRouter"
      />
      <ProductFaq faq={faq} />
    </Container>
  )
}

export default ProductPage
