'use client'

import type { BladePool } from '@sushiswap/graph-client/data-api'
import { createErrorToast, createToast } from '@sushiswap/notifications'
import { useCallback, useMemo, useState } from 'react'
import { logger } from 'src/lib/logger'
import { isUserRejectedError } from 'src/lib/wagmi/errors'
import {
  useConnection,
  usePublicClient,
  useSimulateContract,
  useWriteContract,
} from 'wagmi'
import type { SendTransactionReturnType } from 'wagmi/actions'
import { bladeCommonExchangeAbi } from './abi/bladeCommonExchange'

interface UseUnlockDepositParams {
  pool: Pick<BladePool, 'address' | 'chainId'>
  enabled?: boolean
  onSuccess?: () => void
}

export const useUnlockDeposit = ({
  pool,
  enabled = true,
  onSuccess,
}: UseUnlockDepositParams) => {
  const { address } = useConnection()
  const [isPending, setPending] = useState(false)
  const client = usePublicClient()

  const simulationEnabled = Boolean(enabled && address && pool?.address)

  const { data: simulation } = useSimulateContract({
    chainId: pool.chainId,
    address: pool.address,
    abi: bladeCommonExchangeAbi,
    functionName: 'unlockDeposit',
    query: { enabled: simulationEnabled },
  })

  const onSuccessCallback = useCallback(
    async (data: SendTransactionReturnType) => {
      if (!pool) return

      setPending(true)
      try {
        const ts = new Date().getTime()
        const receiptPromise = client.waitForTransactionReceipt({
          hash: data,
        })

        void createToast({
          account: address,
          type: 'mint',
          chainId: pool.chainId,
          txHash: data,
          promise: receiptPromise,
          summary: {
            pending: 'Unlocking Blade position...',
            completed: 'Successfully unlocked Blade position',
            failed: 'Something went wrong when unlocking position',
          },
          groupTimestamp: ts,
          timestamp: ts,
        })

        await receiptPromise
        onSuccess?.()
      } finally {
        setPending(false)
      }
    },
    [address, client, pool, onSuccess],
  )

  const onError = useCallback((e: Error) => {
    if (!isUserRejectedError(e)) {
      logger.error(e, {
        location: 'useUnlockDeposit',
      })
      createErrorToast(e.message, true)
    }
  }, [])

  const { writeContractAsync, ...rest } = useWriteContract({
    mutation: {
      onSuccess: onSuccessCallback,
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
  }, [simulation?.request, writeContractAsync])

  return {
    ...rest,
    write,
    isPending: isPending || rest.isPending,
  }
}
