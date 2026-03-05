import {
  type UserSetAbstractionParameters,
  userSetAbstraction,
} from '@nktkas/hyperliquid/api/exchange'
import {
  createFailedToast,
  createInfoToast,
  createSuccessToast,
} from '@sushiswap/notifications'
import { useMutation } from '@tanstack/react-query'
import { useWalletClient } from 'wagmi'
import { TOAST_AUTOCLOSE_TIME } from '../config'
import { hlHttpTransport } from '../transports'

export const useSetUserAbstraction = () => {
  const { data: walletClient } = useWalletClient()

  const mutation = useMutation({
    mutationFn: async ({
      abstraction,
      address,
    }: {
      abstraction: UserSetAbstractionParameters['abstraction']
      address: string
    }) => {
      if (!walletClient) {
        throw new Error('Missing wallet client')
      }

      return userSetAbstraction(
        { wallet: walletClient, transport: hlHttpTransport },
        {
          abstraction,
          user: address,
        },
      )
    },

    onMutate: (_data) => {
      if (!walletClient) throw new Error('Missing wallet client')
      const ts = Date.now()

      createInfoToast({
        summary: `Setting User Abstraction`,
        account: walletClient.account.address,
        chainId: 1,
        type: 'burn',
        timestamp: ts,
        groupTimestamp: ts,
        autoClose: TOAST_AUTOCLOSE_TIME,
      })

      return { ts }
    },

    onSuccess: (_res, _vars, ctx) => {
      if (!walletClient || !ctx) return

      createSuccessToast({
        summary: `Set User Abstraction`,
        account: walletClient.account.address,
        chainId: 1,
        type: 'burn',
        timestamp: ctx.ts,
        groupTimestamp: ctx.ts,
        autoClose: TOAST_AUTOCLOSE_TIME,
      })
    },

    onError: (error, _vars, ctx) => {
      let message = ''
      if (error instanceof Error) {
        message = error.message
      }
      createFailedToast({
        summary: message || `Failed to Set User Abstraction`,
        account: walletClient?.account.address,
        chainId: 1,
        type: 'burn',
        timestamp: ctx?.ts ?? Date.now(),
        groupTimestamp: ctx?.ts ?? Date.now(),
        autoClose: TOAST_AUTOCLOSE_TIME,
      })
    },
  })

  return {
    setUserAbstractionAsync: mutation.mutateAsync,
    setUserAbstraction: mutation.mutate,
    isPending: mutation.isPending,
  }
}
