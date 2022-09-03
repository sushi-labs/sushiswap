import { formatNumber, formatPercent } from '@sushiswap/format'
import { Currency, Table, Typography } from '@sushiswap/ui'
import React, { FC } from 'react'

import { usePoolFarmRewards } from '../PoolFarmRewardsProvider'

export const PoolRewards: FC = () => {
  const { totalAPR, incentives } = usePoolFarmRewards()

  return (
    <>
      <div className="flex flex-col gap-4 w-full">
        <div className="flex justify-between items-center px-2">
          <Typography weight={600} className="text-slate-50">
            Rewards
          </Typography>
          <Typography variant="sm" weight={400} className="text-slate-400">
            Reward APR:{' '}
            <span className="font-semibold text-slate-50">{totalAPR > 0 ? formatPercent(totalAPR) : 'n/a'}</span>
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
              {incentives ? (
                incentives.map((incentive, idx) => (
                  <Table.tr key={idx}>
                    <Table.td>
                      <div className="flex gap-3 items-center">
                        <Currency.Icon currency={incentive.rewardToken} width={24} height={24} />
                        <Typography weight={600} variant="sm" className="text-slate-50">
                          {incentive.rewardToken.symbol}
                        </Typography>
                      </div>
                    </Table.td>
                    <Table.td>
                      <Typography variant="sm" weight={600} className="text-slate-50">
                        {formatNumber(incentive.rewardPerDay)} {incentive.rewardToken.symbol} per day
                      </Typography>
                    </Table.td>
                  </Table.tr>
                ))
              ) : (
                <Table.tr>
                  <Table.td colSpan={2}>
                    <Typography variant="xs" className="text-slate-400 italic w-full text-center">
                      No rewards found
                    </Typography>
                  </Table.td>
                </Table.tr>
              )}
            </Table.tbody>
          </Table.table>
        </Table.container>
      </div>
    </>
  )
}
