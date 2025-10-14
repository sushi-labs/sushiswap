import { PactNumber } from '@kadena/pactjs'
import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import { KvmChainId, KvmToken, isKvmTokenAddress } from 'sushi/kvm'
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
      if (!isKvmTokenAddress(tokenContract)) {
        return null
      }

      const decimalsTx = buildGetTokenPrecision(tokenContract)

      const decimalRes = await kadenaClient.local(decimalsTx, {
        preflight: false,
        signatureVerification: false,
      })
      if (decimalRes.result.status !== 'success') {
        throw new Error(
          decimalRes.result.error?.message || 'Failed to fetch token decimals',
        )
      }

      const decimals = new PactNumber(
        decimalRes?.result?.data as { int: string },
      ).toNumber()

      const symbol = tokenContract?.split('.')?.[1] || 'UNKNOWN'

      return new KvmToken({
        chainId: KvmChainId.KADENA,
        address: tokenContract,
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
    enabled: Boolean(tokenContract && enabled),
    staleTime: ms('30s'),
  })
}
