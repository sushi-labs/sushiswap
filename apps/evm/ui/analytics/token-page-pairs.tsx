'use client'

import { usePools } from '@sushiswap/client/hooks'
import { Token as GraphToken } from '@sushiswap/graph-client'
import { LinkExternal, LinkInternal } from '@sushiswap/ui'
import { Currency } from '@sushiswap/ui/components/currency'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@sushiswap/ui/components/table'
import React, { FC } from 'react'
import { formatPercent, formatUSD } from 'sushi'
import chains from 'sushi/chain'
import { Native, Token } from 'sushi/currency'
import { useSWRConfig } from 'swr'

interface TokenPairs {
  token: GraphToken
}

export const TokenPairs: FC<TokenPairs> = ({ token }) => {
  const { data: pools } = usePools({
    args: { ids: token.pairs.map(({ pair }) => pair.id) },
    swrConfig: useSWRConfig(),
  })

  return (
    <div className="flex flex-col w-full gap-4">
      <p className="font-semibold  text-slate-50">Trending Pairs</p>
      <Table>
        <TableHeader>
          <TableHead>
            <div className="text-left">Name</div>
          </TableHead>
          <TableHead>
            <div className="text-left">TVL</div>
          </TableHead>
          <TableHead>
            <div className="text-left">Volume (7d)</div>
          </TableHead>
          <TableHead>
            <div className="text-left">APY</div>
          </TableHead>
        </TableHeader>
        <TableBody>
          {pools &&
            token.pairs.map(({ pair }, i) => {
              const pool = pools.find((pool) => pool.id === pair.id)

              const [token0, token1] = [
                pair.token0.id === Native.onChain(token.chainId).wrapped.address
                  ? Native.onChain(token.chainId)
                  : new Token({
                      address: pair.token0.id,
                      chainId: pair.chainId,
                      decimals: Number(pair.token0.decimals),
                      symbol: pair.token0.symbol,
                    }),
                pair.token1.id === Native.onChain(token.chainId).wrapped.address
                  ? Native.onChain(token.chainId)
                  : new Token({
                      address: pair.token1.id,
                      chainId: pair.chainId,
                      decimals: Number(pair.token1.decimals),
                      symbol: pair.token1.symbol,
                    }),
              ]

              const liquidityUSD = formatUSD(pair.liquidityUSD)
              const volume1w = formatUSD(pair.volume1w)

              return (
                <TableRow key={i}>
                  <TableCell>
                    <LinkInternal href={`/pool/${pair.id}`}>
                      <div className="flex items-center">
                        <Currency.IconList iconWidth={24} iconHeight={24}>
                          <Currency.Icon currency={token0} />
                          <Currency.Icon currency={token1} />
                        </Currency.IconList>
                        <LinkExternal
                          className="flex flex-col !no-underline group"
                          href={chains[token.chainId].getTokenUrl(
                            pair.id.split(':')[1],
                          )}
                        >
                          <p className="text-sm font-semibold">
                            {token0.symbol}{' '}
                            <span className="text-slate-400">/</span>{' '}
                            {token1.symbol}
                          </p>
                        </LinkExternal>
                      </div>
                    </LinkInternal>
                  </TableCell>
                  <TableCell>
                    <LinkInternal
                      href={`/pool/${pair.id}`}
                      className="!no-underline"
                    >
                      <p className="font-semibold text-sm text-slate-100">
                        {liquidityUSD.includes('NaN') ? '$0.00' : liquidityUSD}
                      </p>
                    </LinkInternal>
                  </TableCell>
                  <TableCell>
                    <LinkInternal
                      href={`/pool/${pair.id}`}
                      className="!no-underline"
                    >
                      <p className="font-semibold text-sm text-slate-100">
                        {volume1w.includes('NaN') ? '$0.00' : volume1w}
                      </p>
                    </LinkInternal>
                  </TableCell>
                  <TableCell>
                    <LinkInternal
                      href={`/pool/${pair.id}`}
                      className="!no-underline"
                    >
                      <p className="font-semibold text-sm text-slate-100">
                        {formatPercent(pair.feeApr)}{' '}
                        {/*{pool && pool.incentives.length > 0 && pool.incentiveApr > 0 && (*/}
                        {/*  <FarmRewardsAvailableTooltip />*/}
                        {/*)}*/}
                      </p>
                    </LinkInternal>
                  </TableCell>
                </TableRow>
              )
            })}
        </TableBody>
      </Table>
    </div>
  )
}
