import { Native, tryParseAmount } from '@sushiswap/currency'
import { formatUSD } from '@sushiswap/format'
import { Currency, Table, Typography } from '@sushiswap/ui'
import { usePrices } from '@sushiswap/wagmi'
import { FC } from 'react'

import { Pair } from '../../.graphclient'
import { useTokensFromPair } from '../../lib/hooks'

interface PoolCompositionProps {
  pair: Pair
}

export const PoolComposition: FC<PoolCompositionProps> = ({ pair }) => {
  const { data: prices } = usePrices({ chainId: pair.chainId })
  const [token0, token1] = useTokensFromPair(pair)

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex justify-between items-center px-2">
        <Typography weight={700} className="text-slate-50">
          Pool Composition
        </Typography>
        <Typography variant="sm" weight={400} className="text-slate-400">
          Total Assets:{' '}
          <span className="font-bold text-slate-50">
            {' '}
            {formatUSD(pair.reserveETH * Number(prices?.[Native.onChain(pair.chainId).wrapped.address].toFixed(10)))}
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
                <div className="flex gap-3 items-center">
                  <Currency.Icon currency={token0} width={24} height={24} />
                  <Typography weight={700} variant="sm" className="text-slate-50">
                    {token0.symbol}
                  </Typography>
                </div>
              </Table.td>
              <Table.td>
                <Typography weight={500} variant="sm" className="text-slate-400">
                  {tryParseAmount(pair.reserve0, token0)?.toSignificant(6)}
                </Typography>
              </Table.td>
              <Table.td>{formatUSD(pair.reserve0 * Number(prices?.[token0.address].toFixed(10)))}</Table.td>
            </Table.tr>
            <Table.tr>
              <Table.td>
                <div className="flex gap-3 items-center">
                  <Currency.Icon currency={token1} width={24} height={24} />
                  <Typography weight={700} variant="sm" className="text-slate-50">
                    {token1.symbol}
                  </Typography>
                </div>
              </Table.td>
              <Table.td>
                <Typography weight={500} variant="sm" className="text-slate-400">
                  {tryParseAmount(pair.reserve1, token1)?.toSignificant(6)}
                </Typography>
              </Table.td>
              <Table.td>{formatUSD(pair.reserve1 * Number(prices?.[token1.address].toFixed(10)))}</Table.td>
            </Table.tr>
          </Table.tbody>
        </Table.table>
      </Table.container>
    </div>
  )
}
