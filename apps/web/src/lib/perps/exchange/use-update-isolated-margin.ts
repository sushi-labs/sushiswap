import {
  ApiRequestError,
  updateIsolatedMargin,
} from '@nktkas/hyperliquid/api/exchange'
import { AbstractWalletError } from '@nktkas/hyperliquid/signing'
import {
  createFailedToast,
  createInfoToast,
  createSuccessToast,
} from '@sushiswap/notifications'
import { useMutation } from '@tanstack/react-query'
import { useAccount } from 'src/lib/wallet'
import { parseUnits } from 'viem'
import { useAssetListState } from '~evm/perps/_ui/asset-selector/asset-list-provider'
import { TOAST_AUTOCLOSE_TIME } from '../config'
import { useLegalCheck } from '../info/use-legal-check'
import { hlHttpTransport } from '../transports'
import { useAgent } from '../use-agent'
import { getAssetIdForConverter } from '../utils'

export const useUpdateIsolatedMargin = () => {
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
    mutationKey: ['update-isolated-margin', agentAccount?.address, legalCheck],
    mutationFn: async ({
      assetString,
      side,
      amount,
      isAdd,
    }: {
      assetString: string
      side: 'long' | 'short'
      amount: string
      isAdd: boolean
    }) => {
      if (!agentAccount) {
        return
      }
      if (!legalCheck?.ipAllowed || !legalCheck?.userAllowed) {
        throw new Error('Legal check failed. Cannot update isolated margin.')
      }
      const asset = assetList?.get(assetString)
      if (!asset) throw new Error(`Unknown c.asset: ${assetString}`)
      const id = getAssetIdForConverter(asset)
      const assetId = symbolConverter?.getAssetId(id)

      if (assetId === undefined) {
        throw new Error(`Unknown asset: ${assetString}`)
      }

      // Amount to adjust (float * 1e6)
      const ntli = parseUnits(amount, 6).toString()
      const amountToAddOrRemove = isAdd ? Number(ntli) : -Number(ntli)

      return updateIsolatedMargin(
        {
          wallet: agentAccount,
          transport: hlHttpTransport,
        },
        { asset: assetId, isBuy: side === 'long', ntli: amountToAddOrRemove },
      )
    },

    onMutate: (_data) => {
      if (!agentAccount) return

      const ts = Date.now()

      createInfoToast({
        summary: `Updating Isolated Margin`,
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
        summary: `Updated Isolated Margin`,
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
      if (
        error instanceof AbstractWalletError ||
        error instanceof ApiRequestError ||
        error instanceof Error
      ) {
        message = error.message
      }
      createFailedToast({
        summary: message || `Failed to Update Isolated Margin`,
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
    updateIsolatedMarginAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
  }
}
