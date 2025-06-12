import { createErrorToast, createToast } from '@sushiswap/notifications'
import { useCallback, useMemo } from 'react'
import type { ClaimableRewards } from 'src/lib/hooks/react-query'
import { UserRejectedRequestError } from 'viem'
import {
  useAccount,
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
}

export const useClaimRewards = ({
  rewards,
  enabled = true,
}: UseClaimRewardsParams) => {
  const { address, chainId } = useAccount()

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

  const client = usePublicClient()

  const { refetchChain: refetchBalances } = useRefetchBalances()

  const onSuccess = useCallback(
    (data: SendTransactionReturnType) => {
      const receipt = client.waitForTransactionReceipt({ hash: data })
      receipt.then(() => {
        refetchBalances(rewards.chainId)
      })

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
    },
    [refetchBalances, client, address, rewards.chainId],
  )

  const onError = useCallback((e: Error) => {
    if (e instanceof Error) {
      if (!(e.cause instanceof UserRejectedRequestError)) {
        createErrorToast(e.message, true)
      }
    }
  }, [])

  const {
    writeContractAsync,
    writeContract: _,
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
