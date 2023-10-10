import { ChainId } from 'sushi/chain'
import { createErrorToast, createToast } from '@sushiswap/ui/components/toast'
import { useCallback } from 'react'
import { UserRejectedRequestError } from 'viem'
import {
  Address,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
} from 'wagmi'
import { SendTransactionResult, waitForTransaction } from 'wagmi/actions'

import { ERC1967Proxy } from '../abis'

interface UseHarvestAngleRewards {
  account: Address | undefined
  chainId: ChainId
  enabled?: boolean
  args:
    | {
        users: Address[]
        tokens: Address[]
        claims: bigint[]
        proofs: `0x${string}`[][]
      }
    | undefined
}

export const useHarvestAngleRewards = ({
  account,
  chainId,
  args,
  enabled = true,
}: UseHarvestAngleRewards) => {
  const { chain } = useNetwork()
  const { config } = usePrepareContractWrite({
    chainId,
    abi: ERC1967Proxy,
    address: '0x3Ef3D8bA38EBe18DB133cEc108f4D14CE00Dd9Ae',
    functionName: 'claim',
    args: args
      ? [args.users, args.tokens, args.claims, args.proofs]
      : undefined,
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
    [account, chainId],
  )

  return useContractWrite({
    ...config,
    onSettled,
  })
}
