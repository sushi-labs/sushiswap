import { LinkIcon } from '@heroicons/react/24/outline'
import { classNames } from '@sushiswap/ui'
import { Container } from '@sushiswap/ui/components/container'
import sushixswapImg from 'common/assets/sushixswap-img.png'
import {
  ProductArticles,
  ProductBackground,
  ProductCards,
  ProductFaq,
  ProductHero,
  ProductTechnicalDoc,
} from 'common/components'
import { DEFAULT_SIDE_PADDING } from 'common/helpers'
import { WideTriangle } from 'common/icons'
import { PRODUCTS_DATA } from 'common/productsData'
import { getLatestAndRelevantArticles, getProducts } from 'lib/api'
import { GetStaticProps, InferGetStaticPropsType } from 'next'
import Image from 'next/image'
import { FC } from 'react'
import useSWR from 'swr'

import { ArticleEntity } from '.mesh'

const PRODUCT_SLUG = 'sushixswap'
const { color, cards, faq } = PRODUCTS_DATA[PRODUCT_SLUG]

export const getStaticProps: GetStaticProps = async () => {
  const data = await getProducts({ filters: { slug: { eq: PRODUCT_SLUG } } })
  const product = data?.products?.data?.[0].attributes
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
        productName={
          <h1 className="sm:leading-[78px] flex gap-1 sm:gap-2 text-4xl sm:text-6xl font-bold text-slate-50">
            <span>Sushi</span>
            <span className="flex items-center">
              <WideTriangle fill="#F7EA75" className="h-6 -mr-2 sm:h-10" />
              X
              <WideTriangle fill="#FF9A5F" className="h-6 -ml-2 rotate-180 sm:h-10" />
            </span>
            <span>Swap</span>
          </h1>
        }
        productDescription={description}
        productUrl={url}
        buttonIcon={LinkIcon}
        image={<Image src={sushixswapImg} unoptimized alt="sushixswap-img" />}
      />
      <ProductCards
        name={name}
        description="SushiXSwap is a first of its kind, cross-chain AMM, built on BentoBox and powered by Stargate. Make trades between chains seamlessly, utilizing Sushi’s liquidity on 20+ chains."
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
      {/** TODO: links to be reviewed by team */}
      {/* <section className="py-10 sm:py-[75px] flex items-center flex-col sm:gap-[70px] gap-10">
        <ProductSectionTitle title="Chains you can trade on" />
        <div className="flex flex-wrap justify-center gap-2 sm:gap-6">
          {chains.map(({ Icon, name }) => (
            <div
              key={name}
              className="pl-1 sm:pl-2.5 pr-2 sm:pr-5 h-8 sm:h-[68px] bg-slate-800 rounded-3xl flex gap-2 sm:gap-4 items-center"
            >
              <div className="w-6 h-6 overflow-hidden sm:w-12 sm:h-12 rounded-xl">
                <Icon />
              </div>
              <span className="font-semibold sm:text-2xl sm:font-bold">{name}</span>
            </div>
          ))}
        </div>
      </section>
      <section className="py-10 sm:py-[75px] flex items-center">
        <div className="py-6 sm:py-10 px-6 lg:px-[60px] bg-slate-800 rounded-[20px] flex flex-col sm:items-center gap-10 sm:gap-[70px] mx-auto">
          <div className="text-center">
            <h3 className="text-xl font-bold sm:text-4xl text-slate-50">Trade and Earn Yield on any chain</h3>
            <p className="mt-2 sm:text-lg text-slate-400">
              To use Sushi on these chains, follow our unique chainlinks. For Miso eg. head over to:
            </p>
          </div>
          <div className="grid sm:grid-cols-2 sm:gap-x-[60px] gap-y-4 sm:gap-y-7">
            {chains.map(({ Icon, name, url }) => (
              <div key={name} className="sm:px-2.5 sm:h-[82px] flex gap-2 sm:gap-6 items-center">
                <div className="sm:min-w-[48px] sm:h-12 w-8 h-8 overflow-hidden rounded-xl">
                  <Icon />
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-semibold sm:text-2xl sm:font-bold">{name}</span>
                  <a
                    href={url}
                    rel="noreferrer"
                    target="_blank"
                    className="text-xs sm:text-lg text-slate-400 hover:underline hover:text-blue-500"
                  >
                    {url}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}
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
        url="https://dev.sushi.com/docs/Developers/SushiXSwap/Overview"
      />
      <ProductFaq faq={faq} />
    </Container>
  )
}

export default ProductPage
