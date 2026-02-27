import { twapCancel } from '@nktkas/hyperliquid/api/exchange'
import { AbstractWalletError } from '@nktkas/hyperliquid/signing'
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

type CancelData = { asset: string; twapId: number }

export const useCancelTwap = () => {
  const { agentAccount } = useAgent()
  const {
    state: {
      symbolConverter,
      assetListQuery: { data: assetList },
    },
  } = useAssetListState()

  const mutation = useMutation({
    mutationFn: async ({ cancelData }: { cancelData: CancelData }) => {
      if (!agentAccount || !cancelData) {
        return
      }
      const asset = assetList?.get(cancelData.asset)
      if (!asset) throw new Error(`Unknown c.asset: ${cancelData.asset}`)
      const id = getAssetIdForConverter(asset)
      const assetId = symbolConverter?.getAssetId(id)

      if (assetId === undefined)
        throw new Error(`Unknown asset: ${cancelData.asset}`)

      return twapCancel(
        {
          wallet: agentAccount,
          transport: hlHttpTransport,
        },
        { a: assetId, t: cancelData.twapId },
      )
    },

    onMutate: () => {
      if (!agentAccount) return
      const ts = Date.now()

      createInfoToast({
        summary: `Cancelling Twap Order`,
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
        summary: `Cancelled Twap Order`,
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
      if (error instanceof AbstractWalletError || error instanceof Error) {
        message = error.message
      }
      createFailedToast({
        summary: message || `Failed to Cancel Twap Order`,
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
    cancelTwapOrderAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
  }
}
