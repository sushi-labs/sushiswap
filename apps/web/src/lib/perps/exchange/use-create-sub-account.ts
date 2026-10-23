import {
  type CreateSubAccountSuccessResponse,
  createSubAccount,
} from '@nktkas/hyperliquid/api/exchange'
import {
  createFailedToast,
  createInfoToast,
  createSuccessToast,
} from '@sushiswap/notifications'
import {
  type UseMutationResult,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { useAccount } from 'src/lib/wallet'
import type { EvmAddress } from 'sushi/evm'
import { useWalletClient } from 'wagmi'
import { useAgent } from '../agent'
import { TOAST_AUTOCLOSE_TIME } from '../config'
import { useLegalCheck } from '../info/use-legal-check'
import { MAX_SUB_ACCOUNT_NAME_LENGTH } from '../sub-account'
import { hlHttpTransport } from '../transports'

type CreateSubAccountVariables = {
  masterAddress: EvmAddress
  name: string
}

type CreateSubAccountMutation = UseMutationResult<
  CreateSubAccountSuccessResponse,
  Error,
  CreateSubAccountVariables,
  { ts: number }
>

export function useCreateSubAccount(): {
  createSubAccount: CreateSubAccountMutation['mutate']
  createSubAccountAsync: CreateSubAccountMutation['mutateAsync']
  isPending: boolean
  error: Error | null
  reset: () => void
} {
  const address = useAccount('evm')
  const { agentAccount } = useAgent()
  const { data: legalCheck } = useLegalCheck({ address })
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationKey: ['create-sub-account', address],
    mutationFn: async ({
      masterAddress,
      name,
    }: CreateSubAccountVariables): Promise<CreateSubAccountSuccessResponse> => {
      if (!agentAccount || !address) {
        throw new Error(
          'Connect your master account wallet to create a sub-account.',
        )
      }
      if (address.toLowerCase() !== masterAddress.toLowerCase()) {
        throw new Error(
          'Connect the master account wallet to create a sub-account.',
        )
      }
      if (!legalCheck?.ipAllowed || !legalCheck?.userAllowed) {
        throw new Error('Legal check failed. Cannot create sub-account.')
      }
      const trimmedName = name.trim()
      if (!trimmedName || trimmedName.length > MAX_SUB_ACCOUNT_NAME_LENGTH) {
        throw new Error(
          `Enter a name between 1 and ${MAX_SUB_ACCOUNT_NAME_LENGTH} characters.`,
        )
      }

      return createSubAccount(
        { wallet: agentAccount, transport: hlHttpTransport },
        { name: trimmedName },
      )
    },
    onMutate: ({ masterAddress }) => {
      const ts = Date.now()
      createInfoToast({
        summary: 'Creating sub-account...',
        account: masterAddress,
        chainId: 1,
        type: 'burn',
        timestamp: ts,
        groupTimestamp: ts,
        autoClose: TOAST_AUTOCLOSE_TIME,
        variant: 'perps',
      })
      return { ts }
    },
    onSuccess: async (_response, { masterAddress }, context) => {
      await queryClient.invalidateQueries({
        queryKey: ['useSubAccounts', masterAddress],
      })
      createSuccessToast({
        summary: 'Sub-account created successfully',
        account: masterAddress,
        chainId: 1,
        type: 'burn',
        timestamp: context.ts,
        groupTimestamp: context.ts,
        autoClose: TOAST_AUTOCLOSE_TIME,
        variant: 'perps',
      })
    },
    onError: (error, { masterAddress }, context) => {
      const ts = context?.ts ?? Date.now()
      createFailedToast({
        summary: error.message || 'Failed to create sub-account',
        account: masterAddress,
        chainId: 1,
        type: 'burn',
        timestamp: ts,
        groupTimestamp: ts,
        autoClose: TOAST_AUTOCLOSE_TIME,
        variant: 'perps',
      })
    },
  })

  return {
    createSubAccount: mutation.mutate,
    createSubAccountAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  }
}
