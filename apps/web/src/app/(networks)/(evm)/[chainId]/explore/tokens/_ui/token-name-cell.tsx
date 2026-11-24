import type { Token } from '@sushiswap/graph-client/data-api'
import { Currency } from '@sushiswap/ui'
import type { ReactElement } from 'react'

export function TokenNameCell({ token }: Token): ReactElement {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="shrink-0 rounded-full border-2 border-background">
        <Currency.Icon currency={token} width={28} height={28} />
      </div>
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="truncate text-sm font-medium text-primary">
          {token.name}
        </span>
        <span className="truncate text-xs text-muted-foreground">
          {token.symbol}
        </span>
      </div>
    </div>
  )
}
