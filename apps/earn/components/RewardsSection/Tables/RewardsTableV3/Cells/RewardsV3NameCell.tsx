import React, { FC } from 'react'

import { RewardTableV3CellProps } from './types'
import { Badge } from '@sushiswap/ui/future/components/Badge'
import { NetworkIcon } from '@sushiswap/ui'
import { Currency } from '@sushiswap/ui/future/components/currency'
import { unwrapToken } from '../../../../../lib/functions'

export const RewardsV3NameCell: FC<RewardTableV3CellProps> = ({ row }) => {
  const ongoingFarms = row.distributionData.filter((el) => el.end * 1000 >= Date.now())
  return (
    <div className="flex items-center gap-4">
      <div className="min-w-[52px]">
        <Badge
          className="border-2 border-gray-100 dark:border-slate-900 rounded-full z-[11] !bottom-0 right-[-15%]"
          position="bottom-right"
          badgeContent={<NetworkIcon chainId={row.chainId} width={20} height={20} />}
        >
          <Currency.IconList iconWidth={40} iconHeight={40}>
            <Currency.Icon disableLink currency={row.token0} />
            <Currency.Icon disableLink currency={row.token1} />
          </Currency.IconList>
        </Badge>
      </div>
      <div className="flex flex-col items-baseline gap-[1px]">
        <span className="text-sm font-medium flex items-baseline gap-1 text-gray-900 dark:text-slate-50">
          {unwrapToken(row.token0).symbol} <span className="font-normal text-gray-900 dark:text-slate-500">/</span>{' '}
          {unwrapToken(row.token1).symbol}
          <span className="text-xs text-gray-500 dark:text-slate-500">{row.poolFee}%</span>
        </span>
        <div className="rounded-full px-2 py-0.5 text-xs bg-black/[0.06] dark:bg-white/[0.06]">
          {ongoingFarms.length} Ongoing Farms
        </div>
      </div>
    </div>
  )
}
