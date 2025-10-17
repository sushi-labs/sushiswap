import type { UserPositionInfo } from '@sushiswap/stellar-contract-binding-position-manager'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { positionService } from '../../services/position-service'

/**
 * Hook to get all positions owned by a user
 */
export function useUserPositions(userAddress: string | undefined) {
  console.log('useUserPositions - Hook called with userAddress:', userAddress)
  console.log('useUserPositions - enabled:', !!userAddress)

  return useQuery({
    queryKey: ['stellar', 'positions', 'user', userAddress],
    queryFn: async () => {
      console.log('useUserPositions - queryFn called')

      if (!userAddress) {
        console.log('useUserPositions - No user address provided')
        return []
      }

      console.log('useUserPositions - Fetching positions for:', userAddress)

      try {
        const result =
          await positionService.getUserPositionsWithFees(userAddress)
        console.log('useUserPositions - Service returned:', result)
        return result
      } catch (error) {
        console.error('useUserPositions - Error fetching positions:', error)
        throw error
      }
    },
    enabled: !!userAddress,
    staleTime: 1000 * 60, // 1 minute
    retry: false, // Don't retry on error to see the error immediately
  })
}

/**
 * Hook to get a specific position by token ID
 */
export function usePosition(tokenId: number | undefined) {
  return useQuery({
    queryKey: ['stellar', 'positions', 'single', tokenId],
    queryFn: async () => {
      if (!tokenId) return null
      return await positionService.getPositionWithFees(tokenId)
    },
    enabled: !!tokenId,
    staleTime: 1000 * 60, // 1 minute
  })
}

/**
 * Hook to get uncollected fees for a position
 */
export function useUncollectedFees(tokenId: number | undefined) {
  return useQuery({
    queryKey: ['stellar', 'positions', 'fees', tokenId],
    queryFn: async () => {
      if (!tokenId) return null
      return await positionService.getUncollectedFees(tokenId)
    },
    enabled: !!tokenId,
    staleTime: 1000 * 30, // 30 seconds
  })
}

/**
 * Hook to collect fees from a position
 */
export function useCollectFees() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      tokenId,
      recipient,
      amount0Max,
      amount1Max,
      signTransaction,
    }: {
      tokenId: number
      recipient: string
      amount0Max: bigint
      amount1Max: bigint
      signTransaction: (xdr: string) => Promise<string>
    }) => {
      return await positionService.collectFees(
        {
          tokenId,
          recipient,
          amount0Max,
          amount1Max,
        },
        signTransaction,
      )
    },
    onSuccess: (result, variables) => {
      console.log('Fees collected successfully:', result)

      // Invalidate position queries to refresh data
      queryClient.invalidateQueries({
        queryKey: ['stellar', 'positions', 'user', variables.recipient],
      })
      queryClient.invalidateQueries({
        queryKey: ['stellar', 'positions', 'single', variables.tokenId],
      })
      queryClient.invalidateQueries({
        queryKey: ['stellar', 'positions', 'fees', variables.tokenId],
      })
    },
    onError: (error) => {
      console.error('Failed to collect fees:', error)
    },
  })
}
