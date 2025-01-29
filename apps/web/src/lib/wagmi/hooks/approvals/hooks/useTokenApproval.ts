'use client'

import { createErrorToast, createToast } from '@sushiswap/notifications'
import { InterfaceEventName, sendAnalyticsEvent } from '@sushiswap/telemetry'
import { useCallback, useMemo, useState } from 'react'
import { EvmChainId } from 'sushi'
import { erc20Abi_approve } from 'sushi/abi'
import { Amount, Token, Type } from 'sushi/currency'
import { USDT_ADDRESS } from 'sushi/currency'
import {
  Address,
  SendTransactionReturnType,
  UserRejectedRequestError,
  maxUint256,
} from 'viem'
import {
  useAccount,
  usePublicClient,
  useSimulateContract,
  useWriteContract,
} from 'wagmi'

import { ERC20ApproveABI, ERC20ApproveArgs } from './types'
import { useTokenAllowance } from './useTokenAllowance'

export enum ApprovalState {
  LOADING = 'LOADING',
  UNKNOWN = 'UNKNOWN',
  NOT_APPROVED = 'NOT_APPROVED',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
}

interface UseTokenApprovalParams {
  spender: Address | undefined
  amount: Amount<Type> | undefined
  approveMax?: boolean
  enabled?: boolean
}

function getApprovaAmount(
  amount: Amount<Type> | undefined,
  approveMax: boolean | undefined,
  allowance: Amount<Token> | undefined,
): bigint {
  if (!amount || !allowance) {
    return 0n
  }

  const isMainnetTether =
    amount.currency.chainId === EvmChainId.ETHEREUM &&
    amount.currency.wrapped.address === USDT_ADDRESS[EvmChainId.ETHEREUM]

  // USDT on Ethereum mainnet is a special case where we can't go from N to M (where N != 0)
  // without going to 0 first.
  if (isMainnetTether && allowance.quotient !== 0n) {
    return 0n
  }

  if (approveMax) {
    return maxUint256
  }

  return amount.quotient
}

export const useTokenApproval = ({
  amount,
  spender,
  enabled = true,
  approveMax,
}: UseTokenApprovalParams) => {
  const { address } = useAccount()
  const [pending, setPending] = useState(false)
  const client = usePublicClient()
  const {
    data: allowance,
    isLoading: isAllowanceLoading,
    refetch,
  } = useTokenAllowance({
    token: amount?.currency?.wrapped,
    owner: address,
    spender,
    chainId: amount?.currency.chainId,
    enabled: Boolean(amount?.currency?.isToken && enabled),
  })

  const { data: simulation } = useSimulateContract<
    ERC20ApproveABI,
    'approve',
    ERC20ApproveArgs
  >({
    chainId: amount?.currency.chainId,
    abi: erc20Abi_approve,
    address: amount?.currency?.wrapped?.address as Address,
    functionName: 'approve',
    args: [spender as Address, getApprovaAmount(amount, approveMax, allowance)],
    query: {
      enabled: Boolean(
        amount &&
          spender &&
          address &&
          allowance &&
          enabled &&
          !isAllowanceLoading,
      ),
    },
  })

  const onSuccess = useCallback(
    async (data: SendTransactionReturnType) => {
      if (!amount) return

      sendAnalyticsEvent(InterfaceEventName.APPROVE_TOKEN_TXN_SUBMITTED, {
        chain_id: amount.currency.chainId,
        token_address: amount.currency.wrapped.address,
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
    if (e instanceof Error) {
      if (!(e.cause instanceof UserRejectedRequestError)) {
        createErrorToast(e.message, true)
      }
    }
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
      if (!execute.writeContract || !simulation?.request) return

      return () => execute.writeContract(simulation.request as any)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [execute.writeContract, simulation?.request] as const,
  )

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
