import {
  ApiRequestError,
  updateLeverage,
} from '@nktkas/hyperliquid/api/exchange'
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

export const useUpdateLeverage = () => {
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
    mutationKey: ['update-leverage', agentAccount?.address, legalCheck],
    mutationFn: async ({
      assetString,
      isCross,
      newLeverage,
    }: { assetString: string; isCross: boolean; newLeverage: number }) => {
      if (!agentAccount) {
        return
      }
      if (!legalCheck?.ipAllowed || !legalCheck?.userAllowed) {
        throw new Error('Legal check failed. Cannot update leverage.')
      }
      const asset = assetList?.get(assetString)
      if (!asset) throw new Error(`Unknown c.asset: ${assetString}`)
      const id = getAssetIdForConverter(asset)
      const assetId = symbolConverter?.getAssetId(id)

      if (assetId === undefined) {
        throw new Error(`Unknown asset: ${assetString}`)
      }

      return updateLeverage(
        {
          wallet: agentAccount,
          transport: hlHttpTransport,
        },
        { asset: assetId, isCross, leverage: newLeverage },
      )
    },

    onMutate: (data) => {
      if (!agentAccount) return

      const ts = Date.now()

      createInfoToast({
        summary: `Updating Leverage to ${data.newLeverage}x for ${data.assetString} ${data.isCross ? '(Cross)' : '(Isolated)'}`,
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

    onSuccess: (_res, vars, ctx) => {
      if (!agentAccount || !ctx) return

      createSuccessToast({
        summary: `Updated Leverage to ${vars.newLeverage}x for ${vars.assetString} ${vars.isCross ? '(Cross)' : '(Isolated)'}`,
        account: agentAccount.address,
        chainId: 1,
        type: 'burn',
        timestamp: ctx.ts,
        groupTimestamp: ctx.ts,
        autoClose: TOAST_AUTOCLOSE_TIME,
        variant: 'perps',
      })
    },

    onError: (error, vars, ctx) => {
      let message = ''
      if (
        error instanceof AbstractWalletError ||
        error instanceof ApiRequestError
      ) {
        message = error.message
      }
      createFailedToast({
        summary:
          message ||
          `Failed to Update Leverage to ${vars.newLeverage}x for ${vars.assetString} ${vars.isCross ? '(Cross)' : '(Isolated)'}`,
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
    updateLeverageAsync: mutation.mutateAsync,
    updateLeverage: mutation.mutate,
    isPending: mutation.isPending,
  }
}
