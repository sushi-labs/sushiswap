import { Currency, Typography } from '@sushiswap/ui'
import { FC } from 'react'

import { useTokensFromKashiPair } from '../../lib/hooks'
import { ICON_SIZE } from './constants'
import { CellProps } from './types'

export const BorrowAssetCell: FC<CellProps> = ({ row }) => {
  const { asset, collateral } = useTokensFromKashiPair(row)

  return (
    <div className="flex items-center">
      <div className="flex items-baseline min-w-[54px] min-h-[40px]">
        <div className="z-[1] w-[32px] h-[32px]">
          <Currency.Icon currency={asset} width={32} height={32} />
        </div>
        <div className="-ml-2.5 w-[20px] h-[20px]">
          <Currency.Icon currency={collateral} width={20} height={20} />
        </div>
      </div>
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

export const BorrowAssetCellPopover: FC<CellProps> = ({ row }) => {
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
