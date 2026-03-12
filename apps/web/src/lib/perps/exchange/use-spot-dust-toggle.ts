import { ApiRequestError, spotUser } from '@nktkas/hyperliquid/api/exchange'
import { AbstractWalletError } from '@nktkas/hyperliquid/signing'
import {
  createFailedToast,
  createInfoToast,
  createSuccessToast,
} from '@sushiswap/notifications'
import { useMutation } from '@tanstack/react-query'
import { useAccount } from 'src/lib/wallet'
import { useAgent } from '../agent'
import { TOAST_AUTOCLOSE_TIME } from '../config'
import { useLegalCheck } from '../info/use-legal-check'
import { hlHttpTransport } from '../transports'

export const useSpotDustToggle = () => {
  const { agentAccount } = useAgent()
  const address = useAccount('evm')
  const { data: legalCheck } = useLegalCheck({ address })

  const mutation = useMutation({
    mutationKey: ['useSpotDustToggle', agentAccount?.address, legalCheck],
    mutationFn: async ({ optOut }: { optOut: boolean }) => {
      if (!agentAccount) {
        return
      }
      if (!legalCheck?.ipAllowed || !legalCheck?.userAllowed) {
        throw new Error('Legal check failed. Cannot update spot dusting.')
      }

      return spotUser(
        {
          wallet: agentAccount,
          transport: hlHttpTransport,
        },
        {
          toggleSpotDusting: {
            optOut,
          },
        },
      )
    },

    onMutate: (data) => {
      if (!agentAccount) return

      const ts = Date.now()

      createInfoToast({
        summary: `Opting ${data.optOut ? 'out of' : 'in to'} Spot Dust Collection`,
        account: agentAccount.address,
        chainId: 1,
        type: 'burn',
        timestamp: ts,
        groupTimestamp: ts,
        autoClose: TOAST_AUTOCLOSE_TIME,
      })

      return { ts }
    },

    onSuccess: (_res, vars, ctx) => {
      if (!agentAccount || !ctx) return

      createSuccessToast({
        summary: `Opted ${vars.optOut ? 'out of' : 'in to'} Spot Dust Collection`,
        account: agentAccount.address,
        chainId: 1,
        type: 'burn',
        timestamp: ctx.ts,
        groupTimestamp: ctx.ts,
        autoClose: TOAST_AUTOCLOSE_TIME,
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
          `Failed to ${vars.optOut ? 'opt out of' : 'opt in to'} Spot Dust Collection`,
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
    updateSpotDustingAsync: mutation.mutateAsync,
    updateSpotDusting: mutation.mutate,
    isPending: mutation.isPending,
  }
}
