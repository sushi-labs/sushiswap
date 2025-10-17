import { useQuery } from '@tanstack/react-query'
import { positionService } from '../../services/position-service'

/**
 * Hook to get principal token amounts for a position
 * This calculates the actual token0 and token1 amounts from liquidity
 */
export function usePositionPrincipal(tokenId: number | undefined) {
  return useQuery({
    queryKey: ['stellar', 'position-principal', tokenId],
    queryFn: async () => {
      if (tokenId === undefined || tokenId === null)
        return { amount0: 0n, amount1: 0n }

      console.log(`🔍 Calculating principal amounts for position ${tokenId}`)

      try {
        const result = await positionService.getPositionPrincipal(tokenId)
        console.log(`✅ Principal amounts for position ${tokenId}:`, {
          amount0: result.amount0.toString(),
          amount1: result.amount1.toString(),
        })
        return result
      } catch (error) {
        console.error(
          `❌ Failed to get principal amounts for position ${tokenId}:`,
          error,
        )
        return { amount0: 0n, amount1: 0n }
      }
    },
    enabled: tokenId !== undefined && tokenId !== null,
    staleTime: 1000 * 30, // 30 seconds
    retry: 1,
  })
}
