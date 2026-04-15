import { createErrorToast, createToast } from '@sushiswap/notifications'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback, useMemo } from 'react'
import { logger } from 'src/lib/logger'
import { isUserRejectedError } from 'src/lib/wagmi/errors'
import { EvmChainId } from 'sushi/evm'
import {
  useConnection,
  usePublicClient,
  useSimulateContract,
  useWriteContract,
} from 'wagmi'
import type { SendTransactionReturnType } from 'wagmi/actions'
import type { usePerpsClaim } from '../info/use-perps-claim'
import { sushiReferralQueryKeys } from '../sushi-referral'

export const PERPS_CLAIM_CHAIN_ID = EvmChainId.ARBITRUM

const claimAbi = [
  {
    inputs: [],
    name: 'InvalidProof',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NothingToClaim',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
    name: 'OwnableInvalidOwner',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'address', name: 'token', type: 'address' }],
    name: 'SafeERC20FailedOperation',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ZeroRecipient',
    type: 'error',
  },
  {
    inputs: [
      { internalType: 'address', name: 'recipient', type: 'address' },
      { internalType: 'uint256', name: 'cumulativeAmount', type: 'uint256' },
      { internalType: 'bytes32[]', name: 'proof', type: 'bytes32[]' },
    ],
    name: 'claim',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const

type PerpsClaimData = NonNullable<ReturnType<typeof usePerpsClaim>['data']>

export function useClaimPerpsRewards({
  claim,
  onClaimSuccess,
}: {
  claim: PerpsClaimData | undefined | null
  onClaimSuccess?: () => void | Promise<void>
}) {
  const queryClient = useQueryClient()
  const { address, chainId } = useConnection()
  const client = usePublicClient()

  const args = useMemo(() => {
    if (!address || !claim) {
      return undefined
    }

    return [address, BigInt(claim.cumulativeAmount), claim.proof] as const
  }, [address, claim])

  const { data: simulation } = useSimulateContract({
    chainId: PERPS_CLAIM_CHAIN_ID,
    abi: claimAbi,
    address: claim?.distributor,
    functionName: 'claim',
    args,
    query: {
      enabled: Boolean(
        args &&
          claim &&
          address &&
          chainId === PERPS_CLAIM_CHAIN_ID &&
          BigInt(claim.claimableAmount) > 0n,
      ),
    },
  })

  const handleSuccess = useCallback(
    (data: SendTransactionReturnType) => {
      if (!address || !client) return

      const receipt = client.waitForTransactionReceipt({ hash: data })
      void receipt.then(async () => {
        await queryClient.invalidateQueries({
          queryKey: sushiReferralQueryKeys.claim(address),
        })
        await onClaimSuccess?.()
      })

      const ts = Date.now()
      void createToast({
        account: address,
        type: 'approval',
        chainId: PERPS_CLAIM_CHAIN_ID,
        txHash: data,
        promise: receipt,
        summary: {
          pending: 'Claiming perps rewards',
          completed: 'Successfully claimed perps rewards',
          failed: 'Something went wrong claiming perps rewards',
        },
        groupTimestamp: ts,
        timestamp: ts,
      })
    },
    [address, client, onClaimSuccess, queryClient],
  )

  const onError = useCallback((error: Error) => {
    if (isUserRejectedError(error)) {
      return
    }

    logger.error(error, {
      location: 'useClaimPerpsRewards',
      action: 'mutationError',
    })
    createErrorToast(error.message, true)
  }, [])

  const { mutateAsync: writeContractAsync, ...rest } = useWriteContract({
    mutation: {
      onSuccess: handleSuccess,
      onError,
    },
  })

  const mutation = useMutation({
    mutationKey: ['useClaimPerpsRewards', address, claim?.root],
    mutationFn: async () => {
      if (!simulation?.request) {
        throw new Error('Claim is not available')
      }

      return writeContractAsync(simulation.request)
    },
  })

  const write = useMemo(() => {
    if (!simulation?.request) {
      return undefined
    }

    return async () => {
      await mutation.mutateAsync()
    }
  }, [mutation, simulation?.request])

  return {
    ...rest,
    isPending: mutation.isPending || rest.isPending,
    write,
    isEnabled: Boolean(simulation?.request),
  }
}
