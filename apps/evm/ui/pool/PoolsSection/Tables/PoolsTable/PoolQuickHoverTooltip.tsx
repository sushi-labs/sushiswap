import { PlusIcon, UserCircleIcon } from '@heroicons/react-v1/solid'
import { ChainId } from '@sushiswap/chain'
import { Pool, Protocol } from '@sushiswap/client'
import { formatNumber, formatPercent } from '@sushiswap/format'
import { Button } from '@sushiswap/ui/components/button'
import { Currency } from '@sushiswap/ui/components/currency'
import { List } from '@sushiswap/ui/components/list/List'
import { incentiveRewardToToken } from 'lib/functions'
import React, { FC } from 'react'

interface PoolQuickHoverTooltipProps {
  row: Pool
}

export const PoolQuickHoverTooltip: FC<PoolQuickHoverTooltipProps> = ({ row }) => {
  return (
    <div className="flex flex-col gap-3 p-2">
      <div className="flex flex-col gap-1">
        <span className="text-[10px] text-gray-500 dark:text-slate-500">
          <span className="font-semibold text-gray-900 dark:text-slate-50">Total APR</span> • Rewards + Fees
        </span>
        <span className="text-3xl font-medium text-gray-900 dark:text-slate-50">
          {formatPercent(row.totalApr1d)}{' '}
          <span className="text-[10px] text-gray-500 dark:text-slate-500">
            {formatPercent(row.incentiveApr)} + {formatPercent(row.feeApr1d)}
          </span>
        </span>
      </div>
      <div className="flex gap-2">
        <Button icon={PlusIcon} asChild size="sm" variant="secondary">
          <a href={row.protocol === Protocol.SUSHISWAP_V3 ? `/${row.id}?activeTab=new` : `/${row.id}/add`}>Deposit</a>
        </Button>
        {row.protocol === Protocol.SUSHISWAP_V3 && (
          <Button icon={UserCircleIcon} asChild size="sm" variant="secondary">
            <a href={`/pools/${row.id}?activeTab=myPositions`}>My Positions</a>
          </Button>
        )}
      </div>

      {!!row?.incentives?.length && (
        <>
          <List className="!pt-5">
            <div className="flex justify-between">
              <List.Label>Reward Emission</List.Label>
              <List.Label>per day</List.Label>
            </div>
            <List.Control className="bg-gray-100 dark:bg-slate-700">
              {row.incentives
                .filter((incentive) => incentive.rewardPerDay > 0)
                .map((incentive) => (
                  <List.Item
                    key={incentive.id}
                    icon={Currency.Icon}
                    iconProps={{
                      currency: incentiveRewardToToken(row.chainId as ChainId, incentive),
                    }}
                    title={`${formatNumber(incentive.rewardPerDay)} ${incentive.rewardToken.symbol}`}
                  />
                ))}
            </List.Control>
          </List>
        </>
      )}
    </div>
  )
}
