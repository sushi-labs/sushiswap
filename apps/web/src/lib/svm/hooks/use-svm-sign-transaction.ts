import { type SolanaTransaction, useTransactionSigner } from '@solana/connector'
import {
  type ReadonlyUint8Array,
  getSignatureFromTransaction,
  getTransactionDecoder,
} from '@solana/kit'
import { useCallback } from 'react'
import { usePrivyEmbeddedWallet } from '../../wallet/hooks/use-privy-embedded'
import { usePrivyRuntime } from '../../wallet/privy/use-privy-runtime'

function serializeSignedTransaction(
  transaction: SolanaTransaction,
): Uint8Array {
  if (transaction instanceof Uint8Array) return transaction
  if (ArrayBuffer.isView(transaction)) {
    return new Uint8Array(
      transaction.buffer,
      transaction.byteOffset,
      transaction.byteLength,
    )
  }
  if (
    'serialize' in transaction &&
    typeof transaction.serialize === 'function'
  ) {
    return transaction.serialize()
  }
  throw new Error('SVM wallet returned an unsupported signed transaction')
}

export function useSvmSignTransaction() {
  const { signer } = useTransactionSigner()
  const privyEmbedded = usePrivyEmbeddedWallet('svm')
  const { operations: privyOperations } = usePrivyRuntime()

  const signTransaction = useCallback(
    async (transaction: ReadonlyUint8Array<ArrayBuffer>) => {
      if (!signer) throw new Error('SVM wallet signer is unavailable')
      const isPrivySigner =
        privyEmbedded?.address.toLowerCase() === signer.address.toLowerCase()
      const signedTransaction = isPrivySigner
        ? (
            await privyOperations?.signSvmTransaction({
              transaction: new Uint8Array(transaction),
              address: privyEmbedded.address,
            })
          )?.signedTransaction
        : serializeSignedTransaction(await signer.signTransaction(transaction))
      if (!signedTransaction) throw new Error('Privy runtime is unavailable')
      const base58TxSig = getSignatureFromTransaction(
        getTransactionDecoder().decode(signedTransaction),
      )
      const base64SignedTx = Buffer.from(signedTransaction).toString('base64')
      return { base58TxSig, base64SignedTx }
    },
    [privyEmbedded, privyOperations, signer],
  )
  return { signTransaction }
}
