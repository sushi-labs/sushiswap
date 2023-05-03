import { formatNumber, formatPercent } from '@sushiswap/format'
import { Pool } from '@sushiswap/client'
import { Currency, Link } from '@sushiswap/ui'
import React, { FC } from 'react'

import { incentiveRewardToToken } from '../../../../lib/functions'
import { List } from '@sushiswap/ui/future/components/list/List'
import Button from '@sushiswap/ui/future/components/button/Button'
import { PlusIcon, UserCircleIcon } from '@heroicons/react/solid'

interface PoolQuickHoverTooltipProps {
  row: Pool
}

export const PoolQuickHoverTooltip: FC<PoolQuickHoverTooltipProps> = ({ row }) => {
  return (
    <div className="flex flex-col p-2 gap-3">
      <div className="flex flex-col gap-1">
        <span className="text-[10px] text-gray-500 dark:text-slate-500">
          <span className="font-semibold text-gray-900 dark:text-slate-50">Total APR</span> • Rewards + Fees
        </span>
        <span className="text-3xl font-medium text-gray-900 dark:text-slate-50">
          {formatPercent(row.totalApr)}{' '}
          <span className="text-[10px] text-gray-500 dark:text-slate-500">
            {formatPercent(row.incentiveApr)} + {formatPercent(row.feeApr)}
          </span>
        </span>
      </div>
      <div className="flex gap-2">
        <Link.Internal
          href={row.type === 'CONCENTRATED_LIQUIDITY_POOL' ? `/${row.id}?activeTab=new` : `/${row.id}/add`}
          passHref={true}
        >
          <Button as="a" size="xs" variant="outlined">
            <PlusIcon width={16} height={16} /> Deposit
          </Button>
        </Link.Internal>
        {row.type === 'CONCENTRATED_LIQUIDITY_POOL' && (
          <Link.Internal href={`/${row.id}?activeTab=myPositions`} passHref={true}>
            <Button as="a" size="xs" variant="outlined">
              <UserCircleIcon width={16} height={16} /> My Positions
            </Button>
          </Link.Internal>
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
              {row.incentives.map((incentive, index) => (
                <List.Item
                  key={index}
                  icon={Currency.Icon}
                  iconProps={{
                    currency: incentiveRewardToToken(row.chainId, incentive),
                    width: 18,
                    height: 18,
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
