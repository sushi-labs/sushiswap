import type { ChainId } from '@kadena/client'
import { PactNumber } from '@kadena/pactjs'
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
      if (res.result.status !== 'success') {
        throw new Error(res.result.error?.message || 'Failed to fetch balances')
      }

      const cleanedBalanceMap: Record<string, string> = {}
      try {
        for (const [key, { balance, precision }] of Object.entries(
          res.result.data,
        )) {
          const decimals = precision?.int ?? 12
          const name = key //=== "undefined" ? "coin" : key; // undefined key is native kda
          const tokenAddress = tokenAddresses.find((address) => {
            return address.replace('.', '') === name
          })

          const amount = new PactNumber(balance).toString()

          cleanedBalanceMap[tokenAddress || 'coin'] = parseUnits(
            normalizeAmount(amount),
            decimals,
          ).toString()
        }
      } catch (err) {
        console.error('error while cleaning balances', err)
      }

      return {
        chainId: KADENA_CHAIN_ID,
        balanceMap: cleanedBalanceMap,
      } satisfies NativeTokenBalanceResponse
    },
    enabled: Boolean(account && tokenAddresses?.length > 0),
  })
}

function normalizeAmount(amount: number | string): string {
  if (typeof amount === 'number') {
    // Convert scientific notation to plain string without grouping
    return amount.toString().includes('e')
      ? amount
          .toExponential(18)
          .replace(/e\+?/, 'e') // expand with 18 decimals
      : amount.toString()
  }
  return amount
}
