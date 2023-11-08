import { useQuery } from '@tanstack/react-query'
import { SupportedNetwork, chains } from 'config/chains'
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
  const response = await fetch(
    `${chains[network].api.fetchUrlPrefix}/v1/accounts/${account}/resource/0x1::coin::CoinStore<${currency}>`,
  )

  if (response.status === 200) {
    const data = await response.json()
    return Number(data.data.coin.value)
  }

  return 0
}

interface Params {
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
}: Params) {
  const { network } = useNetwork()

  return useQuery({
    queryKey: ['balance', { currency, account, network }],
    queryFn: async () => tokenBalanceQueryFn({ account, currency, network }),
    refetchInterval: refetchInterval && refetchInterval,
  })
}
