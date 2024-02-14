'use client'

import { ArrowTopRightOnSquareIcon } from '@heroicons/react/20/solid'
import { Pool as PoolV2 } from '@sushiswap/client'
import {
  Button,
  Currency,
  LinkExternal,
  LinkInternal,
  classNames,
  typographyVariants,
} from '@sushiswap/ui'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@sushiswap/ui/components/tooltip'
import { SushiSwapV3Pool } from '@sushiswap/v3-sdk'
import React, { FC, useMemo } from 'react'
import { unwrapToken } from 'src/lib/functions'
import { Chain } from 'sushi/chain'
import { Token } from 'sushi/currency'
import { formatPercent, shortenAddress } from 'sushi/format'

import { APRHoverCard } from './APRHoverCard'

type PoolHeader = {
  backUrl: string
  address: string
  pool: SushiSwapV3Pool | null | undefined | PoolV2
  apy?: {
    fees: number | undefined
    rewards: number | undefined
    vault?: number
  }
  priceRange?: string
  hasEnabledStrategies?: boolean
}

export const PoolHeader: FC<PoolHeader> = ({
  backUrl,
  address,
  pool,
  apy,
  priceRange,
}) => {
  const [token0, token1] = useMemo(() => {
    if (!pool) return [undefined, undefined]
    if (pool instanceof SushiSwapV3Pool) {
      return [unwrapToken(pool.token0), unwrapToken(pool.token1)]
    }

    return [
      unwrapToken(
        new Token({
          chainId: pool.chainId,
          address: pool.token0.address,
          decimals: pool.token0.decimals,
          symbol: pool.token0.symbol,
        }),
      ),
      unwrapToken(
        new Token({
          chainId: pool.chainId,
          address: pool.token1.address,
          decimals: pool.token1.decimals,
          symbol: pool.token1.symbol,
        }),
      ),
    ]
  }, [pool])

  if (pool && token0 && token1)
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <LinkInternal
            href={backUrl}
            className="text-blue hover:underline text-sm"
          >
            ← Pools
          </LinkInternal>
          <div className="relative flex items-center gap-3 max-w-[100vh]">
            <Currency.IconList iconWidth={36} iconHeight={36}>
              <Currency.Icon currency={token0} />
              <Currency.Icon currency={token1} />
            </Currency.IconList>
            <Button
              asChild
              variant="link"
              className={typographyVariants({
                variant: 'h1',
                className:
                  'sm:!text2-xl sm:!text-4xl !font-bold text-gray-900 dark:text-slate-50 truncate overflow-x-auto',
              })}
            >
              <LinkExternal
                href={Chain.from(pool.chainId)?.getTokenUrl(address)}
              >
                {token0.symbol}/{token1.symbol}
              </LinkExternal>
            </Button>
            {pool instanceof SushiSwapV3Pool ? null : (
              <div
                className={classNames(
                  pool.protocol === 'SUSHISWAP_V3'
                    ? 'bg-blue/20 text-blue'
                    : pool.protocol === 'SUSHISWAP_V2'
                    ? 'bg-pink/20 text-pink'
                    : 'bg-green/20 text-green',
                  'text-sm px-2 py-1 font-semibold rounded-full mt-0.5',
                )}
              >
                {pool.protocol === 'SUSHISWAP_V3'
                  ? 'V3'
                  : pool.protocol === 'SUSHISWAP_V2'
                  ? 'V2'
                  : pool.protocol === 'BENTOBOX_CLASSIC'
                  ? 'Classic'
                  : 'Stable'}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-y-5 gap-x-[32px] text-secondary-foreground mb-8 mt-1.5">
          {apy ? (
            <div className="flex items-center gap-1.5">
              <span className="tracking-tighter font-semibold">APR</span>
              {pool instanceof SushiSwapV3Pool ? (
                <TooltipProvider>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <span className="underline decoration-dotted underline-offset-2">
                        {formatPercent((apy.fees || 0) + (apy.rewards || 0))}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      The APR displayed is algorithmic and subject to change.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <APRHoverCard pool={pool} smartPoolAPR={apy.vault}>
                  <span className="underline decoration-dotted underline-offset-2">
                    {formatPercent(
                      ((typeof apy.vault === 'number' ? apy.vault : apy.fees) ||
                        0) + (apy.rewards || 0),
                    )}
                  </span>
                </APRHoverCard>
              )}
            </div>
          ) : null}
          {priceRange ? (
            <div className="flex items-center gap-1.5">
              <span className="tracking-tighter font-semibold">
                Price Range
              </span>
              {priceRange}
            </div>
          ) : null}
          <div className="flex items-center gap-1.5">
            <span className="tracking-tighter font-semibold">Fee</span>
            {pool instanceof SushiSwapV3Pool
              ? pool.fee / 10000
              : pool.swapFee * 100}
            %
          </div>
          <div className="flex items-center gap-1.5">
            <span className="tracking-tighter font-semibold">Network</span>
            {Chain.from(pool.chainId)?.name}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="tracking-tighter font-semibold">
              {token0.symbol}
            </span>
            <LinkExternal
              href={Chain.from(pool.chainId)?.getTokenUrl(
                token0.wrapped.address,
              )}
            >
              <Button
                asChild
                variant="link"
                size="sm"
                className="!font-medium !text-secondary-foreground"
              >
                {shortenAddress(token0.wrapped.address, 4)}
                <ArrowTopRightOnSquareIcon className="w-3 h-3" />
              </Button>
            </LinkExternal>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="tracking-tighter font-semibold">
              {token1.symbol}
            </span>
            <LinkExternal
              target="_blank"
              href={Chain.from(pool.chainId)?.getTokenUrl(
                token1.wrapped.address,
              )}
            >
              <Button
                asChild
                variant="link"
                size="sm"
                className="!font-medium !text-secondary-foreground"
              >
                {shortenAddress(token1.wrapped.address, 4)}
                <ArrowTopRightOnSquareIcon className="w-3 h-3" />
              </Button>
            </LinkExternal>
          </div>
        </div>
      </div>
    )

  return <></>
}
