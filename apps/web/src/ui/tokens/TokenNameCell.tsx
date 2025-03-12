import type { ExploreToken } from '@sushiswap/graph-client/data-api'
import { Currency } from '@sushiswap/ui'
import { useMemo } from 'react'
import { Token } from 'sushi/currency'

export const TokenNameCell = (props: ExploreToken) => {
  const { address, chainId, symbol, name, decimals, logoUrl } = props

  const token = useMemo(() => {
    return new Token({
      chainId,
      address,
      symbol,
      name,
      decimals,
      logoUrl,
    })
  }, [chainId, address, symbol, name, decimals, logoUrl])
  return (
    <div className="flex items-center gap-3">
      <div className="flex">
        <div className="rounded-full border-2 border-gray-200 dark:border-slate-700">
          <Currency.Icon currency={token} width={26} height={26} />
        </div>
      </div>
      <div className="flex gap-2">
        <span className="flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-slate-50">
          {token.name}
        </span>
        <span className="flex items-center gap-1 text-sm font-medium text-[#6A6F7A] dark:text-slate-50">
          {token.symbol}
        </span>
      </div>
    </div>
  )
}
