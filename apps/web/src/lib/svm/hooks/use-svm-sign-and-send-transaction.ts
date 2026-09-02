import type { SendTransactionModalUIOptions } from '@privy-io/react-auth'
import { useTransactionSigner } from '@solana/connector'
import type { ReadonlyUint8Array } from '@solana/kit'
import { useCallback } from 'react'
import { usePrivyEmbeddedWallet } from '../../wallet/hooks/use-privy-embedded'
import { usePrivyRuntime } from '../../wallet/privy/use-privy-runtime'

export function useSvmSignAndSendTransaction() {
  const { signer } = useTransactionSigner()
  const privyEmbedded = usePrivyEmbeddedWallet('svm')
  const { operations: privyOperations } = usePrivyRuntime()

  const signAndSendTransaction = useCallback(
    async (
      transaction: ReadonlyUint8Array<ArrayBuffer>,
      options?: {
        uiOptions?: SendTransactionModalUIOptions
      },
    ) => {
      if (
        privyEmbedded &&
        privyEmbedded.address.toLowerCase() === signer?.address.toLowerCase()
      ) {
        const tx = await privyOperations?.signAndSendSvmTransaction({
          transaction: new Uint8Array(transaction),
          address: privyEmbedded.address,
          uiOptions: options?.uiOptions,
        })
        if (!tx) throw new Error('Privy runtime is unavailable')
        return { base58TxSig: tx.signature }
      } else {
        if (!signer) throw new Error('SVM wallet signer is unavailable')
        const txSig = await signer.signAndSendTransaction(transaction)

        return { base58TxSig: txSig }
      }
    },
    [privyEmbedded, signer, privyOperations],
  )
  return { signAndSendTransaction }
}
