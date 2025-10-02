import { Badge, TooltipContent } from '@sushiswap/ui'
import { Tooltip, TooltipProvider, TooltipTrigger } from '@sushiswap/ui'
import { Currency } from '@sushiswap/ui'
import React, { type FC } from 'react'
import type { PoolInfo } from '~stellar/_common/lib/types/pool.type'
import { formatPoolFee } from '~stellar/_common/lib/utils/formatters'
import { TokenIcon } from '../../General/TokenIcon'

type Row<T> = { row: T }

export const PoolNameCell: FC<Row<PoolInfo>> = ({ row: pool }) => (
  <div className="flex items-center gap-5">
    <div className="flex min-w-[54px]">
      <Badge
        className="border-2 border-slate-900 rounded-full z-[11]"
        position="bottom-right"
        badgeContent={
          <div className="w-3.5 h-3.5 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">S</span>
          </div>
        }
      >
        <Currency.IconList iconWidth={26} iconHeight={26}>
          <TokenIcon currency={pool.token0} />
          <TokenIcon currency={pool.token1} />
        </Currency.IconList>
      </Badge>
    </div>
    <div className="flex flex-col gap-0.5">
      <span className="flex items-center gap-1 pr-2 text-sm font-medium text-gray-900 dark:text-slate-50 whitespace-nowrap">
        {pool.name}
      </span>
      <div className="flex gap-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="bg-gray-200 text-gray-700 dark:bg-slate-800 dark:text-slate-300 text-[10px] px-2 rounded-full">
                {formatPoolFee(pool.fee)}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Swap fee</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  </div>
)
