import { formatPercent } from '@sushiswap/format'
import { AppearOnMount, BreadcrumbLink } from '@sushiswap/ui'
import { SUPPORTED_CHAIN_IDS } from '../../config'
import { getPool, usePool, getPools, getPoolUrl, Pool, Protocol } from '@sushiswap/client'
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { SWRConfig, useSWRConfig } from 'swr'

import {
  Layout,
  PoolActionBar,
  PoolButtons,
  PoolChartV2,
  PoolComposition,
  PoolHeader,
  PoolMyRewards,
  PoolPosition,
  PoolPositionProvider,
  PoolPositionRewardsProvider,
  PoolPositionStakedProvider,
  PoolRewards,
  PoolStats,
  UnknownTokenAlert,
  PoolTransactionsV2,
} from '../../components'
import { PROTOCOL_MAP } from '../../lib/constants'
import { ChainId } from '@sushiswap/chain'
import { NextSeo } from 'next-seo'
import { PoolPageV3 } from '../../components/PoolPageV3'

const LINKS = (pool: Pool): BreadcrumbLink[] => [
  {
    href: `/${pool.id}`,
    label: `${pool.name} - ${PROTOCOL_MAP[pool.protocol]} - ${formatPercent(pool.swapFee)}`,
  },
]

const Pool: FC<InferGetStaticPropsType<typeof getStaticProps>> = ({ fallback }) => {
  return (
    <>
      <SWRConfig value={{ fallback }}>
        <_Pool />
      </SWRConfig>
    </>
  )
}

const _Pool = () => {
  const router = useRouter()

  const [chainId, address] = (router.query.id as string).split(':') as [ChainId, string]

  const { data: pool } = usePool({
    args: { chainId, address },
    swrConfig: useSWRConfig(),
    shouldFetch: Boolean(chainId && address),
  })

  if (!pool) return <></>

  if (pool.protocol === Protocol.SUSHISWAP_V3) {
    return <PoolPageV3 />
  }

  return (
    <>
      <NextSeo title={`${pool.name} - ${formatPercent(pool.swapFee)}`} />
      <PoolPositionProvider pool={pool}>
        <PoolPositionStakedProvider pool={pool}>
          <PoolPositionRewardsProvider pool={pool}>
            <Layout breadcrumbs={LINKS(pool)}>
              <div className="flex flex-col gap-9">
                <UnknownTokenAlert pool={pool} />
                <div className="flex flex-col lg:grid lg:grid-cols-[568px_auto] gap-12">
                  <div className="flex flex-col order-1 gap-9">
                    <PoolHeader pool={pool} />
                    <hr className="my-3 border-t border-gray-900/5 dark:border-slate-200/5" />
                    <PoolChartV2 address={address} chainId={chainId} />
                    <PoolStats pool={pool} />
                    <PoolComposition pool={pool} />
                    <PoolRewards pool={pool} />
                  </div>

                  <div className="flex flex-col order-2 gap-4">
                    <AppearOnMount>
                      <div className="flex flex-col gap-10">
                        <PoolMyRewards pool={pool} />
                        <PoolPosition pool={pool} />
                      </div>
                    </AppearOnMount>
                    <div className="hidden lg:flex">
                      <PoolButtons pool={pool} />
                    </div>
                  </div>
                </div>
                <div className="w-full bg-gray-900/5 dark:bg-slate-200/5 my-5 md:my-10 h-0.5" />
                <PoolTransactionsV2 pool={pool} poolId={address} />
              </div>
            </Layout>
            <PoolActionBar pool={pool} />
          </PoolPositionRewardsProvider>
        </PoolPositionStakedProvider>
      </PoolPositionProvider>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const pools = await getPools({ take: 100, orderBy: 'liquidityUSD', orderDir: 'desc', chainIds: SUPPORTED_CHAIN_IDS })

  // Get the paths we want to pre-render based on pairs
  const paths = pools
    .sort(({ liquidityUSD: a }, { liquidityUSD: b }) => {
      return Number(b) - Number(a)
    })
    .slice(0, 50)
    .map((pool) => ({
      params: { id: pool.id },
    }))

  // We'll pre-render only these paths at build time.
  // { fallback: blocking } will server-render pages
  // on-demand if the path doesn't exist.
  return { paths, fallback: 'blocking' }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const [chainId, address] = (params?.id as string).split(':') as [ChainId, string]
  const pool = await getPool({ chainId, address })
  if (!pool) {
    throw new Error(`Failed to fetch pool, received ${pool}`)
  }
  return {
    props: {
      fallback: {
        [getPoolUrl({ chainId, address })]: pool,
      },
    },
    revalidate: 60,
  }
}

export default Pool
