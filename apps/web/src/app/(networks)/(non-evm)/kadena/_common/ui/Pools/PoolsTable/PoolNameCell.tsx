import { Badge, Currency, TooltipContent } from '@sushiswap/ui'
import { Tooltip, TooltipProvider, TooltipTrigger } from '@sushiswap/ui'
import React, { useMemo } from 'react'
import { formatNumber } from 'sushi'
import { KADENA } from '~kadena/_common/constants/token-list'
import { useBaseTokens } from '~kadena/_common/lib/hooks/use-base-tokens'
import type { Pool } from '~kadena/_common/types/get-all-pools-type'
import { Icon } from '../../General/Icon'

export const PoolNameCell = ({ data }: { data: Pool }) => {
  const { data: baseTokens } = useBaseTokens()
  const token0 = useMemo(() => {
    const _token0 = baseTokens?.find(
      (token) =>
        token?.tokenAddress?.toLowerCase() ===
        data?.token0?.address?.toLowerCase(),
    )
    if (_token0) {
      return _token0
    }

    return {
      tokenAddress: data.token0.address,
      tokenSymbol: data.token0.name?.slice(0, 4)?.toUpperCase(),
      tokenDecimals: 12,
      tokenName: data.token0.name,
      tokenImage: '',
    }
  }, [data.token0, baseTokens])

  const token1 = useMemo(() => {
    const _token1 = baseTokens?.find(
      (token) =>
        token?.tokenAddress?.toLowerCase() ===
        data?.token1?.address?.toLowerCase(),
    )
    if (_token1) {
      return _token1
    }

    return {
      tokenAddress: data.token1.address,
      tokenSymbol: data.token1.name?.slice(0, 4)?.toUpperCase(),
      tokenDecimals: 12,
      tokenName: data.token1.name,
      tokenImage: '',
    }
  }, [data.token1, baseTokens])

  return (
    <div className="flex items-center gap-5">
      <div className="flex min-w-[54px]">
        <Badge
          className="border-2 border-slate-900 rounded-full z-[11]"
          position="bottom-right"
          badgeContent={<Icon currency={KADENA} width={14} height={14} />}
        >
          <Currency.IconList iconWidth={26} iconHeight={26}>
            <Icon currency={token0} />
            <Icon currency={token1} />
          </Currency.IconList>
        </Badge>
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="flex items-center gap-1 pr-2 text-sm font-medium text-gray-900 dark:text-slate-50 whitespace-nowrap">
          {token0.tokenSymbol}/{token1.tokenSymbol}
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
                  {formatNumber(0.003 * 100)}%
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
}
