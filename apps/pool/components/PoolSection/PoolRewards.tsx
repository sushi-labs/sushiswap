import { Currency, Table, Typography } from '@sushiswap/ui'
import { FC } from 'react'

import { useTokensFromPair } from '../../lib/hooks'
import { PairWithAlias } from '../../types'

interface PoolRewardsProps {
  pair: PairWithAlias
}

// TODO rewards
export const PoolRewards: FC<PoolRewardsProps> = ({ pair }) => {
  const { token0 } = useTokensFromPair(pair)

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex justify-between items-center px-2">
        <Typography weight={700} className="text-slate-50">
          Rewards
        </Typography>
        <Typography variant="sm" weight={400} className="text-slate-400">
          Reward APR: <span className="font-bold text-slate-50">12%</span>
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
                <Typography variant="sm" weight={500} className="text-slate-50">
                  69.74 SUSHI per day
                </Typography>
              </Table.td>
            </Table.tr>
          </Table.tbody>
        </Table.table>
      </Table.container>
    </div>
  )
}
