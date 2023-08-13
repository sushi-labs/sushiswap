import { RadioGroup } from '@headlessui/react'
import { CogIcon } from '@heroicons/react-v1/outline'
import { ArrowLeftIcon, ChartBarIcon, PlusIcon, UserCircleIcon } from '@heroicons/react-v1/solid'
import { useConcentratedLiquidityPoolStats } from '@sushiswap/react-query'
import { Button } from '@sushiswap/ui/components/button'
import { IconButton } from '@sushiswap/ui/components/iconbutton'
import { SettingsModule, SettingsOverlay } from '@sushiswap/ui/components/settings'
import { SplashController } from '@sushiswap/ui/components/SplashController'
import { isSushiSwapV3ChainId, SushiSwapV3ChainId } from '@sushiswap/v3-sdk'
import { useConcentratedLiquidityPool } from '@sushiswap/wagmi/future/hooks'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import React, { FC, useState } from 'react'
import { isAddress } from 'viem'
import { z } from 'zod'

import { ConcentratedLiquidityProvider } from '../../ConcentratedLiquidityProvider'
import { PoolHeader } from '../../future/PoolHeader'
import { Layout } from '../../Layout'
import { ManagePosition } from './Tabs/ManagePosition/ManagePosition'
import { NewPosition } from './Tabs/NewPosition/NewPosition'
import { Statistics } from './Tabs/Statistics/Statistics'

const PoolPage: FC<{ id: string }> = ({ id }) => {
  return (
    <SplashController>
      <ConcentratedLiquidityProvider>
        <Pool id={id} />
      </ConcentratedLiquidityProvider>
    </SplashController>
  )
}

const queryParamsSchema = z.object({
  id: z
    .string()
    .refine((val) => val.includes('%3A'), {
      message: 'TokenId not in the right format',
    })
    .transform((val) => {
      const [chainId, poolId] = val.split('%3A')
      return [+chainId, poolId] as [SushiSwapV3ChainId, string]
    })
    .refine(([chainId]) => isSushiSwapV3ChainId(chainId), {
      message: 'ChainId not supported.',
    })
    .refine(([, poolId]) => isAddress(poolId), {
      message: 'PoolId not supported.',
    }),
  activeTab: z
    .string()
    .nullable()
    .transform((val) => {
      switch (val) {
        case 'new':
          return Tab.NewPosition
        case 'myPositions':
          return Tab.ManagePosition
        default:
          return Tab.Analytics
      }
    }),
})

enum Tab {
  Analytics = 'Analytics',
  NewPosition = 'New Position',
  ManagePosition = 'Manage Position',
}

const tabs = [
  {
    name: Tab.Analytics,
    icon: ChartBarIcon,
  },
  {
    name: Tab.NewPosition,
    icon: PlusIcon,
  },
  {
    name: Tab.ManagePosition,
    icon: UserCircleIcon,
  },
] as const

const Pool: FC<{ id: string }> = ({ id }) => {
  const searchParams = useSearchParams()

  const {
    id: [chainId, poolAddress],
    activeTab,
  } = queryParamsSchema.parse({ id, activeTab: searchParams.get('activeTab') })

  const [currentTab, setTab] = useState<Tab>(activeTab || Tab.Analytics)

  const { data: poolStats } = useConcentratedLiquidityPoolStats({ chainId, address: poolAddress })
  const { data: pool, isLoading } = useConcentratedLiquidityPool({
    chainId,
    token0: poolStats?.token0,
    token1: poolStats?.token1,
    feeAmount: poolStats?.feeAmount,
  })

  return (
    <Layout>
      <div className="flex flex-col gap-2">
        <Link className="flex items-center gap-4 mb-2 group" href={`/pool?chainIds=${chainId}`} shallow={true}>
          <IconButton size="sm" icon={ArrowLeftIcon} name="Back" />
          <span className="group-hover:opacity-[1] transition-all opacity-0 text-sm font-medium">
            Go back to pools list
          </span>
        </Link>
        <PoolHeader
          title="Pool "
          isLoading={isLoading}
          chainId={chainId}
          pool={pool}
          apy={{ rewards: poolStats?.incentiveApr, fees: poolStats?.feeApr1d }}
          hasEnabledStrategies={!!poolStats && poolStats?.steerVaults.length > 0}
        />
        <RadioGroup value={currentTab} onChange={setTab} className="flex flex-wrap gap-2 mt-3">
          {tabs.map((tab) => (
            <RadioGroup.Option
              key={tab.name}
              value={tab.name}
              as={Button}
              icon={tab.icon}
              variant="secondary"
              color={currentTab === tab.name ? 'blue' : 'default'}
            >
              {tab.name}
            </RadioGroup.Option>
          ))}
          <div>
            <SettingsOverlay
              options={{
                slippageTolerance: {
                  storageKey: 'addLiquidity',
                  defaultValue: '0.5',
                  title: 'Add Liquidity Slippage',
                },
              }}
              modules={[SettingsModule.SlippageTolerance]}
            >
              {({ setOpen }) => (
                <Button variant="secondary" onClick={() => setOpen(true)}>
                  <CogIcon width={24} height={24} />
                </Button>
              )}
            </SettingsOverlay>
          </div>
        </RadioGroup>
      </div>
      <div className="w-full bg-gray-900/5 dark:bg-slate-200/5 my-5 md:my-10 h-0.5" />
      <div className={currentTab === Tab.Analytics ? 'block' : 'hidden'}>
        <Statistics address={poolAddress} chainId={chainId} />
      </div>
      <div className={currentTab === Tab.NewPosition ? 'block' : 'hidden'}>
        <NewPosition address={poolAddress} chainId={chainId} />
      </div>
      <div className={currentTab === Tab.ManagePosition ? 'block' : 'hidden'}>
        <ManagePosition address={poolAddress} />
      </div>
    </Layout>
  )
}

export { PoolPage }
