import { ArrowRightCircleIcon } from '@heroicons/react/24/solid'
import { Button, classNames, Container, Link, Typography } from '@sushiswap/ui'
import {
  ProductArticles,
  ProductBackground,
  ProductCards,
  ProductFaq,
  ProductStats,
  ProductTechnicalDoc,
} from 'common/components'
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
    title: 'Utilize funds in multiple DeFi apps',
    subtitle:
      'Bento’s innovation is its ability to track the user’s deposits via artificial balance, which is used to account for their idle funds...',
  },
  {
    Icon: () => <AcademyIcon color={accentColor} Icon={MoneyTreeIcon} />,
    title: 'Earn some of the highest yield in DeFi',
    subtitle: 'Being the foundation for multiple DeFi apps, Bentobox can attract more capital than simple vaults.',
  },
  {
    Icon: () => <AcademyIcon color={accentColor} Icon={MoneyHandIcon} />,
    title: 'Flashloans',
    subtitle:
      'The funds in Bento can also be used in flash loans, which can add more passive value to the user’s underutilized capital.',
  },
  {
    Icon: () => <AcademyIcon color={accentColor} Icon={PuzzlePieceIcon} />,
    title: 'Plug’n’play interest pools for your DeFi app',
    subtitle: 'Build your own DeFi apps on top of Bento, to instantly utilize the 500m+ TVL',
  },
  {
    Icon: () => <AcademyIcon color={accentColor} Icon={MoneyBagIcon} />,
    title: 'Capital efficiency',
    subtitle: 'Profit from efficiencies of a growing protocol, by saving on gas fees on each dApp deployed on Bento.',
  },
  {
    Icon: () => <AcademyIcon color={accentColor} Icon={ScreenCheckIcon} />,
    title: 'Smooth UX',
    subtitle: 'Approvals are inherited by the system, making individual transactions within Bento cheaper.',
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

  const latestArticles = (data?.articles?.data ?? []) as ArticleEntity[]
  const relevantArticles = (data?.relevantArticles?.data ?? []) as ArticleEntity[]

  return (
    <Container maxWidth="6xl" className={classNames('mx-auto pt-10 pb-24', defaultSidePadding)}>
      <ProductBackground color={color} />
      <section className="py-[75px]">
        <h3 className="text-2xl font-medium text-gray-400">{description}</h3>
        <h1 className="w-2/5 mt-10 text-6xl font-bold">{longName}</h1>

        <Link.External href={url}>
          <Button size="lg" className="mt-16 rounded-lg" startIcon={<ArrowRightCircleIcon width={20} height={20} />}>
            <Typography weight={500}>Enter App</Typography>
          </Button>
        </Link.External>
        <ProductStats productStats={productStats} />
      </section>
      <ProductCards
        name={longName}
        description="Onsen aims to bring new liquidity to Sushi, decrease slippage, expand our pool offerings, and foster exciting synergistic partnerships with other DeFi projects."
        cards={cards}
        gradientBorderColor={color}
      />
      <ProductArticles
        title="Articles"
        subtitle="We are looking to create an NFT platform that focuses on artists."
        articles={latestArticles}
        productName={productSlug}
        isLoading={isValidating}
      />
      <ProductArticles
        title={`Learn about ${name}`}
        subtitle="Checkout our how-to articles"
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
