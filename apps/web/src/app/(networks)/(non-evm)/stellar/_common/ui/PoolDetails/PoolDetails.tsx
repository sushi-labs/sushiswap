import type React from 'react'
import type { IPool } from '../../lib/hooks/use-pools'

interface PoolDetailsProps {
  pool: IPool
}

export const PoolDetails: React.FC<PoolDetailsProps> = ({ pool }) => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Pool Details</h1>
      <h2>{pool.name}</h2>
      <p>Address: {pool.address}</p>
      <p>Token 0: {pool.token0.code}</p>
      <p>Token 1: {pool.token1.code}</p>
      <p>Liquidity USD: ${pool.liquidityUSD.toLocaleString()}</p>
    </div>
  )
}
