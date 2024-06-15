import { LinkIcon } from '@heroicons/react/24/outline'
import { classNames } from '@sushiswap/ui'
import { Container } from '@sushiswap/ui'
import furoImg from 'common/assets/furo-img.png'
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
import Image from 'next/legacy/image'
import { FC } from 'react'
import useSWR from 'swr'

import { ProductSeo } from '../../common/components/Seo/ProductSeo'

const PRODUCT_SLUG = 'furo'
const { color, cards, buttonText, productStats, faq } =
  PRODUCTS_DATA[PRODUCT_SLUG]

export const getStaticProps: GetStaticProps = async () => {
  const data = await getProducts({ filters: { slug: { eq: PRODUCT_SLUG } } })
  const product = data?.products?.data?.[0].attributes
  if (!product) throw new Error('Product not found')
  return { props: product, revalidate: 60 }
}

const ProductPage: FC<InferGetStaticPropsType<typeof getStaticProps>> = (
  product,
) => {
  const { name, longName, url, description, slug, relevantArticleIds } = product

  const { data, isValidating } = useSWR(
    ['/furo-articles'],
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
    <>
      <ProductSeo product={product} />
      <Container
        maxWidth="6xl"
        className={classNames('mx-auto pt-10', DEFAULT_SIDE_PADDING)}
      >
        <ProductBackground color={color} />
        <ProductHero
          productName={longName}
          productDescription={description}
          productUrl={url}
          buttonText={buttonText}
          buttonIcon={LinkIcon}
          image={<Image src={furoImg} unoptimized alt="furo-img" />}
          productStats={productStats}
        />
      </Container>

      <Container
        maxWidth="6xl"
        className={classNames('mx-auto pb-24', DEFAULT_SIDE_PADDING)}
      >
        <ProductInfoImages
          color="#64C7FE"
          secondaryColor="#B084E9"
          infoSections={[
            {
              title: 'Payments & Salaries',
              description:
                'Automate your DAO salaries securely with Furo. Furo lets you set up payment and salary streams for all your contributors.',
            },
            {
              title: 'Token Vesting',
              description:
                'Traditionally, DAOs have to recreate and redeploy their own vesting contracts. With Furo we aim to free projects and DAOs from this heavy lifting.',
            },
            {
              title: 'Multichain',
              description:
                'Furo is multichain, like all Sushi products, catering to users across all EVM compatible chains like Ethereum, Arbitrum, Polygon and Avalanche.',
            },
          ]}
        />

        <ProductCards
          name={name}
          description="Furo allows projects to rid themselves of the cumbersome payroll related admin process, allowing you to work on your product and what truly matters."
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
          color={color}
          secondaryColor="#FEC464"
          url="https://dev.sushi.com/docs/Developers/Furo/Overview"
        />
        <ProductFaq faq={faq} />
      </Container>
    </>
  )
}

export default ProductPage
