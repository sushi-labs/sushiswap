import { useQuery } from '@tanstack/react-query'
import { kadenaClient } from '~kadena/_common/constants/client'
import {
  KADENA_CHAIN_ID,
  KADENA_NETWORK_ID,
} from '~kadena/_common/constants/network'
import { buildGetBalanceTx } from '../pact/builders'
import type { PactNumberReturnType } from '../pact/type'

type NativeTokenBalanceResponse = {
  chainId: number
  balance: number
}

export const useNativeTokenBalance = ({
  account,
  enabled = true,
}: { account: string; enabled: boolean }) => {
  return useQuery({
    queryKey: ['kadena-native-balance', account],
    queryFn: async (): Promise<NativeTokenBalanceResponse> => {
      const tx = buildGetBalanceTx(account, KADENA_CHAIN_ID, KADENA_NETWORK_ID)
      const res = await kadenaClient.local(tx, {
        preflight: false,
        signatureVerification: false,
      })

      if (res.result.status !== 'success') {
        return {
          chainId: KADENA_CHAIN_ID,
          balance: 0,
        }
      }

      const amount = res.result.data as PactNumberReturnType

      const balance =
        typeof amount === 'object' ? Number.parseFloat(amount.decimal) : amount

      return {
        chainId: KADENA_CHAIN_ID,
        balance: Number(balance),
      }
    },
    enabled: !!account && enabled,
    staleTime: (60 * 1000) / 6,
    gcTime: (5 * 60 * 1000) / 6,
  })
}
