'use client'

import { createErrorToast, createToast } from '@sushiswap/notifications'
import { InterfaceEventName, sendAnalyticsEvent } from '@sushiswap/telemetry'
import { useCallback, useMemo } from 'react'
import { logger } from 'src/lib/logger'
import type { Amount } from 'sushi'
import { type EvmCurrency, weth9Abi_deposit } from 'sushi/evm'
import { type SendTransactionReturnType, UserRejectedRequestError } from 'viem'
import {
  useAccount,
  usePublicClient,
  useSimulateContract,
  useWriteContract,
} from 'wagmi'

interface UseWrapNativeParams {
  amount: Amount<EvmCurrency> | undefined
  enabled?: boolean
}

export const useWrapNative = ({
  amount,
  enabled = true,
}: UseWrapNativeParams) => {
  const { address } = useAccount()
  const client = usePublicClient()

  const onError = useCallback((e: Error) => {
    if (e.cause instanceof UserRejectedRequestError) {
      return
    }

    logger.error(e, {
      location: 'useWrapNative',
      action: 'mutationError',
    })
    createErrorToast(e?.message, true)
  }, [])

  const onSuccess = useCallback(
    async (data: SendTransactionReturnType) => {
      if (!amount) return

      sendAnalyticsEvent(InterfaceEventName.WRAP_TOKEN_TXN_SUBMITTED, {
        chain_id: amount.currency.chainId,
        token_address: amount.currency.wrap().address,
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
      } catch (error) {
        logger.error(error, {
          location: 'useWrapNative',
          action: 'waitForReceipt',
        })
      }
    },
    [client, amount, address],
  )

  const { data: simulation } = useSimulateContract({
    chainId: amount?.currency.chainId,
    address: amount?.currency.wrap().address,
    abi: weth9Abi_deposit,
    functionName: 'deposit',
    value: amount?.amount,
    query: {
      enabled: Boolean(enabled && amount && amount.currency.type === 'native'),
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
      } catch (error) {
        if (
          error instanceof Error &&
          error.cause instanceof UserRejectedRequestError
        ) {
          return
        }
        logger.error(error, {
          location: 'useWrapNative',
          action: 'sendTransaction',
        })
      }
    }
  }, [simulation, writeContractAsync])

  return {
    ...rest,
    write,
  }
}
