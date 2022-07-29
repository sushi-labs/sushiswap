import { Button, Chip, Currency, Tooltip, Typography } from '@sushiswap/ui'
import { FC } from 'react'

import { useTokensFromPair } from '../../../lib/hooks'
import { ICON_SIZE } from './contants'
import { CellProps } from './types'

export const PoolsTableNameCell: FC<CellProps> = ({ pair }) => {
  const [token0, token1] = useTokensFromPair(pair)

  return (
    <div className="flex items-center gap-2">
      <Tooltip
        placement="top"
        button={
          <div>
            <Currency.IconList iconWidth={ICON_SIZE} iconHeight={ICON_SIZE}>
              <Currency.Icon currency={token0} />
              <Currency.Icon currency={token1} />
            </Currency.IconList>
          </div>
        }
        panel={
          <div className="flex flex-col p-2 !pb-0">
            <div className="flex justify-between gap-8">
              <div className="flex flex-col gap-1">
                <div className="flex gap-1">
                  <Currency.IconList iconWidth={ICON_SIZE} iconHeight={ICON_SIZE}>
                    <Currency.Icon currency={token0} />
                    <Currency.Icon currency={token1} />
                  </Currency.IconList>
                  <div className="flex flex-col">
                    <Typography variant="sm" weight={500} className="text-slate-50 flex gap-1">
                      {token0.symbol} <span className="text-slate-500">/</span> {token1.symbol}
                    </Typography>
                    <Typography variant="xxs" className="text-slate-400">
                      SushiSwap Farm
                    </Typography>
                  </div>
                </div>
                <Typography variant="xs" weight={600} className="flex gap-1.5 items-end text-slate-400">
                  <Chip color="gray" size="sm" label="Classic" />
                  0.5%
                </Typography>
              </div>
              <Typography variant="sm" weight={700} className="text-slate-50 flex gap-3">
                <span className="text-slate-400">APY:</span> 22.27%
              </Typography>
            </div>
            <hr className="border-t border-slate-200/10 my-3" />
            <div className="flex flex-col gap-1">
              <Typography variant="xs" className="text-slate-500 mb-1">
                Reward Emission
              </Typography>
              <div className="flex items-center gap-1">
                <Currency.Icon currency={token0} width={18} height={18} />
                <Typography variant="sm" weight={700} className="text-slate-50">
                  <span>420 {token0.symbol}</span> <span className="font-normal text-slate-300">per day</span>
                </Typography>
              </div>
              <div className="flex items-center gap-1">
                <Currency.Icon currency={token1} width={18} height={18} />
                <Typography variant="sm" weight={700} className="text-slate-50">
                  <span>420 {token1.symbol}</span> <span className="font-normal text-slate-300">per day</span>
                </Typography>
              </div>
            </div>
            <div className="flex gap-2 mt-2">
              <Button variant="empty" className="!p-0">
                Deposit
              </Button>
            </div>
          </div>
        }
      />
      <div className="flex flex-col">
        <Typography variant="sm" weight={500} className="text-slate-50 flex gap-1">
          {token0.symbol} <span className="text-slate-500">/</span> {token1.symbol}
        </Typography>
        <Typography variant="xxs" className="text-slate-400">
          SushiSwap Farm
        </Typography>
      </div>
    </div>
  )
}
