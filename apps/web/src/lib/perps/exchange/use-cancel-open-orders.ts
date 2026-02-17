import { cancel } from '@nktkas/hyperliquid/api/exchange'
import { AbstractWalletError } from '@nktkas/hyperliquid/signing'
import {
  createFailedToast,
  createInfoToast,
  createSuccessToast,
} from '@sushiswap/notifications'
import { useMutation } from '@tanstack/react-query'
import { useAssetListState } from '~evm/perps/_ui/asset-selector/asset-list-provider'
import { hlHttpTransport } from '../transports'
import { useAgent } from '../use-agent'

type CancelData = { asset: string; orderId: number }

export const useCancelOpenOrders = () => {
  const { agentAccount } = useAgent()
  const {
    state: { symbolConverter },
  } = useAssetListState()

  const mutation = useMutation({
    mutationFn: async ({ cancelData }: { cancelData: CancelData[] }) => {
      if (!agentAccount || cancelData.length === 0) {
        return
      }

      const cancels = cancelData.map((c) => {
        const assetId = symbolConverter?.getAssetId(c.asset)

        if (assetId === undefined) throw new Error(`Unknown asset: ${c.asset}`)
        return { a: assetId, o: c.orderId }
      })

      return cancel(
        {
          wallet: agentAccount,
          transport: hlHttpTransport,
        },
        { cancels },
      )
    },

    onMutate: (data) => {
      if (!agentAccount) return
      const cancelData = data?.cancelData || []
      const ts = Date.now()

      createInfoToast({
        summary: `Cancelling Order${cancelData.length > 1 ? 's' : ''}`,
        account: agentAccount.address,
        chainId: 1,
        type: 'burn',
        timestamp: ts,
        groupTimestamp: ts,
      })

      return { ts, count: cancelData.length }
    },

    onSuccess: (_res, _vars, ctx) => {
      if (!agentAccount || !ctx) return

      createSuccessToast({
        summary: `Cancelled Order${ctx.count > 1 ? 's' : ''}`,
        account: agentAccount.address,
        chainId: 1,
        type: 'burn',
        timestamp: ctx.ts,
        groupTimestamp: ctx.ts,
      })
    },

    onError: (error, _vars, ctx) => {
      let message = ''
      if (error instanceof AbstractWalletError) {
        message = error.message
      }
      createFailedToast({
        summary:
          message ||
          `Failed to Cancel Order${ctx?.count && ctx.count > 1 ? 's' : ''}`,
        account: agentAccount?.address,
        chainId: 1,
        type: 'burn',
        timestamp: ctx?.ts ?? Date.now(),
        groupTimestamp: ctx?.ts ?? Date.now(),
      })
    },
  })

  return {
    cancelOrdersAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
  }
}
