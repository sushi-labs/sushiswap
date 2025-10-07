'use client'

import type { ExplorePoolStatistics } from '@sushiswap/graph-client/data-api-181'
import { Button, classNames } from '@sushiswap/ui'
import { useMemo, useState } from 'react'
import { formatPercent, formatUSD } from 'sushi'
import { Wrapper } from '~evm/[chainId]/[trade]/_ui/swap/trade/wrapper'

type PoolType = 'v2' | 'v3' | 'all'
export const Statistics = ({
  stats,
}: {
  stats: ExplorePoolStatistics
}) => {
  const [poolType, setPoolType] = useState<PoolType>('all')

  const statsByPoolType = useMemo(() => {
    return stats[poolType]
  }, [stats, poolType])

  return (
    <Wrapper className="flex flex-col gap-6 !p-5 border basis-1/3 border-accent">
      <StatisticsHeader poolType={poolType} setPoolType={setPoolType} />
      <StatisticsContent stats={statsByPoolType} />
    </Wrapper>
  )
}

const StatisticsHeader = ({
  poolType,
  setPoolType,
}: {
  poolType: PoolType
  setPoolType: (poolType: PoolType) => void
}) => {
  return (
    <div className="flex justify-between items-center w-full">
      <div>
        <span className="text-lg font-semibold">Statistics</span>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          className={classNames(
            'rounded-xl border-dashed bg-[#F4F5F6] dark:bg-[#252A3C] hover:!bg-[#F338C31A] hover:!border-[#F338C3] hover:!text-[#F338C3]',
            poolType === 'v2' &&
              '!bg-[#F338C31A] !border-[#F338C3] text-[#F338C3] hover:!text-[#F338C3] !border-solid',
          )}
          onClick={() => {
            setPoolType(poolType === 'v2' ? 'all' : 'v2')
          }}
        >
          <span>V2</span>
        </Button>
        <Button
          variant="outline"
          className={classNames(
            'rounded-xl border-dashed bg-[#F4F5F6] dark:bg-[#252A3C] hover:!bg-[#3B7EF61A] hover:!border-[#3B7EF6] hover:!text-[#3B7EF6]',
            poolType === 'v3' &&
              '!bg-[#3B7EF61A] !border-[#3B7EF6] text-[#3B7EF6] hover:!text-[#3B7EF6] !border-solid',
          )}
          onClick={() => {
            setPoolType(poolType === 'v3' ? 'all' : 'v3')
          }}
        >
          <span>V3</span>
        </Button>
      </div>
    </div>
  )
}

const StatisticsContent = ({
  stats,
}: { stats: ExplorePoolStatistics[keyof ExplorePoolStatistics] }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-3 justify-between items-center lg:flex-col lg:items-start lg:justify-normal">
        <span className="font-medium text-muted-foreground">TVL (7d%)</span>
        <div className="flex gap-2 justify-between items-center lg:flex-col lg:items-start lg:justify-normal lg:gap-2">
          <p className="text-base lg:text-[1.75rem] font-semibold">
            {formatUSD(stats.liquidityUSD)}
          </p>
          <p className="text-sm text-red-500">
            {formatPercent(stats.liquidityUSDChange1w)}
          </p>
        </div>
      </div>
      <div className="flex gap-3 justify-between items-center lg:flex-col lg:items-start lg:justify-normal">
        <span className="font-medium text-muted-foreground">Volume (7d%)</span>
        <div className="flex gap-2 justify-between items-center lg:flex-col lg:items-start lg:justify-normal lg:gap-2">
          <p className="text-base lg:text-[1.75rem] font-semibold">
            {formatUSD(stats.volumeUSD1w)}
          </p>
          <p className="text-sm text-green-500">
            {formatPercent(stats.volumeUSDChange1w)}
          </p>
        </div>
      </div>
    </div>
  )
}
