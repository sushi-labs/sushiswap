import { ChainId } from '@sushiswap/chain'
import { Pool } from '@sushiswap/client'
import { formatNumber, formatPercent } from '@sushiswap/format'
import { LinkInternal } from '@sushiswap/ui'
import { Button } from '@sushiswap/ui/components/button'
import { Chip } from '@sushiswap/ui/components/chip'
import { Currency } from '@sushiswap/ui/components/currency'
import { FC } from 'react'

import { incentiveRewardToToken } from '../lib/functions'
import { useTokensFromPool } from '../lib/hooks'
import { ICON_SIZE } from './TableSection/Pools/constants'

interface PoolQuickHoverTooltipProps {
  row: Pool
}

export const PoolQuickHoverTooltip: FC<PoolQuickHoverTooltipProps> = ({ row }) => {
  const { token0, token1 } = useTokensFromPool(row)

  return (
    <div className="flex flex-col p-2 !pb-0">
      <div className="flex justify-between gap-8">
        <div className="flex flex-col gap-1">
          <div className="flex gap-1">
            <Currency.IconList iconWidth={ICON_SIZE} iconHeight={ICON_SIZE}>
              <Currency.Icon currency={token0} />
              <Currency.Icon currency={token1} />
            </Currency.IconList>
            <div className="flex flex-col">
              <span className="text-sm font-medium flex gap-1 text-slate-50">
                {token0.symbol} <span className="text-slate-500">/</span> {token1.symbol}
              </span>
              {/* <p className="text-[10px] text-slate-400">
                SushiSwap Farm
              </p> */}
            </div>
          </div>
          <span className="text-xs font-semibold flex gap-1.5 mt-1 items-center text-slate-400">
            <Chip variant="ghost">Fee ${formatPercent(row.swapFee)}</Chip>
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-sm font-semibold flex gap-3 text-slate-50">
            <span className="text-slate-400">APR:</span> {formatPercent(row.totalApr1d)}
          </span>
          <span className="text-[10px] font-semibod flex justify-end gap-1 text-slate-50">
            <span className="text-slate-400">Rewards:</span> {formatPercent(row.incentiveApr)}
          </span>
          <span className="text-[10px] font-semibold flex justify-end gap-1 text-slate-50">
            <span className="text-slate-400">Fees:</span> {formatPercent(row.feeApr1d)}
          </span>
        </div>
      </div>
      {!!row?.incentives?.length && row.incentives.length > 0 && (
        <>
          <hr className="my-3 border-t border-slate-200/10" />
          <div className="flex flex-col gap-1.5">
            <span className="text-xs mb-1 text-slate-500">Reward Emission</span>
            {row.incentives.map((incentive) => (
              <div key={incentive.id} className="flex items-center gap-2">
                <Currency.Icon
                  currency={incentiveRewardToToken(row.chainId as ChainId, incentive)}
                  width={18}
                  height={18}
                />
                <span className="text-sm font-semibold text-slate-50">
                  <span>
                    {formatNumber(incentive.rewardPerDay)} {incentive.rewardToken.symbol}
                  </span>{' '}
                  <span className="font-normal text-slate-300">per day</span>
                </span>
              </div>
            ))}
          </div>
        </>
      )}
      <div className="flex justify-end gap-2 mt-4 mb-2">
        <Button asChild fullWidth>
          <LinkInternal href={`/pools/${row.id}/add`}>Earn</LinkInternal>
        </Button>
      </div>
    </div>
  )
}
