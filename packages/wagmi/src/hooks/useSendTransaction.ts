'use client'

import {
  usePrepareSendTransaction,
  useSendTransaction as useSendTransaction_,
} from 'wagmi'

export type UsePrepareSendTransactionConfig = Parameters<
  typeof usePrepareSendTransaction
>['0']
export type UseSendTransactionConfig = Parameters<
  typeof useSendTransaction_
>['0']

interface UseSendTransaction {
  prepare?: UsePrepareSendTransactionConfig
  send?: UseSendTransactionConfig
  gasMargin?: boolean
}

export function useSendTransaction({
  prepare,
  send,
  gasMargin = false,
}: UseSendTransaction) {
  const { config } = usePrepareSendTransaction(prepare)

  const gas = gasMargin && config.gas ? (config.gas * 120n) / 100n : config.gas

  return useSendTransaction_({
    ...config,
    gas,
    ...send,
    onSettled: (data, e, variables, context) => {
      // if (e?.code !== ErrorCode.ACTION_REJECTED) {
      //   createErrorToast(e?.message, true)
      // }

      if (send?.onSettled) {
        send.onSettled(data, e, variables, context)
      }
    },
    mode: 'prepared',
  })
}
