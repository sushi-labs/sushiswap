import {
  ApiRequestError,
  vaultTransfer,
} from '@nktkas/hyperliquid/api/exchange'
import { AbstractWalletError } from '@nktkas/hyperliquid/signing'
import {
  createFailedToast,
  createInfoToast,
  createSuccessToast,
} from '@sushiswap/notifications'
import { useMutation } from '@tanstack/react-query'
import { useAccount } from 'src/lib/wallet'
import type { EvmAddress } from 'sushi/evm'
import { useAgent } from '../agent'
import { TOAST_AUTOCLOSE_TIME } from '../config'
import { useLegalCheck } from '../info/use-legal-check'
import { hlHttpTransport } from '../transports'

export const useVaultTransfer = () => {
  const { agentAccount } = useAgent()
  const address = useAccount('evm')
  const { data: legalCheck } = useLegalCheck({ address })

  const mutation = useMutation({
    mutationKey: ['useVaultTransfer', agentAccount?.address, legalCheck],
    mutationFn: async ({
      vaultAddress,
      usdAmount,
      type,
    }: {
      vaultAddress: EvmAddress
      usdAmount: string | number
      type: 'deposit' | 'withdraw'
    }) => {
      if (!agentAccount) {
        return
      }
      if (!legalCheck?.ipAllowed || !legalCheck?.userAllowed) {
        throw new Error('Legal check failed. Cannot update spot dusting.')
      }

      return vaultTransfer(
        {
          wallet: agentAccount,
          transport: hlHttpTransport,
        },
        {
          vaultAddress,
          usd: usdAmount,
          isDeposit: type === 'deposit',
        },
      )
    },

    onMutate: (data) => {
      if (!agentAccount) return

      const ts = Date.now()

      createInfoToast({
        summary: `${data.type === 'deposit' ? 'Depositing into' : 'Withdrawing from'} Vault`,
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
        summary: `${vars.type === 'deposit' ? 'Deposited into' : 'Withdrew from'} Vault`,
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
          `Failed to ${vars.type === 'deposit' ? 'deposit into' : 'withdraw from'} Vault`,
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
    updateVaultTransferAsync: mutation.mutateAsync,
    updateVaultTransfer: mutation.mutate,
    isPending: mutation.isPending,
  }
}
