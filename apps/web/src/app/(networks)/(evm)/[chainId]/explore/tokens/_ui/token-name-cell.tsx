import type { Token } from '@sushiswap/graph-client/data-api'
import { Currency } from '@sushiswap/ui'

export const TokenNameCell = ({ token }: Token) => {
  return (
    <div className="flex items-center gap-3">
      <div className="border-2 border-slate-900 rounded-full">
        <Currency.Icon currency={token} width={26} height={26} />
      </div>
      <div className="flex gap-2 font-medium">
        <span className="truncate">{token.name}</span>
        <span className="text-muted-foreground">{token.symbol}</span>
      </div>
    </div>
  )
}
