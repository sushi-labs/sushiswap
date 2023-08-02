'use client'

import ArrowTopRightOnSquareIcon from '@heroicons/react/20/solid/ArrowTopRightOnSquareIcon'
import { Chain } from '@sushiswap/chain'
import { usePool } from '@sushiswap/client'
import { Token } from '@sushiswap/currency'
import { formatPercent, shortenAddress } from '@sushiswap/format'
import { Button, Currency, typographyVariants } from '@sushiswap/ui'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@sushiswap/ui/components/tooltip'
import { Pool } from '@sushiswap/v3-sdk'
import { unwrapToken } from 'lib/functions'
import Link from 'next/link'
import React, { FC, useMemo } from 'react'

type PoolHeader = {
  address: string
  pool: Pool | null | undefined | ReturnType<typeof usePool>['data']
  apy?: {
    fees: number | undefined
    rewards: number | undefined
  }
  priceRange?: string
  hasEnabledStrategies?: boolean
}

export const PoolHeader: FC<PoolHeader> = ({ address, pool, apy, priceRange }) => {
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

  if (pool && token0 && token1)
    return (
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2.5">
          <div className="flex gap-4">
            <Link target="_blank" href={Chain.from(pool.chainId).getTokenUrl(token0.wrapped.address)}>
              <Button asChild variant="link" size="xs" className="!font-medium text-muted-foreground">
                {shortenAddress(token0.wrapped.address, 4)}
                <ArrowTopRightOnSquareIcon className="w-3 h-3" />
              </Button>
            </Link>
            <Link target="_blank" href={Chain.from(pool.chainId).getTokenUrl(token1.wrapped.address)}>
              <Button asChild variant="link" size="xs" className="!font-medium text-muted-foreground">
                {shortenAddress(token1.wrapped.address, 4)}
                <ArrowTopRightOnSquareIcon className="w-3 h-3" />
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Currency.IconList iconWidth={36} iconHeight={36}>
              <Currency.Icon currency={token0} />
              <Currency.Icon currency={token1} />
            </Currency.IconList>
            <Button
              asChild
              variant="link"
              className={typographyVariants({
                variant: 'h1',
                className: '!text-4xl !font-bold text-gray-900 dark:text-slate-50',
              })}
            >
              <Link target="_blank" href={Chain.from(pool.chainId).getTokenUrl(address)}>
                {token0.symbol}/{token1.symbol}
              </Link>
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-6 text-secondary-foreground mb-8 mt-1.5">
          {apy ? (
            <div className="flex items-center gap-1.5">
              <span className="tracking-tighter font-semibold">APR</span>
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <span className="underline decoration-dotted">
                      {formatPercent((apy.fees || 0) + (apy.rewards || 0))}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>The APR displayed is algorithmic and subject to change.</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          ) : null}
          {priceRange ? (
            <div className="flex items-center gap-1.5">
              <span className="tracking-tighter font-semibold">Price Range</span>
              {priceRange}
            </div>
          ) : null}
          <div className="flex items-center gap-1.5">
            <span className="tracking-tighter font-semibold">Fee</span>
            {pool instanceof Pool ? pool.fee / 10000 : pool.swapFee * 100}%
          </div>
          <div className="flex items-center gap-1.5">
            <span className="tracking-tighter font-semibold">Network</span>
            {Chain.from(pool.chainId).name}
          </div>
        </div>
      </div>
    )

  return <></>
}
