import { Badge } from '@sushiswap/ui/components/Badge'
import { Currency } from '@sushiswap/ui/components/currency'
import { Explainer } from '@sushiswap/ui/components/explainer'
import { NetworkIcon } from '@sushiswap/ui/components/icons'
import { List } from '@sushiswap/ui/components/list/List'
import { format } from 'date-fns'
import { unwrapToken } from 'lib/functions'
import React, { FC } from 'react'

import { RewardTableV3CellProps } from './Cells'
import { rewardPerDay } from './utils'

export const RewardsTableV3RowPopover: FC<RewardTableV3CellProps> = ({ row }) => {
  const ongoingFarms = row.distributionData.filter((el) => el.isLive)
  console.debug('ongoing farms', ongoingFarms)
  return (
    <div className="p-2">
      <div className="flex items-center gap-4">
        <div className="min-w-[52px]">
          <Badge
            className="border-2 border-gray-100 dark:border-slate-900 rounded-full z-[11] !bottom-0 right-[-15%]"
            position="bottom-right"
            badgeContent={<NetworkIcon chainId={row.chainId} width={20} height={20} />}
          >
            <Currency.IconList iconWidth={40} iconHeight={40}>
              <Currency.Icon currency={row.token0} />
              <Currency.Icon currency={row.token1} />
            </Currency.IconList>
          </Badge>
        </div>
        <div className="flex flex-col items-baseline gap-[1px]">
          <span className="flex items-baseline gap-1 text-sm font-medium text-gray-900 dark:text-slate-50">
            {unwrapToken(row.token0).symbol} <span className="font-normal text-gray-900 dark:text-slate-500">/</span>{' '}
            {unwrapToken(row.token1).symbol}
            <span className="text-xs text-gray-500 dark:text-slate-500">{row.poolFee}%</span>
          </span>
          <div className="rounded-full px-2 py-0.5 text-xs bg-black/[0.06] dark:bg-white/[0.06]">
            {ongoingFarms.length} Ongoing Farms
          </div>
        </div>
      </div>
      <List className="mt-4">
        <List.Control className="max-h-[300px] overflow-y-scroll scroll">
          {ongoingFarms.map(
            ({ start, end, amount, token, propFees, propToken0, propToken1, isOutOfRangeIncentivized }, i) => (
              <>
                <List.Label className="!text-[10px] !px-4 pt-4 uppercase font-semibold !text-gray-400 !dark:text-slate-500">
                  Farm {i + 1}
                </List.Label>
                <List.KeyValue
                  flex
                  className="!items-start"
                  title={
                    <div className="flex items-center gap-1">
                      Reward
                      <Explainer>
                        Total reward that gets distributed per day over all liquidity providers in this pool.
                      </Explainer>
                    </div>
                  }
                  subtitle="per day"
                >
                  <div className="flex items-center gap-2">
                    <Currency.Icon currency={token} width={18} height={18} />
                    {rewardPerDay({
                      start,
                      end,
                      amount,
                      token,
                    })?.toSignificant(6)}{' '}
                    {unwrapToken(token).symbol}
                  </div>
                </List.KeyValue>
                <List.KeyValue className="!items-start" flex title="Duration">
                  <div className="flex flex-col">
                    <span className="font-mediumt">{Math.floor((end - Date.now() / 1000) / 3600 / 24)} days left</span>
                    <span className="text-xs text-gray-500 dark:text-slate-500">
                      Ends at: {format(end * 1000, 'dd MMM yyyy hh:mm')}
                    </span>
                  </div>
                </List.KeyValue>
                <List.KeyValue
                  flex
                  className="!items-start"
                  title={
                    <div className="flex items-center gap-1">
                      Details
                      <Explainer>
                        Weight that fees earned by positions represent in their rewards score. A higher % means that
                        more rewards will be attributed to positions that earn more fees during the distribution.
                      </Explainer>
                    </div>
                  }
                  subtitle="Reward weights (%)"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {propFees}% / {propToken0}% / {propToken1}%
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-slate-500">
                      Fees / {row.token0.symbol} / {row.token1.symbol}
                    </span>
                  </div>
                </List.KeyValue>
                <List.KeyValue
                  flex
                  className="!items-start"
                  title={
                    <div className="flex items-center gap-1">
                      Out of range Liquidity
                      <Explainer>This farm does not incentivize out of range liquidity.</Explainer>
                    </div>
                  }
                >
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {isOutOfRangeIncentivized ? 'Incentivized' : 'Not Incentivized'}
                    </span>
                  </div>
                </List.KeyValue>
              </>
            )
          )}
        </List.Control>
      </List>
    </div>
  )
}
