'use client'

import { PlusIcon } from '@heroicons/react-v1/solid'
import type { BladePool } from '@sushiswap/graph-client/data-api'
import {
  Button,
  Currency,
  LinkExternal,
  LinkInternal,
  classNames,
  typographyVariants,
} from '@sushiswap/ui'
import { CurrencyFiatIcon } from '@sushiswap/ui/icons/CurrencyFiatIcon'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import { USDIcon } from '@sushiswap/ui/icons/USD'
import React, { type FC, useMemo, useState } from 'react'
import { getPoolTokensGrouped } from 'src/lib/pool/blade'
import {
  type EvmAddress,
  EvmToken,
  SushiSwapProtocol,
  getEvmChainById,
  unwrapEvmToken,
} from 'sushi/evm'
import { AddLiquidityDialog } from '~evm/[chainId]/_ui/add-liquidity/add-liquidity-dialog'

type PoolHeaderBlade = {
  backUrl: string
  address: string
  pool: BladePool

  priceRange?: string
  hasEnabledStrategies?: boolean
  showAddLiquidityButton?: boolean
}

export const PoolHeaderBlade: FC<PoolHeaderBlade> = ({
  backUrl,
  address,
  pool,
}) => {
  const groupedTokens = useMemo(() => getPoolTokensGrouped(pool), [pool])
  const { tokens, stablecoinUsdTokens } = groupedTokens
  const hasStablecoin = stablecoinUsdTokens.length > 0

  if (pool)
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <LinkInternal
            href={backUrl}
            className="text-sm w-fit text-blue dark:text-skyblue hover:underline"
          >
            ← Pools
          </LinkInternal>
          <div className="flex flex-wrap gap-4 justify-between items-center">
            <div className="relative flex items-center gap-3 max-w-[100vh]">
              <div className="relative">
                <Currency.IconList
                  iconWidth={36}
                  iconHeight={36}
                  className="border-[#FFFFFF14]"
                >
                  {tokens.map((token) => (
                    <Currency.Icon
                      key={token.wrap().address}
                      currency={token}
                    />
                  ))}
                  {hasStablecoin && <CurrencyFiatIcon width={35} height={35} />}
                </Currency.IconList>

                <div className="border-[#E8E7EB] dark:border-[#222137] border rounded-[4px] overflow-hidden z-10 absolute bottom-[1px] -right-1">
                  <NetworkIcon
                    type="square"
                    chainId={pool.chainId}
                    className="w-3 h-3 lg:w-4 lg:h-4"
                  />
                </div>
              </div>
              <Button
                asChild
                variant="link"
                className={typographyVariants({
                  variant: 'h1',
                  className:
                    'md:!text2-xl md:!text-4xl !font-bold text-gray-900 dark:text-slate-50 truncate overflow-x-auto',
                })}
              >
                <LinkExternal
                  className="text-gray-900 dark:text-slate-50"
                  href={getEvmChainById(pool.chainId)?.getAccountUrl(
                    address as EvmAddress,
                  )}
                >
                  {tokens[0].symbol}/USD
                </LinkExternal>
              </Button>
              <div
                className={classNames(
                  'text-sm px-2 py-1 font-semibold rounded-full mt-0.5 bg-[#4217FF14] dark:bg-[#3DB1FF14]',
                )}
              >
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4217FF] to-[#3DB1FF] dark:from-[#C3F1FB] dark:to-[#FFC9F1]">
                  Blade
                </span>
              </div>
            </div>

            <span className="block md:hidden">
              <AddLiquidityDialog
                chainId={pool.chainId}
                poolType={SushiSwapProtocol.BLADE}
                hidePoolTypeToggle={true}
                bladePool={pool}
                trigger={
                  <Button
                    size="sm"
                    className="w-fit !p-2 !h-[32px] !min-h-[32px]"
                  >
                    <PlusIcon className="w-4 h-4" />
                  </Button>
                }
              />
            </span>
          </div>
        </div>
        {/* <div className="flex flex-wrap items-center gap-y-5 gap-x-[32px] text-secondary-foreground mb-8 mt-1.5">
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
              <span className="font-semibold tracking-tighter">
                Price Range
              </span>
              {priceRange}
            </div>
          ) : null}
          <div className="flex items-center gap-1.5">
            <span className="font-semibold tracking-tighter">Fee</span>
            {pool.swapFee * 100}%
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold tracking-tighter">Network</span>
            {EvmChain.from(pool.chainId)?.name}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold tracking-tighter">
              {token0.symbol}
            </span>
            <LinkExternal
              target="_blank"
              href={EvmChain.from(pool.chainId)?.getTokenUrl(
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
            <span className="font-semibold tracking-tighter">
              {token1.symbol}
            </span>
            <LinkExternal
              target="_blank"
              href={EvmChain.from(pool.chainId)?.getTokenUrl(
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
        </div> */}
      </div>
    )

  return <></>
}
