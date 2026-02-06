import { useTransactionSigner } from '@solana/connector'
import type {
  Base64EncodedWireTransaction,
  ReadonlyUint8Array,
} from '@solana/kit'
import { useMutation } from '@tanstack/react-query'
import { getSvmRpc } from 'src/lib/svm/rpc'
import { isSvmChainId } from 'sushi/svm'
import { useWrapUnwrapTrade } from '~evm/[chainId]/(trade)/swap/_ui/common'
import type { UseSvmTradeParams } from './types'

export function useSvmTradeExecute(variables: UseSvmTradeParams) {
  const { fromToken, toToken, order, chainId, requestId, unsignedBytes } =
    variables
  const resolvedRequestId = requestId ?? order?.requestId
  const isWrapUnwrap = useWrapUnwrapTrade(fromToken, toToken)
  const { signer } = useTransactionSigner()

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
      unsignedBytes?: ReadonlyUint8Array<ArrayBuffer>
    }) => {
      if (!chainId || !isSvmChainId(chainId)) {
        throw new Error('Unsupported SVM chainId')
      }

      const resolvedUnsignedBytes = params?.unsignedBytes ?? unsignedBytes

      if (!resolvedUnsignedBytes) {
        throw new Error('Missing unsigned bytes for SVM trade execute')
      }

      if (isWrapUnwrap) {
        const signature = await signer?.signAndSendTransaction(
          resolvedUnsignedBytes,
        )

        return signature
      }

      const resolvedRequestId =
        params?.requestId ?? requestId ?? order?.requestId

      if (!resolvedRequestId) {
        throw new Error('Missing requestId for SVM trade execute')
      }
      const resolvedSignedTransaction = await signer?.signTransaction(
        resolvedUnsignedBytes,
      )
      if (!resolvedSignedTransaction) {
        throw new Error('Failed to sign SVM transaction')
      }

      const body: Record<string, unknown> = {
        requestId: resolvedRequestId,
        signedTransaction: resolvedSignedTransaction?.toString(),
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
