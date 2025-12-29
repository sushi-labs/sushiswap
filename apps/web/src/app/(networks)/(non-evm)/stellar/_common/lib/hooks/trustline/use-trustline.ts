import {
  createErrorToast,
  createInfoToast,
  createSuccessToast,
} from '@sushiswap/notifications'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import ms from 'ms'
import { ChainId } from 'sushi'
import { useStellarWallet } from '~stellar/providers'
import {
  createTrustline,
  getUserTrustlines,
  hasTrustline,
  requiresTrustline,
} from '../../soroban/trustline-helpers'
import { extractErrorMessage } from '../../utils/error-helpers'
import { getStellarTxnLink } from '../../utils/stellarchain-helpers'

type TrustlineParams = {
  assetCode: string
  assetIssuer: string
  limit?: string
}

type TrustlineResult = {
  hasTrustline: boolean
  needsTrustline: boolean
}

const NO_TRUSTLINE_NEEDED: TrustlineResult = {
  hasTrustline: true,
  needsTrustline: false,
}

/**
 * Helper function to check if a token needs a trustline
 */
async function checkTokenTrustline(
  connectedAddress: string,
  code: string,
  issuer: string,
): Promise<TrustlineResult> {
  const needsTrustlineCheck = requiresTrustline(code, issuer)
  if (!needsTrustlineCheck) {
    return NO_TRUSTLINE_NEEDED
  }

  const hasTrustlineData = await hasTrustline(connectedAddress, code, issuer)
  return {
    hasTrustline: hasTrustlineData,
    needsTrustline: !hasTrustlineData,
  }
}

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
    enabled: Boolean(connectedAddress && assetIssuer),
    staleTime: ms('30s'),
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
    enabled: Boolean(connectedAddress),
    staleTime: ms('1m'),
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
    onMutate: async (params: TrustlineParams) => {
      const timestamp = Date.now()
      createInfoToast({
        summary: `Creating trustline for ${params.assetCode}...`,
        type: 'mint',
        account: connectedAddress || undefined,
        chainId: ChainId.STELLAR,
        groupTimestamp: timestamp,
        timestamp,
      })
    },
    mutationFn: async (params: TrustlineParams) => {
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
      const timestamp = Date.now()
      createSuccessToast({
        summary: `Trustline created for ${variables.assetCode}`,
        type: 'mint',
        account: connectedAddress || undefined,
        chainId: ChainId.STELLAR,
        txHash: result.txHash,
        href: result.txHash ? getStellarTxnLink(result.txHash) : undefined,
        groupTimestamp: timestamp,
        timestamp,
      })

      // Invalidate trustline queries
      queryClient.invalidateQueries({
        queryKey: ['stellar', 'trustline'],
      })
      queryClient.invalidateQueries({
        queryKey: ['stellar', 'trustlines', connectedAddress],
      })
      queryClient.invalidateQueries({
        queryKey: ['stellar', 'trustlines-batch'],
      })
    },
    onError: (error) => {
      console.error('Failed to create trustline:', error)
      const errorMessage = extractErrorMessage(error)
      createErrorToast(errorMessage, false)
    },
  })
}

/**
 * Hook to check if multiple tokens need trustlines
 *
 * Takes an array of tokens and returns an array of trustline needs for each token
 */
export function useNeedsTrustlines(
  tokens: Array<{ code: string; issuer: string } | null | undefined>,
) {
  const { connectedAddress } = useStellarWallet()

  const trustlineQueries = useQuery({
    queryKey: [
      'stellar',
      'trustlines-batch',
      connectedAddress,
      tokens.map((t) => `${t?.code || ''}:${t?.issuer || ''}`).join(','),
    ],
    queryFn: async () => {
      if (!connectedAddress) {
        return tokens.map(() => NO_TRUSTLINE_NEEDED)
      }

      return await Promise.all(
        tokens.map(async (token) => {
          if (!token?.code || !token?.issuer) {
            return NO_TRUSTLINE_NEEDED
          }
          return await checkTokenTrustline(
            connectedAddress,
            token.code,
            token.issuer,
          )
        }),
      )
    },
    enabled: Boolean(connectedAddress),
    staleTime: ms('30s'),
  })

  const defaultResults = tokens.map(() => NO_TRUSTLINE_NEEDED)

  return {
    results: trustlineQueries.data || defaultResults,
    isLoading: trustlineQueries.isLoading,
    needsAnyTrustline:
      trustlineQueries.data?.some((result) => result.needsTrustline) || false,
  }
}

/**
 * Hook to check if a token needs a trustline
 *
 * Determines if a token requires a trustline based on:
 * - XLM (native): Never needs trustline
 * - Classic assets (with G... issuer): Need trustline if user doesn't have one
 * - SAC-wrapped classic assets (C... contract + G... issuer): Need trustline
 * - Pure Soroban tokens (C... address only, no issuer): Never need trustline
 */
export function useNeedsTrustline(assetCode: string, assetIssuer: string) {
  const { results, isLoading } = useNeedsTrustlines([
    { code: assetCode, issuer: assetIssuer },
  ])
  const result = results[0] || NO_TRUSTLINE_NEEDED

  return {
    needsTrustline: result.needsTrustline,
    hasTrustline: result.hasTrustline,
    isLoading,
  }
}
