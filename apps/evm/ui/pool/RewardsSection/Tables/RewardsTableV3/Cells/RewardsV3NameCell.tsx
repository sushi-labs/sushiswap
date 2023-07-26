import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { Chip } from '@sushiswap/ui'
import { Tooltip, TooltipContent, TooltipTrigger } from '@sushiswap/ui'
import { TooltipProvider } from '@sushiswap/ui'
import { Badge } from '@sushiswap/ui/components/Badge'
import { Currency } from '@sushiswap/ui/components/currency'
import { NetworkIcon } from '@sushiswap/ui/components/icons'
import { unwrapToken } from 'lib/functions'
import React, { FC } from 'react'

import { RewardsTableV3RowPopover } from '../RewardsTableV3RowPopover'
import { RewardTableV3CellProps } from './types'

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
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Chip variant="secondary" icon={InformationCircleIcon}>
                {ongoingFarms.length} Ongoing incentive{ongoingFarms.length > 1 ? 's' : ''}
              </Chip>
            </TooltipTrigger>
            <TooltipContent asChild className="!w-fit !p-0 !border-none">
              <div>
                <RewardsTableV3RowPopover row={row} />
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}
