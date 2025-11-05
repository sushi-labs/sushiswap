import {
  createErrorToast,
  createInfoToast,
  createSuccessToast,
} from '@sushiswap/notifications'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useStellarWallet } from '~stellar/providers'
import {
  createTrustline,
  getUserTrustlines,
  hasTrustline,
  requiresTrustline,
} from '../../soroban/trustline-helpers'
import { getStellarTxnLink } from '../../utils/stellarchain-helpers'

/**
 * Hook to check if a user has a trustline for a specific asset
 */
export function useHasTrustline(assetCode: string, assetIssuer: string) {
  const { connectedAddress } = useStellarWallet()

  return useQuery({
    queryKey: [
      'stellar',
      'trustline',
      connectedAddress,
      assetCode,
      assetIssuer,
    ],
    queryFn: async () => {
      if (!connectedAddress || !assetIssuer) {
        return true // If no issuer, assume no trustline needed (SAC or XLM)
      }
      return await hasTrustline(connectedAddress, assetCode, assetIssuer)
    },
    enabled: !!connectedAddress && !!assetIssuer,
    staleTime: 1000 * 30, // 30 seconds
  })
}

/**
 * Hook to get all trustlines for the connected user
 */
export function useUserTrustlines() {
  const { connectedAddress } = useStellarWallet()

  return useQuery({
    queryKey: ['stellar', 'trustlines', connectedAddress],
    queryFn: async () => {
      if (!connectedAddress) {
        return []
      }
      return await getUserTrustlines(connectedAddress)
    },
    enabled: !!connectedAddress,
    staleTime: 1000 * 60, // 1 minute
  })
}

/**
 * Hook to create a trustline
 */
export function useCreateTrustline() {
  const { signTransaction, connectedAddress } = useStellarWallet()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['stellar', 'createTrustline'],
    onMutate: async (params: {
      assetCode: string
      assetIssuer: string
      limit?: string
    }) => {
      const timestamp = Date.now()
      createInfoToast({
        summary: `Creating trustline for ${params.assetCode}...`,
        type: 'mint',
        account: connectedAddress || undefined,
        chainId: 1,
        groupTimestamp: timestamp,
        timestamp,
      })
    },
    mutationFn: async (params: {
      assetCode: string
      assetIssuer: string
      limit?: string
    }) => {
      if (!connectedAddress) {
        throw new Error('Wallet not connected')
      }

      const result = await createTrustline(
        connectedAddress,
        params.assetCode,
        params.assetIssuer,
        signTransaction,
        params.limit,
      )

      if (!result.success) {
        throw new Error(result.error || 'Failed to create trustline')
      }

      return result
    },
    onSuccess: (result, variables) => {
      createSuccessToast({
        summary: `Trustline created for ${variables.assetCode}`,
        type: 'mint',
        account: connectedAddress || undefined,
        chainId: 1,
        txHash: result.txHash,
        href: result.txHash ? getStellarTxnLink(result.txHash) : undefined,
        groupTimestamp: Date.now(),
        timestamp: Date.now(),
      })

      // Invalidate trustline queries
      queryClient.invalidateQueries({
        queryKey: ['stellar', 'trustline'],
      })
      queryClient.invalidateQueries({
        queryKey: ['stellar', 'trustlines', connectedAddress],
      })
    },
    onError: (error) => {
      console.error('Failed to create trustline:', error)
      createErrorToast(
        error instanceof Error ? error.message : 'Failed to create trustline',
        false,
      )
    },
  })
}

/**
 * Hook to check if a token needs a trustline
 *
 * Determines if a token requires a trustline based on:
 * - Classic assets (with issuer): Need trustline if user doesn't have one
 * - SAC assets (C... addresses): Never need trustline
 * - XLM (native, no issuer): Never needs trustline
 */
export function useNeedsTrustline(
  tokenAddress: string,
  assetCode: string,
  assetIssuer: string,
) {
  const { data: hasTrustlineData, isLoading } = useHasTrustline(
    assetCode,
    assetIssuer,
  )

  // Check if this asset type requires a trustline
  const needsTrustlineCheck = requiresTrustline(tokenAddress, assetIssuer)

  // Needs trustline if:
  // 1. Asset type requires trustline (classic asset with issuer)
  // 2. User doesn't already have the trustline
  const needsTrustline = needsTrustlineCheck && !hasTrustlineData

  return {
    needsTrustline,
    hasTrustline: hasTrustlineData,
    isLoading,
  }
}
