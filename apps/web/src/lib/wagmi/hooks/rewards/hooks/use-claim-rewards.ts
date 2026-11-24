import { createErrorToast, createToast } from '@sushiswap/notifications'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useMemo } from 'react'
import type { ClaimableRewards } from 'src/lib/hooks/react-query'
import { logger } from 'src/lib/logger'
import { isUserRejectedError } from 'src/lib/wagmi/errors'
import { waitForSuccessfulReceipt } from 'src/lib/wagmi/transactions/wait-for-successful-receipt'
import {
  useConnection,
  usePublicClient,
  useSimulateContract,
  useWriteContract,
} from 'wagmi'
import type { SendTransactionReturnType } from 'wagmi/actions'
import { useRefetchBalances } from '~evm/_common/ui/balance-provider/use-refetch-balances'

const MERKL_DISTRIBUTOR_ADDRESS = '0x3Ef3D8bA38EBe18DB133cEc108f4D14CE00Dd9Ae'

const claimAbi = [
  {
    inputs: [
      { internalType: 'address[]', name: 'users', type: 'address[]' },
      { internalType: 'address[]', name: 'tokens', type: 'address[]' },
      { internalType: 'uint256[]', name: 'amounts', type: 'uint256[]' },
      { internalType: 'bytes32[][]', name: 'proofs', type: 'bytes32[][]' },
    ],
    name: 'claim',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const

interface UseClaimRewardsParams {
  rewards: ClaimableRewards
  enabled?: boolean
  onRewardsSubmitted?(
    hash: SendTransactionReturnType,
    receipt: Promise<unknown>,
  ): void
  onRewardsClaimed?(): void
}

export const useClaimRewards = ({
  rewards,
  enabled = true,
  onRewardsSubmitted,
  onRewardsClaimed,
}: UseClaimRewardsParams) => {
  const { address, chainId } = useConnection()

  const { data: simulation } = useSimulateContract({
    chainId: rewards.chainId,
    abi: claimAbi,
    address: MERKL_DISTRIBUTOR_ADDRESS,
    functionName: 'claim',
    args: rewards.claimArgs,
    query: {
      enabled: Boolean(
        enabled && rewards.claimArgs && rewards.chainId === chainId,
      ),
    },
  })

  const client = usePublicClient({ chainId: rewards.chainId })
  const queryClient = useQueryClient()

  const { refetchChain: refetchBalances } = useRefetchBalances()

  const onSuccess = useCallback(
    async (data: SendTransactionReturnType) => {
      const receipt = waitForSuccessfulReceipt(client, data)
      onRewardsSubmitted?.(data, receipt)

      const ts = new Date().getTime()
      void createToast({
        account: address,
        type: 'approval',
        chainId: rewards.chainId,
        txHash: data,
        promise: receipt,
        summary: {
          pending: 'Harvesting rewards',
          completed: 'Successfully harvested rewards',
          failed: 'Something went wrong harvesting rewards',
        },
        groupTimestamp: ts,
        timestamp: ts,
      })

      try {
        await receipt
      } catch (error) {
        logger.error(error, {
          location: 'useClaimRewards',
          action: 'waitForReceipt',
        })
        return
      } finally {
        refetchBalances(rewards.chainId)
      }

      void queryClient.invalidateQueries({
        queryKey: [
          'claimableMerklRewards',
          { account: rewards.claimArgs[0][0]?.toLowerCase() },
        ],
      })
      onRewardsClaimed?.()
    },
    [
      client,
      address,
      rewards,
      refetchBalances,
      queryClient,
      onRewardsSubmitted,
      onRewardsClaimed,
    ],
  )

  const onError = useCallback((e: Error) => {
    if (isUserRejectedError(e)) {
      return
    }

    logger.error(e, {
      location: 'useClaimRewards',
      action: 'mutationError',
    })
    createErrorToast(e.message, true)
  }, [])

  const {
    mutateAsync: writeContractAsync,
    mutate: _,
    ...rest
  } = useWriteContract({
    mutation: {
      onSuccess,
      onError,
    },
  })

  const write = useMemo(() => {
    if (!simulation?.request) return undefined

    return async () => {
      try {
        await writeContractAsync(simulation.request)
      } catch {}
    }
  }, [writeContractAsync, simulation])

  return {
    ...rest,
    write,
  }
}
