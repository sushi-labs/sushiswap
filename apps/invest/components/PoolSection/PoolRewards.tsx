import { formatNumber, formatPercent } from '@sushiswap/format'
import { Pair } from '@sushiswap/graph-client/.graphclient'
import { Currency, Table, Typography } from '@sushiswap/ui'
import React, { FC } from 'react'

import { incentiveRewardToToken } from '../../lib/functions'

export const PoolRewards: FC<{ pair: Pair }> = ({ pair }) => {
  if (!pair.farm) return <></>

  return (
    <>
      <div className="flex flex-col w-full gap-4">
        <div className="flex items-center justify-between px-2">
          <Typography weight={600} className="text-slate-50">
            Rewards
          </Typography>
          <Typography variant="sm" weight={400} className="text-slate-400">
            Reward APR:{' '}
            <span className="font-semibold text-slate-50">
              {pair.incentiveApr > 0 ? formatPercent(pair.incentiveApr) : 'n/a'}
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
              </Table.thr>
            </Table.thead>
            <Table.tbody>
              {pair.farm.incentives ? (
                pair.farm.incentives.map((incentive, idx) => (
                  <Table.tr key={idx}>
                    <Table.td>
                      <div className="flex items-center gap-3">
                        <Currency.Icon
                          currency={incentiveRewardToToken(pair.chainId, incentive)}
                          width={24}
                          height={24}
                        />
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
                    <Typography variant="xs" className="w-full italic text-center text-slate-400">
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
