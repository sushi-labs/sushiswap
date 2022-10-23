import { LinkIcon } from '@heroicons/react/24/outline'
import { Button, classNames, Container, Link, Typography } from '@sushiswap/ui'
import { ProductArticles, ProductBackground, ProductCards, ProductFaq, ProductTechnicalDoc } from 'common/components'
import { defaultSidePadding } from 'common/helpers'
import {
  AcademyIcon,
  MoneyBagIcon,
  MoneyHandIcon,
  MoneyTreeIcon,
  PuzzlePieceIcon,
  ScreenCheckIcon,
  TilesIcon,
} from 'common/icons'
import { getLatestAndRelevantArticles, getProducts } from 'lib/api'
import { InferGetStaticPropsType } from 'next'
import { FC } from 'react'
import useSWR from 'swr'

import { ArticleEntity } from '.mesh'

const productSlug = 'bentobox'
const color = '#FF5EAF'
const accentColor = '#A048DA'

const cards = [
  {
    Icon: () => <AcademyIcon color={accentColor} Icon={TilesIcon} />,
    title: 'Utilize funds in multiple DeFi apps',
    subtitle:
      'Bento’s innovation is its ability to track the user’s deposits via an artificial balance, which is used to account for the idle funds.',
  },
  {
    Icon: () => <AcademyIcon color={accentColor} Icon={MoneyTreeIcon} />,
    title: 'Earn some of the highest yields in DeFi',
    subtitle: 'As the foundation for multiple DeFi apps, Bentobox can attract more capital than regular vaults.',
  },
  {
    Icon: () => <AcademyIcon color={accentColor} Icon={MoneyHandIcon} />,
    title: 'Flash Loans',
    subtitle:
      'Funds in BentoBox can be used in flash loans, resulting in more passive value to the user’s underutilized capital.',
  },
  {
    Icon: () => <AcademyIcon color={accentColor} Icon={PuzzlePieceIcon} />,
    title: 'Plug ’n play interest pools for your DeFi app',
    subtitle: 'Build your own DeFi apps on top of BentoBox to instantly unlock and utilize 500m+ TVL.',
  },
  {
    Icon: () => <AcademyIcon color={accentColor} Icon={MoneyBagIcon} />,
    title: 'Capital Efficiency',
    subtitle:
      'Profit from efficiencies of a growing protocol, by saving on gas fees on each dApp deployed on BentoBox.',
  },
  {
    Icon: () => <AcademyIcon color={accentColor} Icon={ScreenCheckIcon} />,
    title: 'Smooth UX',
    subtitle: 'Transaction approvals are inherited by the system, making individual txns within BentoBox cheaper.',
  },
]

const faq = [
  {
    question: 'Lorem ipsum',
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

  const latestArticles = (data?.articles?.data ?? []) as ArticleEntity[]
  const relevantArticles = (data?.relevantArticles?.data ?? []) as ArticleEntity[]

  return (
    <Container maxWidth="6xl" className={classNames('mx-auto pt-10 pb-24', defaultSidePadding)}>
      <ProductBackground color={color} />
      <section className="flex flex-col items-center py-[75px]">
        <h1 className="text-6xl font-bold leading-[78px]">{longName}</h1>
        <h3 className="text-2xl mt-1.5 font-medium text-gray-500">{description}</h3>

        <Link.External href={url}>
          <Button
            size="lg"
            className="mt-16 rounded-lg"
            startIcon={<LinkIcon width={20} height={20} strokeWidth={2} />}
          >
            <Typography weight={500}>Linking to farm</Typography>
          </Button>
        </Link.External>
      </section>
      <ProductCards
        name={name}
        description="BentoBox is unique token vault that generates yield (interest) on your tokens, while also allowing you to utilize them in DeFi protocols like lending markets or liquidity pools."
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
        title="Learn about Bentobox"
        subtitle="Check out our tutorials and explainers"
        articles={relevantArticles}
        productName={productSlug}
        isLoading={isValidating}
      />
      <ProductTechnicalDoc color={color} secondaryColor="#FFBCFE" />
      <ProductFaq faq={faq} />
    </Container>
  )
}

export default ProductPage
