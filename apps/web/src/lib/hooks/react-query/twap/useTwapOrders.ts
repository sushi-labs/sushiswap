import { useQuery } from '@tanstack/react-query'
import type { TwapSupportedChainId } from 'src/config'
import { TwapSDK } from 'src/lib/swap/twap/TwapSDK'
import type { Address } from 'sushi/types'

interface TwapOrdersParams {
  chainId: TwapSupportedChainId
  account: Address
}

export const useTwapOrders = ({ chainId, account }: TwapOrdersParams) => {
  return useQuery({
    queryKey: ['twap-orders', chainId, account],
    queryFn: async () => {
      const orders = await TwapSDK.onNetwork(chainId).getUserOrders({ account })
      return orders
    },
    enabled: Boolean(account),
  })
}
