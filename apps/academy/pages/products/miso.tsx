import { LinkIcon } from '@heroicons/react/24/outline'
import { CheckIcon, classNames, Container } from '@sushiswap/ui'
import {
  ProductArticles,
  ProductBackground,
  ProductFaq,
  ProductHero,
  ProductSectionTitle,
  ProductTechnicalDoc,
} from 'common/components'
import { DEFAULT_SIDE_PADDING } from 'common/helpers'
import { PRODUCTS_DATA } from 'common/productsData'
import { getLatestAndRelevantArticles, getProducts } from 'lib/api'
import { GetStaticProps, InferGetStaticPropsType } from 'next'
import { FC } from 'react'
import useSWR from 'swr'

import { ArticleEntity } from '.mesh'

const PRODUCT_SLUG = 'miso'
const { color, usps, productStats, buttonText, cards, faq } = PRODUCTS_DATA[PRODUCT_SLUG]

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
    }
  )

  const latestArticles: ArticleEntity[] = data?.articles?.data ?? []
  const relevantArticles: ArticleEntity[] = data?.relevantArticles?.data ?? []

  return (
    <Container maxWidth="6xl" className={classNames('mx-auto pt-10 pb-24', DEFAULT_SIDE_PADDING)}>
      <ProductBackground color={color} />
      <ProductHero
        productName={longName}
        productDescription={description}
        productUrl={url}
        buttonText={buttonText}
        buttonIcon={<LinkIcon width={20} height={20} strokeWidth={2} />}
        productStats={productStats}
      />

      <section className="py-10 sm:py-[75px]">
        <ProductSectionTitle
          className="text-center"
          title={`What is ${name}?`}
          subtitle={
            <>
              <p>The only community curated launchpad platform, available to everyone.</p>
              <p>
                MISO enables project owners to easily launch a token in a true permissionless and decentralized way.
              </p>
            </>
          }
        />

        <div className="grid gap-6 mt-8 sm:grid-cols-2">
          {usps.map((usp) => (
            <div key={usp} className="flex gap-4 sm:gap-6 sm:p-4">
              <div className="bg-slate-800 rounded-full min-w-[32px] sm:min-w-[56px] h-8 sm:h-14 flex items-center justify-center">
                <CheckIcon className="text-[#7CFF6B] w-4 sm:w-10" />
              </div>
              <p className="text-xs sm:text-lg text-slate-400">{usp}</p>
            </div>
          ))}
        </div>

        <div className="grid sm:grid-cols-[repeat(auto-fit,minmax(360px,1fr))] mt-10 sm:mt-[70px] gap-x-6 gap-y-8">
          {cards.map((card, i) => (
            <div
              key={card.title}
              className="p-px sm:h-[415px] rounded-3xl"
              style={{
                background: !i ? `linear-gradient(218.8deg, ${color} 2.35%, rgba(0, 0, 0, 0) 97.65%)` : 'unset',
              }}
            >
              <div className="p-8 md:p-12 h-full bg-[#212939] rounded-3xl">
                <card.Icon />
                <div className="mt-6 sm:mt-10">
                  <h3 className="text-xl font-bold sm:text-2xl">{card.title}</h3>
                </div>
                <div className="mt-2 sm:mt-4">
                  <p className="text-xs text-slate-400 sm:text-sm">{card.subtitle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

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
        color="#FF855F"
        secondaryColor={color}
        url="https://dev.sushi.com/docs/Developers/Miso/Overview"
      />
      <ProductFaq faq={faq} />
    </Container>
  )
}

export default ProductPage
