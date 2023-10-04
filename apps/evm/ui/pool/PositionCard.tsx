import { Chain } from '@sushiswap/chain'
import { formatNumber, formatUSD } from 'sushi'
import { LinkInternal } from '@sushiswap/ui'
import { Button } from '@sushiswap/ui/components/button'
import { Currency } from '@sushiswap/ui/components/currency'
import { SkeletonCircle, SkeletonText } from '@sushiswap/ui/components/skeleton'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@sushiswap/ui/components/tooltip'
import { useTokensFromPool } from 'lib/hooks'
import React, { FC } from 'react'
import { PositionWithPool } from 'types'

interface PositionCard {
  position: PositionWithPool
}

export const PositionCardSkeleton = () => {
  return (
    <div className="relative bg-white dark:bg-slate-800 hover:shadow-md transition-all rounded-2xl p-7 overflow-hidden w-[320px]">
      <SkeletonText fontSize="xs" className="w-[40px]" />
      <SkeletonText fontSize="2xl" className="w-[160px]" />
      <div className="flex flex-col gap-2 items-center py-7">
        <div className="inline-flex">
          <SkeletonCircle radius={56} />
          <SkeletonCircle radius={56} style={{ marginLeft: -48 / 3 }} />
        </div>
      </div>
      <SkeletonText fontSize="sm" className="w-[100px]" />
      <SkeletonText fontSize="sm" className="w-[40px]" />
      <div className="absolute bottom-7 right-7">
        <SkeletonText fontSize="2xl" className="w-[80px] !h-[32px] !rounded-full" />
      </div>
    </div>
  )
}

export const PositionCard: FC<PositionCard> = ({ position }) => {
  const { token0, token1 } = useTokensFromPool(position.pool)
  const valueUSD = (Number(position.balance) / Number(position.pool.totalSupply)) * Number(position.pool.liquidityUSD)
  return (
    <div className="relative bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-all rounded-2xl p-7 overflow-hidden w-[320px]">
      <span className="uppercase text-xs font-semibold dark:text-slate-400 text-gray-600">
        {Chain.from(position.chainId).name}
      </span>
      <h1 className="text-2xl font-semibold dark:text-white text-gray-900">
        {token0.symbol}/{token1.symbol}{' '}
        <span className="text-sm text-gray-600 dark:text-slate-400">{formatNumber(position.pool.swapFee * 100)}%</span>
      </h1>
      <div className="flex flex-col gap-2 items-center py-7">
        <div className="flex min-w-[44px]">
          <Currency.IconList iconWidth={56} iconHeight={56}>
            <Currency.Icon currency={token0} />
            <Currency.Icon currency={token1} />
          </Currency.IconList>
        </div>
      </div>
      <span className="text-sm pt-4">
        Est. position value <br />
        {formatUSD(valueUSD)}
      </span>
      <div className="flex gap-1 absolute top-7 right-7">
        {position.pool.incentives && position.pool.incentives.length > 0 && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="whitespace-nowrap py-1 bg-green/20 text-green text-xs px-2 rounded-full">
                  🧑‍🌾 {position.pool.incentives.length > 1 ? `x ${position.pool.incentives.length}` : ''}{' '}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Farm rewards available</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <div className="absolute bottom-7 right-7">
        <Button size="sm" asChild>
          <LinkInternal href={`/pools/${position.pool.id}/migrate`}>Migrate</LinkInternal>
        </Button>
      </div>
    </div>
  )
}
