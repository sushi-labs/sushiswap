import { useQuery } from '@tanstack/react-query'
import type { Token } from '../types/token.type'
import { usePoolInfo } from './pool'
import { useLPUsdValue } from './useLPUsdValue'

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
    queryKey: ['usePoolOwnership', { pairAddress }],
    queryFn: async () => {
      if (
        !pairAddress ||
        !pool ||
        lpUsdValueOwned === undefined ||
        lpUsdValueTotal === undefined
      ) {
        return { ownership: '0', ownedSupply: '0' }
      }

      const ownership =
        lpUsdValueTotal === 0
          ? '0'
          : (lpUsdValueOwned / lpUsdValueTotal).toString()

      return { ownership, ownedSupply: lpUsdValueOwned.toString() }
    },
    enabled:
      !!pairAddress &&
      !!pool &&
      lpUsdValueOwned !== undefined &&
      lpUsdValueTotal !== undefined,
  })
}
