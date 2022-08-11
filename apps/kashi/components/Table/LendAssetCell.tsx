import { Currency, Typography } from '@sushiswap/ui'
import { FC } from 'react'

import { useTokensFromKashiPair } from '../../lib/hooks'
import { IconListVariableSizes } from '../IconListVariableSizes'
import { ICON_SIZE } from './constants'
import { CellProps } from './types'

export const LendAssetCell: FC<CellProps> = ({ row }) => {
  const { asset, collateral } = useTokensFromKashiPair(row)

  return (
    <div className="flex items-center">
      <IconListVariableSizes token0={asset} token1={collateral} />
      <div className="flex flex-col">
        <Typography variant="sm" weight={600} className="text-slate-50">
          {asset.symbol}
        </Typography>
        <Typography variant="xs" weight={400} className="text-slate-400">
          Collateral: <span className="text-slate-50">{collateral.symbol}</span>
        </Typography>
      </div>
    </div>
  )
}

export const LendAssetCellPopover: FC<CellProps> = ({ row }) => {
  const { asset, collateral } = useTokensFromKashiPair(row)

  return (
    <div className="flex items-center">
      <Currency.IconList iconWidth={ICON_SIZE} iconHeight={ICON_SIZE}>
        <Currency.Icon currency={asset} />
        <Currency.Icon currency={collateral} />
      </Currency.IconList>
      <div className="flex flex-col">
        <Typography variant="sm" weight={600} className="text-slate-50">
          {asset.symbol}/{collateral.symbol}
        </Typography>
      </div>
    </div>
  )
}
