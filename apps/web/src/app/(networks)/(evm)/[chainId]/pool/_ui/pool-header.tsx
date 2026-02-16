import { ArrowTopRightOnSquareIcon } from '@heroicons/react/20/solid'
import type { RawV2Pool, RawV3Pool } from '@sushiswap/graph-client/data-api'
import {
  Button,
  Currency,
  LinkExternal,
  LinkInternal,
  classNames,
  typographyVariants,
} from '@sushiswap/ui'
import React, { type FC } from 'react'
import { formatPercent, shortenAddress } from 'sushi'
import {
  type EvmAddress,
  EvmToken,
  getEvmChainById,
  unwrapEvmToken,
} from 'sushi/evm'
import { APRHoverCard } from '~evm/[chainId]/_ui/apr-hover-card'

type PoolHeader = {
  backUrl: string
  address: EvmAddress
  pool: RawV2Pool | RawV3Pool
  apy?: {
    fees: number | undefined
    rewards: number | undefined
  }
  priceRange?: string
  hasEnabledStrategies?: boolean
  showAddLiquidityButton?: boolean
}

export const PoolHeader: FC<PoolHeader> = ({
  backUrl,
  address,
  pool,
  apy,
  priceRange,
  showAddLiquidityButton = false,
}) => {
  const token0 = unwrapEvmToken(new EvmToken(pool.token0))
  const token1 = unwrapEvmToken(new EvmToken(pool.token1))

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <LinkInternal
          href={backUrl}
          className="text-sm text-blue hover:underline"
        >
          ← Back
        </LinkInternal>
        <div className="flex flex-wrap justify-between gap-6">
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
                href={getEvmChainById(pool.chainId).getAccountUrl(address)}
              >
                {token0.symbol}/{token1.symbol}
              </LinkExternal>
            </Button>
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
                  : 'UNKNOWN'}
            </div>
          </div>
          {showAddLiquidityButton ? (
            <Button asChild>
              <LinkInternal
                href={
                  pool.protocol === 'SUSHISWAP_V2'
                    ? `/${getEvmChainById(pool.chainId).key}/pool/v2/${
                        pool.address
                      }/add`
                    : pool.protocol === 'SUSHISWAP_V3'
                      ? `/${getEvmChainById(pool.chainId).key}/pool/v3/${
                          pool.address
                        }/positions`
                      : ''
                }
              >
                Add Liquidity
              </LinkInternal>
            </Button>
          ) : null}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-y-5 gap-x-[32px] text-secondary-foreground mb-8 mt-1.5">
        {apy ? (
          <div className="flex items-center gap-1.5">
            <span className="font-semibold tracking-tighter">APR</span>

            <APRHoverCard pool={pool}>
              <span className="underline decoration-dotted underline-offset-2">
                {formatPercent((apy.fees || 0) + (apy.rewards || 0))}
              </span>
            </APRHoverCard>
          </div>
        ) : null}
        {priceRange ? (
          <div className="flex items-center gap-1.5">
            <span className="font-semibold tracking-tighter">Price Range</span>
            {priceRange}
          </div>
        ) : null}
        <div className="flex items-center gap-1.5">
          <span className="font-semibold tracking-tighter">Fee</span>
          {pool.swapFee * 100}%
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-semibold tracking-tighter">Network</span>
          {getEvmChainById(pool.chainId).name}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-semibold tracking-tighter">
            {token0.symbol}
          </span>
          <LinkExternal
            target="_blank"
            href={getEvmChainById(pool.chainId).getTokenUrl(
              token0.wrap().address,
            )}
          >
            <Button
              asChild
              variant="link"
              size="sm"
              className="!font-medium !text-secondary-foreground"
            >
              {shortenAddress(token0.wrap().address, 4)}
              <ArrowTopRightOnSquareIcon className="w-3 h-3" />
            </Button>
          </LinkExternal>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-semibold tracking-tighter">
            {token1.symbol}
          </span>
          <LinkExternal
            target="_blank"
            href={getEvmChainById(pool.chainId).getTokenUrl(
              token1.wrap().address,
            )}
          >
            <Button
              asChild
              variant="link"
              size="sm"
              className="!font-medium !text-secondary-foreground"
            >
              {shortenAddress(token1.wrap().address, 4)}
              <ArrowTopRightOnSquareIcon className="w-3 h-3" />
            </Button>
          </LinkExternal>
        </div>
      </div>
    </div>
  )
}
