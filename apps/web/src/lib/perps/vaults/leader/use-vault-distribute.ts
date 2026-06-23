import { vaultDistribute } from '@nktkas/hyperliquid/api/exchange'
import { AbstractWalletError } from '@nktkas/hyperliquid/signing'
import {
  createFailedToast,
  createInfoToast,
  createSuccessToast,
} from '@sushiswap/notifications'
import { useMutation } from '@tanstack/react-query'
import { useAccount } from 'src/lib/wallet'
import type { EvmAddress } from 'sushi/evm'
import { useAgent } from '../../agent'
import { TOAST_AUTOCLOSE_TIME } from '../../config'
import { useLegalCheck } from '../../info'
import { hlHttpTransport } from '../../transports'

export const useVaultDistribute = () => {
  const { agentAccount } = useAgent()
  const address = useAccount('evm')
  const { data: legalCheck } = useLegalCheck({ address })

  const mutation = useMutation({
    mutationKey: ['vault-distribute', agentAccount?.address, legalCheck],
    mutationFn: async ({
      vaultAddress,
      usdAmount,
    }: {
      vaultAddress: EvmAddress
      usdAmount: number //0 to close the vault
    }) => {
      if (!agentAccount) {
        return
      }

      return vaultDistribute(
        {
          wallet: agentAccount,
          transport: hlHttpTransport,
        },
        {
          vaultAddress,
          usd: usdAmount,
        },
      )
    },

    onMutate: ({ usdAmount }) => {
      if (!agentAccount) return
      const ts = Date.now()

      createInfoToast({
        summary: usdAmount === 0 ? `Closing Vault...` : `Distributing Vault...`,
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
        summary: `Vault ${_vars.usdAmount === 0 ? 'Closed' : 'Distributed'} Successfully`,
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
      if (error instanceof AbstractWalletError || error instanceof Error) {
        message = error.message
      }
      createFailedToast({
        summary:
          message ||
          `Failed to ${_vars.usdAmount === 0 ? 'Close' : 'Distribute'} Vault`,
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
    vaultDistributeAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
  }
}
