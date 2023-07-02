'use client'

import { ExternalLinkIcon } from '@heroicons/react-v1/solid'
import { ChainId } from '@sushiswap/chain'
import { usePool } from '@sushiswap/client'
import { Link } from '@sushiswap/ui'
import { AppearOnMount } from '@sushiswap/ui/components/animation'
import { Container } from '@sushiswap/ui/components/container'
import { isTridentPoolProtocol } from 'lib/functions'
import { useSWRConfig } from 'swr'
import {
  AddSectionLegacy,
  AddSectionMyPosition,
  AddSectionStake,
  AddSectionTrident,
  Layout,
  PoolPositionProvider,
  PoolPositionStakedProvider,
} from 'ui/pool'

export default function Page({ params }: { params: { id: string } }) {
  const [chainId, address] = params.id.split('%3A') as [ChainId, string]
  const { data: pool } = usePool({
    args: { chainId, address },
    swrConfig: useSWRConfig(),
    shouldFetch: Boolean(chainId && address),
  })

  if (!pool) return <></>

  return (
    <>
      <PoolPositionProvider pool={pool}>
        <PoolPositionStakedProvider pool={pool}>
          <Layout>
            <div className="grid grid-cols-1 sm:grid-cols-[340px_auto] md:grid-cols-[auto_396px_264px] gap-10">
              <div className="hidden md:block" />
              <div className="flex flex-col order-3 gap-3 pb-40 sm:order-2">
                {isTridentPoolProtocol(pool.protocol) ? (
                  <AddSectionTrident pool={pool} />
                ) : (
                  <AddSectionLegacy pool={pool} />
                )}
                <AddSectionStake poolId={pool.id} />
                <Container className="flex justify-center">
                  <Link.External
                    href="https://docs.sushi.com/docs/Products/Sushiswap/Liquidity%20Pools"
                    className="flex justify-center px-6 py-4 dark:decoration-slate-500 decoration-gray-500 hover:bg-opacity-[0.06] cursor-pointer rounded-2xl"
                  >
                    <p className="text-xs font-medium flex items-center gap-1 text-gray-600 dark:text-slate-500">
                      Learn more about liquidity and yield farming
                      <ExternalLinkIcon width={16} height={16} className="text-gray-600 dark:text-slate-500" />
                    </p>
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

// export const getStaticPaths: GetStaticPaths = async () => {
//   const pools = await getPools({ take: 100, orderBy: 'liquidityUSD', orderDir: 'desc', chainIds: SUPPORTED_CHAIN_IDS })

//   // Get the paths we want to pre-render based on pairs
//   const paths = pools
//     .sort(({ liquidityUSD: a }, { liquidityUSD: b }) => {
//       return Number(b) - Number(a)
//     })
//     .slice(0, 100)
//     .map((pool) => ({
//       params: { id: pool.id },
//     }))

//   // We'll pre-render only these paths at build time.
//   // { fallback: blocking } will server-render pages
//   // on-demand if the path doesn't exist.
//   return { paths, fallback: 'blocking' }
// }

// export const getStaticProps: GetStaticProps = async ({ params }) => {
//   const [chainId, address] = (params?.id as string).split(':') as [ChainId, string]
//   const pool = await getPool({ chainId, address })
//   if (!pool) {
//     throw new Error(`Failed to fetch pool, received ${pool}`)
//   }
//   return {
//     props: {
//       fallback: {
//         [getPoolUrl({ chainId, address })]: pool,
//       },
//     },
//     revalidate: 60,
//   }
// }

// export default Add
