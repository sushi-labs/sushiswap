import { ChainId } from '@sushiswap/chain'
import { createErrorToast, createToast } from '@sushiswap/ui/components/toast'
import { useCallback } from 'react'
import { UserRejectedRequestError } from 'viem'
import { Address, useContractWrite, useNetwork, usePrepareContractWrite } from 'wagmi'
import { PrepareWriteContractConfig, SendTransactionResult, waitForTransaction } from 'wagmi/actions'

import { DistributionCreator } from '../abis/DistributionCreator'

interface UseHarvestAngleRewards {
  account: Address | undefined
  chainId: ChainId
  enabled?: boolean
  args: PrepareWriteContractConfig<typeof DistributionCreator, 'signAndCreateDistribution'>['args'] | undefined
}

export const useIncentivizePoolWithRewards = ({ account, chainId, args, enabled = true }: UseHarvestAngleRewards) => {
  const { chain } = useNetwork()
  const prepare = usePrepareContractWrite({
    chainId,
    abi: DistributionCreator,
    address: '0x8BB4C975Ff3c250e0ceEA271728547f3802B36Fd',
    functionName: 'signAndCreateDistribution',
    args: args ? args : undefined,
    enabled: Boolean(enabled && args && chainId === chain?.id),
  })

  const onSettled = useCallback(
    (data: SendTransactionResult | undefined, e: Error | null) => {
      if (e instanceof Error) {
        if (!(e instanceof UserRejectedRequestError)) {
          createErrorToast(e.message, true)
        }
      }

      if (data) {
        const ts = new Date().getTime()
        void createToast({
          account,
          type: 'approval',
          chainId,
          txHash: data.hash,
          promise: waitForTransaction({ hash: data.hash }),
          summary: {
            pending: 'Harvesting rewards',
            completed: 'Successfully harvested rewards',
            failed: 'Something went wrong harvesting rewards',
          },
          groupTimestamp: ts,
          timestamp: ts,
        })
      }
    },
    [account, chainId]
  )

  return {
    prepare,
    write: useContractWrite({
      ...prepare.config,
      onSettled,
    }),
  }
}
