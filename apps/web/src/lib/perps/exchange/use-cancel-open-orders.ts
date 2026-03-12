import { cancel } from '@nktkas/hyperliquid/api/exchange'
import { AbstractWalletError } from '@nktkas/hyperliquid/signing'
import {
  createFailedToast,
  createInfoToast,
  createSuccessToast,
} from '@sushiswap/notifications'
import { useMutation } from '@tanstack/react-query'
import { useAccount } from 'src/lib/wallet'
import { useAssetListState } from '~evm/perps/_ui/asset-selector'
import { useAgent } from '../agent'
import { TOAST_AUTOCLOSE_TIME } from '../config'
import { useLegalCheck } from '../info/use-legal-check'
import { hlHttpTransport } from '../transports'
import { getAssetIdForConverter } from '../utils'

type CancelData = { asset: string; orderId: number }

export const useCancelOpenOrders = () => {
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
    mutationKey: ['cancel-open-orders', agentAccount?.address, legalCheck],
    mutationFn: async ({ cancelData }: { cancelData: CancelData[] }) => {
      if (!agentAccount || cancelData.length === 0) {
        return
      }
      if (!legalCheck?.ipAllowed || !legalCheck?.userAllowed) {
        throw new Error('Legal check failed. Cannot cancel open orders.')
      }

      const cancels = cancelData.map((c) => {
        const asset = assetList?.get(c.asset)
        if (!asset) throw new Error(`Unknown c.asset: ${c.asset}`)
        const id = getAssetIdForConverter(asset)
        const assetId = symbolConverter?.getAssetId(id)

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
        autoClose: TOAST_AUTOCLOSE_TIME,
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
        autoClose: TOAST_AUTOCLOSE_TIME,
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
        autoClose: TOAST_AUTOCLOSE_TIME,
      })
    },
  })

  return {
    cancelOrdersAsync: mutation.mutateAsync,
    cancelOrders: mutation.mutate,
    isPending: mutation.isPending,
  }
}
