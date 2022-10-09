import { Disclosure } from '@headlessui/react'
import { ChevronDownIcon, LinkIcon } from '@heroicons/react/24/outline'
import { ArrowRightIcon } from '@heroicons/react/24/solid'
import { Button, classNames, Container, IconButton, Typography } from '@sushiswap/ui'
import { ArticleList, Card } from 'common/components'
import { ProductCard } from 'common/components/ProductCard'
import { defaultSidePadding } from 'common/helpers'
import { StatisticsReportIcon } from 'common/icons'
import { getArticles } from 'lib/api'
import ErrorPage from 'next/error'
import { useRouter } from 'next/router'
import useSWR from 'swr'

import { ArticleEntity } from '.mesh'

enum Product {
  BentoBox = 'bentobox',
}

const productsInfo = {
  [Product.BentoBox]: {
    title: 'BentoBox',
    subtitle: 'The interest-bearing DeFi base layer',
    description:
      'BentoBox is unique token vault that generates yield (interest) on your tokens, while also allowing you to utilize them in DeFi protocols like lending markets ir liquidity pools.',
    cards: [
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
        subtitle:
          'Profit from efficiencies of a growing protocol, by saving on gas fees on each dApp deployed on Bento.',
      },
      {
        img: StatisticsReportIcon,
        title: 'Smooth UX',
        subtitle: 'Approvals are inherited by the system, making individual transactions within Bento cheaper.',
      },
    ],
  },
}

const ProductPage = () => {
  const router = useRouter()
  const { product } = router.query as { product: Product }
  const productInfo = productsInfo[product]
  const { data: articlesData, isValidating } = useSWR(
    [`/products/${product}`],
    async () => {
      return (
        await getArticles({
          pagination: { limit: 3 },
          filters: {
            // TODO: product filter here
          },
        })
      )?.articles
    },
    { revalidateOnFocus: false, revalidateIfStale: false, revalidateOnReconnect: false }
  )

  const articles = articlesData?.data
  if (!productInfo) return <ErrorPage statusCode={404} title="Product could not be found" />
  const { title, subtitle, description, cards } = productInfo
  return (
    <Container maxWidth="6xl" className={classNames('mx-auto pt-10 pb-24', defaultSidePadding)}>
      <section className="flex flex-col items-center">
        <Typography variant="hero" weight={700}>
          {title}
        </Typography>
        <Typography variant="h3" weight={500} className="text-gray-500">
          {subtitle}
        </Typography>
        <Button
          color="pink"
          size="lg"
          className="mt-16 rounded-full"
          startIcon={<LinkIcon width={20} height={20} stroke="black" />}
        >
          <Typography weight={700} className="text-black">
            Linking to farm
          </Typography>
        </Button>
      </section>

      <section className="mt-40">
        <div className="text-center">
          <Typography variant="h1" weight={700}>
            What is {title}?
          </Typography>
          <Typography className="mt-6 text-center text-gray-500" variant="lg">
            {description}
          </Typography>
        </div>

        <div className="grid grid-cols-3 mt-24 gap-x-6 gap-y-8">
          {cards.map((card, i) => (
            <ProductCard
              key={i}
              title={card.title}
              subtitle={card.subtitle}
              img={<card.img />}
              gradientBorderColor={!i && '#FF5EAF'}
            />
          ))}
        </div>
      </section>

      <section className="mt-32">
        <div className="flex items-center justify-between w-full">
          <div>
            <Typography weight={700} variant="h1">
              Blogs
            </Typography>
            <Typography variant="lg" className="mt-3 text-gray-500">
              We are looking to create an NFT platform that focuses on artists.
            </Typography>
          </div>
          <Button variant="outlined" color="pink" className="rounded-full">
            View All
          </Button>
        </div>
        <div className="mt-20">
          {articles && (
            <div className="grid grid-cols-1 gap-4 transition-all sm:grid-cols-2 md:grid-cols-3">
              <ArticleList
                skeletonAmount={3}
                articles={articles as unknown as ArticleEntity[]}
                loading={isValidating}
                render={(article, i) => <Card article={article} key={`article__left__${article?.attributes?.slug}`} />}
              />
            </div>
          )}
        </div>
      </section>
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

      <section className="mt-32">
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
      </section>

      <section className="mt-44">
        <Typography variant="h1">FAQs</Typography>
        <Typography variant="sm">Checkout our how-to articles and Video Tutorials</Typography>
        <div className="mt-16 border divide-y rounded-3xl border-slate-500 divide-slate-500">
          <Disclosure as="div">
            {({ open }) => (
              <>
                <Disclosure.Button className="flex justify-between w-full p-9">
                  <Typography variant="lg">What is Trident and what Pool types does it support?</Typography>
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-700">
                    <ChevronDownIcon
                      width={12}
                      height={12}
                      className={classNames('transition', open && 'transform rotate-180')}
                    />
                  </div>
                </Disclosure.Button>

                <Disclosure.Panel className="text-gray-500 px-9 pb-9">
                  <Typography>
                    Trident is a production framework for building and deploying AMMs, but it is not an AMM itself.
                    While AMMs can be created using the Trident code, there isn’t a specific AMM at the center of
                    Trident. Instead, there is a framework for creating any AMM anyone would ever need.
                  </Typography>
                  <Typography className="mt-9">Trident is able to produce the following pool types:</Typography>
                  <ul className="list-disc list-inside">
                    <li>
                      <Typography weight={700} className="text-white" as="span">
                        Classic pool{' '}
                      </Typography>
                      <Typography as="span">
                        = constant product pool (x * y = k). Classic pools are composed 50% of one token and 50% of
                        another. They’re best for pairing tokens that are unpredictable.
                      </Typography>
                    </li>
                    <li>
                      <Typography weight={700} className="text-white" as="span">
                        Concentrated pool{' '}
                      </Typography>
                      <Typography as="span">
                        = these pools also use two tokens. The difference is that the liquidity in each pool is
                        determined by the ranges set by the pool creator.
                      </Typography>
                    </li>
                    <li>
                      <Typography weight={700} className="text-white" as="span">
                        Stable pools{' '}
                      </Typography>
                      <Typography as="span">
                        = are ideal for pooling “like-kind” assets. These tokens are usually stable coins like USDC and
                        USDT, or other pegged tokens like ETH and stETH, or renBTC and WBTC.
                      </Typography>
                    </li>
                    <li>
                      <Typography weight={700} className="text-white" as="span">
                        Index pools{' '}
                      </Typography>
                      <Typography as="span">
                        = these pools are usually used to create baskets of assets or decentralized index funds; hence
                        the name. These pools can be made of any percentage of tokens equalling 100.
                      </Typography>
                    </li>
                  </ul>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
          <Disclosure as="div">
            {({ open }) => (
              <>
                <Disclosure.Button className="flex justify-between w-full p-9">
                  <Typography variant="lg">What is Trident and what Pool types does it support?</Typography>
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-700">
                    <ChevronDownIcon
                      width={12}
                      height={12}
                      className={classNames('transition', open && 'transform rotate-180')}
                    />
                  </div>
                </Disclosure.Button>

                <Disclosure.Panel className="text-gray-500 px-9 pb-9">
                  <Typography>
                    Trident is a production framework for building and deploying AMMs, but it is not an AMM itself.
                    While AMMs can be created using the Trident code, there isn’t a specific AMM at the center of
                    Trident. Instead, there is a framework for creating any AMM anyone would ever need.
                  </Typography>
                  <Typography className="mt-9">Trident is able to produce the following pool types:</Typography>
                  <ul className="list-disc list-inside">
                    <li>
                      <Typography weight={700} className="text-white" as="span">
                        Classic pool{' '}
                      </Typography>
                      <Typography as="span">
                        = constant product pool (x * y = k). Classic pools are composed 50% of one token and 50% of
                        another. They’re best for pairing tokens that are unpredictable.
                      </Typography>
                    </li>
                    <li>
                      <Typography weight={700} className="text-white" as="span">
                        Concentrated pool{' '}
                      </Typography>
                      <Typography as="span">
                        = these pools also use two tokens. The difference is that the liquidity in each pool is
                        determined by the ranges set by the pool creator.
                      </Typography>
                    </li>
                    <li>
                      <Typography weight={700} className="text-white" as="span">
                        Stable pools{' '}
                      </Typography>
                      <Typography as="span">
                        = are ideal for pooling “like-kind” assets. These tokens are usually stable coins like USDC and
                        USDT, or other pegged tokens like ETH and stETH, or renBTC and WBTC.
                      </Typography>
                    </li>
                    <li>
                      <Typography weight={700} className="text-white" as="span">
                        Index pools{' '}
                      </Typography>
                      <Typography as="span">
                        = these pools are usually used to create baskets of assets or decentralized index funds; hence
                        the name. These pools can be made of any percentage of tokens equalling 100.
                      </Typography>
                    </li>
                  </ul>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        </div>
      </section>
    </Container>
  )
}

export default ProductPage
