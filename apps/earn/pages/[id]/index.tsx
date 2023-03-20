import { formatPercent } from '@sushiswap/format'
import { AppearOnMount, BreadcrumbLink } from '@sushiswap/ui'
import { SUPPORTED_CHAIN_IDS } from '../../config'
import { getPool, usePool, getPools, getPoolUrl, Pool } from '@sushiswap/client'
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { SWRConfig, useSWRConfig } from 'swr'

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
} from '../../components'
import { POOL_TYPE_MAP } from '../../lib/constants'
import { ChainId } from '@sushiswap/chain'
import { NextSeo } from 'next-seo'

const LINKS = (pool: Pool): BreadcrumbLink[] => [
  {
    href: `/${pool.id}`,
    label: `${pool.name} - ${POOL_TYPE_MAP[pool.type]} - ${formatPercent(pool.swapFee)}`,
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

  return (
    <>
      <NextSeo title={`${pool.name} - ${formatPercent(pool.swapFee)}`} />
      <PoolPositionProvider pool={pool}>
        <PoolPositionStakedProvider pool={pool}>
          <PoolPositionRewardsProvider pool={pool}>
            <Layout breadcrumbs={LINKS(pool)}>
              <div className="flex flex-col lg:grid lg:grid-cols-[568px_auto] gap-12">
                <div className="flex flex-col order-1 gap-9">
                  <PoolHeader pool={pool} />
                  <hr className="my-3 border-t border-slate-200/5" />
                  <PoolChart pool={pool} />
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
    .slice(0, 250)
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
