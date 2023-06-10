import { ExternalLinkIcon } from '@heroicons/react/solid'
import { formatPercent } from '@sushiswap/format'
import { AppearOnMount, BreadcrumbLink, Container, Link, Typography } from '@sushiswap/ui'
import { SUPPORTED_CHAIN_IDS } from '../../config'
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { SWRConfig } from 'swr'

import {
  AddSectionMyPosition,
  Layout,
  PoolPositionProvider,
  PoolPositionStakedProvider,
  RemoveSectionLegacy,
  RemoveSectionTrident,
  RemoveSectionUnstake,
  UnknownTokenAlert,
} from '../../components'
import { PROTOCOL_MAP } from '../../lib/constants'
import { getPool, getPools, usePool, Pool, getPoolUrl } from '@sushiswap/client'
import { ChainId } from '@sushiswap/chain'
import { useSWRConfig } from 'swr/_internal'
import { NextSeo } from 'next-seo'
import { isTridentPoolProtocol } from '../../lib/functions'

const LINKS = (pool: Pool): BreadcrumbLink[] => [
  {
    href: `/${pool.id}`,
    label: `${pool.name} - ${PROTOCOL_MAP[pool.protocol]} - ${formatPercent(pool.swapFee)}`,
  },
  {
    href: `/${pool.id}/remove`,
    label: `Remove Liquidity`,
  },
]

const Remove: FC<InferGetStaticPropsType<typeof getStaticProps>> = ({ fallback }) => {
  return (
    <SWRConfig value={{ fallback }}>
      <_Remove />
    </SWRConfig>
  )
}

const _Remove = () => {
  const router = useRouter()

  const [chainId, address] = (router.query.id as string).split(':') as [ChainId, string]
  const { data: pool } = usePool({
    args: { chainId, address },
    swrConfig: useSWRConfig(),
    shouldFetch: Boolean(chainId && address),
  })

  if (!pool) return <></>
  // console.log(pool.protocol)

  return (
    <>
      <NextSeo title={`Remove liquidity ${pool.name} - ${formatPercent(pool.swapFee)}`} />
      <PoolPositionProvider pool={pool}>
        <PoolPositionStakedProvider pool={pool}>
          <Layout breadcrumbs={LINKS(pool)}>
            <div className="grid grid-cols-1 sm:grid-cols-[340px_auto] md:grid-cols-[auto_396px_264px] gap-10">
              <div className="hidden md:block" />
              <div className="flex flex-col order-3 gap-3 pb-40 sm:order-2">
                <RemoveSectionUnstake poolId={pool.id} />
                {isTridentPoolProtocol(pool.protocol) ? (
                  <RemoveSectionTrident pool={pool} />
                ) : (
                  <RemoveSectionLegacy pool={pool} />
                )}
                <Container className="flex justify-center">
                  <Link.External
                    href="https://docs.sushi.com/docs/Products/Sushiswap/Liquidity%20Pools"
                    className="flex justify-center px-6 py-4 decoration-slate-500 hover:bg-opacity-[0.06] cursor-pointer rounded-2xl"
                  >
                    <Typography
                      variant="xs"
                      weight={500}
                      className="flex items-center gap-1 text-gray-600 dark:text-slate-500"
                    >
                      Learn more about liquidity and yield farming
                      <ExternalLinkIcon width={16} height={16} className="text-gray-600 dark:text-slate-500" />
                    </Typography>
                  </Link.External>
                </Container>
              </div>
              <div className="order-1 sm:order-3">
                <AppearOnMount>
                  <AddSectionMyPosition pool={pool} />
                </AppearOnMount>
              </div>
            </div>
          </Layout>
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

export default Remove
