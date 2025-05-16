'use client'

import { createErrorToast, createToast } from '@sushiswap/notifications'
import { InterfaceEventName, sendAnalyticsEvent } from '@sushiswap/telemetry'
import { useCallback, useMemo, useState } from 'react'
import { weth9Abi_deposit } from 'sushi/abi'
import type { Amount, Type } from 'sushi/currency'
import { type SendTransactionReturnType, UserRejectedRequestError } from 'viem'
import {
  type UseSimulateContractParameters,
  useAccount,
  usePublicClient,
  useSimulateContract,
  useWriteContract,
} from 'wagmi'

// export enum WrapState {
//   LOADING = 'LOADING',
//   UNKNOWN = 'UNKNOWN',
//   NOT_APPROVED = 'NOT_APPROVED',
//   PENDING = 'PENDING',
//   APPROVED = 'APPROVED',
// }

interface UseWrapNativeParams {
  amount: Amount<Type> | undefined
  enabled?: boolean
}

export const useWrapNative = ({
  amount,
  enabled = true,
}: UseWrapNativeParams) => {
  const { address } = useAccount()
  const client = usePublicClient()

  const onError = useCallback((e: Error) => {
    if (!(e.cause instanceof UserRejectedRequestError)) {
      createErrorToast(e?.message, true)
    }
  }, [])

  const onSuccess = useCallback(
    async (data: SendTransactionReturnType) => {
      if (!amount) return

      sendAnalyticsEvent(InterfaceEventName.WRAP_TOKEN_TXN_SUBMITTED, {
        chain_id: amount.currency.chainId,
        token_address: amount.currency.wrapped.address,
        token_symbol: amount.currency.symbol,
      })
      try {
        const ts = new Date().getTime()
        const receiptPromise = client.waitForTransactionReceipt({
          hash: data,
        })

        void createToast({
          account: address,
          type: 'swap',
          chainId: amount.currency.chainId,
          txHash: data,
          promise: receiptPromise,
          summary: {
            pending: `Wrapping ${amount.currency.symbol}`,
            completed: `Successfully wrapped ${amount.currency.symbol}`,
            failed: `Something went wrong wrapping ${amount.currency.symbol}`,
          },
          groupTimestamp: ts,
          timestamp: ts,
        })

        await receiptPromise
      } catch {}
    },
    [client, amount, address],
  )

  const { data: simulation } = useSimulateContract({
    chainId: amount?.currency.chainId,
    address: amount?.currency.wrapped.address,
    abi: weth9Abi_deposit,
    functionName: 'deposit',
    value: amount?.quotient,
    query: {
      enabled: Boolean(enabled && amount && amount.currency.isNative),
    },
  })

  const {
    writeContractAsync,
    writeContract: _,
    ...rest
  } = useWriteContract({
    mutation: {
      onSuccess,
      onError,
    },
  })

  const write = useMemo(() => {
    if (!simulation) return undefined

    return async () => {
      try {
        await writeContractAsync(simulation.request)
      } catch {}
    }
  }, [simulation, writeContractAsync])

  return {
    ...rest,
    write,
  }
}
