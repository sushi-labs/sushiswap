import { useQuery } from '@tanstack/react-query'
import { Token } from './tokenType'

export const tokenBalanceQueryFn = async (account: string, currency: string, chainId: number) => {
  const network = chainId == 1 ? 'mainnet' : 'testnet'
  if (account) {
    const response = await fetch(
      `https://fullnode.${network}.aptoslabs.com/v1/accounts/${account}/resource/0x1::coin::CoinStore<${currency}>`
    )
    if (response.status == 200) {
      const data = await response.json()
      return data.data.coin.value
    }
  }
  return 0
}

interface Params {
  account: string
  currency: string
  chainId: number
  enabled?: boolean
  refetchInterval?: number
}

export function useTokenBalance({ account, currency, chainId = 1, enabled = true, refetchInterval }: Params) {
  return useQuery({
    queryKey: ['balance', { currency, account, chainId }],
    queryFn: async () => tokenBalanceQueryFn(account, currency, isNaN(chainId) ? 1 : chainId),
    enabled: Boolean(isNaN(chainId) ? 1 : chainId && currency && enabled),
    refetchInterval: refetchInterval && refetchInterval,
  })
}
