import type { ChainId } from '@kadena/client'
import { useQuery } from '@tanstack/react-query'
import type { KvmTokenAddress } from 'sushi/kvm'
import { parseUnits } from 'viem'
import { kadenaClient } from '~kadena/_common/constants/client'
import { KADENA_CHAIN_ID } from '~kadena/_common/constants/network'
import { buildGetTokenBalanceAndPrecisionTx } from '../pact/builders'

type NativeTokenBalanceResponse = {
  chainId: ChainId
  balanceMap: Record<string, string>
}

export const useTokenBalances = ({
  account,
  tokenAddresses,
}: {
  account: string
  tokenAddresses: KvmTokenAddress[]
}) => {
  return useQuery({
    queryKey: ['kadena-token-balances', account, tokenAddresses],
    queryFn: async () => {
      if (!account || !tokenAddresses || tokenAddresses.length === 0) {
        throw new Error('Account and token addresses are required')
      }

      const tx = buildGetTokenBalanceAndPrecisionTx(account, tokenAddresses)

      const res = await kadenaClient.local(tx, {
        preflight: false,
        signatureVerification: false,
      })
      console.log(res)
      if (res.result.status !== 'success') {
        throw new Error(res.result.error?.message || 'Failed to fetch balances')
      }

      const cleanedBalanceMap: Record<string, string> = {}
      for (const [key, { balance, precision }] of Object.entries(
        res.result.data,
      )) {
        const decimals = precision?.int ?? 12
        const name = key //=== "undefined" ? "coin" : key; // undefined key is native kda
        const tokenAddress = tokenAddresses.find((address) => {
          return address.replace('.', '') === name
        })

        //@dev will use PactNumber once pactjs pkg is fixed
        let amount = typeof balance === 'number' ? balance : 0 // Default to 0 if value is not a number b/c it'll the fallback of {int: -1}
        if (balance && typeof balance === 'object' && 'decimal' in balance) {
          //id {decimal: "123.456"}
          amount = balance.decimal // If the value is an object with a decimal property, use that it will be a string
        } else if (balance && typeof balance === 'object' && 'int' in balance) {
          // is {int: 123456}
          if (balance.int < 0) {
            amount = 0 // If the balance is -1, set to 0
          } else {
            amount = balance.int // If the value is an object with an int property, use that
          }
        }

        cleanedBalanceMap[tokenAddress || 'coin'] =
          parseUnits(String(amount ?? 0), decimals)?.toString() || '0'
      }

      return {
        chainId: KADENA_CHAIN_ID,
        balanceMap: cleanedBalanceMap,
      } satisfies NativeTokenBalanceResponse
    },
    enabled: Boolean(account && tokenAddresses?.length > 0),
  })
}
