import type { ReactElement } from 'react'
import { LiquidityAllocationCard } from '~evm/[chainId]/pool/_ui/liquidity-allocation-card'
import { usePoolPosition } from '../../../_common/ui/pool-position-provider'

export function PoolPositionDesktop(): ReactElement {
  const { underlying0, underlying1, isLoading } = usePoolPosition()

  return (
    <LiquidityAllocationCard
      title="Unstaked Position Value"
      amount0={underlying0}
      amount1={underlying1}
      isLoading={isLoading}
    />
  )
}
