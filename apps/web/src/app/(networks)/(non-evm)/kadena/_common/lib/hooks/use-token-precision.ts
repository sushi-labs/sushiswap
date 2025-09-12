import { useQuery } from '@tanstack/react-query'
import { kadenaClient } from '~kadena/_common/constants/client'
import {
  KADENA_CHAIN_ID,
  KADENA_NETWORK_ID,
} from '~kadena/_common/constants/network'
import { buildGetTokenPrecision } from '~kadena/_common/lib/pact/builders'

export const useTokenPrecision = ({
  tokenContract,
}: { tokenContract: string }) => {
  return useQuery({
    queryKey: ['kadena-token-info', tokenContract],
    queryFn: async (): Promise<number> => {
      if (!tokenContract) {
        return 12 // Default precision for KDA
      }
      const tx = buildGetTokenPrecision(
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

      const decimals =
        typeof res?.result?.data === 'object' && 'int' in res.result.data
          ? (res?.result?.data?.int as number)
          : 12
      return decimals
    },
    enabled: !!tokenContract,
  })
}
