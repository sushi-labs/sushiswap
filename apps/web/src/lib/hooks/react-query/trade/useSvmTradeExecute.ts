import { useTransactionSigner } from '@solana/connector'
import type { ReadonlyUint8Array } from '@solana/kit'
import { useMutation } from '@tanstack/react-query'
import { useSvmSignAndSendTransaction } from 'src/lib/svm/hooks/use-svm-sign-and-send-transaction'
import { useSvmSignTransaction } from 'src/lib/svm/hooks/use-svm-sign-transaction'
import { isSvmChainId } from 'sushi/svm'
import { useWrapUnwrapTrade } from '~evm/[chainId]/(trade)/swap/_ui/common'
import type { UseSvmTradeParams } from './types'

export function useSvmTradeExecute(variables: UseSvmTradeParams) {
  const { fromToken, toToken, order, chainId, requestId, unsignedBytes } =
    variables
  const resolvedRequestId = requestId ?? order?.requestId
  const { isWrapUnwrap } = useWrapUnwrapTrade(fromToken, toToken)
  const { signer } = useTransactionSigner()
  const { signTransaction } = useSvmSignTransaction()
  const { signAndSendTransaction } = useSvmSignAndSendTransaction()

  const mutation = useMutation({
    mutationKey: [
      'executeSvmTrade',
      {
        chainId,
        requestId: resolvedRequestId,
        isWrapUnwrap,
        signer: signer?.address,
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
        const { base58TxSig: signature } = await signAndSendTransaction(
          resolvedUnsignedBytes,
        )

        return signature
      }

      const resolvedRequestId =
        params?.requestId ?? requestId ?? order?.requestId

      if (!resolvedRequestId) {
        throw new Error('Missing requestId for SVM trade execute')
      }
      const { base58TxSig, base64SignedTx } = await signTransaction(
        resolvedUnsignedBytes,
      )

      if (!base58TxSig) {
        throw new Error('Failed to obtain transaction signature')
      }
      if (!base64SignedTx) {
        throw new Error('Failed to obtain signed transaction')
      }

      const body: Record<string, unknown> = {
        requestId: resolvedRequestId,
        signedTransaction: base64SignedTx,
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

      return base58TxSig
    },
    retry: false,
  })

  return mutation
}
