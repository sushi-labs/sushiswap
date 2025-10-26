'use client'

import type { BladePool } from '@sushiswap/graph-client/data-api'
import {
  Badge,
  Button,
  Currency,
  LinkExternal,
  LinkInternal,
} from '@sushiswap/ui'
import { CurrencyFiatIcon } from '@sushiswap/ui/icons/CurrencyFiatIcon'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import React, { type FC, useMemo, useState, Fragment } from 'react'
import { getPoolTokensGrouped } from 'src/lib/pool/blade'
import { formatUSD } from 'sushi'
import { type EvmAddress, getEvmChainById, shortenEvmAddress } from 'sushi/evm'

type PoolHeader = {
  backUrl: string
  address: EvmAddress
  pool: BladePool
}

export const BladePoolLiquidityHeader: FC<PoolHeader> = ({
  backUrl,
  address,
  pool,
}) => {
  const [showStableTypes, setShowStableTypes] = useState(false)

  const groupedTokens = useMemo(() => {
    if (!pool) return { tokens: [], stablecoinUsdTokens: [] }
    return getPoolTokensGrouped(pool)
  }, [pool])

  const { tokens, stablecoinUsdTokens } = groupedTokens
  const hasStablecoin = stablecoinUsdTokens.length > 0

  const tokenSymbols = useMemo(
    () => [
      ...tokens.map((token) => token.symbol),
      ...(hasStablecoin && !showStableTypes
        ? ['USD']
        : stablecoinUsdTokens.map((token) => token.symbol)),
    ],
    [tokens, hasStablecoin, showStableTypes, stablecoinUsdTokens],
  )

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <div className="flex flex-col gap-3 sm:gap-4">
          <LinkInternal
            href={backUrl}
            className="text-sm text-blue hover:underline"
          >
            ← Back
          </LinkInternal>
          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-7">
                <div className="relative flex">
                  <Badge
                    className="!-right-[6px] !-bottom-[2px] z-[11] rounded-full border-2 border-white"
                    position="bottom-right"
                    badgeContent={
                      <NetworkIcon
                        chainId={pool.chainId}
                        width={16}
                        height={16}
                      />
                    }
                  >
                    <Currency.IconList iconWidth={36} iconHeight={36}>
                      {tokens.map((token) => (
                        <Currency.Icon
                          key={token.wrap().address}
                          currency={token}
                        />
                      ))}
                      {hasStablecoin && !showStableTypes ? (
                        <CurrencyFiatIcon width={36} height={36} />
                      ) : (
                        stablecoinUsdTokens.map((token) => (
                          <Currency.Icon
                            key={token.wrap().address}
                            currency={token}
                          />
                        ))
                      )}
                    </Currency.IconList>
                  </Badge>
                </div>
                <div className="flex flex-col items-center gap-1 sm:items-start">
                  <h1 className="text-center text-xl font-bold text-gray-900 dark:text-slate-50 break-words sm:text-left sm:text-2xl">
                    {tokenSymbols.map((symbol, index) => (
                      <Fragment key={index}>
                        {index > 0 && (
                          <span className="pr-1 sm:pr-0">{'\u200B/'}</span>
                        )}
                        <span>{symbol}</span>
                      </Fragment>
                    ))}
                  </h1>
                  {hasStablecoin && (
                    <Button
                      onClick={() => setShowStableTypes(!showStableTypes)}
                      variant="link"
                    >
                      Show stablecoin types
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap justify-center sm:justify-start items-center gap-4 sm:gap-x-8 text-sm text-secondary-foreground">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold">TVL</span>
            <span>{formatUSD(pool.liquidityUSD)}</span>
          </div>
          <div className="hidden sm:block h-4 w-px bg-gray-300" />
          <div className="flex items-center gap-1.5">
            <span className="font-semibold">Volume(24hr)</span>
            <span>{formatUSD(pool.volumeUSD1d)}</span>
          </div>
          <div className="hidden sm:block h-4 w-px bg-gray-300" />
          <div className="flex items-center gap-1.5">
            <span className="font-semibold">Pool Address</span>
            <LinkExternal
              target="_blank"
              href={getEvmChainById(pool.chainId).getAccountUrl(address)}
              className="text-blue hover:underline break-all"
            >
              {shortenEvmAddress(address, 4)}
            </LinkExternal>
          </div>
      </div>
    </div>
  )
}
