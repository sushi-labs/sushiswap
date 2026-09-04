import type { SendTransactionModalUIOptions } from '@privy-io/react-auth'
import { useTransactionSigner } from '@solana/connector'
import { useConnector } from '@solana/connector/react'
import type { ReadonlyUint8Array } from '@solana/kit'
import { useCallback } from 'react'
import { usePrivyEmbeddedWallet } from '../../wallet/hooks/use-privy-embedded'
import { PRIVY_SVM_CONNECTOR_ID } from '../../wallet/namespaces/svm/config'
import { usePrivyRuntime } from '../../wallet/privy/use-privy-runtime'

export function useSvmSignAndSendTransaction() {
  const { signer } = useTransactionSigner()
  const { wallet } = useConnector()
  const privyEmbedded = usePrivyEmbeddedWallet('svm')
  const { operations: privyOperations } = usePrivyRuntime()

  const signAndSendTransaction = useCallback(
    async (
      transaction: ReadonlyUint8Array<ArrayBuffer>,
      options?: {
        uiOptions?: SendTransactionModalUIOptions
      },
    ) => {
      const isPrivySigner =
        wallet.status === 'connected' &&
        wallet.session.connectorId === PRIVY_SVM_CONNECTOR_ID
      if (isPrivySigner) {
        if (!privyEmbedded) throw new Error('Privy SVM wallet is unavailable')
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
    [privyEmbedded, privyOperations, signer, wallet],
  )
  return { signAndSendTransaction }
}
