import { ArrowTopRightOnSquareIcon } from '@heroicons/react/20/solid'
import {
  type RawV2Pool,
  type RawV3Pool,
  type RawV4Pool,
  hydratePoolCurrency,
} from '@sushiswap/graph-client/data-api'
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
  EvmChainId,
  type EvmCurrency,
  EvmToken,
  SushiSwapProtocol,
  getEvmChainById,
  unwrapEvmToken,
} from 'sushi/evm'
import type { Hex } from 'viem'
import { APRHoverCard } from '~evm/[chainId]/_ui/apr-hover-card'

const PROTOCOL_PILLS: Record<
  RawV2Pool['protocol'] | RawV3Pool['protocol'] | RawV4Pool['protocol'],
  { label: string; className: string }
> = {
  [SushiSwapProtocol.SUSHISWAP_V2]: {
    label: 'V2',
    className: 'bg-pink/20 text-pink',
  },
  [SushiSwapProtocol.SUSHISWAP_V3]: {
    label: 'V3',
    className: 'bg-blue/20 text-blue',
  },
  [SushiSwapProtocol.SUSHISWAP_V4]: {
    label: 'V4',
    className: 'bg-purple-500/20 text-purple-500',
  },
}

function getPoolCurrencies(
  pool: RawV2Pool | RawV3Pool | RawV4Pool,
): [EvmCurrency, EvmCurrency] {
  // V4 pools hold native currency directly, so their tokens are never unwrapped
  if (pool.protocol === SushiSwapProtocol.SUSHISWAP_V4) {
    return [hydratePoolCurrency(pool.token0), hydratePoolCurrency(pool.token1)]
  }

  if (pool.chainId === EvmChainId.ARC) {
    return [new EvmToken(pool.token0), new EvmToken(pool.token1)]
  }

  return [
    unwrapEvmToken(new EvmToken(pool.token0)),
    unwrapEvmToken(new EvmToken(pool.token1)),
  ]
}

type PoolHeader = {
  backUrl: string
  /** The pool address, or the pool ID for V4 pools */
  address: Hex
  pool: RawV2Pool | RawV3Pool | RawV4Pool
  apy?: {
    fees: number | undefined
    rewards: number | undefined
    vault?: number
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
  const [token0, token1] = getPoolCurrencies(pool)
  const pill = PROTOCOL_PILLS[pool.protocol]
  const isV4 = pool.protocol === SushiSwapProtocol.SUSHISWAP_V4

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
            {/* V4 pool IDs are not accounts, so there is nothing to link to */}
            {isV4 ? (
              <h1
                className={typographyVariants({
                  variant: 'h1',
                  className:
                    'sm:!text2-xl sm:!text-4xl !font-bold text-gray-900 dark:text-slate-50 truncate overflow-x-auto',
                })}
              >
                {token0.symbol}/{token1.symbol}
              </h1>
            ) : (
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
            )}
            <div
              className={classNames(
                pill.className,
                'text-sm px-2 py-1 font-semibold rounded-full mt-0.5',
              )}
            >
              {pill.label}
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

            <APRHoverCard pool={pool} smartPoolAPR={apy.vault}>
              <span className="underline decoration-dotted underline-offset-2">
                {formatPercent(
                  ((typeof apy.vault === 'number' ? apy.vault : apy.fees) ||
                    0) + (apy.rewards || 0),
                )}
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
          {'isDynamicFee' in pool && pool.isDynamicFee
            ? 'Dynamic'
            : `${pool.swapFee * 100}%`}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-semibold tracking-tighter">Network</span>
          {getEvmChainById(pool.chainId).name}
        </div>
        <PoolTokenAddress
          chainId={pool.chainId}
          token={token0}
          showNative={!isV4}
        />
        <PoolTokenAddress
          chainId={pool.chainId}
          token={token1}
          showNative={!isV4}
        />
      </div>
    </div>
  )
}

/**
 * Links the token's contract. A native V4 pool token has none, while V2/V3
 * pools show the wrapped token they actually hold.
 */
function PoolTokenAddress({
  chainId,
  token,
  showNative,
}: {
  chainId: EvmChainId
  token: EvmCurrency
  showNative: boolean
}) {
  if (token.isNative && !showNative) return null

  return (
    <div className="flex items-center gap-1.5">
      <span className="font-semibold tracking-tighter">{token.symbol}</span>
      <LinkExternal
        target="_blank"
        href={getEvmChainById(chainId).getTokenUrl(token.wrap().address)}
      >
        <Button
          asChild
          variant="link"
          size="sm"
          className="!font-medium !text-secondary-foreground"
        >
          {shortenAddress(token.wrap().address, 4)}
          <ArrowTopRightOnSquareIcon className="w-3 h-3" />
        </Button>
      </LinkExternal>
    </div>
  )
}
