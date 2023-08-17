import { ChainId } from '@sushiswap/chain'
import { formatPercent } from '@sushiswap/format'
import { Badge } from '@sushiswap/ui/components/Badge'
import { Currency } from '@sushiswap/ui/components/currency'
import { NetworkIcon } from '@sushiswap/ui/components/icons'
import { SkeletonCircle, SkeletonText } from '@sushiswap/ui/components/skeleton'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@sushiswap/ui/components/tooltip'
import { SushiSwapV3Pool } from '@sushiswap/v3-sdk'
import { unwrapToken } from 'lib/functions'
import React, { FC, useMemo } from 'react'

type PoolHeader = {
  title?: string
  isLoading: boolean
  pool: SushiSwapV3Pool | null | undefined
  chainId: ChainId
  apy?: {
    fees: number | undefined
    rewards: number | undefined
  }
  priceRange?: string
  hasEnabledStrategies?: boolean
}

export const PoolHeader: FC<PoolHeader> = ({
  title,
  isLoading,
  pool,
  chainId,
  apy,
  priceRange,
  hasEnabledStrategies,
}) => {
  const unwrappedTokens = useMemo(() => {
    if (!pool) return [undefined, undefined]
    return [unwrapToken(pool.token0), unwrapToken(pool.token1)]
  }, [pool])

  if (isLoading) {
    return (
      <div className="flex gap-6 h-[52px]">
        <div className="inline-flex">
          <SkeletonCircle radius={48} />
          <SkeletonCircle radius={48} style={{ marginLeft: -48 / 3 }} />
        </div>
        <div className="flex flex-col flex-grow">
          <SkeletonText fontSize="xl" className="w-[120px]" />
          <SkeletonText className="w-[240px]" />
        </div>
      </div>
    )
  }

  if (pool && unwrappedTokens[0] && unwrappedTokens[1])
    return (
      <div className="flex gap-6 h-[52px]">
        <div className="flex min-w-[44px]">
          <Badge
            className="border-2 border-slate-900 rounded-full z-[11] !bottom-0 right-[-15%]"
            position="bottom-right"
            badgeContent={<NetworkIcon chainId={chainId} width={24} height={24} />}
          >
            <Currency.IconList iconWidth={48} iconHeight={48}>
              <Currency.Icon currency={unwrappedTokens[0]} />
              <Currency.Icon currency={unwrappedTokens[1]} />
            </Currency.IconList>
          </Badge>
        </div>
        <div className="flex flex-col flex-grow gap-0.5">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-slate-50">
            {title && title}
            {unwrapToken(pool.token0).symbol}/{unwrapToken(pool.token1).symbol}
          </h1>
          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-slate-400">
            {apy ? (
              <>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>{formatPercent((apy.fees || 0) + (apy.rewards || 0))} APR</TooltipTrigger>
                    <TooltipContent>
                      <p>{`${formatPercent(apy.fees)} fee APR + ${formatPercent(apy.rewards)} reward APR`}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <span className="text-[10px]">•</span>
              </>
            ) : (
              <></>
            )}{' '}
            {priceRange ? (
              <>
                {priceRange}
                <span className="text-[10px]">•</span>
              </>
            ) : (
              <></>
            )}
            {pool.fee / 10000}% Fee{' '}
            {apy?.rewards ? (
              <>
                <span className="text-[10px]">•</span> Farm rewards available ✨
              </>
            ) : null}
            {/* {hasEnabledStrategies && (
              <>
                <span className="text-[10px]">•</span> Steer strategy available
                <SteerIcon className="w-[10px] h-[14px] text-purple-500" />
              </>
            )} */}
          </div>
        </div>
      </div>
    )

  return <></>
}
