import { useQuery } from '@tanstack/react-query'
import { kadenaClient } from '~kadena/_common/constants/client'
import {
  KADENA_CHAIN_ID,
  KADENA_NETWORK_ID,
} from '~kadena/_common/constants/network'
import { buildGetTokenPrecision } from '~kadena/_common/lib/pact/builders'
import type { KadenaToken } from '~kadena/_common/types/token-type'

export const useTokenInfo = ({
  tokenContract,
  enabled = true,
}: {
  tokenContract: string
  enabled?: boolean
}) => {
  return useQuery({
    queryKey: ['kadena-token-info', tokenContract],
    queryFn: async (): Promise<KadenaToken> => {
      const decimalsTx = buildGetTokenPrecision(
        tokenContract,
        KADENA_CHAIN_ID,
        KADENA_NETWORK_ID,
      )

      const decimalRes = await kadenaClient.local(decimalsTx, {
        preflight: false,
        signatureVerification: false,
      })
      if (decimalRes.result.status !== 'success') {
        throw new Error(
          decimalRes.result.error?.message || 'Failed to fetch token decimals',
        )
      }

      //@ts-expect-error - type mismatch, but we know this is correct
      const decimals = decimalRes?.result?.data?.int as number

      const symbol = tokenContract?.split('.')?.[1] || 'UNKNOWN'

      return {
        tokenAddress: tokenContract,
        tokenName: symbol,
        tokenSymbol: symbol,
        tokenDecimals: decimals,
      }
    },
    enabled: !!tokenContract && enabled,
    staleTime: (30 * 1000) / 6,
    gcTime: (10 * 60 * 1000) / 6,
  })
}
