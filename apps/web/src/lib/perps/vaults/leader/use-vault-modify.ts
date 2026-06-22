import { vaultModify } from '@nktkas/hyperliquid/api/exchange'
import { AbstractWalletError } from '@nktkas/hyperliquid/signing'
import {
  createFailedToast,
  createInfoToast,
  createSuccessToast,
} from '@sushiswap/notifications'
import { useMutation } from '@tanstack/react-query'
import { useAccount } from 'src/lib/wallet'
import type { EvmAddress } from 'sushi/evm'
import {
  TOAST_AUTOCLOSE_TIME,
  hlHttpTransport,
  useAgent,
  useLegalCheck,
} from '../..'

export const useVaultModify = () => {
  const { agentAccount } = useAgent()
  const address = useAccount('evm')
  const { data: legalCheck } = useLegalCheck({ address })

  const mutation = useMutation({
    mutationKey: ['vault-modify', agentAccount?.address, legalCheck],
    mutationFn: async ({
      vaultAddress,
      allowDeposits,
      alwaysCloseOnWithdraw,
    }: {
      vaultAddress: EvmAddress
      allowDeposits?: boolean
      alwaysCloseOnWithdraw?: boolean
    }) => {
      if (!agentAccount) {
        return
      }

      return vaultModify(
        {
          wallet: agentAccount,
          transport: hlHttpTransport,
        },
        {
          vaultAddress,
          allowDeposits: allowDeposits !== undefined ? allowDeposits : null,
          alwaysCloseOnWithdraw:
            alwaysCloseOnWithdraw !== undefined ? alwaysCloseOnWithdraw : null,
        },
      )
    },

    onMutate: () => {
      if (!agentAccount) return
      const ts = Date.now()

      createInfoToast({
        summary: `Modifying Vault...`,
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
        summary: `Vault Modified Successfully`,
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
        summary: message || `Failed to Modify Vault`,
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
    modifyVaultAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
  }
}
