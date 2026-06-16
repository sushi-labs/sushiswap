import { useSignAndSendTransaction } from '@privy-io/react-auth/solana'
import { useTransactionSigner } from '@solana/connector'
import { type ReadonlyUint8Array, getBase58Decoder } from '@solana/kit'
import { useCallback } from 'react'
import { usePrivyEmbeddedWallet } from 'src/lib/wallet'

export const useSvmSignAndSendTransaction = () => {
  const { signer } = useTransactionSigner()
  const privyEmbedded = usePrivyEmbeddedWallet('svm')
  const { signAndSendTransaction: signAndSendTransactionWithPrivy } =
    useSignAndSendTransaction()

  const signAndSendTransaction = useCallback(
    async (transaction: ReadonlyUint8Array<ArrayBuffer>) => {
      if (
        privyEmbedded &&
        privyEmbedded?.address.toLowerCase() === signer?.address.toLowerCase()
      ) {
        const tx = await signAndSendTransactionWithPrivy({
          transaction: new Uint8Array(transaction),
          wallet: privyEmbedded,
        })

        const base58TxSig = getBase58Decoder().decode(
          new Uint8Array(Object.values(tx.signature)),
        )

        return { base58TxSig }
      } else {
        const txSig = await signer?.signAndSendTransaction(transaction)

        return { base58TxSig: txSig }
      }
    },
    [privyEmbedded, signer, signAndSendTransactionWithPrivy],
  )
  return { signAndSendTransaction }
}
