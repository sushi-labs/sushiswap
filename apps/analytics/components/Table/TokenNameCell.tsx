import { Currency, Typography } from '@sushiswap/ui'
import { FC } from 'react'

import { useTokenFromToken } from '../../lib/hooks'
import { ICON_SIZE } from './constants'
import { TokenCellProps } from './types'

export const TokenNameCell: FC<TokenCellProps> = ({ row }) => {
  const token = useTokenFromToken(row)
  return (
    <div className="flex items-center gap-3">
      <div className="flex w-5 h-5">
        <Currency.Icon disableLink currency={token} width={ICON_SIZE} height={ICON_SIZE} />
      </div>
      <div className="flex flex-col">
        <Typography variant="sm" weight={500} className="flex items-center gap-1 text-slate-50">
          {token.symbol}
        </Typography>
        <Typography variant="xxs" className="text-slate-400">
          {token.name}
        </Typography>
      </div>
    </div>
  )
}
