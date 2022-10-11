import { classNames, Container, Typography } from '@sushiswap/ui'
import { ProductArticles, ProductCards, ProductFaq, ProductHero } from 'common/components'
import { defaultSidePadding } from 'common/helpers'
import { StatisticsReportIcon } from 'common/icons'
import { getArticles, getProducts } from 'lib/api'
import { InferGetStaticPropsType } from 'next'
import { FC } from 'react'
import useSWR from 'swr'

import { ArticleEntity } from '.mesh'

const productName = 'bentobox'

const cards = [
  {
    img: StatisticsReportIcon,
    title: 'Utilize funds in multiple DeFi apps',
    subtitle:
      'Bento’s innovation is its ability to track the user’s deposits via artificial balance, which is used to account for their idle funds...',
  },
  {
    img: StatisticsReportIcon,
    title: 'Earn some of the highest yield in DeFi',
    subtitle: 'Being the foundation for multiple DeFi apps, Bentobox can attract more capital than simple vaults.',
  },
  {
    img: StatisticsReportIcon,
    title: 'Flashloans',
    subtitle:
      'The funds in Bento can also be used in flash loans, which can add more passive value to the user’s underutilized capital.',
  },
  {
    img: StatisticsReportIcon,
    title: 'Plug’n’play interest pools for your DeFi app',
    subtitle: 'Build your own DeFi apps on top of Bento, to instantly utilize the 500m+ TVL',
  },
  {
    img: StatisticsReportIcon,
    title: 'Capital efficiency',
    subtitle: 'Profit from efficiencies of a growing protocol, by saving on gas fees on each dApp deployed on Bento.',
  },
  {
    img: StatisticsReportIcon,
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
  const data = await getProducts({ filters: { slug: { eq: productName } } })
  const product = data?.products?.data?.[0].attributes

  return { props: product }
}

const ProductPage: FC<InferGetStaticPropsType<typeof getStaticProps>> = ({
  name,
  longName,
  url,
  description,
  relevantArticleIds,
}) => {
  const { data: articlesData, isValidating } = useSWR(
    [`/bentobox-articles`],
    async () => {
      return (
        await getArticles({
          pagination: { limit: 3 },
          filters: {
            id: { in: relevantArticleIds },
          },
        })
      )?.articles
    },
    { revalidateOnFocus: false, revalidateIfStale: false, revalidateOnReconnect: false }
  )

  const articles = articlesData?.data as unknown as ArticleEntity[]

  return (
    <Container maxWidth="6xl" className={classNames('mx-auto pt-10 pb-24', defaultSidePadding)}>
      <ProductHero title={longName} subtitle={description} url={url} buttonText={'Linking to farm'} />
      <ProductCards
        name={name}
        description="BentoBox is unique token vault that generates yield (interest) on your tokens, while also allowing you to utilize them in DeFi protocols like lending markets ir liquidity pools."
        cards={cards}
        gradientBorderColor="#FF5EAF"
      />
      <ProductArticles
        productName={productName}
        articles={articles}
        subtitle={'We are looking to create an NFT platform that focuses on artists.'}
        isLoading={isValidating}
      />

      <section className="flex flex-col items-center px-20 py-10 mt-32 gap-14 bg-slate-800 rounded-2xl">
        <Typography variant="h1" weight={700}>
          Built on Bento
        </Typography>
        <div className="grid grid-cols-4 gap-32">
          <StatisticsReportIcon />
          <StatisticsReportIcon />
          <StatisticsReportIcon />
          <StatisticsReportIcon />
        </div>
      </section>
      {/* <section className="mt-32">
        <Typography variant="h1">Learn about Bentobox</Typography>
        <Typography variant="sm" className="text-gray-500">
          Checkout our how-to articles and Video Tutorials
        </Typography>
        <div className="flex bg-slate-800 h-[522px] rounded-3xl mt-16">
          <div className="w-3/5 overflow-hidden">video</div>
          <div className="flex flex-col w-2/5 gap-8 p-12">
            <div className="flex items-center gap-3">
              <div className="flex items-center p-3 rounded-full bg-slate-700">
                <StatisticsReportIcon width={20} height={20} />
              </div>
              <Typography variant="h3" weight={500}>
                Step by step Tutorials
              </Typography>
            </div>

            <hr className="border border-slate-200/5" />

            <ol className="flex flex-col list-decimal list-inside gap-7">
              <li>
                <Typography className="inline">Getting Started with Trident</Typography>
              </li>
              <li>
                <Typography className="inline">Type of pool in trident</Typography>
              </li>
              <li>
                <Typography className="inline">How to Participate</Typography>
              </li>
              <li>
                <Typography className="inline">New Designs</Typography>
              </li>
              <li>
                <Typography className="inline">Invest Using Bentobox</Typography>
              </li>
            </ol>
            <Button
              className="flex justify-between px-5 rounded-full"
              color="gray"
              endIcon={<ArrowRightIcon width={20} height={20} />}
            >
              View all Tutorials
            </Button>
          </div>
        </div>

        <div className="flex items-center p-10 mt-10 rounded-3xl bg-slate-800">
          <StatisticsReportIcon width={92} height={92} />
          <div className="ml-8">
            <Typography variant="lg">Documentation</Typography>
            <Typography variant="sm" className="mt-3 text-gray-500">
              The IPool interface was developed by the Sushi team in the process of building. The IPool interface was
              developed by the Sushi team in the process of building.
            </Typography>
          </div>
          <div className="w-12 h-12 ml-6">
            <IconButton className="flex items-center justify-center w-12 h-12 ml-6 bg-[#0C121F] rounded-full">
              <ArrowRightIcon width={20} height={20} />
            </IconButton>
          </div>
        </div>
      </section> */}
      <ProductFaq faq={faq} />
    </Container>
  )
}

export default ProductPage
