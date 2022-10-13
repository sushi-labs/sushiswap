import { ErrorCode } from '@ethersproject/logger'
import { TransactionRequest } from '@ethersproject/providers'
import { createErrorToast } from '@sushiswap/ui'
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react'
import { ProviderRpcError, usePrepareSendTransaction, useSendTransaction as useSendTransaction_ } from 'wagmi'
import { SendTransactionArgs, SendTransactionResult } from 'wagmi/actions'
import {
  UseSendTransactionArgs,
  UseSendTransactionConfig,
} from 'wagmi/dist/declarations/src/hooks/transactions/useSendTransaction'

export function useSendTransaction<Args extends UseSendTransactionArgs = UseSendTransactionArgs>({
  chainId,
  onError,
  onMutate,
  onSuccess,
  onSettled,
  prepare,
}: Omit<Args & UseSendTransactionConfig, 'request' | 'mode'> & {
  prepare: (request: Dispatch<SetStateAction<Partial<TransactionRequest & { to: string }>>>) => void
}) {
  const [request, setRequest] = useState<Partial<TransactionRequest & { to: string }>>({})
  const { config } = usePrepareSendTransaction({
    request,
    chainId,
  })

  const _onSettled = useCallback(
    (
      data: SendTransactionResult | undefined,
      e: ProviderRpcError | null,
      variables: SendTransactionArgs,
      context: unknown
    ) => {
      // TODO: ignore until wagmi workaround on ethers error
      // @ts-ignore
      if (e?.code !== ErrorCode.ACTION_REJECTED) {
        createErrorToast(e?.message, true)
      }

      if (onSettled) {
        onSettled(data, e, variables, context)
      }
    },
    [onSettled]
  )

  useEffect(() => {
    prepare(setRequest)
  }, [prepare])

  return useSendTransaction_({
    ...config,
    chainId,
    onError,
    onMutate,
    onSuccess,
    // TODO: ignore until wagmi workaround on ethers error
    // @ts-ignore
    onSettled: _onSettled,
  })
}
