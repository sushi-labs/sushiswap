'use client'

import { RadioGroup } from '@headlessui/react'
import { ChartBarIcon, PlusIcon } from '@heroicons/react/24/solid'
import { MinusIcon } from '@heroicons/react-v1/solid'
import { ChainId } from '@sushiswap/chain'
import { Protocol, usePool } from '@sushiswap/client'
import { Button } from '@sushiswap/ui'
import React, { useState } from 'react'
import { useSWRConfig } from 'swr'
import {
  AddSectionLegacy,
  AddSectionStake,
  AddSectionTrident,
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
  Analytics,
  IncreaseLiq,
  DecreaseLiq,
  Transactions,
  Rewards,
}

export default function Page({ params }: { params: { id: string } }) {
  // 1. figure out the pool type from the id
  // 2. use the pool type to determine which pool page to render

  const [chainId, address] = params.id.split('%3A') as [ChainId, string]
  const [tab, setTab] = useState<SelectedTab>(SelectedTab.Analytics)

  const { data: pool, isLoading } = usePool({
    args: { chainId, address },
    swrConfig: useSWRConfig(),
    shouldFetch: Boolean(chainId && address),
  })

  if (!pool) return <></>

  if (pool.protocol === Protocol.SUSHISWAP_V3) {
    return <PoolPageV3 id={params.id} />
  }

  return (
    <PoolPositionProvider pool={pool}>
      <PoolPositionStakedProvider pool={pool}>
        <PoolPositionRewardsProvider pool={pool}>
          <div className="flex flex-col gap-2">
            <PoolHeader
              title="Pool "
              isLoading={isLoading}
              chainId={chainId}
              pool={pool}
              apy={{ rewards: pool?.incentiveApr, fees: pool?.feeApr1d }}
            />
            <RadioGroup value={tab} onChange={setTab} className="flex flex-wrap gap-2 mt-3">
              <RadioGroup.Option
                size="sm"
                value={SelectedTab.Analytics}
                as={Button}
                icon={ChartBarIcon}
                variant="secondary"
                color={tab === SelectedTab.Analytics ? 'blue' : 'default'}
              >
                Statistics
              </RadioGroup.Option>
              <RadioGroup.Option
                size="sm"
                value={SelectedTab.Rewards}
                as={Button}
                variant="secondary"
                color={tab === SelectedTab.Rewards ? 'blue' : 'default'}
              >
                Rewards
              </RadioGroup.Option>
              <RadioGroup.Option
                size="sm"
                value={SelectedTab.IncreaseLiq}
                as={Button}
                icon={PlusIcon}
                variant="secondary"
                color={tab === SelectedTab.IncreaseLiq ? 'blue' : 'default'}
              >
                Increase Liquidity
              </RadioGroup.Option>{' '}
              <RadioGroup.Option
                size="sm"
                value={SelectedTab.DecreaseLiq}
                as={Button}
                icon={MinusIcon}
                variant="secondary"
                color={tab === SelectedTab.DecreaseLiq ? 'blue' : 'default'}
              >
                Decrease Liquidity
              </RadioGroup.Option>
              <RadioGroup.Option
                size="sm"
                value={SelectedTab.Transactions}
                as={Button}
                variant="secondary"
                color={tab === SelectedTab.Transactions ? 'blue' : 'default'}
              >
                Transactions
              </RadioGroup.Option>
            </RadioGroup>
          </div>
          <div className="w-full bg-gray-900/5 dark:bg-slate-200/5 my-4 h-0.5" />
          <div className={tab === SelectedTab.Analytics ? 'flex' : 'hidden'}>
            <div className="flex flex-col gap-9 flex-1">
              <UnknownTokenAlert pool={pool} />
              <PoolChartV2 address={address} chainId={chainId} />
              <PoolStats pool={pool} />
              <PoolComposition pool={pool} />
              <PoolRewards pool={pool} />
            </div>
          </div>
          <div className={tab === SelectedTab.Transactions ? 'block' : 'hidden'}>
            <PoolTransactionsV2 pool={pool} poolId={address} />
          </div>
          <div className={tab === SelectedTab.Rewards ? 'block' : 'hidden'}>
            <PoolMyRewards pool={pool} />
          </div>
          <div className={tab === SelectedTab.IncreaseLiq ? 'block' : 'hidden'}>
            <div className="grid grid-cols-1 gap-4">
              {isTridentPoolProtocol(pool.protocol) ? (
                <AddSectionTrident pool={pool} />
              ) : (
                <AddSectionLegacy pool={pool} />
              )}
              <AddSectionStake poolId={pool.id} />
            </div>
          </div>
          <div className={tab === SelectedTab.DecreaseLiq ? 'block' : 'hidden'}>
            <div className="grid grid-cols-1 gap-4">
              <RemoveSectionUnstake poolId={pool.id} />
              {isTridentPoolProtocol(pool.protocol) ? (
                <RemoveSectionTrident pool={pool} />
              ) : (
                <RemoveSectionLegacy pool={pool} />
              )}
            </div>
          </div>
        </PoolPositionRewardsProvider>
      </PoolPositionStakedProvider>
    </PoolPositionProvider>
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
