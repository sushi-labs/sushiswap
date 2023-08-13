import { ChainId } from '@sushiswap/chain'
import { Pool, Protocol } from '@sushiswap/client'
import { formatNumber } from '@sushiswap/format'
import { classNames } from '@sushiswap/ui'
import { Badge } from '@sushiswap/ui/components/Badge'
import { Currency } from '@sushiswap/ui/components/currency'
import { NetworkIcon } from '@sushiswap/ui/components/icons'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@sushiswap/ui/components/tooltip'
import { useTokensFromPool } from 'lib/hooks'
import { FC } from 'react'

import { ICON_SIZE } from '../constants'
import { Row } from './types'

const ProtocolBadge: Record<Protocol, JSX.Element> = {
  [Protocol.BENTOBOX_STABLE]: (
    <div className="bg-green/20 text-green text-[10px] px-2 rounded-full">Trident Stable</div>
  ),
  [Protocol.BENTOBOX_CLASSIC]: (
    <div className="bg-green/20 text-green text-[10px] px-2 rounded-full">Trident Classic</div>
  ),
  [Protocol.SUSHISWAP_V2]: (
    <div className="bg-pink/20 text-pink text-[10px] px-2 rounded-full">
      SushiSwap<sup>v2</sup>
    </div>
  ),
  [Protocol.SUSHISWAP_V3]: (
    <div className="bg-blue/20 text-blue text-[10px] px-2 rounded-full">
      SushiSwap<sup>v3</sup>
    </div>
  ),
}

export const PoolNameCell: FC<Row<Pool>> = ({ row }) => {
  const { token0, token1 } = useTokensFromPool(row)

  const incentives = row.incentives.filter((i) => i.rewardPerDay > 0)

  return (
    <div className="flex items-center gap-5">
      <div className="flex min-w-[54px]">
        {token0 && token1 && (
          <Badge
            className="border-2 border-slate-900 rounded-full z-[11]"
            position="bottom-right"
            badgeContent={<NetworkIcon chainId={row.chainId as ChainId} width={14} height={14} />}
          >
            <Currency.IconList iconWidth={ICON_SIZE} iconHeight={ICON_SIZE}>
              <Currency.Icon disableLink currency={token0} />
              <Currency.Icon disableLink currency={token1} />
            </Currency.IconList>
          </Badge>
        )}
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-slate-50">
          {token0?.symbol} <span className="font-normal text-gray-900 dark:text-slate-500">/</span> {token1?.symbol}{' '}
          <div className={classNames('text-[10px] bg-gray-200 dark:bg-slate-700 rounded-lg px-1 ml-1')} />
        </span>
        <div className="flex gap-1">
          {ProtocolBadge[row.protocol]}
          <div className="bg-gray-200 text-gray-700 dark:bg-slate-800 dark:text-slate-300 text-[10px] px-2 rounded-full">
            {formatNumber(row.swapFee * 100)}%
          </div>
          {incentives && incentives.length > 0 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="bg-green/20 text-green text-[10px] px-2 rounded-full">
                    🧑‍🌾 {incentives.length > 1 ? `x ${incentives.length}` : ''}{' '}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Farm rewards available</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {/* {row.hasEnabledSteerVault && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center px-2 text-white rounded-full dark:bg-purple-500/20 bg-purple-500/70">
                    <SteerIcon width={12} height={12} />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Steer strategy available</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )} */}
        </div>
      </div>
    </div>
  )
}
