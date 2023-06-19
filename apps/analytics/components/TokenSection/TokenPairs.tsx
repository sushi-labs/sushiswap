import chains from '@sushiswap/chain'
import { usePools } from '@sushiswap/client'
import { Native, Token } from '@sushiswap/currency'
import { formatPercent, formatUSD } from '@sushiswap/format'
import { Token as GraphToken } from '@sushiswap/graph-client'
import { Currency, Link, Table, Tooltip, Typography } from '@sushiswap/ui'
import { FC } from 'react'
import { useSWRConfig } from 'swr'

import { FarmRewardsAvailableTooltip } from '../FarmRewardsAvailableTooltip'
import { PoolQuickHoverTooltip } from '../PoolQuickHoverTooltip'

interface TokenPairs {
  token: GraphToken
}

export const TokenPairs: FC<TokenPairs> = ({ token }) => {
  const { data: pools } = usePools({ args: { ids: token.pairs.map(({ pair }) => pair.id) }, swrConfig: useSWRConfig() })

  return (
    <div className="flex flex-col w-full gap-4">
      <Typography weight={600} className="text-slate-50">
        Trending Pairs
      </Typography>
      <Table.container className="w-full">
        <Table.table>
          <Table.thead>
            <Table.thr>
              <Table.th>
                <div className="text-left">Name</div>
              </Table.th>
              <Table.th>
                <div className="text-left">TVL</div>
              </Table.th>
              <Table.th>
                <div className="text-left">Volume (7d)</div>
              </Table.th>
              <Table.th>
                <div className="text-left">APY</div>
              </Table.th>
            </Table.thr>
          </Table.thead>
          <Table.tbody>
            {pools &&
              token.pairs.map(({ pair }) => {
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
                  <Tooltip
                    destroyTooltipOnHide={true}
                    key={pair.id}
                    trigger="hover"
                    mouseEnterDelay={0.5}
                    placement="top"
                    button={
                      <Table.tr>
                        <Table.td>
                          <Link.External href={`/earn/${pair.id}`} className="!no-underline">
                            <div className="flex items-center">
                              <Currency.IconList iconWidth={24} iconHeight={24}>
                                <Currency.Icon currency={token0} />
                                <Currency.Icon currency={token1} />
                              </Currency.IconList>
                              <Link.External
                                className="flex flex-col !no-underline group"
                                href={chains[token.chainId].getTokenUrl(pair.id.split(':')[1])}
                              >
                                <Typography variant="sm" weight={600}>
                                  {token0.symbol} <span className="text-slate-400">/</span> {token1.symbol}
                                </Typography>
                              </Link.External>
                            </div>
                          </Link.External>
                        </Table.td>
                        <Table.td>
                          <Link.External href={`/earn/${pair.id}`} className="!no-underline">
                            <Typography weight={600} variant="sm" className="text-slate-100">
                              {liquidityUSD.includes('NaN') ? '$0.00' : liquidityUSD}
                            </Typography>
                          </Link.External>
                        </Table.td>
                        <Table.td>
                          <Link.External href={`/earn/${pair.id}`} className="!no-underline">
                            <Typography weight={600} variant="sm" className="text-slate-100">
                              {volume1w.includes('NaN') ? '$0.00' : volume1w}
                            </Typography>
                          </Link.External>
                        </Table.td>
                        <Table.td>
                          <Link.External href={`/earn/${pair.id}`} className="!no-underline">
                            <Typography weight={600} variant="sm" className="text-slate-100">
                              {formatPercent(pair.feeApr)}{' '}
                              {pool && pool.incentives.length > 0 && pool.incentiveApr > 0 && (
                                <FarmRewardsAvailableTooltip />
                              )}
                            </Typography>
                          </Link.External>
                        </Table.td>
                      </Table.tr>
                    }
                    panel={pool ? <PoolQuickHoverTooltip row={pool} /> : <></>}
                  />
                )
              })}
          </Table.tbody>
        </Table.table>
      </Table.container>
    </div>
  )
}
