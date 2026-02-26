import {
  type TwapOrderParameters,
  twapOrder,
} from '@nktkas/hyperliquid/api/exchange'
import {
  createFailedToast,
  createInfoToast,
  createSuccessToast,
} from '@sushiswap/notifications'
import { useMutation } from '@tanstack/react-query'
import { useAssetListState } from '~evm/perps/_ui/asset-selector/asset-list-provider'
import { hlHttpTransport } from '../transports'
import { useAgent } from '../use-agent'

type TwapOrder = {
  asset: string
  side: 'long' | 'short'
  size: string
  reduceOnly: boolean
  minutes: number
  ramdonize: boolean
}

export const useExecuteOrders = () => {
  const { agentAccount } = useAgent()
  const {
    state: { symbolConverter },
  } = useAssetListState()

  const mutation = useMutation({
    mutationFn: async (orderData: TwapOrder) => {
      if (!agentAccount || !orderData) {
        return
      }

      const assetId = symbolConverter?.getAssetId(orderData.asset)
      if (assetId === undefined) {
        throw new Error(`Unknown asset: ${orderData.asset}`)
      }
      const twapOrderData: TwapOrderParameters = {
        twap: {
          a: assetId,
          b: orderData.side === 'long',
          s: orderData.size,
          r: orderData.reduceOnly,
          m: orderData.minutes,
          t: orderData.ramdonize,
        },
      } satisfies TwapOrderParameters

      return twapOrder(
        { wallet: agentAccount, transport: hlHttpTransport },
        twapOrderData,
      )
    },

    onMutate: () => {
      if (!agentAccount) return
      const ts = Date.now()

      createInfoToast({
        summary: `Submitting Twap Order`,
        account: agentAccount.address,
        chainId: 1,
        type: 'burn',
        timestamp: ts,
        groupTimestamp: ts,
      })

      return { ts }
    },

    onSuccess: (_res, _vars, ctx) => {
      if (!agentAccount || !ctx) return

      createSuccessToast({
        summary: `Submitted Twap Order`,
        account: agentAccount.address,
        chainId: 1,
        type: 'burn',
        timestamp: ctx.ts,
        groupTimestamp: ctx.ts,
      })
    },

    onError: (error, _vars, ctx) => {
      let message = ''
      if (error instanceof Error) {
        message = error.message
      }
      createFailedToast({
        summary: message || `Failed to Submit Twap Order`,
        account: agentAccount?.address,
        chainId: 1,
        type: 'burn',
        timestamp: ctx?.ts ?? Date.now(),
        groupTimestamp: ctx?.ts ?? Date.now(),
      })
    },
  })

  return {
    executeTwapOrderAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
  }
}
