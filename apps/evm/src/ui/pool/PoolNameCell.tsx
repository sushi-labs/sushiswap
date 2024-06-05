'use client'

import { Protocol } from '@sushiswap/client'
import { classNames } from '@sushiswap/ui'
import { Badge } from '@sushiswap/ui/components/badge'
import { Currency } from '@sushiswap/ui/components/currency'
import { NetworkIcon } from '@sushiswap/ui/components/icons'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@sushiswap/ui/components/tooltip'
import { Row } from '@tanstack/react-table'
import { FC } from 'react'
import { useTokensFromPool } from 'src/lib/hooks'
import { ChainId } from 'sushi/chain'
import { formatNumber } from 'sushi/format'

import {
  MaybeNestedPool,
  PoolBase,
  PoolWithIncentives,
  unnestPool,
} from 'sushi'

export const ProtocolBadge: Record<Protocol, JSX.Element> = {
  [Protocol.BENTOBOX_STABLE]: (
    <div className="whitespace-nowrap bg-green/20 text-green text-[10px] px-2 rounded-full">
      Trident Stable
    </div>
  ),
  [Protocol.BENTOBOX_CLASSIC]: (
    <div className="whitespace-nowrap bg-green/20 text-green text-[10px] px-2 rounded-full">
      Trident Classic
    </div>
  ),
  [Protocol.SUSHISWAP_V2]: (
    <div className="whitespace-nowrap bg-pink/20 text-pink text-[10px] px-2 rounded-full">
      V2
    </div>
  ),
  [Protocol.SUSHISWAP_V3]: (
    <div className="whitespace-nowrap bg-blue/20 text-blue text-[10px] px-2 rounded-full">
      V3
    </div>
  ),
}

export const PoolNameCell: FC<
  Row<MaybeNestedPool<PoolWithIncentives<PoolBase>>>
> = ({ original }) => {
  const pool = unnestPool(original)

  const { token0, token1 } = useTokensFromPool(pool)

  const incentives = pool.incentives?.filter((i) => i.rewardPerDay > 0)

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
              <TooltipTrigger asChild>
                {ProtocolBadge[pool.protocol]}
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
          {pool.isIncentivized && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="whitespace-nowrap bg-green/20 text-green text-[10px] px-2 rounded-full">
                    🧑‍🌾 {incentives.length > 1
                      ? `x ${incentives.length}`
                      : ''}{' '}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Farm rewards available</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {pool.hasEnabledSteerVault && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="bg-[#F2E9D6] dark:bg-yellow/60 text-[10px] px-2 rounded-full">
                    💡
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Smart Pool available</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
    </div>
  )
}
