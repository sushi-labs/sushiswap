import { ArrowTopRightOnSquareIcon } from '@heroicons/react/20/solid'
import type { RawV2Pool, RawV3Pool } from '@sushiswap/graph-client/data-api'
import { Button, Currency, LinkExternal, LinkInternal } from '@sushiswap/ui'
import type { FC } from 'react'
import { formatPercent, shortenAddress } from 'sushi'
import {
  type EvmAddress,
  EvmChainId,
  EvmToken,
  getEvmChainById,
  unwrapEvmToken,
} from 'sushi/evm'
import { APRHoverCard } from '~evm/[chainId]/_ui/apr-hover-card'
import { ProtocolBadge } from '../../_ui/protocol-badge'

type PoolHeader = {
  backUrl: string
  address: EvmAddress
  pool: RawV2Pool | RawV3Pool
  apy?: {
    fees: number | undefined
    rewards: number | undefined
    vault?: number
  }
  priceRange?: string
  hasEnabledStrategies?: boolean
  showAddLiquidityButton?: boolean
  title?: {
    main: string
    sub: string
  }
}

export const PoolHeader: FC<PoolHeader> = ({
  backUrl,
  address,
  pool,
  apy,
  priceRange,
  showAddLiquidityButton = false,
  title,
}) => {
  const token0 =
    pool.chainId === EvmChainId.ARC
      ? new EvmToken(pool.token0)
      : unwrapEvmToken(new EvmToken(pool.token0))
  const token1 =
    pool.chainId === EvmChainId.ARC
      ? new EvmToken(pool.token1)
      : unwrapEvmToken(new EvmToken(pool.token1))

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap justify-between gap-6">
        <LinkInternal
          href={backUrl}
          className="text-sm text-pink hover:underline"
        >
          ← Back
        </LinkInternal>
        {showAddLiquidityButton ? (
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
            <Button>Add Liquidity</Button>
          </LinkInternal>
        ) : null}
      </div>
      {title ? (
        <div className="flex flex-col gap-1 mb-2">
          <h1 className="text-3xl md:text-4xl font-medium">{title.main}</h1>
          <h2 className="md:text-lg text-secondary-foreground">{title.sub}</h2>
        </div>
      ) : null}
      <div className="flex flex-col gap-4 md:flex-row center md:justify-between md:flex-wrap">
        <div className="relative flex items-center gap-2">
          <Currency.IconList iconWidth={36} iconHeight={36}>
            <Currency.Icon currency={token0} />
            <Currency.Icon currency={token1} />
          </Currency.IconList>
          <Button
            asChild
            variant="link"
            className={
              'truncate overflow-x-auto !rounded-none font-semibold !text-2xl'
            }
          >
            <LinkExternal
              href={getEvmChainById(pool.chainId).getAccountUrl(address)}
            >
              <span className="tracking-wide !text-primary">
                {token0.symbol}/{token1.symbol}
              </span>
            </LinkExternal>
          </Button>
          <ProtocolBadge protocol={pool.protocol} size="lg" />
        </div>

        <div className="flex flex-wrap items-center gap-y-5 gap-x-[32px] text-secondary-foreground">
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
    </div>
  )
}
