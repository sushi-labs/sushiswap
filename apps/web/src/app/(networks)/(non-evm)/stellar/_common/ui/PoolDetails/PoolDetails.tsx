import type React from 'react'
import type { IPool } from '../../lib/hooks/use-pools'
import { ManageLiquidityCard } from './ManageLiquidityCard'
import { MyPosition } from './MyPosition'
import { PoolLiquidity } from './PoolLiquidity'

interface PoolDetailsProps {
  pool: IPool
}

export const PoolDetails: React.FC<PoolDetailsProps> = ({ pool }) => {
  return (
    <div className="flex flex-col gap-6">
      <ManageLiquidityCard pool={pool} />
      <PoolLiquidity pool={pool} />
    </div>
  )
}
