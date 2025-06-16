'use client'

import type { BladePool } from '@sushiswap/graph-client/data-api'
import { Badge, Button, Currency, LinkExternal } from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import { SushiIcon } from '@sushiswap/ui/icons/SushiIcon'
import Link from 'next/link'
import { type FC, Fragment, useMemo, useState } from 'react'
import { getPoolTokensGrouped } from 'src/lib/pool/blade'
import { ChainKey, EvmChain } from 'sushi'
import { formatPercent, formatUSD } from 'sushi/format'
import { shortenAddress } from 'sushi/format'
import { CurrencyFiatIcon } from '../CurrencyFiatIcon'
import background from '../assets/banner-background.jpg'
import { BladeLetter } from './BladeLetter'

interface BladePoolHeroProps {
  pool: BladePool
}

export const BladePoolHero: FC<BladePoolHeroProps> = ({ pool }) => {
  const [showStableCoins, setShowStableCoins] = useState(false)
  const groupedTokens = getPoolTokensGrouped(pool)
  const { tokens, stablecoinUsdTokens } = groupedTokens
  const hasStablecoin = stablecoinUsdTokens.length > 0

  const tokenSymbols = useMemo(
    () => [
      ...tokens.map((token) => token.symbol),
      ...(hasStablecoin && !showStableCoins
        ? ['USD']
        : stablecoinUsdTokens.map((token) => token.symbol)),
    ],
    [tokens, hasStablecoin, showStableCoins, stablecoinUsdTokens],
  )
  const baseApr = pool.totalApr1d
  const rewardsApr = 0
  const basisApr = baseApr + rewardsApr

  const poolExplorerLink = EvmChain.from(pool.chainId)?.getAccountUrl(pool.id)

  return (
    <div
      className="relative min-h-[280px] w-full overflow-hidden rounded-[20px] bg-center bg-cover sm:min-h-[322px]"
      style={{
        background: `linear-gradient(180deg, rgba(5, 41, 57, 0.80) 0%, rgba(5, 41, 57, 0.40) 157.14%), url('${background.src}') lightgray -1289px -914px  no-repeat`,
      }}
    >
      <BladeLetter className="absolute top-0 right-0 opacity-20" />

      <div className="relative z-10 flex flex-col items-center justify-center gap-4 px-4 py-8 sm:gap-6 sm:py-12">
        <div className="flex flex-col items-center gap-3 sm:gap-4">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-7">
            <div className="relative flex">
              <Badge
                className="!-right-[12px] !-bottom-0 z-[11] rounded-full border-2 border-slate-900"
                position="bottom-right"
                badgeContent={
                  <NetworkIcon chainId={pool.chainId} width={20} height={20} />
                }
              >
                <Currency.IconList iconWidth={35} iconHeight={35}>
                  {tokens.map((token) => (
                    <Currency.Icon
                      key={token.address}
                      disableLink
                      currency={token}
                    />
                  ))}
                  {hasStablecoin && !showStableCoins ? (
                    <CurrencyFiatIcon width={35} height={35} />
                  ) : (
                    stablecoinUsdTokens.map((token) => (
                      <Currency.Icon
                        key={token.address}
                        disableLink
                        currency={token}
                      />
                    ))
                  )}
                </Currency.IconList>
              </Badge>
            </div>

            <div className="flex flex-col items-center gap-1 sm:items-start">
              <h1 className="break-words text-center font-bold text-white text-xl sm:text-left sm:text-2xl">
                {tokenSymbols.map((symbol, index) => (
                  <Fragment key={index}>
                    {index > 0 && (
                      <span className="pr-1 sm:pr-0">{'\u200B/'}</span>
                    )}
                    <span>{symbol}</span>
                  </Fragment>
                ))}
              </h1>
              <Button
                onClick={() => setShowStableCoins(!showStableCoins)}
                variant="blank"
                className="!p-0 !h-[unset] !min-h-[unset] font-medium text-blue text-sm hover:text-blue-700 sm:text-base"
              >
                Show stablecoin types
              </Button>
            </div>
          </div>

          <div className="flex justify-center xs:flex-row flex-col xs:flex-wrap items-center gap-3 text-white text-xs sm:flex-nowrap sm:gap-12 sm:text-sm lg:flex-wrap">
            <div className="flex items-center gap-1">
              <span className="font-medium">TVL</span>
              <span className="font-normal">
                {formatUSD(pool.liquidityUSD)}
              </span>
            </div>
            <div className="xs:block hidden h-[14px] w-px bg-gray-400" />
            <div className="flex items-center gap-1">
              <span className="font-medium">Volume(24h)</span>
              <span>{formatUSD(pool.volumeUSD1d)}</span>
            </div>
            <div className="xs:block hidden h-[14px] w-px bg-gray-400" />
            <div className="flex items-center gap-1">
              <span className="font-medium">Pool Address</span>
              <LinkExternal href={poolExplorerLink}>
                <span className="text-blue-400">
                  {shortenAddress(pool.address)}
                </span>
              </LinkExternal>
            </div>
          </div>
        </div>

        <div className="flex xs:flex-row flex-col items-center gap-2 sm:gap-3">
          <div className="flex flex-col items-center gap-1 sm:gap-2">
            <div className="bg-gradient-to-r font-bold font-orbitron text-2xl text-transparent text-white xs:text-sm sm:text-4xl">
              {formatPercent(basisApr)}
            </div>
            <div className="font-semibold text-white text-xs opacity-80">
              1D Basis APR
            </div>
          </div>

          <div className="hidden pb-6 font-normal text-gray-500 text-xl sm:block">
            =
          </div>
          <div className="block font-normal text-gray-500 text-sm sm:hidden">
            =
          </div>

          <div className="flex flex-col items-center gap-1 sm:gap-2">
            <div className="bg-gradient-to-r font-bold font-orbitron text-2xl text-transparent text-white xs:text-sm sm:text-4xl">
              {formatPercent(baseApr)}
            </div>
            <div className="font-medium text-white text-xs opacity-80">
              Base APR
            </div>
          </div>

          <div className="hidden pb-6 font-normal text-gray-500 text-xl sm:block">
            +
          </div>
          <div className="block font-normal text-gray-500 text-sm sm:hidden">
            +
          </div>

          <div className="flex flex-col items-center gap-1 sm:gap-2">
            <div className="relative flex items-center gap-2">
              <div className="bg-gradient-to-r font-bold font-orbitron text-2xl text-transparent text-white xs:text-sm sm:text-4xl">
                {formatPercent(rewardsApr)}
              </div>
              <div className="-right-6 sm:-right-8 absolute top-1 sm:top-2">
                <SushiIcon width={20} height={20} />
              </div>
            </div>
            <div className="font-medium text-white text-xs opacity-80">
              Rewards APR
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col items-center gap-2 sm:w-auto sm:flex-row sm:gap-3">
          <Link
            href={`/${ChainKey[pool.chainId]}/pool/blade/${pool.address}/add`}
          >
            <Button
              variant="blank"
              className="w-full rounded-lg bg-[#3B7EF6] bg-[linear-gradient(276deg,_#C3F1FB_2%,_#FFC9F1_142%)] px-4 py-2 font-medium text-[#12172B] text-sm hover:opacity-90 sm:w-auto sm:px-6"
            >
              Deposit Now
            </Button>
          </Link>
          <Button
            variant="blank"
            className="w-full rounded-lg bg-white/10 px-4 py-2 font-medium text-sm text-white hover:bg-white/20 sm:w-auto sm:px-6"
          >
            Read More
          </Button>
        </div>
      </div>
    </div>
  )
}
