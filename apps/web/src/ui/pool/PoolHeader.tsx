'use client'

import { PlusIcon } from '@heroicons/react-v1/solid'
import type { RawV2Pool, RawV3Pool } from '@sushiswap/graph-client/data-api'
import {
  Button,
  Currency,
  LinkExternal,
  LinkInternal,
  classNames,
  typographyVariants,
  useBreakpoint,
} from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import React, { type FC, useMemo } from 'react'
import { EvmToken, getEvmChainById, unwrapEvmToken } from 'sushi/evm'

type PoolHeader = {
  backUrl: string
  address: string
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
  showAddLiquidityButton = false,
}) => {
  const { isMd } = useBreakpoint('md')
  const [token0, token1] = useMemo(() => {
    if (!pool) return [undefined, undefined]

    return [
      unwrapEvmToken(
        new EvmToken({
          chainId: pool.chainId,
          address: pool.token0.address,
          decimals: pool.token0.decimals,
          symbol: pool.token0.symbol,
          name: pool.token0.name,
        }),
      ),
      unwrapEvmToken(
        new EvmToken({
          chainId: pool.chainId,
          address: pool.token1.address,
          decimals: pool.token1.decimals,
          symbol: pool.token1.symbol,
          name: pool.token1.name,
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
                  <Currency.Icon currency={token0} />
                  <Currency.Icon currency={token1} />
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
                    address as `0x${string}`,
                  )}
                >
                  {token0.symbol}/{token1.symbol}
                </LinkExternal>
              </Button>
              <div
                className={classNames(
                  pool.protocol === 'SUSHISWAP_V3'
                    ? 'text-blue dark:text-skyblue'
                    : pool.protocol === 'SUSHISWAP_V2'
                      ? 'text-pink'
                      : '',
                  'text-sm px-2 py-1 font-semibold rounded-full mt-0.5 bg-[#0000001F] dark:bg-[#FFFFFF1F]',
                )}
              >
                {pool.protocol === 'SUSHISWAP_V3' ? (
                  'V3'
                ) : pool.protocol === 'SUSHISWAP_V2' ? (
                  'V2'
                ) : (
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4217FF] to-[#3DB1FF]">
                    Blade
                  </span>
                )}
              </div>
            </div>
            {showAddLiquidityButton && !isMd ? (
              <LinkInternal
                href={`/${getEvmChainById(pool.chainId).key}/pool/v3/${pool.address}/add?feeAmount=${
                  pool.swapFee * 1000000
                }&fromCurrency=${token0?.isNative ? 'NATIVE' : token0?.address}&toCurrency=${
                  token1?.isNative ? 'NATIVE' : token1?.address
                }`}
              >
                <Button
                  size="sm"
                  className="w-fit !p-2 !h-[32px] !min-h-[32px]"
                >
                  <PlusIcon className="w-4 h-4" />
                </Button>
              </LinkInternal>
            ) : null}
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
