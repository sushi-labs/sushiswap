import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import ms from 'ms'
import { positionService } from '../../services/position-service'
import { waitForTransaction } from '../../soroban/transaction-helpers'

/**
 * Hook to get all positions owned by a user
 */
export function useUserPositions({
  userAddress,
  excludeDust = false,
  isLegacy = false,
}: {
  userAddress?: string
  excludeDust?: boolean
  isLegacy?: boolean
}) {
  return useQuery({
    queryKey: [
      'stellar',
      'positions',
      'user',
      userAddress,
      isLegacy,
      excludeDust,
    ],
    queryFn: async () => {
      if (!userAddress) {
        return []
      }

      try {
        const result = await positionService.getUserPositionsWithFees({
          userAddress,
          excludeDust,
          isLegacy,
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
export function usePosition({
  tokenId,
  isLegacy = false,
}: {
  tokenId: number | undefined
  isLegacy?: boolean
}) {
  return useQuery({
    queryKey: ['stellar', 'positions', 'single', isLegacy, tokenId],
    queryFn: async () => {
      if (!tokenId) {
        return null
      }
      return await positionService.getPosition({ tokenId, isLegacy })
    },
    enabled: Boolean(tokenId !== undefined),
    staleTime: ms('1m'),
  })
}

/**
 * Hook to get uncollected fees for a position
 */
export function useUncollectedFees({
  tokenId,
  isLegacy = false,
}: {
  tokenId: number | undefined
  isLegacy?: boolean
}) {
  return useQuery({
    queryKey: ['stellar', 'positions', 'fees', isLegacy, tokenId],
    queryFn: async () => {
      if (!tokenId) {
        return null
      }
      return await positionService.getUncollectedFees({ tokenId, isLegacy })
    },
    enabled: Boolean(tokenId !== undefined),
    staleTime: ms('30s'),
  })
}

/**
 * Hook to collect fees from a position
 */
export function useCollectFees({
  isLegacy = false,
}: { isLegacy?: boolean } = {}) {
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
      const collectFeesResult = await positionService.collectFees(
        {
          tokenId,
          recipient,
          amount0Max,
          amount1Max,
        },
        signTransaction,
        signAuthEntry,
        isLegacy,
      )
      await waitForTransaction(collectFeesResult.txHash)
      return collectFeesResult
    },
    onSuccess: (_result, variables) => {
      // Invalidate position queries to refresh data
      queryClient.invalidateQueries({
        queryKey: [
          'stellar',
          'positions',
          'user',
          variables.recipient,
          isLegacy,
        ],
      })
      queryClient.invalidateQueries({
        queryKey: [
          'stellar',
          'positions',
          'single',
          isLegacy,
          variables.tokenId,
        ],
      })
      queryClient.invalidateQueries({
        queryKey: ['stellar', 'positions', 'fees', isLegacy, variables.tokenId],
      })
      // Invalidate principal amounts for this position since collecting fees might affect them
      queryClient.invalidateQueries({
        queryKey: [
          'stellar',
          'position-principal',
          isLegacy,
          variables.tokenId,
        ],
      })
    },
    onError: (error) => {
      console.error('Failed to collect fees:', error)
    },
  })
}
