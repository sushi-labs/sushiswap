import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { AngleRewardsPool } from '@sushiswap/react-query'
import { DataTable } from '@sushiswap/ui'
import { Currency } from '@sushiswap/ui/components/currency'
import { ColumnDef } from '@tanstack/react-table'
import { unwrapToken } from 'lib/functions'
import React, { FC } from 'react'

import { RewardTableV3CellProps } from './Cells'
import { rewardPerDay } from './utils'

const COLUMNS = [
  {
    id: 'id',
    header: '',
    cell: ({ row }) => <span className="text-muted-foreground">{`${+row.id + 1}.`}</span>,
  },
  {
    id: 'reward',
    header: 'Reward',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Currency.Icon currency={row.original.token} width={18} height={18} />
        {rewardPerDay({
          start: row.original.start,
          end: row.original.end,
          amount: row.original.amount,
          token: row.original.token,
        })?.toSignificant(6)}{' '}
        {unwrapToken(row.original.token).symbol}
      </div>
    ),
  },
  {
    id: 'duration',
    header: 'Duration',
    cell: ({ row }) => <>{Math.floor((row.original.end - Date.now() / 1000) / 3600 / 24)} days left</>,
  },
  {
    id: 'distribution',
    header: 'Distribution',
    cell: ({ row }) => (
      <>
        {row.original.propFees}% / {row.original.propToken0}% / {row.original.propToken1}%
      </>
    ),
  },
  {
    id: 'oorIncentivized',
    header: 'Out of Range Incentivized',
    cell: ({ row }) =>
      row.original.isOutOfRangeIncentivized ? (
        <CheckIcon width={16} height={16} className="text-blue" />
      ) : (
        <XMarkIcon width={16} height={16} />
      ),
  },
] satisfies ColumnDef<AngleRewardsPool['distributionData'][0], unknown>[]

export const RewardsTableV3RowPopover: FC<RewardTableV3CellProps> = ({ row }) => {
  const ongoingFarms = row.distributionData.filter((el) => el.isLive)
  return <DataTable columns={COLUMNS} data={ongoingFarms} loading={false} />
}
