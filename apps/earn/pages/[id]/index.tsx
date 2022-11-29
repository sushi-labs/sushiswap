//import { Tab } from '@headlessui/react'
import { chainShortName } from '@sushiswap/chain'
import { formatPercent } from '@sushiswap/format'
import { getBuiltGraphSDK, Pair } from '@sushiswap/graph-client'
import { AppearOnMount, BreadcrumbLink, classNames, Typography } from '@sushiswap/ui'
import { SUPPORTED_CHAIN_IDS } from 'config'
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import { useRouter } from 'next/router'
import { FC } from 'react'
import useSWR, { SWRConfig } from 'swr'

import {
  Layout,
  PoolActionBar,
  PoolButtons,
  PoolChart,
  PoolComposition,
  PoolHeader,
  PoolMyRewards,
  PoolPosition,
  PoolPositionProvider,
  PoolPositionRewardsProvider,
  PoolPositionStakedProvider,
  PoolRewards,
  PoolStats,
  SwapsTable
} from '../../components'
import { GET_POOL_TYPE_MAP } from '../../lib/constants'

const LINKS = ({ pair }: { pair: Pair }): BreadcrumbLink[] => [
  {
    href: `/${pair.id}`,
    label: `${pair.name} - ${GET_POOL_TYPE_MAP[pair.type]} - ${formatPercent(pair.swapFee / 10000)}`,
  },
]

const Pool: FC<InferGetStaticPropsType<typeof getStaticProps>> = ({ fallback }) => {
  return (
    <SWRConfig value={{ fallback }}>
      <_Pool />
    </SWRConfig>
  )
}

const _Pool = () => {
  const router = useRouter()
  const { data } = useSWR<{ pair: Pair }>(`/earn/api/pool/${router.query.id}`, (url) =>
    fetch(url).then((response) => response.json())
  )
  
  if (!data) return <></>
  const { pair } = data
  
  return (
    <PoolPositionProvider pair={pair}>
      <PoolPositionStakedProvider pair={pair}>
        <PoolPositionRewardsProvider pair={pair}>
          <Layout breadcrumbs={LINKS(data)}>
            <div className="flex flex-col lg:grid lg:grid-cols-[568px_auto] gap-12">
              <div className="flex flex-col order-1 gap-9">
                <PoolHeader pair={pair} />
                <hr className="my-3 border-t border-slate-200/5" />
                <PoolChart pair={pair} />
                <AppearOnMount>
                  <PoolStats pair={pair} />
                </AppearOnMount>
                <PoolComposition pair={pair} />
                <PoolRewards pair={pair} />
              </div>

              <div className="flex flex-col order-2 gap-4">
                <AppearOnMount>
                  <div className="flex flex-col gap-10">
                    <PoolMyRewards pair={pair} />
                    <PoolPosition pair={pair} />
                  </div>
                </AppearOnMount>
                <div className="hidden lg:flex">
                  <PoolButtons pair={pair} />
                </div>
              </div>
            </div>
            <section className="flex flex-col mt-8">
              <div className="flex flex-col w-full gap-4">
                <div className="flex items-center gap-6 px-2">
                  <Typography weight={600} className="text-slate-50">
                    Swaps
                  </Typography>
                </div>                
                <SwapsTable pair={pair}/>
              </div>
            </section>            
          </Layout>
          <PoolActionBar pair={pair} />
        </PoolPositionRewardsProvider>
      </PoolPositionStakedProvider>
    </PoolPositionProvider>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const sdk = getBuiltGraphSDK()
  const { pairs } = await sdk.PairsByChainIds({
    first: 250,
    orderBy: 'liquidityUSD',
    orderDirection: 'desc',
    chainIds: SUPPORTED_CHAIN_IDS,
  })

  // Get the paths we want to pre-render based on pairs
  const paths = pairs
    .sort(({ liquidityUSD: a }, { liquidityUSD: b }) => {
      return Number(b) - Number(a)
    })
    .slice(0, 250)
    .map((pair, i) => ({
      params: { id: `${chainShortName[pair.chainId]}:${pair.address}` },
    }))

  // We'll pre-render only these paths at build time.
  // { fallback: blocking } will server-render pages
  // on-demand if the path doesn't exist.
  return { paths, fallback: 'blocking' }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const sdk = getBuiltGraphSDK()
  const id = params?.id as string
  const { pair } = await sdk.PairById({ id })

  if (!pair) {
    // If there is a server error, you might want to
    // throw an error instead of returning so that the cache is not updated
    // until the next successful request.
    throw new Error(`Failed to fetch pair, received ${pair}`)
  }

  return {
    props: {
      fallback: {
        [`/earn/api/pool/${id}`]: { pair },
      },
    },
    revalidate: 60,
  }
}

export default Pool
