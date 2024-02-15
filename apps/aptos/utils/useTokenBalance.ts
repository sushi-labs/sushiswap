import { useQuery } from '@tanstack/react-query'
import { SupportedNetwork, chains } from 'config/chains'
import { isPromiseFulfilled } from 'sushi'
import { useNetwork } from './useNetwork'

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
  console.log(currency)

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
  account: string
  currency: string
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
    queryFn: async () => tokenBalanceQueryFn({ account, currency, network }),
    select: (data) => data?.balance,
    refetchInterval,
    enabled,
  })
}

interface UseTokenBalances {
  account: string
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
      const promises = currencies.map((currency) =>
        tokenBalanceQueryFn({ account, currency, network }),
      )

      const balances = await Promise.allSettled(promises)

      return balances
        .filter(isPromiseFulfilled)
        .map((balance) => balance.value)
        .reduce<Record<string, number>>((acc, cur) => {
          acc[cur.currency] = cur.balance
          return acc
        }, {})
    },
    refetchInterval: refetchInterval,
    enabled,
  })
}
