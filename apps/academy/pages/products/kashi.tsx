import { LinkIcon } from '@heroicons/react/24/outline'
import { Button, classNames, Container, Link, Typography } from '@sushiswap/ui'
import kashiImg from 'common/assets/kashi-img.png'
import {
  ProductArticles,
  ProductBackground,
  ProductCards,
  ProductFaq,
  ProductStats,
  ProductTechnicalDoc,
} from 'common/components'
import { DEFAULT_SIDE_PADDING } from 'common/helpers'
import { AcademyIcon, MoneyBagIcon, MoneyHandIcon, MoneyTreeIcon, PuzzlePieceIcon, TilesIcon } from 'common/icons'
import { getLatestAndRelevantArticles, getProducts } from 'lib/api'
import { InferGetStaticPropsType } from 'next'
import Image from 'next/image'
import { FC } from 'react'
import useSWR from 'swr'

import { ArticleEntity } from '.mesh'

const productSlug = 'kashi'
const color = '#FF5EAF'
const accentColor = '#D84D7F'
const productStats = [
  { value: '20', name: 'Projects Launched' },
  { value: '$500m', name: 'Funds Raised' },
  { value: '13k', name: 'Users Participated' },
  { value: '$4m', name: 'Volume Generated' },
]
const cards = [
  {
    Icon: () => <AcademyIcon color={accentColor} Icon={TilesIcon} />,
    title: 'Isolated Lending Pairs',
    subtitle:
      'Anyone can create a pair, it’s up to users which pairs they find safe enough; risk is isolated to just that pair.',
  },
  {
    Icon: () => <AcademyIcon color={accentColor} Icon={MoneyTreeIcon} />,
    title: 'Flexible',
    subtitle: 'Flexible oracles, both on-chain and off-chain.',
  },
  {
    Icon: () => <AcademyIcon color={accentColor} Icon={MoneyHandIcon} />,
    title: 'Liquid Utilization Range',
    subtitle: 'Liquid interest rates based on a specific target utilization range.',
  },
  {
    Icon: () => <AcademyIcon color={accentColor} Icon={PuzzlePieceIcon} />,
    title: 'Lowest Gas Fees',
    subtitle: 'Flexible/composable contracts optimized for low gas consumption.',
  },
  {
    Icon: () => <AcademyIcon color={accentColor} Icon={MoneyBagIcon} />,
    title: 'Flash Loans',
    subtitle:
      'Built on the BentoBox, so supplied assets can be used for flash loans and strategies, providing extra revenue for liquidity providers.',
  },
  {
    Icon: () => <AcademyIcon color={accentColor} Icon={MoneyBagIcon} />,
    title: 'Smooth UX',
    subtitle: 'Benefits of liquidations go to the liquidity providers, not the liquidators.',
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
      <section className="py-[75px] relative">
        <div className="grid md:grid-cols-2">
          <div>
            {longName.split('-').map((name, i) => (
              <h1 key={i} className="text-6xl font-bold leading-[78px]">
                {name}
              </h1>
            ))}
            <h3 className="mt-2 text-2xl font-medium text-slate-400">{description}</h3>
            <Link.External href={url}>
              <Button
                size="lg"
                className="mt-16 rounded-lg"
                startIcon={<LinkIcon width={20} height={20} strokeWidth={2} />}
              >
                <Typography weight={500}>Linking to kashi</Typography>
              </Button>
            </Link.External>
          </div>
          <div className="md:block hidden">
            <Image src={kashiImg} unoptimized alt="kashi-img" />
          </div>
        </div>

        <ProductStats productStats={productStats} />
      </section>
      <ProductCards
        name={name}
        description="Kashi is a lending and margin trading platform, built on the BentoBox, allowing lenders to earn yield on their pooled funds and borrowers to take out token loans. Kashi solves problems with existing lending markets, by introducing new paradigms:"
        cards={cards}
        gradientBorderColor={color}
      />
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
      <ProductTechnicalDoc color="#5F82FF" secondaryColor={accentColor} />
      <ProductFaq faq={faq} />
    </Container>
  )
}

export default ProductPage
