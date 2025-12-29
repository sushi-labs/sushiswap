import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import ms from 'ms'
import { positionService } from '../../services/position-service'

/**
 * Hook to get all positions owned by a user
 */
export function useUserPositions({
  userAddress,
  excludeDust = false,
}: {
  userAddress?: string
  excludeDust?: boolean
}) {
  return useQuery({
    queryKey: ['stellar', 'positions', 'user', userAddress, excludeDust],
    queryFn: async () => {
      if (!userAddress) {
        return []
      }

      try {
        const result = await positionService.getUserPositionsWithFees({
          userAddress,
          excludeDust,
        })
        return result
      } catch (error) {
        console.error('useUserPositions - Error fetching positions:', error)
        throw error
      }
    },
    enabled: Boolean(userAddress),
    staleTime: ms('1m'),
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
      if (!tokenId) {
        return null
      }
      return await positionService.getPosition(tokenId)
    },
    enabled: Boolean(tokenId !== undefined),
    staleTime: ms('1m'),
  })
}

/**
 * Hook to get uncollected fees for a position
 */
export function useUncollectedFees(tokenId: number | undefined) {
  return useQuery({
    queryKey: ['stellar', 'positions', 'fees', tokenId],
    queryFn: async () => {
      if (!tokenId) {
        return null
      }
      return await positionService.getUncollectedFees(tokenId)
    },
    enabled: Boolean(tokenId !== undefined),
    staleTime: ms('30s'),
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
      signAuthEntry,
    }: {
      tokenId: number
      recipient: string
      amount0Max: bigint
      amount1Max: bigint
      signTransaction: (xdr: string) => Promise<string>
      signAuthEntry: (entryPreimageXdr: string) => Promise<string>
    }) => {
      return await positionService.collectFees(
        {
          tokenId,
          recipient,
          amount0Max,
          amount1Max,
        },
        signTransaction,
        signAuthEntry,
      )
    },
    onSuccess: (_result, variables) => {
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
      // Invalidate principal amounts for this position since collecting fees might affect them
      queryClient.invalidateQueries({
        queryKey: ['stellar', 'position-principal', variables.tokenId],
      })
    },
    onError: (error) => {
      console.error('Failed to collect fees:', error)
    },
  })
}
