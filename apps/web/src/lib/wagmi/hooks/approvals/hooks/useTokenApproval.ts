'use client'

import { createErrorToast, createToast } from '@sushiswap/notifications'
import { InterfaceEventName, sendAnalyticsEvent } from '@sushiswap/telemetry'
import { useCallback, useMemo, useState } from 'react'
import { logger } from 'src/lib/logger'
import { isUserRejectedError } from 'src/lib/wagmi/errors'
import type { Amount } from 'sushi'
import { type EvmAddress, type EvmCurrency, erc20Abi_approve } from 'sushi/evm'
import {
  ContractFunctionZeroDataError,
  type SendTransactionReturnType,
  maxUint256,
} from 'viem'
import {
  useConnection,
  usePublicClient,
  useSimulateContract,
  useWriteContract,
} from 'wagmi'
import {
  type ERC20ApproveABI,
  type ERC20ApproveArgs,
  type OLD_ERC20ApproveABI,
  old_erc20Abi_approve,
} from './types'
import { useTokenAllowance } from './useTokenAllowance'

export enum ApprovalState {
  LOADING = 'LOADING',
  UNKNOWN = 'UNKNOWN',
  NOT_APPROVED = 'NOT_APPROVED',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
}

interface UseTokenApprovalParams {
  spender: EvmAddress | undefined
  amount: Amount<EvmCurrency> | undefined
  approveMax?: boolean
  enabled?: boolean
}

export const useTokenApproval = ({
  amount,
  spender,
  enabled = true,
  approveMax,
}: UseTokenApprovalParams) => {
  const { address } = useConnection()
  const [pending, setPending] = useState(false)
  const client = usePublicClient()
  const {
    data: allowance,
    isLoading: isAllowanceLoading,
    refetch,
  } = useTokenAllowance({
    token: amount?.currency?.wrap(),
    owner: address,
    spender,
    chainId: amount?.currency.chainId,
    enabled: Boolean(amount?.currency?.type === 'token' && enabled),
  })

  const [fallback, setFallback] = useState(false)

  const simulationEnabled = Boolean(
    amount && spender && address && allowance && enabled && !isAllowanceLoading,
  )

  const standardSimulation = useSimulateContract<
    ERC20ApproveABI,
    'approve',
    ERC20ApproveArgs
  >({
    chainId: amount?.currency.chainId,
    abi: erc20Abi_approve,
    address: amount?.currency.wrap().address,
    functionName: 'approve',
    args: [
      spender as EvmAddress,
      approveMax ? maxUint256 : amount ? amount.amount : 0n,
    ],
    scopeKey: 'approve-std',
    query: {
      enabled: simulationEnabled && !fallback,
      retry: (failureCount, error) => {
        if (
          error instanceof ContractFunctionZeroDataError ||
          error.cause instanceof ContractFunctionZeroDataError
        ) {
          setFallback(true)
          return false
        }
        return failureCount < 2
      },
    },
  })

  const fallbackSimulation = useSimulateContract<
    OLD_ERC20ApproveABI,
    'approve',
    ERC20ApproveArgs
  >({
    chainId: amount?.currency.chainId,
    abi: old_erc20Abi_approve,
    address: amount?.currency.wrap().address,
    functionName: 'approve',
    args: [spender, approveMax ? maxUint256 : amount ? amount.amount : 0n],
    scopeKey: 'approve-fallback',
    query: {
      enabled: simulationEnabled && fallback,
    },
  })

  const { data: simulation } = fallback
    ? fallbackSimulation
    : standardSimulation

  const onSuccess = useCallback(
    async (data: SendTransactionReturnType) => {
      if (!amount) return

      sendAnalyticsEvent(InterfaceEventName.APPROVE_TOKEN_TXN_SUBMITTED, {
        chain_id: amount.currency.chainId,
        token_address: amount.currency.wrap().address,
        token_symbol: amount.currency.symbol,
      })
      setPending(true)
      try {
        const ts = new Date().getTime()
        const receiptPromise = client.waitForTransactionReceipt({
          hash: data,
        })

        void createToast({
          account: address,
          type: 'approval',
          chainId: amount.currency.chainId,
          txHash: data,
          promise: receiptPromise,
          summary: {
            pending: `Approving ${amount.currency.symbol}`,
            completed: `Successfully approved ${amount.currency.symbol}`,
            failed: `Something went wrong approving ${amount.currency.symbol}`,
          },
          groupTimestamp: ts,
          timestamp: ts,
        })

        await receiptPromise
        await refetch()
      } finally {
        setPending(false)
      }
    },
    [refetch, client, amount, address],
  )

  const onError = useCallback((e: Error) => {
    if (isUserRejectedError(e)) {
      return
    }

    logger.error(e, {
      location: 'useTokenApproval',
      action: 'mutationError',
    })
    createErrorToast(e.message, true)
  }, [])

  const execute = useWriteContract({
    // ...data?.request,
    mutation: {
      onError,
      onSuccess,
    },
  })

  // biome-ignore lint/correctness/useExhaustiveDependencies: Typecheck speedup
  const write = useMemo(
    () => {
      if (!execute.mutate || !simulation?.request) return

      return () => execute.mutate(simulation.request as any)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [execute.mutate, simulation?.request] as const,
  )

  return useMemo<[ApprovalState, { write: undefined | (() => void) }]>(() => {
    let state = ApprovalState.UNKNOWN
    if (amount?.currency.type === 'native') state = ApprovalState.APPROVED
    else if (allowance && amount && allowance.gt(amount))
      state = ApprovalState.APPROVED
    else if (allowance && amount && allowance.eq(amount))
      state = ApprovalState.APPROVED
    else if (pending) state = ApprovalState.PENDING
    else if (isAllowanceLoading) state = ApprovalState.LOADING
    else if (allowance && amount && allowance.lt(amount))
      state = ApprovalState.NOT_APPROVED

    return [state, { write }]
  }, [allowance, amount, write, isAllowanceLoading, pending])
}
