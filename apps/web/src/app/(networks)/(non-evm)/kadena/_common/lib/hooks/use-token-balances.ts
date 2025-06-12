import { useQuery } from '@tanstack/react-query'
import { kadenaClient } from '~kadena/_common/constants/client'
import {
  KADENA_CHAIN_ID,
  KADENA_NETWORK_ID,
} from '~kadena/_common/constants/network'
import { buildGetTokenBalanceTx } from '../pact/builders'

type NativeTokenBalanceResponse = {
  chainId: number
  balanceMap: Record<string, number>
}

export const useTokenBalances = ({
  account,
  tokenAddresses,
}: {
  account: string
  tokenAddresses: string[]
}) => {
  //@DEV - ADD BACK NETWORKID BEFORE COMMITTING
  return useQuery({
    queryKey: ['kadena-token-balances', account, tokenAddresses],
    queryFn: async (): Promise<NativeTokenBalanceResponse> => {
      const tx = buildGetTokenBalanceTx(
        account,
        tokenAddresses,
        KADENA_CHAIN_ID,
        KADENA_NETWORK_ID,
      )

      const res = await kadenaClient.local(tx, {
        preflight: false,
        signatureVerification: false,
      })

      if (res.result.status !== 'success') {
        throw new Error(res.result.error?.message || 'Failed to fetch balances')
      }

      const cleanedBalanceMap: Record<string, number> = {}
      for (const [key, value] of Object.entries(res.result.data)) {
        const namespace = key //=== "undefined" ? "coin" : key; // undefined key is native kda
        const tokenAddress = tokenAddresses.find((address) => {
          return address.split('.')[1] === namespace
        })

        const amount = typeof value === 'number' ? value : 0 // Default to 0 if value is not a number b/c it'll the fallback of {int: -1}
        if (tokenAddress) {
          cleanedBalanceMap[tokenAddress] = amount
        } else {
          cleanedBalanceMap['coin'] = amount // native kda will be undefined
        }
      }

      return {
        chainId: KADENA_CHAIN_ID,
        balanceMap: cleanedBalanceMap,
      }
    },
    enabled: !!account,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  })
}
