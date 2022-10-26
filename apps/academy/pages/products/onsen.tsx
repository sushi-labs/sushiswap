import { ArrowRightCircleIcon } from '@heroicons/react/24/solid'
import { Button, classNames, Container, Link, Typography } from '@sushiswap/ui'
import onsenImg from 'common/assets/onsen-img.png'
import { ProductArticles, ProductBackground, ProductFaq, ProductStats, ProductTechnicalDoc } from 'common/components'
import { DEFAULT_SIDE_PADDING } from 'common/helpers'
import {
  AcademyIcon,
  MoneyBagIcon,
  MoneyHandIcon,
  MoneyTreeIcon,
  PeopleIcon,
  PuzzlePieceIcon,
  ScreenCheckIcon,
  TilesIcon,
  TradingIcon,
} from 'common/icons'
import { getLatestAndRelevantArticles, getProducts } from 'lib/api'
import { InferGetStaticPropsType } from 'next'
import Image from 'next/image'
import { FC } from 'react'
import useSWR from 'swr'

import { ArticleEntity } from '.mesh'

const productSlug = 'onsen'
const color = '#75B5F0'
const accentColor = '#187BD8'
const productStats = [
  { value: '20', name: 'Projects Launched' },
  { value: '$500m', name: 'Funds Raised' },
  { value: '13k', name: 'Users Participated' },
  { value: '$4m', name: 'Volume Generated' },
]
const cards = [
  {
    Icon: () => <AcademyIcon color={accentColor} Icon={TilesIcon} />,
    title: 'Earn some of the highest yields in DeFi',
    subtitle: 'Earn some of the highest yields on new, exciting projects.',
  },
  {
    Icon: () => <AcademyIcon color={accentColor} Icon={MoneyTreeIcon} />,
    title: 'Deep Liquidity',
    subtitle:
      'Provides incentives to pool tokens into BentoBox, providing deeper liquidity for trades on Trident AMMs and Kashi lending markets.',
  },
  {
    Icon: () => <AcademyIcon color={accentColor} Icon={MoneyHandIcon} />,
    title: 'Multichain Deployment',
    subtitle: 'Deployed across 14+ chains, never miss another opportunity to farm on a new chain again.',
  },
  {
    Icon: () => <AcademyIcon color={accentColor} Icon={PuzzlePieceIcon} />,
    title: 'Attract Liquidity & Attention',
    subtitle: 'Get incentives from Sushi to match with your own, attracting liquidity and attention to your project.',
  },
  {
    Icon: () => <AcademyIcon color={accentColor} Icon={MoneyBagIcon} />,
    title: 'Earn Yield & Boost Efficiency',
    subtitle:
      'Earn yield on treasury tokens, ease the burden of impermanent loss and decrease the price impact/slippage of individual trades, improving cost efficiency.',
  },
  {
    Icon: () => <AcademyIcon color={accentColor} Icon={ScreenCheckIcon} />,
    title: 'Security Audited',
    subtitle: 'Safe, fully audited for security and peace of mind.',
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
  const traderCards = cards.slice(0, 3)
  const projectCards = cards.slice(3)

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
                startIcon={<ArrowRightCircleIcon width={20} height={20} />}
              >
                <Typography weight={500}>Enter App</Typography>
              </Button>
            </Link.External>
          </div>
          <div className="md:block hidden">
            <Image src={onsenImg} unoptimized alt="furo-img" />
          </div>
        </div>

        <ProductStats productStats={productStats} />
      </section>

      <section className="py-[75px]">
        <div className="text-center">
          <Typography variant="h1" weight={700}>
            What is {name}?
          </Typography>
          <Typography className="mt-6 text-center text-slate-400" variant="lg">
            Onsen aims to bring new liquidity to Sushi, decrease slippage, expand our pool offerings, and foster
            exciting synergistic partnerships with other DeFi projects.
          </Typography>
        </div>

        <div className="grid gap-6 mt-[70px]">
          <div className="flex items-center gap-4">
            <TradingIcon />
            <span className="font-bold text-2xl">For Traders</span>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-x-6 gap-y-8">
            {traderCards.map((card, i) => (
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
        </div>
        <div className="grid gap-6 mt-20">
          <div className="flex items-center gap-4">
            <PeopleIcon />
            <span className="font-bold text-2xl">For Projects</span>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-x-6 gap-y-8">
            {projectCards.map((card, i) => (
              <div key={i} className="p-12 h-full bg-[#212939] rounded-3xl">
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
            ))}
          </div>
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
      <ProductTechnicalDoc color={color} secondaryColor="#FEC464" />
      <ProductFaq faq={faq} />
    </Container>
  )
}

export default ProductPage
