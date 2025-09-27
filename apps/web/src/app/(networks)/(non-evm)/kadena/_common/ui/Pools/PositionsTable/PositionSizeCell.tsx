import type { WalletPosition } from '@sushiswap/graph-client/kadena'
import { formatPercent } from 'sushi'

export const PositionSizeCell = ({ data }: { data: WalletPosition }) => {
  const totalSupply = Number(data?.pair?.totalSupply ?? 0)
  const ownedSupply = Number(data?.liquidity ?? 0)

  const ownedPercent =
    totalSupply > 0 && ownedSupply > 0 ? ownedSupply / totalSupply : 0

  return (
    <div className="flex items-center gap-1">
      <div className="flex flex-col gap-0.5">
        <span className="flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-slate-50">
          {formatPercent(ownedPercent)}
        </span>
      </div>
    </div>
  )
}
