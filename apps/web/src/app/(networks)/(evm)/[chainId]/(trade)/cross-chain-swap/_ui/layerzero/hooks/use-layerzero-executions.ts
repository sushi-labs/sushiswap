import { useQueries } from '@tanstack/react-query'
import ms from 'ms'
import { useCallback, useEffect, useRef, useState } from 'react'
import { valueTransferStatusResponseSchema } from 'src/lib/swap/value-transfer/schemas'
import type { ValueTransferTrade } from 'src/lib/swap/value-transfer/trade'
import { useRefetchBalances } from '../../../../../../_common/ui/balance-provider/use-refetch-balances'

export interface LayerZeroExecution {
  id: string
  quote: ValueTransferTrade
  txHash?: string
  submitted?: boolean
  sourceStatus: 'SIGNING' | 'PENDING' | 'SUCCESS' | 'FAILED'
  error?: string
}

type LayerZeroExecutionUpdate = Partial<
  Pick<LayerZeroExecution, 'txHash' | 'sourceStatus' | 'submitted'>
>

export interface LayerZeroTrackedExecution extends LayerZeroExecution {
  delivery?: LayerZeroDeliveryStatus
  statusError: boolean
}

export interface LayerZeroExecutionState {
  executions: LayerZeroTrackedExecution[]
  isSubmitting: boolean
  mutate: {
    beginExecution(id: string, quote: ValueTransferTrade): boolean
    updateExecution(id: string, update: LayerZeroExecutionUpdate): void
    failExecution(id: string, error: string): LayerZeroExecution | undefined
    finishSubmission(id: string): void
  }
}

export interface LayerZeroDeliveryStatus {
  status: 'PENDING' | 'SUCCESS' | 'ACTION_REQUIRED'
  destinationTxHash?: string
  sourceTxHash?: string
  explorerUrl?: string
  terminal: boolean
}

export function useLayerZeroExecutions(): LayerZeroExecutionState {
  const [executions, setExecutions] = useState<LayerZeroExecution[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const records = useRef<LayerZeroExecution[]>([])
  const submissionId = useRef<string | undefined>(undefined)
  const refreshed = useRef(new Set<string>())
  const { refetchChain } = useRefetchBalances()

  const beginExecution = useCallback(
    (id: string, quote: ValueTransferTrade): boolean => {
      // A bridge in flight is not a lock. Only serialize source signing/submission
      // to prevent duplicate clicks and conflicting Stellar account sequences.
      if (
        submissionId.current ||
        records.current.some(
          (execution) =>
            execution.id === id ||
            (execution.quote.quote.id === quote.quote.id &&
              execution.submitted),
        )
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
    (id: string, update: LayerZeroExecutionUpdate): void => {
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
              sourceStatus:
                execution.txHash || execution.submitted
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
        'value-transfer-status',
        execution.quote.quote.id,
        execution.txHash,
        execution.id,
      ],
      queryFn: async ({
        signal,
      }: { signal: AbortSignal }): Promise<LayerZeroDeliveryStatus> => {
        const params = new URLSearchParams({
          quoteId: execution.quote.quote.id,
        })
        if (execution.txHash) params.set('txHash', execution.txHash)
        const response = await fetch(
          `/api/cross-chain/value-transfer/status?${params}`,
          { signal },
        )
        if (!response.ok) throw new Error('LayerZero status unavailable')
        const result = valueTransferStatusResponseSchema.parse(
          await response.json(),
        )
        const history = result.executionHistory ?? []
        return {
          status:
            result.status === 'SUCCEEDED'
              ? 'SUCCESS'
              : result.status === 'FAILED'
                ? 'ACTION_REQUIRED'
                : 'PENDING',
          terminal: result.status === 'SUCCEEDED' || result.status === 'FAILED',
          sourceTxHash: history.findLast(
            ({ transaction }) =>
              transaction.chainKey === execution.quote.srcChain.chainKey,
          )?.transaction.hash,
          destinationTxHash: history.findLast(
            ({ transaction }) =>
              transaction.chainKey === execution.quote.dstChain.chainKey,
          )?.transaction.hash,
          explorerUrl: result.explorerUrl,
        }
      },
      enabled: Boolean(
        (execution.txHash || execution.submitted) &&
          execution.sourceStatus !== 'FAILED',
      ),
      refetchInterval: (query: {
        state: { data?: LayerZeroDeliveryStatus }
      }) => (query.state.data?.terminal ? false : ms('5s')),
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
      txHash: execution.txHash ?? statuses[index]?.data?.sourceTxHash,
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
