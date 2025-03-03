import { useQuery } from '@tanstack/react-query'
import {
  type SupportedNetwork,
  networkNameToNetwork,
} from '~aptos/_common/config/chains'
import { AptosSDK } from './aptos-sdk'
import { useNetwork } from './use-network'

interface TokenBalanceQueryFn {
  account: string
  currencies: string[]
  network: SupportedNetwork
}

export const tokenBalancesQueryFn = async ({
  account,
  currencies,
  network,
}: TokenBalanceQueryFn) => {
  const aptos = AptosSDK.onNetwork(networkNameToNetwork(network))

  try {
    const balancesResponse = await aptos.getCurrentFungibleAssetBalances({
      options: {
        where: {
          owner_address: {
            _eq: account,
          },
          asset_type: {
            _in: currencies,
          },
        },
      },
    })

    const balancesMap = balancesResponse.reduce<Record<string, number>>(
      (acc, cur) => {
        if (cur.asset_type) acc[cur.asset_type] = cur.amount
        return acc
      },
      {},
    )

    return currencies.reduce<Record<string, number>>((acc, cur) => {
      acc[cur] = balancesMap[cur] ?? 0
      return acc
    }, {})
  } catch {
    return currencies.reduce<Record<string, number>>((acc, cur) => {
      acc[cur] = 0
      return acc
    }, {})
  }
}

interface UseTokenBalance {
  account?: string
  currency?: string
  enabled?: boolean
  refetchInterval?: number
}

export function useTokenBalance({
  account,
  currency,
  enabled = true,
  refetchInterval,
}: UseTokenBalance) {
  const { network } = useNetwork()

  return useQuery({
    queryKey: ['balance', { currency, account, network }],
    queryFn: async () => {
      if (!account || !currency) {
        throw new Error('Account and currency is required')
      }

      const balances = await tokenBalancesQueryFn({
        account,
        currencies: [currency],
        network,
      })

      return balances[currency]
    },
    refetchInterval,
    enabled: Boolean(account && currency && enabled),
  })
}

interface UseTokenBalances {
  account?: string
  currencies: string[]
  enabled?: boolean
  refetchInterval?: number
}

export function useTokenBalances({
  account,
  currencies,
  enabled = true,
  refetchInterval,
}: UseTokenBalances) {
  const { network } = useNetwork()

  return useQuery({
    queryKey: ['balance', { currencies, account, network }],
    queryFn: async () => {
      if (!account) {
        throw new Error('Account is required')
      }

      return await tokenBalancesQueryFn({ account, currencies, network })
    },
    refetchInterval: refetchInterval,
    enabled: Boolean(account && enabled),
  })
}
