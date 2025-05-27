import { Badge, Currency, TooltipContent } from '@sushiswap/ui'
import { Tooltip, TooltipProvider, TooltipTrigger } from '@sushiswap/ui'
import React from 'react'
import { formatNumber } from 'sushi'
import { KADENA } from '~kadena/_common/constants/token-list'
import type { Pool } from '~kadena/_common/types/get-all-pools-type'
import { Icon } from '../../General/Icon'

export const PoolNameCell = ({ data }: { data: Pool }) => {
  console.log('data', data)
  const token0Name = data.token0.name
  const token1Name = data.token1.name
  const token0Symbol =
    token0Name === 'coin' ? 'KDA' : token0Name.slice(0, 3).toUpperCase()
  const token1Symbol =
    token1Name === 'coin' ? 'KDA' : token1Name.slice(0, 3).toUpperCase()
  const poolName = `${token0Symbol}-${token1Symbol}`
  const mockSwapFee = 0.001

  return (
    <div className="flex items-center gap-5">
      <div className="flex min-w-[54px]">
        <Badge
          className="border-2 border-slate-900 rounded-full z-[11]"
          position="bottom-right"
          badgeContent={<Icon currency={KADENA} width={14} height={14} />}
        >
          <Currency.IconList iconWidth={26} iconHeight={26}>
            <Icon
              currency={{
                tokenSymbol: token0Symbol,
                tokenName: token0Name,
                tokenImage: '',
                tokenAddress: '',
                tokenDecimals: 18,
              }}
            />
            <Icon
              currency={{
                tokenImage: '',
                tokenSymbol: token1Symbol,
                tokenName: token1Name,
                tokenAddress: '',
                tokenDecimals: 18,
              }}
            />
          </Currency.IconList>
        </Badge>
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="flex items-center gap-1 pr-2 text-sm font-medium text-gray-900 dark:text-slate-50 whitespace-nowrap">
          {poolName}
        </span>
        <div className="flex gap-1">
          {/* <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                {ProtocolBadge[data.protocol as SushiSwapProtocol]}
              </TooltipTrigger>
              <TooltipContent>
                <p>Protocol version</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider> */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="bg-gray-200 text-gray-700 dark:bg-slate-800 dark:text-slate-300 text-[10px] px-2 rounded-full">
                  {formatNumber(mockSwapFee * 100)}%
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Swap fee</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {/* {data.isIncentivized && (
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
          {data.isSmartPool && (
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
          )} */}
        </div>
      </div>
    </div>
  )
}
