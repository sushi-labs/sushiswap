import { useQueries } from '@tanstack/react-query'
import { useCallback, useEffect, useRef, useState } from 'react'
import type {
  LayerZeroQuote,
  LayerZeroStatus,
} from 'src/lib/swap/layerzero/types'
import { z } from 'zod'
import { useRefetchBalances } from '../../../../../../_common/ui/balance-provider/use-refetch-balances'

export interface LayerZeroExecution {
  id: string
  quote: LayerZeroQuote
  txHash?: string
  sourceStatus: 'SIGNING' | 'PENDING' | 'SUCCESS' | 'FAILED'
  error?: string
}

export interface LayerZeroTrackedExecution extends LayerZeroExecution {
  delivery?: LayerZeroStatus
  statusError: boolean
}

export interface LayerZeroExecutionState {
  executions: LayerZeroTrackedExecution[]
  isSubmitting: boolean
  mutate: {
    beginExecution(id: string, quote: LayerZeroQuote): boolean
    updateExecution(
      id: string,
      update: Partial<Pick<LayerZeroExecution, 'txHash' | 'sourceStatus'>>,
    ): void
    failExecution(id: string, error: string): LayerZeroExecution | undefined
    finishSubmission(id: string): void
  }
}

const statusSchema = z.object({
  status: z.enum(['PENDING', 'SUCCESS', 'ACTION_REQUIRED']),
  destinationTxHash: z.string().optional(),
})

export function useLayerZeroExecutions(): LayerZeroExecutionState {
  const [executions, setExecutions] = useState<LayerZeroExecution[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const records = useRef<LayerZeroExecution[]>([])
  const submissionId = useRef<string | undefined>(undefined)
  const refreshed = useRef(new Set<string>())
  const { refetchChain } = useRefetchBalances()

  const beginExecution = useCallback(
    (id: string, quote: LayerZeroQuote): boolean => {
      // A bridge in flight is not a lock. Only serialize source signing/submission
      // to prevent duplicate clicks and conflicting Stellar account sequences.
      if (
        submissionId.current ||
        records.current.some((execution) => execution.id === id)
      )
        return false
      submissionId.current = id
      setIsSubmitting(true)
      records.current = [
        ...records.current,
        { id, quote, sourceStatus: 'SIGNING' },
      ]
      setExecutions(records.current)
      return true
    },
    [],
  )

  const updateExecution = useCallback(
    (
      id: string,
      update: Partial<Pick<LayerZeroExecution, 'txHash' | 'sourceStatus'>>,
    ): void => {
      records.current = records.current.map((execution) =>
        execution.id === id ? { ...execution, ...update } : execution,
      )
      setExecutions(records.current)
    },
    [],
  )

  const failExecution = useCallback(
    (id: string, error: string): LayerZeroExecution | undefined => {
      records.current = records.current.map((execution) =>
        execution.id === id
          ? {
              ...execution,
              error,
              // A timeout after broadcast is not proof that the transfer failed.
              sourceStatus: execution.txHash
                ? execution.sourceStatus
                : 'FAILED',
            }
          : execution,
      )
      setExecutions(records.current)
      return records.current.find((execution) => execution.id === id)
    },
    [],
  )

  const finishSubmission = useCallback((id: string): void => {
    if (submissionId.current !== id) return
    submissionId.current = undefined
    setIsSubmitting(false)
  }, [])

  const statuses = useQueries({
    queries: executions.map((execution) => ({
      queryKey: [
        'layerzero-status',
        execution.quote.fromChainId,
        execution.quote.toChainId,
        execution.txHash,
        execution.id,
      ],
      queryFn: async ({ signal }: { signal: AbortSignal }) => {
        if (!execution.txHash)
          throw new Error('No submitted LayerZero transfer')
        const params = new URLSearchParams({
          txHash: execution.txHash,
          fromChainId: String(execution.quote.fromChainId),
          toChainId: String(execution.quote.toChainId),
        })
        const response = await fetch(
          `/api/cross-chain/layerzero/status?${params}`,
          { signal },
        )
        if (!response.ok) throw new Error('LayerZero status unavailable')
        return statusSchema.parse(await response.json())
      },
      enabled: Boolean(execution.txHash && execution.sourceStatus !== 'FAILED'),
      refetchInterval: (query: { state: { data?: LayerZeroStatus } }) =>
        query.state.data?.status === 'SUCCESS' ? false : 5_000,
    })),
  })

  useEffect(() => {
    executions.forEach((execution, index) => {
      if (
        statuses[index]?.data?.status !== 'SUCCESS' ||
        refreshed.current.has(execution.id)
      )
        return
      refreshed.current.add(execution.id)
      refetchChain(execution.quote.toChainId)
    })
  }, [executions, statuses, refetchChain])

  return {
    executions: executions.map((execution, index) => ({
      ...execution,
      delivery: statuses[index]?.data,
      statusError: Boolean(statuses[index]?.isError),
    })),
    isSubmitting,
    mutate: {
      beginExecution,
      updateExecution,
      failExecution,
      finishSubmission,
    },
  }
}
