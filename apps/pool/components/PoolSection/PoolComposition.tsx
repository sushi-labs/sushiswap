import { Amount, Native } from '@sushiswap/currency'
import { formatUSD } from '@sushiswap/format'
import { Currency, Table, Typography } from '@sushiswap/ui'
import { usePrices } from '@sushiswap/wagmi'
import { FC } from 'react'

import { useTokensFromPair } from '../../lib/hooks'
import { PairWithAlias } from '../../types'

interface PoolCompositionProps {
  pair: PairWithAlias
}

export const PoolComposition: FC<PoolCompositionProps> = ({ pair }) => {
  const { data: prices } = usePrices({ chainId: pair.chainId })
  const { token0, token1 } = useTokensFromPair(pair)
  const reserve0 = Amount.fromRawAmount(token0, pair.reserve0)
  const reserve1 = Amount.fromRawAmount(token1, pair.reserve1)
  return (
    <div className="flex flex-col w-full gap-4">
      <div className="flex items-center justify-between px-2">
        <Typography weight={600} className="text-slate-50">
          Pool Composition
        </Typography>
        <Typography variant="sm" weight={400} className="text-slate-400">
          Total Assets:{' '}
          <span className="font-bold text-slate-50">
            {' '}
            {formatUSD(
              pair.liquidityNative * Number(prices?.[Native.onChain(pair.chainId).wrapped.address].toFixed(10))
            )}
          </span>
        </Typography>
      </div>
      <Table.container className="w-full">
        <Table.table>
          <Table.thead>
            <Table.thr>
              <Table.th>
                <div className="text-left">Token</div>
              </Table.th>
              <Table.th>
                <div className="text-left">Amount</div>
              </Table.th>
              <Table.th>
                <div className="text-left">Value</div>
              </Table.th>
            </Table.thr>
          </Table.thead>
          <Table.tbody>
            <Table.tr>
              <Table.td>
                <div className="flex items-center gap-3">
                  <Currency.Icon currency={token0} width={24} height={24} />
                  <Typography weight={600} variant="sm" className="text-slate-50">
                    {token0.symbol}
                  </Typography>
                </div>
              </Table.td>
              <Table.td>
                <Typography weight={500} variant="sm" className="text-slate-400">
                  {reserve0?.toSignificant(6)}
                </Typography>
              </Table.td>
              <Table.td>
                <Typography weight={600} variant="sm" className="text-slate-50">
                  {formatUSD(
                    prices?.[token0.wrapped.address]
                      ? reserve0.multiply(prices?.[token0.wrapped.address].asFraction).toSignificant(6)
                      : ''
                  )}
                </Typography>
              </Table.td>
            </Table.tr>
            <Table.tr>
              <Table.td>
                <div className="flex items-center gap-3">
                  <Currency.Icon currency={token1} width={24} height={24} />
                  <Typography weight={600} variant="sm" className="text-slate-50">
                    {token1.symbol}
                  </Typography>
                </div>
              </Table.td>
              <Table.td>
                <Typography weight={500} variant="sm" className="text-slate-400">
                  {reserve1?.toSignificant(6)}
                </Typography>
              </Table.td>
              <Table.td>
                <Typography weight={600} variant="sm" className="text-slate-50">
                  {formatUSD(
                    prices?.[token1.wrapped.address]
                      ? reserve1.multiply(prices?.[token1.wrapped.address].asFraction).toSignificant(6)
                      : ''
                  )}
                </Typography>
              </Table.td>
            </Table.tr>
          </Table.tbody>
        </Table.table>
      </Table.container>
    </div>
  )
}
