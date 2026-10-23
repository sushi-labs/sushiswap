import {
  type SubAccountModifySuccessResponse,
  subAccountModify,
} from '@nktkas/hyperliquid/api/exchange'
import type { SubAccounts2Response } from '@nktkas/hyperliquid/api/info'
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
import { useActiveAccountState } from '~evm/perps/active-account-provider'
import { useAgent } from '../agent'
import { TOAST_AUTOCLOSE_TIME } from '../config'
import { useLegalCheck } from '../info/use-legal-check'
import { useSubAccounts } from '../info/use-sub-accounts'
import { MAX_SUB_ACCOUNT_NAME_LENGTH } from '../sub-account'
import { hlHttpTransport } from '../transports'

export { MAX_SUB_ACCOUNT_NAME_LENGTH } from '../sub-account'

type RenameSubAccountVariables = {
  masterAddress: EvmAddress
  subAccountUser: EvmAddress
  name: string
}

type RenameSubAccountMutation = UseMutationResult<
  SubAccountModifySuccessResponse,
  Error,
  RenameSubAccountVariables,
  { ts: number }
>

export function useRenameSubAccount(): {
  renameSubAccount: RenameSubAccountMutation['mutate']
  renameSubAccountAsync: RenameSubAccountMutation['mutateAsync']
  isPending: boolean
  error: Error | null
  reset: () => void
} {
  const address = useAccount('evm')
  const { agentAccount } = useAgent()
  const { data: legalCheck } = useLegalCheck({ address })
  const { data: subAccounts } = useSubAccounts({ address })
  const queryClient = useQueryClient()
  const {
    state: { activeAccount },
    mutate: { setActiveAccount },
  } = useActiveAccountState()

  const mutation = useMutation({
    mutationKey: ['rename-sub-account', address],
    mutationFn: async ({
      masterAddress,
      subAccountUser,
      name,
    }: RenameSubAccountVariables): Promise<SubAccountModifySuccessResponse> => {
      if (!agentAccount || !address) {
        throw new Error(
          'Connect your master account wallet to rename a sub-account.',
        )
      }
      if (address.toLowerCase() !== masterAddress.toLowerCase()) {
        throw new Error(
          'Connect the master account wallet for this sub-account.',
        )
      }
      if (!legalCheck?.ipAllowed || !legalCheck?.userAllowed) {
        throw new Error('Legal check failed. Cannot rename sub-account.')
      }
      if (
        !subAccounts?.some(
          (account) =>
            account.subAccountUser.toLowerCase() ===
              subAccountUser.toLowerCase() &&
            account.master.toLowerCase() === masterAddress.toLowerCase(),
        )
      ) {
        throw new Error(
          'This sub-account does not belong to the connected master account.',
        )
      }
      const trimmedName = name.trim()
      if (!trimmedName || trimmedName.length > MAX_SUB_ACCOUNT_NAME_LENGTH) {
        throw new Error(
          `Enter a name between 1 and ${MAX_SUB_ACCOUNT_NAME_LENGTH} characters.`,
        )
      }

      return subAccountModify(
        { wallet: agentAccount, transport: hlHttpTransport },
        { subAccountUser, name: trimmedName },
      )
    },
    onMutate: ({ masterAddress }) => {
      const ts = Date.now()
      createInfoToast({
        summary: 'Renaming sub-account...',
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
    onSuccess: (
      _response,
      { masterAddress, subAccountUser, name },
      context,
    ) => {
      const trimmedName = name.trim()
      queryClient.setQueryData<SubAccounts2Response>(
        ['useSubAccounts', masterAddress],
        (accounts) =>
          accounts?.map((account) =>
            account.subAccountUser.toLowerCase() ===
            subAccountUser.toLowerCase()
              ? { ...account, name: trimmedName }
              : account,
          ),
      )
      void queryClient.invalidateQueries({
        queryKey: ['useSubAccounts', masterAddress],
      })
      if (
        address?.toLowerCase() === masterAddress.toLowerCase() &&
        activeAccount?.type === 'sub' &&
        activeAccount.walletAddress.toLowerCase() ===
          masterAddress.toLowerCase() &&
        activeAccount.address.toLowerCase() === subAccountUser.toLowerCase()
      ) {
        setActiveAccount(subAccountUser, 'sub', trimmedName)
      }
      createSuccessToast({
        summary: 'Sub-account renamed successfully',
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
        summary: error.message || 'Failed to rename sub-account',
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
    renameSubAccount: mutation.mutate,
    renameSubAccountAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  }
}
