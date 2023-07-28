'use client'
import { RadioGroup } from '@headlessui/react'
import { Bars3BottomLeftIcon, ChartBarIcon, FunnelIcon } from '@heroicons/react/24/solid'
import { ArrowLeftIcon } from '@heroicons/react-v1/outline'
import { ChainId } from '@sushiswap/chain'
import { Protocol, usePool } from '@sushiswap/client'
import { Button, Separator, Tabs, TabsContent, TabsList, TabsTrigger } from '@sushiswap/ui'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useSWRConfig } from 'swr'
import {
  AddSectionLegacy,
  AddSectionStake,
  AddSectionTrident,
  Layout,
  PoolChartV2,
  PoolComposition,
  PoolMyRewards,
  PoolPositionProvider,
  PoolPositionRewardsProvider,
  PoolPositionStakedProvider,
  PoolRewards,
  PoolStats,
  PoolTransactionsV2,
  RemoveSectionLegacy,
  RemoveSectionTrident,
  RemoveSectionUnstake,
  UnknownTokenAlert,
} from 'ui/pool'
import { PoolHeader } from 'ui/pool/future/PoolHeader'
import { PoolPageV3 } from 'ui/pool/PoolPageV3'

import { isTridentPoolProtocol } from '../../../lib/functions'

enum SelectedTab {
  Manage,
  Analytics,
  Transactions,
  Rewards,
}

export default function Page({ params }: { params: { id: string; positionId?: string } }) {
  const { back } = useRouter()
  const [chainId, address] = params.id.split('%3A') as [ChainId, string]
  const [tab, setTab] = useState<SelectedTab>(SelectedTab.Manage)

  const { data: pool, isLoading } = usePool({
    args: { chainId, address },
    swrConfig: useSWRConfig(),
    shouldFetch: Boolean(chainId && address),
  })

  if (!pool) return <></>

  return (
    <Layout>
      <Button
        onClick={back}
        size="sm"
        icon={ArrowLeftIcon}
        variant="link"
        asChild
        className="text-muted-foreground mb-4"
      >
        Go back to pools list
      </Button>
      {pool.protocol === Protocol.SUSHISWAP_V3 ? (
        <PoolPageV3 id={params.id} positionId={params.positionId} />
      ) : (
        <PoolPositionProvider pool={pool}>
          <PoolPositionStakedProvider pool={pool}>
            <PoolPositionRewardsProvider pool={pool}>
              <div className="flex flex-col gap-2">
                <PoolHeader
                  title="Pool "
                  address={address}
                  isLoading={isLoading}
                  chainId={chainId}
                  pool={pool}
                  apy={{ rewards: pool?.incentiveApr, fees: pool?.feeApr1d }}
                />
                <RadioGroup value={tab} onChange={setTab} className="flex flex-wrap gap-2 mt-3">
                  <RadioGroup.Option
                    size="sm"
                    value={SelectedTab.Manage}
                    as={Button}
                    icon={FunnelIcon}
                    variant={tab === SelectedTab.Manage ? 'secondary' : 'ghost'}
                  >
                    Manage
                  </RadioGroup.Option>
                  <RadioGroup.Option
                    size="sm"
                    value={SelectedTab.Analytics}
                    as={Button}
                    icon={ChartBarIcon}
                    variant={tab === SelectedTab.Analytics ? 'secondary' : 'ghost'}
                  >
                    Analytics
                  </RadioGroup.Option>
                  <RadioGroup.Option
                    size="sm"
                    value={SelectedTab.Transactions}
                    as={Button}
                    icon={Bars3BottomLeftIcon}
                    variant={tab === SelectedTab.Transactions ? 'secondary' : 'ghost'}
                  >
                    Transactions
                  </RadioGroup.Option>
                </RadioGroup>
              </div>
              <div className="w-full bg-gray-900/5 dark:bg-slate-200/5 my-6 h-px" />
              <div className={tab === SelectedTab.Manage ? 'flex' : 'hidden'}>
                <div className="flex w-full gap-10">
                  <Tabs className="w-full" defaultValue="add">
                    <TabsList className="!flex">
                      <TabsTrigger value="add" className="flex flex-1">
                        Add liquidity
                      </TabsTrigger>
                      <TabsTrigger value="remove" className="flex flex-1">
                        Remove liquidity
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="add" className="mt-6">
                      <div className="grid grid-cols-1 gap-4">
                        {isTridentPoolProtocol(pool.protocol) ? (
                          <AddSectionTrident pool={pool} />
                        ) : (
                          <AddSectionLegacy pool={pool} />
                        )}
                        <AddSectionStake poolId={pool.id} />
                      </div>
                    </TabsContent>
                    <TabsContent value="remove" className="mt-6">
                      <div className="grid grid-cols-1 gap-4">
                        <RemoveSectionUnstake poolId={pool.id} />
                        {isTridentPoolProtocol(pool.protocol) ? (
                          <RemoveSectionTrident pool={pool} />
                        ) : (
                          <RemoveSectionLegacy pool={pool} />
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                  <div className="hidden lg:block">
                    <Separator orientation="vertical" />
                  </div>
                  <div className="w-full">
                    <PoolMyRewards pool={pool} />
                  </div>
                </div>
              </div>
              <div className={tab === SelectedTab.Analytics ? 'block' : 'hidden'}>
                <UnknownTokenAlert pool={pool} />
                <PoolStats pool={pool} />
                <div className="w-full bg-gray-900/5 dark:bg-slate-200/5 my-6 h-px" />
                <PoolChartV2 address={address} chainId={chainId} />
                <div className="w-full bg-gray-900/5 dark:bg-slate-200/5 my-6 h-px" />
                <div className="flex flex-col gap-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <PoolComposition pool={pool} />
                    <PoolRewards pool={pool} />
                  </div>
                </div>
              </div>
              <div className={tab === SelectedTab.Transactions ? 'block' : 'hidden'}>
                <PoolTransactionsV2 pool={pool} poolId={address} />
              </div>
            </PoolPositionRewardsProvider>
          </PoolPositionStakedProvider>
        </PoolPositionProvider>
      )}
    </Layout>
  )
}

// export const getStaticPaths: GetStaticPaths = async () => {
//   const pools = await getPools({ take: 100, orderBy: 'liquidityUSD', orderDir: 'desc', chainIds: SUPPORTED_CHAIN_IDS })

//   // Get the paths we want to pre-render based on pairs
//   const paths = pools
//     .sort(({ liquidityUSD: a }, { liquidityUSD: b }) => {
//       return Number(b) - Number(a)
//     })
//     .slice(0, 50)
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
