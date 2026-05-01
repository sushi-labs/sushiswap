import {
  ApiRequestError,
  type ModifyParameters,
  modify,
} from '@nktkas/hyperliquid/api/exchange'
import { AbstractWalletError } from '@nktkas/hyperliquid/signing'
import {
  createFailedToast,
  createInfoToast,
  createSuccessToast,
} from '@sushiswap/notifications'
import { useMutation } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useAccount } from 'src/lib/wallet'
import { useAssetListState } from '~evm/perps/_ui/asset-selector'
import { useAgent } from '../agent'
import { TOAST_AUTOCLOSE_TIME } from '../config'
import { useLegalCheck } from '../info/use-legal-check'
import { hlHttpTransport } from '../transports'
import type { UserOpenOrdersItemType } from '../user/use-user-open-orders'
import { getAssetIdForConverter } from '../utils'
import type { OrderType, TimeInForceType } from './use-execute-orders'

type ModifyOrderData = {
  asset: string
  orderId: number
  side: 'A' | 'B'
  size: string
  price: string
  reduceOnly: boolean
  orderType: OrderType
}

export const useModifyOrder = () => {
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
    mutationKey: ['modify-order', agentAccount?.address, legalCheck],
    mutationFn: async (modifyOrderData: ModifyOrderData) => {
      if (!agentAccount || !modifyOrderData) {
        return
      }
      const asset = assetList?.get(modifyOrderData.asset)
      if (!asset) throw new Error(`Unknown c.asset: ${modifyOrderData.asset}`)
      const id = getAssetIdForConverter(asset)
      const assetId = symbolConverter?.getAssetId(id)

      if (assetId === undefined)
        throw new Error(`Unknown asset: ${modifyOrderData.asset}`)

      const order = {
        a: assetId,
        b: modifyOrderData.side === 'B',
        s: modifyOrderData.size,
        p: modifyOrderData.price,
        r: modifyOrderData.reduceOnly,
        t:
          'limit' in modifyOrderData.orderType
            ? { limit: { tif: modifyOrderData.orderType.limit.timeInForce } }
            : {
                trigger: {
                  isMarket: modifyOrderData.orderType.trigger.isMarket,
                  triggerPx: modifyOrderData.orderType.trigger.triggerPrice,
                  tpsl: modifyOrderData.orderType.trigger.tpsl,
                },
              },
      } satisfies ModifyParameters['order']

      return modify(
        {
          wallet: agentAccount,
          transport: hlHttpTransport,
        },
        {
          oid: modifyOrderData.orderId,
          order,
        },
      )
    },

    onMutate: () => {
      if (!agentAccount) return
      const ts = Date.now()

      createInfoToast({
        summary: `Modifying Order`,
        account: agentAccount.address,
        chainId: 1,
        type: 'burn',
        timestamp: ts,
        groupTimestamp: ts,
        autoClose: TOAST_AUTOCLOSE_TIME,
        variant: 'perps',
      })

      return { ts }
    },

    onSuccess: (_res, _vars, ctx) => {
      if (!agentAccount || !ctx) return

      createSuccessToast({
        summary: `Modified Order`,
        account: agentAccount.address,
        chainId: 1,
        type: 'burn',
        timestamp: ctx.ts,
        groupTimestamp: ctx.ts,
        autoClose: TOAST_AUTOCLOSE_TIME,
        variant: 'perps',
      })
    },

    onError: (error, _vars, ctx) => {
      let message = ''
      if (
        error instanceof AbstractWalletError ||
        error instanceof ApiRequestError ||
        error instanceof Error
      ) {
        message = error.message
      }
      createFailedToast({
        summary: message || `Failed to Modify Order`,
        account: agentAccount?.address,
        chainId: 1,
        type: 'burn',
        timestamp: ctx?.ts ?? Date.now(),
        groupTimestamp: ctx?.ts ?? Date.now(),
        autoClose: TOAST_AUTOCLOSE_TIME,
        variant: 'perps',
      })
    },
  })

  return {
    modifyOrderAsync: mutation.mutateAsync,
    modifyOrder: mutation.mutate,
    isPending: mutation.isPending,
  }
}

export const usePrepModifyOrderData = ({
  openOrder,
}: {
  openOrder: UserOpenOrdersItemType
}) => {
  return useMemo(() => {
    return prepModifyOrderData(openOrder)
  }, [openOrder])
}

export const prepModifyOrderData = (openOrder: UserOpenOrdersItemType) => {
  const isTrigger = openOrder.isTrigger
  const isMarket =
    openOrder.orderType === 'Stop Market' ||
    openOrder.orderType === 'Take Profit Market'
  const isTp = openOrder.orderType.toLowerCase().includes('take profit')
  return {
    asset: openOrder.coin,
    orderId: openOrder.oid,
    side: openOrder.side,
    size: openOrder.sz,
    price: openOrder.limitPx,
    reduceOnly: openOrder.reduceOnly,
    orderType: !isTrigger
      ? {
          limit: {
            timeInForce: openOrder.tif as TimeInForceType,
          },
        }
      : ({
          trigger: {
            isMarket: isMarket,
            triggerPrice: openOrder.triggerPx,
            tpsl: isTp ? 'tp' : 'sl',
          },
        } as OrderType),
  }
}
