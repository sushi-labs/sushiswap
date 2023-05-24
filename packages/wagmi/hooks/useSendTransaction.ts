import { ErrorCode } from '@ethersproject/logger'
import { TransactionRequest } from '@ethersproject/providers'
import { createErrorToast } from '@sushiswap/ui/future/components/toast'
import { BigNumber } from 'ethers'
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
  gasMargin = false,
}: Omit<NonNullable<Args>, 'request' | 'mode'> & {
  prepare: (request: Dispatch<SetStateAction<(TransactionRequest & { to: string }) | undefined>>) => void
  enabled?: boolean
  gasMargin?: boolean
}) {
  const [request, setRequest] = useState<(TransactionRequest & { to: string }) | undefined>()
  // console.log('useSendTransaction (wrapper) re-runing with', {
  //   request,
  //   chainId,
  //   enabled,
  // })
  const { config } = usePrepareSendTransaction({
    request,
    chainId,
    enabled,
  })
  // console.log('usePrepareSendTransaction returned config', { config })

  const _onSettled = useCallback(
    (
      data: SendTransactionResult | undefined,
      e: ProviderRpcError | null,
      variables: SendTransactionArgs,
      context: unknown
    ) => {
      // console.log('onSettled callback', { data, e, variables, context })
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
    // console.log('Prepare effect called with setRequest', setRequest)
    prepare(setRequest)
  }, [prepare])

  return useSendTransaction_({
    ...(config.request && {
      request: {
        ...config.request,
        ...(config.request.gasLimit && {
          gasLimit: BigNumber.from(config.request.gasLimit)
            .mul(gasMargin ? 120 : 100)
            .div(100),
        }),
      },
    }),
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