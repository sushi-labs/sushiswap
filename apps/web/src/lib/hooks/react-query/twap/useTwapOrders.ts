import { groupOrdersByStatus } from '@orbs-network/twap-sdk'
import { useQuery } from '@tanstack/react-query'
import type { TwapSupportedChainId } from 'src/config'
import { TwapSDK } from 'src/lib/swap/twap'
import type { Address } from 'sushi/types'

interface TwapOrdersParams {
  chainId: TwapSupportedChainId
  account: Address | undefined
}

export const useTwapOrders = ({ chainId, account }: TwapOrdersParams) => {
  return useQuery({
    queryKey: ['twap-orders', chainId, account],
    queryFn: async () => {
      if (!account) throw new Error()
      const orders = await TwapSDK.onNetwork(chainId).getUserOrders({ account })
      return groupOrdersByStatus(orders)
    },
    enabled: Boolean(account),
  })
}
