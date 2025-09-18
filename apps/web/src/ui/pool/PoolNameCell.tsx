'use client'

import { classNames } from '@sushiswap/ui'
import { Badge } from '@sushiswap/ui'
import { Currency } from '@sushiswap/ui'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import type { FC, JSX } from 'react'
import { useTokensFromPool } from 'src/lib/hooks'
import {
  type PoolBase,
  type PoolIfIncentivized,
  SushiSwapProtocol,
} from 'sushi'
import { formatNumber } from 'sushi/format'

export const ProtocolBadge = ({
  protocol,
  showFullName,
}: {
  protocol: SushiSwapProtocol
  showFullName?: boolean
}) => {
  if (protocol === SushiSwapProtocol.SUSHISWAP_V2) {
    return (
      <div className="whitespace-nowrap bg-[#F338C31A] text-[#F338C3] dark:bg-[#252A3C] text-xs px-2.5 py-1 w-fit font-medium rounded-full">
        {showFullName ? 'V2 Classic Liquidity Pool' : 'V2'}
      </div>
    )
  }

  if (protocol === SushiSwapProtocol.SUSHISWAP_V3) {
    return (
      <div className="whitespace-nowrap bg-[#3B7EF61A] text-[#3B7EF6] dark:bg-[#252A3C] text-xs px-2.5 py-1 w-fit font-medium rounded-full">
        {showFullName ? 'V3 Concentrated Liquidity Pool' : 'V3'}
      </div>
    )
  }
}

export const PoolNameCell: FC<{
  pool: PoolIfIncentivized<PoolBase, true>
}> = ({ pool }) => {
  const { token0, token1 } = useTokensFromPool(pool)

  const isIncentivized = 'isIncentivized' in pool && pool.isIncentivized

  return (
    <div className="flex items-center gap-5">
      <div className="flex min-w-[54px]">
        {token0 && token1 && (
          <Badge
            className="border-2 border-slate-900 rounded-full z-[11]"
            position="bottom-right"
            badgeContent={
              <NetworkIcon chainId={pool.chainId} width={14} height={14} />
            }
          >
            <Currency.IconList iconWidth={26} iconHeight={26}>
              <Currency.Icon disableLink currency={token0} />
              <Currency.Icon disableLink currency={token1} />
            </Currency.IconList>
          </Badge>
        )}
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-slate-50">
          {token0?.symbol}{' '}
          <span className="font-normal text-gray-900 dark:text-slate-500">
            /
          </span>{' '}
          {token1?.symbol}{' '}
          <div
            className={classNames(
              'text-[10px] bg-gray-200 dark:bg-slate-700 rounded-lg px-1 ml-1',
            )}
          />
        </span>
        <div className="flex gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <ProtocolBadge protocol={pool.protocol} />
              </TooltipTrigger>
              <TooltipContent>
                <p>Protocol version</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="bg-gray-200 text-gray-700 dark:bg-slate-800 dark:text-slate-300 text-[10px] px-2 rounded-full">
                  {formatNumber(pool.swapFee * 100)}%
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Swap fee</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {isIncentivized && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="whitespace-nowrap bg-green/20 text-green text-[10px] px-2 rounded-full">
                    🧑‍🌾{' '}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Farm rewards available</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
    </div>
  )
}
