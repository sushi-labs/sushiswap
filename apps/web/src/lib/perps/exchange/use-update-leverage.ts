import { updateLeverage } from '@nktkas/hyperliquid/api/exchange'
import { AbstractWalletError } from '@nktkas/hyperliquid/signing'
import {
  createFailedToast,
  createInfoToast,
  createSuccessToast,
} from '@sushiswap/notifications'
import { useMutation } from '@tanstack/react-query'
import { useAssetListState } from '~evm/perps/_ui/asset-list-provider'
import { hlHttpTransport } from '../transports'
import { useAgent } from '../use-agent'

export const useUpdateLeverage = () => {
  const { agentAccount } = useAgent()
  const {
    state: { symbolConverter },
  } = useAssetListState()
  const mutation = useMutation({
    mutationFn: async ({
      assetString,
      isCross,
      newLeverage,
    }: { assetString: string; isCross: boolean; newLeverage: number }) => {
      if (!agentAccount) {
        return
      }

      const assetId = symbolConverter?.getAssetId(assetString)
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
      })
    },

    onError: (error, vars, ctx) => {
      let message = ''
      if (error instanceof AbstractWalletError) {
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
      })
    },
  })

  return {
    updateLeverageAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
  }
}
