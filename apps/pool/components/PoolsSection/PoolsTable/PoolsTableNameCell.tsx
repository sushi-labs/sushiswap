import { Token } from '@sushiswap/currency'
import { Currency, Popover, Typography } from '@sushiswap/ui'
import { FC, useMemo } from 'react'

import { ICON_SIZE } from './contants'
import { CellProps } from './types'

export const PoolsTableNameCell: FC<CellProps> = ({ pair }) => {
  const [token0, token1] = useMemo(() => {
    return [
      new Token({
        address: pair.token0.id,
        name: pair.token0.name,
        decimals: Number(pair.token0.decimals),
        symbol: pair.token0.symbol,
        chainId: pair.chainId,
      }),
      new Token({
        address: pair.token1.id,
        name: pair.token1.name,
        decimals: Number(pair.token1.decimals),
        symbol: pair.token1.symbol,
        chainId: pair.chainId,
      }),
    ]
  }, [
    pair.chainId,
    pair.token0.decimals,
    pair.token0.id,
    pair.token0.name,
    pair.token0.symbol,
    pair.token1.decimals,
    pair.token1.id,
    pair.token1.name,
    pair.token1.symbol,
  ])

  return (
    <Popover
      hover
      button={
        <div className="flex items-center gap-2">
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
      }
      panel={<div>test</div>}
    />
  )
}
