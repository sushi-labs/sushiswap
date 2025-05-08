import { useQuery } from '@tanstack/react-query'
import type { TwapSupportedChainId } from 'src/config'
import { TwapSDK } from 'src/lib/swap/twap/TwapSDK'
import type { Address } from 'sushi/types'

interface WaitForTwapOrderParams {
  chainId: TwapSupportedChainId
  account: Address | undefined
  orderId: number | undefined
}

export const useWaitForTwapOrder = ({
  chainId,
  account,
  orderId,
}: WaitForTwapOrderParams) => {
  return useQuery({
    queryKey: ['twap-order', chainId, account, orderId],
    queryFn: async () => {
      if (!orderId || !account) throw new Error()
      const orderUpdate = await TwapSDK.onNetwork(chainId).waitForOrdersUpdate(
        orderId,
        account,
      )
      return orderUpdate
    },
    enabled: Boolean(orderId && account),
  })
}
