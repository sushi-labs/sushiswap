import { Pool } from '@sushiswap/client'
import { formatNumber, formatPercent } from '@sushiswap/format'
import { Button, Chip, Currency, Typography } from '@sushiswap/ui'
import { FC } from 'react'

import { incentiveRewardToToken } from '../lib/functions'
import { useTokensFromPool } from '../lib/hooks'
import { ICON_SIZE } from './TableSection/Pools/constants'
import { ChainId } from '@sushiswap/chain'

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
              <Typography variant="sm" weight={500} className="flex gap-1 text-slate-50">
                {token0.symbol} <span className="text-slate-500">/</span> {token1.symbol}
              </Typography>
              {/* <Typography variant="xxs" className="text-slate-400">
                SushiSwap Farm
              </Typography> */}
            </div>
          </div>
          <Typography variant="xs" weight={600} className="flex gap-1.5 mt-1 items-center text-slate-400">
            <Chip color="gray" label={`Fee ${formatPercent(row.swapFee)}`} />
          </Typography>
        </div>
        <div className="flex flex-col gap-1">
          <Typography variant="sm" weight={600} className="flex gap-3 text-slate-50">
            <span className="text-slate-400">APR:</span> {formatPercent(row.totalApr1d)}
          </Typography>
          <Typography variant="xxs" weight={600} className="flex justify-end gap-1 text-slate-50">
            <span className="text-slate-400">Rewards:</span> {formatPercent(row.incentiveApr)}
          </Typography>
          <Typography variant="xxs" weight={600} className="flex justify-end gap-1 text-slate-50">
            <span className="text-slate-400">Fees:</span> {formatPercent(row.feeApr1d)}
          </Typography>
        </div>
      </div>
      {!!row?.incentives?.length && row.incentives.length > 0 && (
        <>
          <hr className="my-3 border-t border-slate-200/10" />
          <div className="flex flex-col gap-1.5">
            <Typography variant="xs" className="mb-1 text-slate-500">
              Reward Emission
            </Typography>
            {row.incentives.map((incentive) => (
              <div key={incentive.id} className="flex items-center gap-2">
                <Currency.Icon
                  currency={incentiveRewardToToken(row.chainId as ChainId, incentive)}
                  width={18}
                  height={18}
                />
                <Typography variant="sm" weight={600} className="text-slate-50">
                  <span>
                    {formatNumber(incentive.rewardPerDay)} {incentive.rewardToken.symbol}
                  </span>{' '}
                  <span className="font-normal text-slate-300">per day</span>
                </Typography>
              </div>
            ))}
          </div>
        </>
      )}
      <div className="flex justify-end gap-2 mt-4 mb-2">
        <Button as="a" size="sm" fullWidth href={`/pools/${row.id}/add`}>
          Earn
        </Button>
      </div>
    </div>
  )
}
