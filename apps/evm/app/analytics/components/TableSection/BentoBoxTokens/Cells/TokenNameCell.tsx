import { Token } from '@sushiswap/currency'
import { Currency } from '@sushiswap/ui/components/currency'
import { FC } from 'react'

import { ICON_SIZE } from '../constants'

export const TokenNameCell: FC<{ token: Token }> = ({ token }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex w-5 h-5">
        <Currency.Icon disableLink currency={token} width={ICON_SIZE} height={ICON_SIZE} />
      </div>
      <div className="flex flex-col">
        <p>{token.symbol}</p>
        <p className="text-xs text-muted-foreground">{token.name}</p>
      </div>
    </div>
  )
}
