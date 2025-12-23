import { useQuery } from '@tanstack/react-query'
import type { Token } from '../../types/token.type'
import { usePoolInfo } from '../pool'
import { useLPUsdValue } from '../pool/use-pool-usd-value'

type UsePoolOwnershipProps = {
  pairAddress: string | undefined | null
  token0: Token
  token1: Token
  reserve0: bigint
  reserve1: bigint
}

export const usePoolOwnership = ({
  pairAddress,
  token0,
  token1,
  reserve0,
  reserve1,
}: UsePoolOwnershipProps) => {
  const { data: pool } = usePoolInfo(pairAddress ?? null)
  const { data: lpUsdValueOwned } = useLPUsdValue({
    token0,
    token1,
    reserve0,
    reserve1,
  })
  const { data: lpUsdValueTotal } = useLPUsdValue({
    token0,
    token1,
    reserve0: pool ? BigInt(pool.reserves.token0.amount) : 0n,
    reserve1: pool ? BigInt(pool.reserves.token1.amount) : 0n,
  })
  return useQuery({
    queryKey: [
      'stellar',
      'usePoolOwnership',
      {
        pool: pool?.address,
        reserve0: reserve0.toString(),
        reserve1: reserve1.toString(),
        lpUsdValueOwned,
        lpUsdValueTotal,
      },
    ],
    queryFn: async () => {
      if (
        !pairAddress ||
        !pool ||
        lpUsdValueOwned === undefined ||
        lpUsdValueTotal === undefined
      ) {
        return { ownership: '0', ownedSupplyUsd: '0' }
      }

      const proportionToken0Owned =
        Number(reserve0) / Number(pool.reserves.token0.amount)
      const proportionToken1Owned =
        Number(reserve1) / Number(pool.reserves.token1.amount)

      const ownership =
        lpUsdValueTotal === 0
          ? ((proportionToken0Owned + proportionToken1Owned) / 2).toString()
          : (lpUsdValueOwned / lpUsdValueTotal).toString()

      return { ownership, ownedSupplyUsd: lpUsdValueOwned.toString() }
    },
    enabled:
      !!pairAddress &&
      !!pool &&
      lpUsdValueOwned !== undefined &&
      lpUsdValueTotal !== undefined,
  })
}
