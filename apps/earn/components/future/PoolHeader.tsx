import React, { FC, useMemo } from 'react'
import { Badge } from '@sushiswap/ui/future/components/Badge'
import { NetworkIcon } from '@sushiswap/ui'
import { Currency } from '@sushiswap/ui/future/components/currency'
import { Skeleton } from '@sushiswap/ui/future/components/skeleton'
import { ChainId } from '@sushiswap/chain'
import { Pool } from '@sushiswap/v3-sdk'
import { unwrapToken } from '../../lib/functions'
import { Tooltip } from '@sushiswap/ui/future/components/Tooltip'
import { formatPercent } from '@sushiswap/format'

type PoolHeader = {
  title?: string
  isLoading: boolean
  pool: Pool | null | undefined
  chainId: ChainId
  apy?: {
    fees: number | undefined
    rewards: number | undefined
  }
  priceRange?: string
}

export const PoolHeader: FC<PoolHeader> = ({ title, isLoading, pool, chainId, apy, priceRange }) => {
  const unwrappedTokens = useMemo(() => {
    if (!pool) return [undefined, undefined]
    return [unwrapToken(pool.token0), unwrapToken(pool.token1)]
  }, [pool])

  if (isLoading) {
    return (
      <div className="flex gap-6 h-[52px]">
        <div className="inline-flex">
          <Skeleton.Circle radius={48} />
          <Skeleton.Circle radius={48} style={{ marginLeft: -48 / 3 }} />
        </div>
        <div className="flex flex-col flex-grow">
          <Skeleton.Text fontSize="text-xl" className="w-[120px]" />
          <Skeleton.Text fontSize="text-base" className="w-[240px]" />
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
                <Tooltip description={`${formatPercent(apy.fees)} fee APR + ${formatPercent(apy.rewards)} reward APR`}>
                  <span className="font-semibold text-gray-900 dark:text-slate-50 underline underline-offset-[6px] decoration-dotted decoration-slate-500">
                    {formatPercent((apy.fees || 0) + (apy.rewards || 0))} APR
                  </span>{' '}
                </Tooltip>

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
            {apy && apy.rewards ? (
              <>
                <span className="text-[10px]">•</span> Farm rewards available ✨
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    )

  return <></>
}
