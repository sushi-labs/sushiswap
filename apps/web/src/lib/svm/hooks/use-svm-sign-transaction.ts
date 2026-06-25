import { useSignTransaction } from '@privy-io/react-auth/solana'
import { useTransactionSigner } from '@solana/connector'
import {
  type ReadonlyUint8Array,
  getSignatureFromTransaction,
  getTransactionDecoder,
} from '@solana/kit'
import { useCallback } from 'react'
import { usePrivyEmbeddedWallet } from 'src/lib/wallet'

export const useSvmSignTransaction = () => {
  const { signer } = useTransactionSigner()
  const privyEmbedded = usePrivyEmbeddedWallet('svm')
  const { signTransaction: signTransactionWithPrivy } = useSignTransaction()

  const signTransaction = useCallback(
    async (transaction: ReadonlyUint8Array<ArrayBuffer>) => {
      if (
        privyEmbedded &&
        privyEmbedded?.address.toLowerCase() === signer?.address.toLowerCase()
      ) {
        const tx = await signTransactionWithPrivy({
          transaction: new Uint8Array(transaction),
          wallet: privyEmbedded,
        })
        const base58TxSig = getSignatureFromTransaction(
          getTransactionDecoder().decode(tx.signedTransaction),
        )
        const base64SignedTx = Buffer.from(tx.signedTransaction).toString(
          'base64',
        )
        return { base58TxSig, base64SignedTx }
      } else {
        const tx = await signer?.signTransaction(transaction)
        const base58TxSig = getSignatureFromTransaction(
          getTransactionDecoder().decode(tx as Uint8Array),
        )
        const base64SignedTx = Buffer.from(tx as Uint8Array).toString('base64')
        return { base58TxSig, base64SignedTx }
      }
    },
    [privyEmbedded, signer, signTransactionWithPrivy],
  )
  return { signTransaction }
}
