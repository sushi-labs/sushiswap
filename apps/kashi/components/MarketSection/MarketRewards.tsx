import { Currency, Table, Typography } from '@sushiswap/ui'
import { FC } from 'react'

import { KashiPair } from '../../.graphclient'
import { useTokensFromKashiPair } from '../../lib/hooks'

interface MarketRewardsProps {
  pair: KashiPair
}

// TODO rewards
export const MarketRewards: FC<MarketRewardsProps> = ({ pair }) => {
  const { asset } = useTokensFromKashiPair(pair)

  return (
    <div className="flex flex-col w-full gap-4">
      <div className="flex items-center justify-between px-2">
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
                <div className="flex items-center gap-3">
                  <Currency.Icon currency={asset} width={24} height={24} />
                  <Typography weight={700} variant="sm" className="text-slate-50">
                    {asset.symbol}
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
