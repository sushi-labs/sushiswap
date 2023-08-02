import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { AngleRewardsPool } from '@sushiswap/react-query'
import { Chip, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@sushiswap/ui'
import { Badge } from '@sushiswap/ui/components/Badge'
import { Currency } from '@sushiswap/ui/components/currency'
import { NetworkIcon } from '@sushiswap/ui/components/icons'
import { Row } from '@tanstack/react-table'
import { unwrapToken } from 'lib/functions'
import React, { FC } from 'react'

import { RewardsTableV3RowPopover } from './RewardsTableV3RowPopover'

export const RewardsV3NameCell: FC<Row<AngleRewardsPool>> = (props) => {
  const { original } = props

  const ongoingFarms = original.distributionData.filter((el) => el.end * 1000 >= Date.now())
  return (
    <div className="flex items-center gap-4">
      <div className="min-w-[52px]">
        <Badge
          className="border-2 border-gray-100 dark:border-slate-900 rounded-full z-[11] !bottom-0 right-[-15%]"
          position="bottom-right"
          badgeContent={<NetworkIcon chainId={original.chainId} width={20} height={20} />}
        >
          <Currency.IconList iconWidth={40} iconHeight={40}>
            <Currency.Icon disableLink currency={original.token0} />
            <Currency.Icon disableLink currency={original.token1} />
          </Currency.IconList>
        </Badge>
      </div>
      <div className="flex flex-col items-baseline gap-[1px]">
        <span className="text-sm font-medium flex items-baseline gap-1 text-gray-900 dark:text-slate-50">
          {unwrapToken(original.token0).symbol} <span className="font-normal text-gray-900 dark:text-slate-500">/</span>{' '}
          {unwrapToken(original.token1).symbol}
          <span className="text-xs text-gray-500 dark:text-slate-500">{original.poolFee}%</span>
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
                <RewardsTableV3RowPopover {...props} />
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}
