import { createVault } from '@nktkas/hyperliquid/api/exchange'
import { AbstractWalletError } from '@nktkas/hyperliquid/signing'
import {
  createFailedToast,
  createInfoToast,
  createSuccessToast,
} from '@sushiswap/notifications'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAccount } from 'src/lib/wallet'
import { useAgent } from '../../agent'
import { TOAST_AUTOCLOSE_TIME } from '../../config'
import { useLegalCheck } from '../../info'
import { getLeadingVaultsQueryKey } from '../../info/use-leading-vaults'
import { hlHttpTransport } from '../../transports'

type CreateData = {
  name: string
  description: string
  initialUsdcAmount: number
}

export const useCreateVault = () => {
  const queryClient = useQueryClient()
  const { agentAccount } = useAgent()
  const address = useAccount('evm')
  const { data: legalCheck } = useLegalCheck({ address })

  const mutation = useMutation({
    mutationKey: ['create-vault', agentAccount?.address, legalCheck],
    mutationFn: async ({ createData }: { createData: CreateData }) => {
      if (!agentAccount || !createData) {
        return
      }
      if (!legalCheck?.ipAllowed || !legalCheck?.userAllowed) {
        throw new Error('Legal check failed. Cannot create vault.')
      }
      if (createData.name.length < 3 || createData.name.length > 50) {
        throw new Error('Vault name must be between 3 and 50 characters')
      }
      if (
        createData.description.length < 10 ||
        createData.description.length > 250
      ) {
        throw new Error(
          'Vault description must be between 10 and 250 characters',
        )
      }
      // initialUsdcAmount is in micro-USDC (float * 1e6), per the createVault SDK.
      if (createData.initialUsdcAmount < 100 * 1e6) {
        throw new Error('Initial deposit must be at least 100 USDC')
      }

      return createVault(
        {
          wallet: agentAccount,
          transport: hlHttpTransport,
        },
        {
          name: createData.name,
          description: createData.description,
          initialUsd: createData.initialUsdcAmount,
          nonce: Date.now(),
        },
      )
    },

    onMutate: () => {
      if (!agentAccount) return
      const ts = Date.now()

      createInfoToast({
        summary: `Creating Vault...`,
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

    onSuccess: async (_res, _vars, ctx) => {
      if (!agentAccount || !ctx) return

      createSuccessToast({
        summary: `Vault Created Successfully`,
        account: agentAccount.address,
        chainId: 1,
        type: 'burn',
        timestamp: ctx.ts,
        groupTimestamp: ctx.ts,
        autoClose: TOAST_AUTOCLOSE_TIME,
        variant: 'perps',
      })

      await queryClient.invalidateQueries({
        queryKey: getLeadingVaultsQueryKey(address),
      })
    },

    onError: (error, _vars, ctx) => {
      let message = ''
      if (error instanceof AbstractWalletError || error instanceof Error) {
        message = error.message
      }
      createFailedToast({
        summary: message || `Failed to Create Vault`,
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
    createVaultAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
  }
}
