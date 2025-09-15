import type { WalletPosition } from '@sushiswap/graph-client/kadena'

import { useMemo } from 'react'
import { formatUSD } from 'sushi'
import type { KvmTokenAddress } from 'sushi/kvm'
import { usePoolFromTokens } from '~kadena/_common/lib/hooks/pools/use-pool-from-tokens'

export const PositionValueCell = ({ data }: { data: WalletPosition }) => {
  const { data: poolData } = usePoolFromTokens({
    token0: data.pair.token0.address as KvmTokenAddress,
    token1: data.pair.token1.address as KvmTokenAddress,
  })

  const totalSupply = poolData?.poolData?.totalSupplyLp ?? 0

  const tvl = useMemo(() => {
    const numerator = Number(data.liquidity) * Number(data.pair.tvlUsd)
    const denominator = Number(totalSupply)

    if (denominator === 0) return 0
    return numerator / denominator
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
