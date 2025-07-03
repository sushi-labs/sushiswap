'use client'

import { createErrorToast, createToast } from '@sushiswap/notifications'
import { useCallback, useMemo, useState } from 'react'
import { permit2Abi_approve } from 'sushi/abi'
import type { Amount, Type } from 'sushi/currency'
import {
  type Address,
  type SendTransactionReturnType,
  UserRejectedRequestError,
} from 'viem'
import {
  useAccount,
  usePublicClient,
  useSimulateContract,
  useWriteContract,
} from 'wagmi'
import { PERMIT2_ADDRESS, type Permit2ChainId } from './config'
import { PERMIT_EXPIRATION } from './constants'
import { usePermit2Allowance } from './usePermit2Allowance'
import { toDeadline } from './utils'

export enum ApprovalState {
  LOADING = 'LOADING',
  UNKNOWN = 'UNKNOWN',
  NOT_APPROVED = 'NOT_APPROVED',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
}

interface UsePermit2Params {
  chainId: Permit2ChainId
  spender: Address | undefined
  amount: Amount<Type> | undefined
  enabled?: boolean
}

export const usePermit2Approve = ({
  chainId,
  amount,
  spender,
  enabled = true,
}: UsePermit2Params) => {
  const { address } = useAccount()
  const [pending, setPending] = useState(false)
  const client = usePublicClient()
  const {
    data: allowance,
    isLoading: isAllowanceLoading,
    refetch,
  } = usePermit2Allowance({
    token: amount?.currency.wrapped,
    owner: address,
    spender,
    chainId,
    enabled: Boolean(amount?.currency?.isToken && enabled),
  })

  const { data: simulation } = useSimulateContract({
    chainId,
    abi: permit2Abi_approve,
    address: PERMIT2_ADDRESS[chainId],
    functionName: 'approve',
    args: [
      amount?.currency.wrapped.address as Address,
      spender as Address,
      amount?.quotient as bigint,
      toDeadline(PERMIT_EXPIRATION),
    ],
    query: {
      enabled: Boolean(
        enabled &&
          amount &&
          spender &&
          address &&
          allowance &&
          !isAllowanceLoading,
      ),
    },
  })

  const onSuccess = useCallback(
    async (data: SendTransactionReturnType) => {
      if (!amount) return

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
            pending: `Permitting ${amount.currency.symbol}`,
            completed: `Successfully permitted ${amount.currency.symbol}`,
            failed: `Something went wrong permitting ${amount.currency.symbol}`,
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
    if (e instanceof Error) {
      if (!(e.cause instanceof UserRejectedRequestError)) {
        createErrorToast(e.message, true)
      }
    }
  }, [])

  const execute = useWriteContract({
    mutation: {
      onError,
      onSuccess,
    },
  })

  const write = useMemo(() => {
    if (!execute.writeContract || !simulation?.request) return

    return () => execute.writeContract(simulation.request)
  }, [execute.writeContract, simulation?.request])

  return useMemo<[ApprovalState, { write: undefined | (() => void) }]>(() => {
    let state = ApprovalState.UNKNOWN
    if (amount?.currency.isNative) state = ApprovalState.APPROVED
    else if (allowance && amount && allowance.greaterThan(amount))
      state = ApprovalState.APPROVED
    else if (allowance && amount && allowance.equalTo(amount))
      state = ApprovalState.APPROVED
    else if (pending) state = ApprovalState.PENDING
    else if (isAllowanceLoading) state = ApprovalState.LOADING
    else if (allowance && amount && allowance.lessThan(amount))
      state = ApprovalState.NOT_APPROVED

    return [state, { write }]
  }, [allowance, amount, write, isAllowanceLoading, pending])
}
