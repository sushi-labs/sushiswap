'use client'

import { createErrorToast, createToast } from '@sushiswap/notifications'
import { useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { logger } from 'src/lib/logger'
import { onV4PositionFeesCollected } from 'src/lib/pool/v4'
import { isUserRejectedError } from 'src/lib/wagmi/errors'
import { waitForSuccessfulReceipt } from 'src/lib/wagmi/transactions/wait-for-successful-receipt'
import {
  SUSHISWAP_V4_CL_POSITION_MANAGER,
  type SushiSwapV4ChainId,
  type SushiSwapV4MethodParameters,
} from 'sushi/evm'
import type { SendTransactionReturnType } from 'viem'
import {
  type UseCallParameters,
  useCall,
  useConnection,
  usePublicClient,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from 'wagmi'
import { useRefetchBalances } from '~evm/_common/ui/balance-provider/use-refetch-balances'

interface UseV4PositionTransactionParams {
  chainId: SushiSwapV4ChainId
  tokenId: bigint
  call: SushiSwapV4MethodParameters | undefined
  toast: {
    type: 'burn' | 'claimRewards'
    pending: string
    completed: string
    failed: string
  }
  location: string
}

interface UseV4PositionTransactionResult {
  /** Sends the call, then runs `onSent`; unset until there is a call. */
  send: ((onSent?: () => void) => Promise<void>) | undefined
  isPending: boolean
  isSimulationError: boolean
  hash: SendTransactionReturnType | undefined
  status: ReturnType<typeof useWaitForTransactionReceipt>['status']
}

/** Simulates and sends a position manager call, then refreshes the position. */
export function useV4PositionTransaction({
  chainId,
  tokenId,
  call,
  toast,
  location,
}: UseV4PositionTransactionParams): UseV4PositionTransactionResult {
  const { address, chain } = useConnection()
  const client = usePublicClient({ chainId })
  const queryClient = useQueryClient()
  const { refetchChain: refetchBalances } = useRefetchBalances()

  const prepare = useMemo(() => {
    if (!address || !call) return undefined
    return {
      to: SUSHISWAP_V4_CL_POSITION_MANAGER[chainId],
      account: address,
      chainId,
      data: call.calldata,
      value: call.value,
    } as const satisfies UseCallParameters
  }, [address, call, chainId])

  const { isError: isSimulationError } = useCall({
    ...prepare,
    query: { enabled: Boolean(prepare && chainId === chain?.id) },
  })

  const {
    mutateAsync,
    isPending,
    data: hash,
  } = useSendTransaction({
    mutation: {
      onSuccess(hash) {
        // Rejects if the transaction reverts or is replaced
        const receipt = waitForSuccessfulReceipt(client, hash)
        receipt.then(
          () => {
            refetchBalances(chainId)
            onV4PositionFeesCollected(queryClient, { chainId, tokenId })
          },
          () => {},
        )

        const { type, ...summary } = toast
        const ts = Date.now()
        void createToast({
          account: address,
          type,
          chainId,
          txHash: hash,
          promise: receipt,
          summary,
          timestamp: ts,
          groupTimestamp: ts,
        })
      },
      onError(e) {
        if (isUserRejectedError(e)) return
        logger.error(e, { location, action: 'mutationError' })
        createErrorToast(e?.message, true)
      },
    },
  })

  const { status } = useWaitForTransactionReceipt({ chainId, hash })

  // A failed simulation shows as an error but does not block a retry
  const send = prepare
    ? async (onSent?: () => void) => {
        try {
          await mutateAsync(prepare)
          onSent?.()
        } catch {}
      }
    : undefined

  return { send, isPending, isSimulationError, hash, status }
}
