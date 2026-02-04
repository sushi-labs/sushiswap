import { approveBuilderFee } from '@nktkas/hyperliquid/api/exchange'
import { useSessionStorage } from '@sushiswap/hooks'
import {
  createFailedToast,
  createInfoToast,
  createSuccessToast,
} from '@sushiswap/notifications'
import { useMutation } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useWalletClient } from 'wagmi'
import { BUILDER_FEE_RECEIVER, BUILDER_FEE_SPOT_PERCENTAGE } from '../config'
import { hlHttpTransport } from '../transports'

export const useApproveBuilderFee = () => {
  const { data: walletClient } = useWalletClient()
  const [storedValue, setValue] = useSessionStorage<boolean>(
    `sushi.perps.approved.builder.${walletClient?.account.address}`,
    false,
  )

  const hasApprovedBuilder = useMemo(() => storedValue === true, [storedValue])

  const mutation = useMutation({
    mutationFn: async () => {
      if (!walletClient) {
        throw new Error('Missing wallet client')
      }

      return approveBuilderFee(
        { wallet: walletClient, transport: hlHttpTransport },
        {
          maxFeeRate: `${BUILDER_FEE_SPOT_PERCENTAGE}%`,
          builder: BUILDER_FEE_RECEIVER,
        },
      )
    },

    onMutate: (_data) => {
      if (!walletClient) throw new Error('Missing wallet client')
      const ts = Date.now()

      createInfoToast({
        summary: `Approving Builder Fee`,
        account: walletClient.account.address,
        chainId: 1,
        type: 'burn',
        timestamp: ts,
        groupTimestamp: ts,
      })

      return { ts }
    },

    onSuccess: (_res, _vars, ctx) => {
      if (!walletClient || !ctx) return
      setValue(true)

      createSuccessToast({
        summary: `Approved Builder Fee`,
        account: walletClient.account.address,
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
        account: walletClient?.account.address,
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
    hasApprovedBuilder,
  }
}
