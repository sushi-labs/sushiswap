import { useMemo } from 'react'
import { Decimal } from 'sushi'
import { formatUSD } from 'sushi/format'
import { usePoolFromTokens } from '~kadena/_common/lib/hooks/pools/use-pool-from-tokens'
import type { WalletPosition } from '~kadena/_common/types/get-positions'

export const PositionValueCell = ({ data }: { data: WalletPosition }) => {
  const { data: poolData } = usePoolFromTokens({
    token0: data.pair.token0.address,
    token1: data.pair.token1.address,
  })

  const totalSupply = poolData?.poolData?.totalSupplyLp ?? 0

  const tvl = useMemo(() => {
    const numerator = new Decimal(data.liquidity).mul(
      new Decimal(data.pair.tvlUsd),
    )
    const denominator = new Decimal(totalSupply)
    if (denominator.eq(0)) return 0
    return numerator.div(denominator).toNumber()
  }, [data.liquidity, data.pair.tvlUsd, totalSupply])

  return (
    <div className="flex items-center gap-1">
      <div className="flex flex-col gap-0.5">
        <span className="flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-slate-50">
          {formatUSD(tvl)}
        </span>
      </div>
    </div>
  )
}
