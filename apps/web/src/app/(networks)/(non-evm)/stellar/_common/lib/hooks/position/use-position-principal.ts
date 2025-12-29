import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import { positionService } from '../../services/position-service'

/**
 * Hook to get principal token amounts for a position
 * This calculates the actual token0 and token1 amounts from liquidity
 */
export function usePositionPrincipal(tokenId: number | undefined) {
  return useQuery({
    queryKey: ['stellar', 'position-principal', tokenId],
    queryFn: async () => {
      if (tokenId === undefined) {
        return { amount0: 0n, amount1: 0n }
      }

      try {
        const result = await positionService.getPositionPrincipal(tokenId)
        return result
      } catch (error) {
        console.error(
          `Failed to get principal amounts for position ${tokenId}:`,
          error,
        )
        return { amount0: 0n, amount1: 0n }
      }
    },
    enabled: Boolean(tokenId !== undefined),
    staleTime: ms('30s'),
    retry: 1,
  })
}
