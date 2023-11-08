import { LinkIcon } from '@heroicons/react/24/outline'
import { classNames } from '@sushiswap/ui'
import { Container } from '@sushiswap/ui/components/container'
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
import { FC } from 'react'
import useSWR from 'swr'

const PRODUCT_SLUG = 'bentobox'
const { color, cards, buttonText, faq } = PRODUCTS_DATA[PRODUCT_SLUG]

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
    ['/bentobox-articles'],
    async () => await getLatestAndRelevantArticles(slug, relevantArticleIds),
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
    },
  )

  const latestArticles = data?.articles ?? []
  const relevantArticles = data?.relevantArticles ?? []

  return (
    <Container
      maxWidth="6xl"
      className={classNames('mx-auto pb-24', DEFAULT_SIDE_PADDING)}
    >
      <ProductBackground color={color} isCentered />
      <ProductHero
        productName={longName}
        productDescription={description}
        productUrl={url}
        buttonText={buttonText}
        buttonIcon={LinkIcon}
      />
      <ProductCards
        name={name}
        description="BentoBox is a unique token vault that generates yield (interest) on your tokens, while also allowing you to utilize them in DeFi protocols like lending markets or liquidity pools."
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
        title="Learn about BentoBox"
        subtitle="Check out our tutorials and explainers"
        articles={relevantArticles}
        productName={PRODUCT_SLUG}
        isLoading={isValidating}
      />
      <ProductTechnicalDoc
        color={color}
        secondaryColor="#FFBCFE"
        url="https://dev.sushi.com/docs/Developers/Bentobox/Overview"
      />
      <ProductFaq faq={faq} />
    </Container>
  )
}

export default ProductPage
