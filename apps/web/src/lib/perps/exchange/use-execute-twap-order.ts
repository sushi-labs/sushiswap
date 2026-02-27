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
import { TOAST_AUTOCLOSE_TIME } from '../config'
import { hlHttpTransport } from '../transports'
import { useAgent } from '../use-agent'
import { getAssetIdForConverter } from '../utils'

export type TwapOrder = {
  asset: string
  side: 'long' | 'short'
  size: string
  reduceOnly: boolean
  minutes: number
  ramdonize: boolean
}

export const useExecuteTwapOrder = () => {
  const { agentAccount } = useAgent()
  const {
    state: {
      symbolConverter,
      assetListQuery: { data: assetList },
    },
  } = useAssetListState()

  const mutation = useMutation({
    mutationFn: async (orderData: TwapOrder) => {
      if (!agentAccount || !orderData) {
        return
      }
      const asset = assetList?.get(orderData.asset)
      if (!asset) throw new Error(`Unknown c.asset: ${orderData.asset}`)
      const id = getAssetIdForConverter(asset)
      const assetId = symbolConverter?.getAssetId(id)
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
        autoClose: TOAST_AUTOCLOSE_TIME,
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
        autoClose: TOAST_AUTOCLOSE_TIME,
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
        autoClose: TOAST_AUTOCLOSE_TIME,
      })
    },
  })

  return {
    executeTwapOrderAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
  }
}
