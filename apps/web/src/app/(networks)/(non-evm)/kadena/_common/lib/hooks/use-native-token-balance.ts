import { Pact, createClient } from '@kadena/client'
import { useQuery } from '@tanstack/react-query'
import { kadenaClient } from '~kadena/_common/constants/client'
import {
  KADENA_CHAIN_ID,
  KADENA_NETWORK_ID,
} from '~kadena/_common/constants/network'
import { buildGetBalanceTx } from '../pact/builders'

type NativeTokenBalanceResponse = {
  chainId: number
  balance: number
}

export const useNativeTokenBalance = ({
  account,
  enabled = true,
}: {
  account: string
  enabled: boolean
}) => {
  return useQuery({
    queryKey: ['kadena-native-balance', account],
    queryFn: async (): Promise<NativeTokenBalanceResponse> => {
      const tx = buildGetBalanceTx(account, KADENA_CHAIN_ID, KADENA_NETWORK_ID)

      const res = await kadenaClient.local(tx, {
        preflight: false,
        signatureVerification: false,
      })

      if (res.result.status !== 'success') {
        throw new Error(res.result.error?.message || 'Failed to fetch balance')
      }

      return {
        chainId: KADENA_CHAIN_ID,
        balance: Number(res.result.data),
      }
    },
    enabled: !!account && enabled,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}
