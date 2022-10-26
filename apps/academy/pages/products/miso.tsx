import { LinkIcon } from '@heroicons/react/24/outline'
import { Button, CheckIcon, classNames, Container, Link, Typography } from '@sushiswap/ui'
import { ProductArticles, ProductBackground, ProductFaq, ProductStats, ProductTechnicalDoc } from 'common/components'
import { DEFAULT_SIDE_PADDING } from 'common/helpers'
import { AcademyIcon, TilesIcon } from 'common/icons'
import { getLatestAndRelevantArticles, getProducts } from 'lib/api'
import { InferGetStaticPropsType } from 'next'
import { FC } from 'react'
import useSWR from 'swr'

import { ArticleEntity } from '.mesh'

const productSlug = 'miso'
const color = '#87BC06'
const accentColor = '#7F9F30'
const productStats = [
  { value: '20', name: 'Projects Launched' },
  { value: '$500m', name: 'Funds Raised' },
  { value: '13k', name: 'Users Participated' },
  { value: '$4m', name: 'Volume Generated' },
]
const usps = [
  'From token generation to launch on Sushi, MISO is optimized for every aspect of a trustless UX.',
  'MISO aims to capture the spirit of crypto, a platform where any project can launch and anyone can buy, no strings attached.',
]
const cards = [
  {
    Icon: () => <AcademyIcon color={accentColor} Icon={TilesIcon} />,
    title: 'Wide Exposure',
    subtitle: 'Introduce your tokens to the largest possible crypto native audiences.',
  },
  {
    Icon: () => <AcademyIcon color={accentColor} Icon={TilesIcon} />,
    title: 'Simple and Intuitive',
    subtitle: 'Anyone can launch a token on MISO, no technical knowledge required.',
  },
  {
    Icon: () => <AcademyIcon color={accentColor} Icon={TilesIcon} />,
    title: 'Rich in Data',
    subtitle: 'The highest level of transparency and data availability to help you make informed decisions.',
  },
  {
    Icon: () => <AcademyIcon color={accentColor} Icon={TilesIcon} />,
    title: 'Fast to Launch',
    subtitle: 'Quick launches with no interruption.',
  },
]

const faq = [
  {
    question: 'What is Trident and what Pool types does it support?',
    answer: (
      <>
        <Typography>
          Trident is a production framework for building and deploying AMMs, but it is not an AMM itself. While AMMs can
          be created using the Trident code, there isn’t a specific AMM at the center of Trident. Instead, there is a
          framework for creating any AMM anyone would ever need.
        </Typography>
        <Typography className="mt-9">Trident is able to produce the following pool types:</Typography>
        <ul className="list-disc list-inside">
          <li>
            <Typography weight={700} className="text-white" as="span">
              Classic pool{' '}
            </Typography>
            <Typography as="span">
              = constant product pool (x * y = k). Classic pools are composed 50% of one token and 50% of another.
              They’re best for pairing tokens that are unpredictable.
            </Typography>
          </li>
          <li>
            <Typography weight={700} className="text-white" as="span">
              Concentrated pool{' '}
            </Typography>
            <Typography as="span">
              = these pools also use two tokens. The difference is that the liquidity in each pool is determined by the
              ranges set by the pool creator.
            </Typography>
          </li>
          <li>
            <Typography weight={700} className="text-white" as="span">
              Stable pools{' '}
            </Typography>
            <Typography as="span">
              = are ideal for pooling “like-kind” assets. These tokens are usually stable coins like USDC and USDT, or
              other pegged tokens like ETH and stETH, or renBTC and WBTC.
            </Typography>
          </li>
          <li>
            <Typography weight={700} className="text-white" as="span">
              Index pools{' '}
            </Typography>
            <Typography as="span">
              = these pools are usually used to create baskets of assets or decentralized index funds; hence the name.
              These pools can be made of any percentage of tokens equalling 100.
            </Typography>
          </li>
        </ul>
      </>
    ),
  },
]

export const getStaticProps = async () => {
  const data = await getProducts({ filters: { slug: { eq: productSlug } } })
  const product = data?.products?.data?.[0].attributes

  return { props: product }
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
    [`/bentobox-articles`],
    async () => await getLatestAndRelevantArticles(slug, relevantArticleIds),
    { revalidateOnFocus: false, revalidateIfStale: false, revalidateOnReconnect: false }
  )

  const latestArticles: ArticleEntity[] = data?.articles?.data ?? []
  const relevantArticles: ArticleEntity[] = data?.relevantArticles?.data ?? []

  return (
    <Container maxWidth="6xl" className={classNames('mx-auto pt-10 pb-24', DEFAULT_SIDE_PADDING)}>
      <ProductBackground color={color} />
      <section className="py-[75px]">
        {longName.split('-').map((name, i) => (
          <h1 key={i} className="text-6xl font-bold leading-[78px]">
            {name}
          </h1>
        ))}
        <h3 className="w-2/5 mt-2 text-2xl font-medium text-slate-400">{description}</h3>

        <Link.External href={url}>
          <Button
            size="lg"
            className="mt-16 rounded-lg"
            startIcon={<LinkIcon width={20} height={20} strokeWidth={2} />}
          >
            <Typography weight={500}>Launch Miso</Typography>
          </Button>
        </Link.External>
        <ProductStats productStats={productStats} />
      </section>
      <section className="py-[75px]">
        <div className="text-center">
          <Typography variant="h1" weight={700}>
            What is {name}?
          </Typography>
          <Typography className="mt-6 text-center text-slate-400" variant="lg">
            The only community curated launchpad platform, available to everyone.
          </Typography>
          <Typography className="text-center text-slate-400" variant="lg">
            MISO enables project owners to easily launch a token in a true permissionless and decentralized way.
          </Typography>
        </div>

        <div className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(360px,1fr))] gap-6">
          {usps.map((usp, i) => (
            <div key={i} className="flex gap-6 p-4">
              <div className="bg-slate-800 rounded-full min-w-[56px] h-14 flex items-center justify-center">
                <CheckIcon className="text-[#7CFF6B] w-10" />
              </div>
              <p className="text-lg text-slate-400">{usp}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(360px,1fr))] mt-[70px] gap-x-6 gap-y-8">
          {cards.map((card, i) => (
            <div
              key={i}
              className="p-px h-[415px] rounded-3xl"
              style={{
                background: !i ? `linear-gradient(218.8deg, ${color} 2.35%, rgba(0, 0, 0, 0) 97.65%)` : 'unset',
              }}
            >
              <div className="p-12 h-full bg-[#212939] rounded-3xl">
                <card.Icon />
                <div className="mt-11">
                  <Typography weight={700} variant="h3">
                    {card.title}
                  </Typography>
                </div>
                <div className="mt-5">
                  <Typography variant="sm" className="text-slate-400">
                    {card.subtitle}
                  </Typography>
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
        productName={productSlug}
        isLoading={isValidating}
      />
      <ProductArticles
        title={`Learn about ${name}`}
        subtitle="Check out our tutorials and explainers"
        articles={relevantArticles}
        productName={productSlug}
        isLoading={isValidating}
      />
      <ProductTechnicalDoc color="#FF855F" secondaryColor={color} />
      <ProductFaq faq={faq} />
    </Container>
  )
}

export default ProductPage
