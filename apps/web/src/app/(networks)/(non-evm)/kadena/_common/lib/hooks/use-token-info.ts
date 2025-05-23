import { useQuery } from '@tanstack/react-query'
import { kadenaClient } from '~kadena/_common/constants/client'
import {
  KADENA_CHAIN_ID,
  KADENA_NETWORK_ID,
} from '~kadena/_common/constants/network'
import { buildGetTokenMetaTx } from '~kadena/_common/lib/pact/builders'

type TokenInfo = {
  name: string
  symbol: string
  decimals: number
}

export const useTokenInfo = ({
  tokenContract,
  enabled = true,
}: {
  tokenContract: string
  enabled?: boolean
}) => {
  return useQuery({
    queryKey: ['kadena-token-info', tokenContract],
    queryFn: async (): Promise<TokenInfo> => {
      const tx = buildGetTokenMetaTx(
        tokenContract,
        KADENA_CHAIN_ID,
        KADENA_NETWORK_ID,
      )

      const res = await kadenaClient.local(tx, {
        preflight: false,
        signatureVerification: false,
      })

      if (res.result.status !== 'success') {
        throw new Error(
          res.result.error?.message || 'Failed to fetch token info',
        )
      }

      const { name, symbol, decimals } = res.result.data
      return { name, symbol, decimals }
    },
    enabled: !!tokenContract && enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}
