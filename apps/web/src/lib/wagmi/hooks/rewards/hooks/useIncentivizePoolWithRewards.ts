import { createErrorToast, createToast } from '@sushiswap/notifications'
import { useCallback } from 'react'
import type { EvmChainId } from 'sushi/evm'
import type { Address } from 'viem'
import {
  type UseSimulateContractParameters,
  useAccount,
  usePublicClient,
  useSimulateContract,
  useWriteContract,
} from 'wagmi'

import { logger } from 'src/lib/logger'
import { isUserRejectedError } from 'src/lib/wagmi/errors'
import type { SendTransactionReturnType } from 'wagmi/actions'
import type { DistributionCreator } from '../abis/DistributionCreator'

const distributionCreatorAbi_createDistribution = [
  {
    inputs: [
      {
        components: [
          { internalType: 'bytes32', name: 'rewardId', type: 'bytes32' },
          { internalType: 'address', name: 'uniV3Pool', type: 'address' },
          { internalType: 'address', name: 'rewardToken', type: 'address' },
          { internalType: 'uint256', name: 'amount', type: 'uint256' },
          {
            internalType: 'address[]',
            name: 'positionWrappers',
            type: 'address[]',
          },
          {
            internalType: 'uint32[]',
            name: 'wrapperTypes',
            type: 'uint32[]',
          },
          { internalType: 'uint32', name: 'propToken0', type: 'uint32' },
          { internalType: 'uint32', name: 'propToken1', type: 'uint32' },
          { internalType: 'uint32', name: 'propFees', type: 'uint32' },
          { internalType: 'uint32', name: 'epochStart', type: 'uint32' },
          { internalType: 'uint32', name: 'numEpoch', type: 'uint32' },
          {
            internalType: 'uint32',
            name: 'isOutOfRangeIncentivized',
            type: 'uint32',
          },
          { internalType: 'uint32', name: 'boostedReward', type: 'uint32' },
          {
            internalType: 'address',
            name: 'boostingAddress',
            type: 'address',
          },
          { internalType: 'bytes', name: 'additionalData', type: 'bytes' },
        ],
        internalType: 'struct DistributionParameters',
        name: 'newDistribution',
        type: 'tuple',
      },
    ],
    name: 'createDistribution',
    outputs: [
      {
        internalType: 'uint256',
        name: 'distributionAmount',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const

interface UseHarvestAngleRewards {
  account: Address | undefined
  chainId: EvmChainId
  enabled?: boolean
  args:
    | UseSimulateContractParameters<
        typeof DistributionCreator,
        'createDistribution'
      >['args']
    | undefined
}

export const useIncentivizePoolWithRewards = ({
  account,
  chainId,
  args,
  enabled = true,
}: UseHarvestAngleRewards) => {
  const { chain } = useAccount()
  const simulation = useSimulateContract({
    chainId,
    abi: distributionCreatorAbi_createDistribution,
    address: '0x8BB4C975Ff3c250e0ceEA271728547f3802B36Fd',
    functionName: 'createDistribution',
    args: args ? args : undefined,
    query: {
      enabled: Boolean(enabled && args && chainId === chain?.id),
    } as any, // shrug,
  })

  const client = usePublicClient()

  const onError = useCallback((e: Error) => {
    if (isUserRejectedError(e)) {
      return
    }

    logger.error(e, {
      location: 'useIncentivizePoolWithRewards',
      action: 'mutationError',
    })
    createErrorToast(e.message, true)
  }, [])

  const onSuccess = useCallback(
    (data: SendTransactionReturnType) => {
      const ts = new Date().getTime()
      void createToast({
        account,
        type: 'approval',
        chainId,
        txHash: data,
        promise: client.waitForTransactionReceipt({ hash: data }),
        summary: {
          pending: 'Harvesting rewards',
          completed: 'Successfully harvested rewards',
          failed: 'Something went wrong harvesting rewards',
        },
        groupTimestamp: ts,
        timestamp: ts,
      })
    },
    [account, chainId, client],
  )

  return {
    simulation,
    write: useWriteContract({
      mutation: {
        onSuccess,
        onError,
      },
    }),
  }
}
