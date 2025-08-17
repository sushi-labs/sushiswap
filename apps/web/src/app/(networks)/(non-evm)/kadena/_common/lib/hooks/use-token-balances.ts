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
  return useQuery({
    queryKey: ['kadena-token-balances', account, tokenAddresses],
    queryFn: async (): Promise<NativeTokenBalanceResponse> => {
      if (!account || !tokenAddresses || tokenAddresses.length === 0) {
        return {
          chainId: KADENA_CHAIN_ID,
          balanceMap: {},
        }
      }

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
        const name = key //=== "undefined" ? "coin" : key; // undefined key is native kda
        const tokenAddress = tokenAddresses.find((address) => {
          return address.replace('.', '') === name
        })

        let amount = typeof value === 'number' ? value : 0 // Default to 0 if value is not a number b/c it'll the fallback of {int: -1}
        if (value && typeof value === 'object' && 'decimal' in value) {
          //id {decimal: "123.456"}
          amount = Number(value.decimal) // If the value is an object with a decimal property, use that it will be a string
        }

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
    enabled: !!account && tokenAddresses?.length > 0,
    // staleTime: 60 * 1000,
    // gcTime: 5 * 60 * 1000,
  })
}
