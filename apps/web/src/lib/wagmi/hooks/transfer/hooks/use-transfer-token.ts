'use client'

import { createErrorToast, createToast } from '@sushiswap/notifications'
import { useCallback, useMemo, useState } from 'react'
import { erc20Abi_transfer } from 'sushi/abi'
import type { Amount, Type } from 'sushi/currency'
import {
  type Address,
  ContractFunctionZeroDataError,
  type SendTransactionReturnType,
  UserRejectedRequestError,
} from 'viem'
import {
  useAccount,
  useFeeHistory,
  usePublicClient,
  useSendTransaction,
  useSimulateContract,
  useWriteContract,
} from 'wagmi'

export enum TransferState {
  UNKNOWN = 'UNKNOWN',
  NOT_TRANSFERED = 'NOT_TRANSFERED',
  PENDING = 'PENDING',
  TRANSFERED = 'TRANSFERED',
}

interface UseTokenTransferParams {
  sendTo: Address | undefined
  amount: Amount<Type> | undefined
  enabled?: boolean
}

export type ERC20TransferABI = typeof erc20Abi_transfer
export type ERC20TransferArgs = [Address, bigint]

export const useTransferToken = ({
  amount,
  sendTo,
  enabled = true,
}: UseTokenTransferParams) => {
  const { address } = useAccount()
  const [pending, setPending] = useState(false)
  const [success, setSuccess] = useState(false)
  const client = usePublicClient()

  const simulationEnabled = Boolean(
    amount?.currency?.isToken &&
      amount?.greaterThan(0) &&
      sendTo &&
      address &&
      enabled,
  )

  const simulation = useSimulateContract<
    ERC20TransferABI,
    'transfer',
    ERC20TransferArgs
  >({
    chainId: amount?.currency.chainId,
    abi: erc20Abi_transfer,
    address: amount?.currency?.wrapped?.address as Address,
    functionName: 'transfer',
    args: [sendTo as Address, amount ? amount.quotient : 0n],
    scopeKey: 'transfer-std',
    query: {
      enabled: simulationEnabled,
      retry: (failureCount, error) => {
        if (
          error instanceof ContractFunctionZeroDataError ||
          error.cause instanceof ContractFunctionZeroDataError
        ) {
          return false
        }
        return failureCount < 2
      },
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
          type: 'send',
          chainId: amount.currency.chainId,
          txHash: data,
          promise: receiptPromise,
          summary: {
            pending: `Sending ${amount.currency.symbol}`,
            completed: `Successfully sent ${amount.toExact()} ${amount.currency.symbol}`,
            failed: `Something went wrong sending ${amount.currency.symbol}`,
          },
          groupTimestamp: ts,
          timestamp: ts,
        })

        await receiptPromise
        setSuccess(true)
      } finally {
        setPending(false)
      }
    },
    [client, amount, address],
  )

  const onError = useCallback((e: Error) => {
    setPending(false)
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

  const nativeTx = useSendTransaction({
    mutation: {
      onSuccess,
      onError,
    },
  })

  // biome-ignore lint/correctness/useExhaustiveDependencies: Typecheck speedup
  const write = useMemo(
    () => {
      if (!amount || !sendTo || !address) return

      if (amount?.currency?.isNative) {
        return () => {
          nativeTx.sendTransaction({
            to: sendTo,
            value: amount.quotient,
            account: address,
          })
          setSuccess(false)
          setPending(true)
        }
      }

      if (execute.writeContract && simulation?.data?.request) {
        return () => {
          execute.writeContract(simulation.data.request)
          setSuccess(false)
          setPending(true)
        }
      }
    },
    [
      execute.writeContract,
      simulation?.data?.request,
      amount?.currency?.isNative,
      amount?.quotient,
      nativeTx.sendTransaction,
      sendTo,
      address,
    ] as const,
  )

  return useMemo<[TransferState, { write: undefined | (() => void) }]>(() => {
    let state = TransferState.UNKNOWN
    if (success) state = TransferState.TRANSFERED
    else if (pending) state = TransferState.PENDING
    else state = TransferState.NOT_TRANSFERED

    return [state, { write }]
  }, [write, pending, success])
}
