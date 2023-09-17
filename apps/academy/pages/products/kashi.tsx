import { LinkIcon } from '@heroicons/react/24/outline'
import { classNames } from '@sushiswap/ui'
import { Container } from '@sushiswap/ui/components/container'
import kashiImg from 'common/assets/kashi-img.png'
import {
  ProductArticles,
  ProductBackground,
  ProductCards,
  ProductFaq,
  ProductHero,
  ProductTechnicalDoc,
} from 'common/components'
import { DEFAULT_SIDE_PADDING } from 'common/helpers'
import { PRODUCTS_DATA } from 'common/productsData'
import { getLatestAndRelevantArticles, getProducts } from 'lib/api'
import { GetStaticProps, InferGetStaticPropsType } from 'next'
import Image from 'next/image'
import { FC } from 'react'
import useSWR from 'swr'

const PRODUCT_SLUG = 'kashi'
const { color, accentColor, cards, faq } = PRODUCTS_DATA[PRODUCT_SLUG]

export const getStaticProps: GetStaticProps = async () => {
  const data = await getProducts({ filters: { slug: { eq: PRODUCT_SLUG } } })
  const product = data?.products?.data?.[0].attributes
  if (!product) throw new Error('Product not found')
  return { props: product, revalidate: 60 }
}

const ProductPage: FC<InferGetStaticPropsType<typeof getStaticProps>> = ({
  name,
  longName,
  url,
  description,
  slug,
  relevantArticleIds,
}) => {
  const { data, isValidating } = useSWR(
    ['/kashi-articles'],
    async () => await getLatestAndRelevantArticles(slug, relevantArticleIds),
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
    }
  )

  const latestArticles = data?.articles ?? []
  const relevantArticles = data?.relevantArticles ?? []

  return (
    <Container maxWidth="6xl" className={classNames('mx-auto pt-10 pb-24', DEFAULT_SIDE_PADDING)}>
      <ProductBackground color={color} />
      <ProductHero
        productName={longName}
        productDescription={description}
        productUrl={url}
        buttonIcon={LinkIcon}
        image={<Image src={kashiImg} unoptimized alt="kashi-img" />}
      />
      <ProductCards
        name={name}
        description="Kashi is a lending and margin trading platform, built on the BentoBox, allowing lenders to earn yield on their pooled funds and borrowers to take out token loans."
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
      <ProductArticles
        title={`Learn about ${name}`}
        subtitle="Check out our tutorials and explainers"
        articles={relevantArticles}
        productName={PRODUCT_SLUG}
        isLoading={isValidating}
      />
      <ProductTechnicalDoc
        color="#5F82FF"
        secondaryColor={accentColor}
        url="https://dev.sushi.com/docs/Developers/Kashi%20Lending/Overview"
      />
      <ProductFaq faq={faq} />
    </Container>
  )
}

export default ProductPage
