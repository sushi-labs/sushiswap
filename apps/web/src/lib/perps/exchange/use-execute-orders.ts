import { type OrderParameters, order } from '@nktkas/hyperliquid/api/exchange'
import {
  createFailedToast,
  createInfoToast,
  createSuccessToast,
} from '@sushiswap/notifications'
import { useMutation } from '@tanstack/react-query'
import { execute } from 'porto/viem/ContractActions'
import { useAccount } from 'src/lib/wallet'
import { useAssetListState } from '~evm/perps/_ui/asset-selector'
import { useAgent } from '../agent'
import { BUILDER_FEE_RECEIVER, TOAST_AUTOCLOSE_TIME } from '../config'
import { useLegalCheck } from '../info/use-legal-check'
import { hlHttpTransport } from '../transports'
import { getAssetIdForConverter } from '../utils'

export type TimeInForceType = 'Gtc' | 'Ioc' | 'Alo' | 'FrontendMarket'

export type OrderType =
  | {
      limit: {
        // "Gtc": Remains active until filled or canceled.
        // "Ioc": Fills immediately or cancels any unfilled portion.
        // "Alo": Adds liquidity only.
        // "FrontendMarket": Similar to Ioc, used in Hyperliquid UI.
        timeInForce: TimeInForceType
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

export type OrderData = {
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
    state: {
      symbolConverter,
      assetListQuery: { data: assetList },
    },
  } = useAssetListState()
  const address = useAccount('evm')
  const { data: legalCheck } = useLegalCheck({ address })

  const mutation = useMutation({
    mutationKey: ['execute-orders', agentAccount?.address, legalCheck],
    mutationFn: async ({ orderData }: { orderData: OrderData }) => {
      if (!agentAccount || orderData.orders.length === 0) {
        return
      }
      if (!legalCheck?.ipAllowed || !legalCheck?.userAllowed) {
        throw new Error('Legal check failed. Cannot execute orders.')
      }

      const orders: OrderParameters['orders'] = orderData.orders.map((c) => {
        const asset = assetList?.get(c.asset)
        if (!asset) throw new Error(`Unknown c.asset: ${c.asset}`)
        const id = getAssetIdForConverter(asset)
        const assetId = symbolConverter?.getAssetId(id)
        if (assetId === undefined) throw new Error(`Unknown asset: ${id}`)

        return {
          a: assetId,
          b: c.side === 'long',
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
      console.log(orders)
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
        autoClose: TOAST_AUTOCLOSE_TIME,
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
        autoClose: TOAST_AUTOCLOSE_TIME,
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
        autoClose: TOAST_AUTOCLOSE_TIME,
      })
    },
  })

  return {
    executeOrdersAsync: mutation.mutateAsync,
    executeOrders: mutation.mutate,
    isPending: mutation.isPending,
  }
}
