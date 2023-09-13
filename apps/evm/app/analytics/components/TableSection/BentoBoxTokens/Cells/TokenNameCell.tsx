import { Token } from '@sushiswap/currency'
import { Badge, NetworkIcon } from '@sushiswap/ui'
import { Currency } from '@sushiswap/ui/components/currency'
import { FC } from 'react'

export const TokenNameCell: FC<{ token: Token }> = ({ token }) => {
  return (
    <div className="flex items-center gap-5">
      <div className="flex">
        <Badge
          className="border-2 border-slate-900 rounded-full z-[11]"
          position="bottom-right"
          badgeContent={<NetworkIcon chainId={token.chainId} width={14} height={14} />}
        >
          <Currency.Icon disableLink currency={token} width={26} height={26} />
        </Badge>
      </div>
      <div className="flex flex-col">
        <p>{token.symbol}</p>
        <p className="text-xs text-muted-foreground">{token.name}</p>
      </div>
    </div>
  )
}
