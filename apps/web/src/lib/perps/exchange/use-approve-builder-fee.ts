import { approveBuilderFee } from '@nktkas/hyperliquid/api/exchange'
import {
  createFailedToast,
  createInfoToast,
  createSuccessToast,
} from '@sushiswap/notifications'
import { useMutation } from '@tanstack/react-query'
import { BUILDER_FEE_PERPS_PERCENTAGE, BUILDER_FEE_RECEIVER } from '../config'
import { hlHttpTransport } from '../transports'
import { useAgent } from '../use-agent'

export const useApproveBuilderFee = () => {
  const { agentAccount } = useAgent()
  const mutation = useMutation({
    mutationFn: async () => {
      if (!agentAccount) {
        alert(
          'todo: handle missing agent account flow; ie. enable trading checker',
        )
        throw new Error('Missing agent account')
      }

      return approveBuilderFee(
        { wallet: agentAccount, transport: hlHttpTransport },
        {
          maxFeeRate: `${BUILDER_FEE_PERPS_PERCENTAGE}%`, // 0.1% in 0.1bps
          builder: BUILDER_FEE_RECEIVER,
        },
      )
    },

    onMutate: (_data) => {
      if (!agentAccount) throw new Error('Missing agent account')
      const ts = Date.now()

      createInfoToast({
        summary: `Approving Builder Fee`,
        account: agentAccount.address,
        chainId: 1,
        type: 'burn',
        timestamp: ts,
        groupTimestamp: ts,
      })

      return { ts }
    },

    onSuccess: (_res, _vars, ctx) => {
      if (!agentAccount || !ctx) return

      createSuccessToast({
        summary: `Approved Builder Fee`,
        account: agentAccount.address,
        chainId: 1,
        type: 'burn',
        timestamp: ctx.ts,
        groupTimestamp: ctx.ts,
      })
    },

    onError: (error, _vars, ctx) => {
      let message = ''
      if (error instanceof Error) {
        message = error.message
      }
      createFailedToast({
        summary: message || `Failed to Approve Builder Fee`,
        account: agentAccount?.address,
        chainId: 1,
        type: 'burn',
        timestamp: ctx?.ts ?? Date.now(),
        groupTimestamp: ctx?.ts ?? Date.now(),
      })
    },
  })

  return {
    approveBuilderFeeAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
  }
}
