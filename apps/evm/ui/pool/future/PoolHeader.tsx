import { ArrowTopRightOnSquareIcon } from '@heroicons/react/20/solid'
import { Chain, ChainId } from '@sushiswap/chain'
import { usePool } from '@sushiswap/client'
import { Token } from '@sushiswap/currency'
import { formatPercent } from '@sushiswap/format'
import { Button } from '@sushiswap/ui'
import { Badge } from '@sushiswap/ui/components/Badge'
import { Currency } from '@sushiswap/ui/components/currency'
import { NetworkIcon } from '@sushiswap/ui/components/icons'
import { SkeletonCircle, SkeletonText } from '@sushiswap/ui/components/skeleton'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@sushiswap/ui/components/tooltip'
import { Pool } from '@sushiswap/v3-sdk'
import { unwrapToken } from 'lib/functions'
import React, { FC, useMemo } from 'react'
type PoolHeader = {
  address: string
  title?: string
  isLoading: boolean
  pool: Pool | null | undefined | ReturnType<typeof usePool>['data']
  chainId: ChainId
  apy?: {
    fees: number | undefined
    rewards: number | undefined
  }
  priceRange?: string
}

export const PoolHeader: FC<PoolHeader> = ({ address, title, isLoading, pool, chainId, apy, priceRange }) => {
  const [token0, token1] = useMemo(() => {
    if (!pool) return [undefined, undefined]
    if (pool instanceof Pool) {
      return [unwrapToken(pool.token0), unwrapToken(pool.token1)]
    }

    return [
      unwrapToken(
        new Token({
          chainId: pool.chainId,
          address: pool.token0.address,
          decimals: pool.token0.decimals,
          symbol: pool.token0.symbol,
        })
      ),
      unwrapToken(
        new Token({
          chainId: pool.chainId,
          address: pool.token1.address,
          decimals: pool.token1.decimals,
          symbol: pool.token1.symbol,
        })
      ),
    ]
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

  if (pool && token0 && token1)
    return (
      <div className="flex gap-6 h-[52px]">
        <div className="flex min-w-[44px]">
          <Badge
            className="border-2 border-slate-900 rounded-full z-[11] !bottom-0 right-[-15%]"
            position="bottom-right"
            badgeContent={<NetworkIcon chainId={chainId} width={24} height={24} />}
          >
            <Currency.IconList iconWidth={48} iconHeight={48}>
              <Currency.Icon currency={token0} />
              <Currency.Icon currency={token1} />
            </Currency.IconList>
          </Badge>
        </div>
        <div className="flex flex-col flex-grow gap-0.5">
          <div>
            <Button
              asChild
              variant="link"
              className="text-xl font-semibold text-gray-900 dark:text-slate-50 flex items-start gap-2"
              icon={ArrowTopRightOnSquareIcon}
              iconPosition="end"
            >
              <a rel="noopener noreferrer" target="_blank" href={Chain.from(pool.chainId).getTokenUrl(address)}>
                <span>
                  {title && title}
                  {token0.symbol}/{token1.symbol}
                </span>
              </a>
            </Button>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-slate-400">
            {apy ? (
              <>
                <TooltipProvider>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <span className="underline decoration-dotted text-sm text-gray-900 dark:text-slate-50">
                        {formatPercent((apy.fees || 0) + (apy.rewards || 0))} APR
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>The APR displayed is algorithmic and subject to change.</TooltipContent>
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
            {pool instanceof Pool ? pool.fee / 10000 : pool.swapFee * 100}% Fee{' '}
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
