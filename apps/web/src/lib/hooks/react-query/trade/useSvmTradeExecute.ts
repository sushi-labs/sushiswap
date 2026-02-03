import type { Base64EncodedWireTransaction } from '@solana/kit'
import { useMutation } from '@tanstack/react-query'
import { getSvmRpc } from 'src/lib/svm/rpc'
import { isSvmChainId } from 'sushi/svm'
import { useWrapUnwrapTrade } from '~evm/[chainId]/(trade)/swap/_ui/common'
import type { UseSvmTradeParams } from './types'

export function useSvmTradeExecute(variables: UseSvmTradeParams) {
  const { fromToken, toToken, order, chainId, requestId, signedTransaction } =
    variables
  const resolvedRequestId = requestId ?? order?.requestId
  const isWrapUnwrap = useWrapUnwrapTrade(fromToken, toToken)

  const mutation = useMutation({
    mutationKey: [
      'executeSvmTrade',
      {
        chainId,
        requestId: resolvedRequestId,
        isWrapUnwrap,
      },
    ],
    mutationFn: async (params?: {
      requestId?: string
      signedTransaction?: string
    }) => {
      if (!chainId || !isSvmChainId(chainId)) {
        throw new Error('Unsupported SVM chainId')
      }

      const resolvedSignedTransaction =
        params?.signedTransaction ?? signedTransaction

      if (!resolvedSignedTransaction) {
        throw new Error('Missing signed transaction for SVM trade execute')
      }

      if (isWrapUnwrap) {
        const rpc = getSvmRpc()
        const signature = await rpc
          .sendTransaction(
            resolvedSignedTransaction as Base64EncodedWireTransaction,
            { encoding: 'base64' },
          )
          .send()

        return signature
      }

      const resolvedRequestId =
        params?.requestId ?? requestId ?? order?.requestId

      if (!resolvedRequestId) {
        throw new Error('Missing requestId for SVM trade execute')
      }

      const body: Record<string, unknown> = {
        requestId: resolvedRequestId,
        signedTransaction: resolvedSignedTransaction,
      }

      const res = await fetch(`/api/jupiter/ultra/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        throw new Error(`Jupiter execute failed: ${res.statusText}`)
      }

      // const json = await res.json()
      // const parsed = svmExecuteValidator.parse(json)

      return resolvedSignedTransaction
    },
    retry: false,
  })

  return mutation
}
