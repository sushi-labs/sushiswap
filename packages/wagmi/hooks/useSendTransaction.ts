import { ErrorCode } from '@ethersproject/logger'
import { TransactionRequest } from '@ethersproject/providers'
import { createErrorToast } from '@sushiswap/ui'
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react'
import { ProviderRpcError, usePrepareSendTransaction, useSendTransaction as useSendTransaction_ } from 'wagmi'
import { SendTransactionArgs, SendTransactionResult } from 'wagmi/actions'

type Args = Parameters<typeof useSendTransaction_>['0']

export function useSendTransaction({
  chainId,
  onError,
  onMutate,
  onSuccess,
  onSettled,
  prepare,
  enabled = true,
}: Omit<NonNullable<Args>, 'request' | 'mode'> & {
  prepare: (request: Dispatch<SetStateAction<(TransactionRequest & { to: string }) | undefined>>) => void
  enabled?: boolean
}) {
  const [request, setRequest] = useState<(TransactionRequest & { to: string }) | undefined>()
  const { config } = usePrepareSendTransaction({
    request,
    chainId,
    enabled,
  })

  console.log({
    request,
    'config.setrequest': config.request,
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
    mode: 'prepared',
  })
}
