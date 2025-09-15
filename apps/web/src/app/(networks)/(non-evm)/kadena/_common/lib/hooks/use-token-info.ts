import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import {
  KvmChainId,
  KvmToken,
  type KvmTokenAddress,
  isKvmTokenAddress,
} from 'sushi/kvm'
import { kadenaClient } from '~kadena/_common/constants/client'
import {
  KADENA_CHAIN_ID,
  KADENA_NETWORK_ID,
} from '~kadena/_common/constants/network'
import { buildGetTokenPrecision } from '~kadena/_common/lib/pact/builders'

export const useTokenInfo = ({
  tokenContract,
  enabled = true,
}: {
  tokenContract: string
  enabled?: boolean
}) => {
  return useQuery({
    queryKey: ['kadena-token-info', tokenContract],
    queryFn: async () => {
      if (!isKvmTokenAddress(tokenContract as KvmTokenAddress)) {
        return null
      }
      const decimalsTx = buildGetTokenPrecision(
        tokenContract as KvmTokenAddress,
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

      const decimals =
        typeof decimalRes?.result?.data === 'object' &&
        'int' in decimalRes.result.data
          ? (decimalRes?.result?.data?.int as number)
          : 12

      const symbol = tokenContract?.split('.')?.[1] || 'UNKNOWN'

      return new KvmToken({
        chainId: KvmChainId.KADENA,
        address: tokenContract as KvmTokenAddress,
        symbol,
        decimals,
        name: symbol,
        metadata: {
          imageUrl: undefined,
          validated: false,
          kadenaChainId: KADENA_CHAIN_ID,
          kadenaNetworkId: KADENA_NETWORK_ID,
        },
      })
    },
    enabled: !!tokenContract && enabled,
    staleTime: ms('30s'),
  })
}
