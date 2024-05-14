import { useQuery } from '@tanstack/react-query'
import { SupportedNetwork, chains } from 'config/chains'
import { isPromiseFulfilled } from 'sushi'
import { useNetwork } from './use-network'

interface TokenBalanceQueryFn {
  account: string
  currency: string
  network: SupportedNetwork
}

export const tokenBalanceQueryFn = async ({
  account,
  currency,
  network,
}: TokenBalanceQueryFn) => {
  const response = await fetch(
    `${chains[network].api.fetchUrlPrefix}/v1/accounts/${account}/resource/0x1::coin::CoinStore<${currency}>`,
  )

  if (response.status === 200) {
    const data = await response.json()
    return { currency, balance: Number(data.data.coin.value) }
  }

  // Apparently, on Aptos, if the balance is 0, the API returns a 404
  if (response.status === 404) {
    return { currency, balance: 0 }
  }

  throw new Error('Failed to fetch balance')
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

      return tokenBalanceQueryFn({ account, currency, network })
    },
    select: (data) => data?.balance,
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

      const promises = currencies.map((currency) =>
        tokenBalanceQueryFn({ account, currency, network }),
      )

      const balances = await Promise.allSettled(promises)

      return balances
        .map((balance, i) => {
          if (isPromiseFulfilled(balance)) {
            return balance.value
          }

          return {
            currency: currencies[i],
            balance: 0,
          }
        })
        .reduce<Record<string, number>>((acc, cur) => {
          acc[cur.currency] = cur.balance
          return acc
        }, {})
    },
    refetchInterval: refetchInterval,
    enabled: Boolean(account && enabled),
  })
}
