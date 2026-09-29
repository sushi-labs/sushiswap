import {
  createErrorToast,
  createInfoToast,
  createSuccessToast,
} from '@sushiswap/notifications'
import {
  type UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import ms from 'ms'
import { useAccount } from 'src/lib/wallet/hooks/use-account'
import { getStellarWalletKit } from 'src/lib/wallet/namespaces/stellar/config'
import { ChainId } from 'sushi'
import {
  type StellarAccountAddress,
  type StellarContractAddress,
  type StellarToken,
  isStellarAccountAddress,
} from 'sushi/stellar'
import { NETWORK_PASSPHRASE } from '../../constants'
import {
  checkTrustlineRequired,
  createTrustline,
  hasTrustline,
} from '../../soroban/trustline-helpers'
import { extractErrorMessage } from '../../utils/error-helpers'
import { getStellarTxnLink } from '../../utils/stellarchain-helpers'

type TrustlineParams = {
  assetCode: string
  assetIssuer: StellarAccountAddress
  limit?: string
}

type TrustlineResult = {
  needsTrustline: boolean
  issuer: StellarAccountAddress | null
}

const NO_TRUSTLINE_NEEDED: TrustlineResult = {
  needsTrustline: false,
  issuer: null,
}

/** Resolve the token contract identity before checking the account. */
async function checkTokenTrustline(
  connectedAddress: StellarAccountAddress,
  code: string,
  contract: StellarContractAddress,
  issuer: StellarAccountAddress | '',
): Promise<TrustlineResult> {
  const { required, issuer: resolvedIssuer } = await checkTrustlineRequired(
    contract,
    code,
    issuer,
  )

  if (!required || connectedAddress === resolvedIssuer) {
    return NO_TRUSTLINE_NEEDED
  }

  if (!resolvedIssuer) throw new Error('Trustline issuer unavailable')

  const hasTrustlineData = await hasTrustline(
    connectedAddress,
    code,
    resolvedIssuer,
  )
  return {
    needsTrustline: !hasTrustlineData,
    issuer: resolvedIssuer,
  }
}

/**
 * Hook to create a trustline
 */
export function useCreateTrustline() {
  const connectedAddress = useAccount('stellar')
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
        async (xdr) => {
          const kit = await getStellarWalletKit()
          const { signedTxXdr } = await kit.signTransaction(xdr, {
            address: connectedAddress,
            networkPassphrase: NETWORK_PASSPHRASE,
          })
          return signedTxXdr
        },
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

interface NeedsTrustlinesResult {
  results: TrustlineResult[]
  isLoading: boolean
  isError: boolean
  refetch: UseQueryResult<TrustlineResult[]>['refetch']
}

/** Check every selected token, including tokens whose issuer needs resolving. */
export function useNeedsTrustlines(
  tokens: StellarToken[],
): NeedsTrustlinesResult {
  const connectedAddress = useAccount('stellar')
  const query = useQuery({
    queryKey: [
      'stellar',
      'trustlines-batch',
      connectedAddress,
      tokens.map((token) => [token.address, token.symbol, token.issuer]),
    ],
    queryFn: async () => {
      if (!connectedAddress) throw new Error('Wallet not connected')
      return Promise.all(
        tokens.map((token) =>
          checkTokenTrustline(
            connectedAddress,
            token.symbol,
            token.address,
            token.issuer && isStellarAccountAddress(token.issuer)
              ? token.issuer
              : '',
          ),
        ),
      )
    },
    enabled: Boolean(connectedAddress && tokens.length),
    staleTime: ms('30s'),
  })
  return {
    results: query.data ?? [],
    isLoading: Boolean(connectedAddress && tokens.length && query.isPending),
    isError: query.isError,
    refetch: query.refetch,
  }
}
