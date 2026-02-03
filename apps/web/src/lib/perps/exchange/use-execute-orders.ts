import { type OrderParameters, order } from '@nktkas/hyperliquid/api/exchange'
import {
  createFailedToast,
  createInfoToast,
  createSuccessToast,
} from '@sushiswap/notifications'
import { useMutation } from '@tanstack/react-query'
import { useAssetListState } from '~evm/perps/_ui/asset-list-provider'
import { BUILDER_FEE_RECEIVER } from '../config'
import { hlHttpTransport } from '../transports'
import { useAgent } from '../use-agent'

type OrderType =
  | {
      limit: {
        // "Gtc": Remains active until filled or canceled.
        // "Ioc": Fills immediately or cancels any unfilled portion.
        // "Alo": Adds liquidity only.
        // "FrontendMarket": Similar to Ioc, used in Hyperliquid UI.
        // "LiquidationMarket": Similar to Ioc, used in Hyperliquid UI.
        //todo: bring theses types out to a common file
        timeInForce:
          | 'Gtc'
          | 'Ioc'
          | 'Alo'
          | 'FrontendMarket'
          | 'LiquidationMarket'
      }
    }
  | {
      trigger: {
        isMarket: boolean
        triggerPrice: string
        tpsl: 'tp' | 'sl'
      }
    }
type Order = {
  asset: string
  side: 'long' | 'short'
  price: string
  size: string
  reduceOnly: boolean
  orderType: OrderType
  clientOrderId?: string
}

type OrderData = {
  orders: Order[]
  // na: Standard order without grouping.
  // normalTpsl: TP/SL order with fixed size that doesn't adjust with position changes.
  // positionTpsl: TP/SL order that adjusts proportionally with the position size.
  grouping?: 'na' | 'normalTpsl' | 'positionTpsl'
  builder: {
    builderFee: number //Builder fee in 0.1bps (1 = 0.0001%). Max 100 for perps (0.1%), 1000 for spot (1%).
  }
}

export const useExecuteOrders = () => {
  const { agentAccount } = useAgent()
  const {
    state: { symbolConverter },
  } = useAssetListState()

  const mutation = useMutation({
    mutationFn: async ({ orderData }: { orderData: OrderData }) => {
      if (!agentAccount || orderData.orders.length === 0) {
        alert(
          'todo: handle missing agent account flow; ie. enable trading checker',
        )
        return
      }

      const orders: OrderParameters['orders'] = orderData.orders.map((c) => {
        const assetId = symbolConverter?.getAssetId(c.asset)
        if (assetId === undefined) throw new Error(`Unknown asset: ${c.asset}`)

        return {
          a: assetId,
          b: c.side !== 'long',
          p: c.price,
          s: c.size,
          r: c.reduceOnly,
          t:
            'limit' in c.orderType
              ? { limit: { tif: c.orderType.limit.timeInForce } }
              : {
                  trigger: {
                    isMarket: c.orderType.trigger.isMarket,
                    triggerPx: c.orderType.trigger.triggerPrice,
                    tpsl: c.orderType.trigger.tpsl,
                  },
                },
          ...(c.clientOrderId ? { c: c.clientOrderId } : {}),
        } satisfies OrderParameters['orders'][number]
      })

      const _orderData: OrderParameters = {
        orders,
        builder: {
          b: BUILDER_FEE_RECEIVER,
          f: orderData.builder.builderFee,
        },
        ...(orderData.grouping ? { grouping: orderData.grouping } : {}),
      }

      return order(
        { wallet: agentAccount, transport: hlHttpTransport },
        _orderData,
      )
    },

    onMutate: (data) => {
      if (!agentAccount) return
      const ts = Date.now()

      createInfoToast({
        summary: `Submitting Order${data.orderData.orders.length > 1 ? 's' : ''}`,
        account: agentAccount.address,
        chainId: 1,
        type: 'burn',
        timestamp: ts,
        groupTimestamp: ts,
      })

      return { ts, count: data.orderData.orders.length }
    },

    onSuccess: (_res, _vars, ctx) => {
      if (!agentAccount || !ctx) return

      createSuccessToast({
        summary: `Submitted Order${ctx.count > 1 ? 's' : ''}`,
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
        summary:
          message ||
          `Failed to Submit Order${ctx?.count && ctx.count > 1 ? 's' : ''}`,
        account: agentAccount?.address,
        chainId: 1,
        type: 'burn',
        timestamp: ctx?.ts ?? Date.now(),
        groupTimestamp: ctx?.ts ?? Date.now(),
      })
    },
  })

  return {
    executeOrdersAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
  }
}
