import { useQuery } from '@tanstack/react-query'
import { Token } from './tokenType'

export const tokenBalanceQueryFn = async (account: string, currency: Token, chainId: number) => {
  const network = chainId == 1 ? 'mainnet' : 'testnet'
  if (account) {
    const response = await fetch(
      `https://fullnode.${network}.aptoslabs.com/v1/accounts/${account}/resource/0x1::coin::CoinStore<${currency?.address}>`
    )
    if (response.status == 200) {
      const data = await response.json()
      return data.data.coin.value
    }
  }
  return 0
}

export function useTokenBalance(account: string, currency: Token, chainId: number = 1, enabled: boolean = true) {
  return useQuery({
    queryKey: ['balance', { currency, account, chainId }],
    queryFn: async () => tokenBalanceQueryFn(account, currency, isNaN(chainId) ? 1 : chainId),
    enabled: Boolean(isNaN(chainId) ? 1 : chainId && currency?.address && enabled),
    refetchInterval: 2000,
  })
}
