import { getTransferSolInstruction } from '@solana-program/system'
import { useKitTransactionSigner } from '@solana/connector'
import {
  appendTransactionMessageInstructions,
  assertIsTransactionWithBlockhashLifetime,
  createSolanaRpc,
  createSolanaRpcSubscriptions,
  createTransactionMessage,
  getSignatureFromTransaction,
  lamports,
  pipe,
  sendAndConfirmTransactionFactory,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signTransactionMessageWithSigners,
} from '@solana/kit'
import {
  createFailedToast,
  createInfoToast,
  createSuccessToast,
} from '@sushiswap/notifications'
import { useMutation } from '@tanstack/react-query'
import { useAccount } from 'src/lib/wallet'
import { Amount } from 'sushi'
import { type SvmAddress, SvmChainId, SvmNative, svmAddress } from 'sushi/svm'
import { SVM_RPC_URL } from '../config'
import { getRpcSubscriptionsUrl } from '../utils'

type TransferSolArgs = {
  /**

Amount in lamports.
1 SOL = 1_000_000_000 lamports.
*/
  amount: bigint
  destination: SvmAddress
}

export const useTransferSol = (params?: {
  onSuccess?: (signature: string) => void
}) => {
  const address = useAccount('svm')
  const { signer } = useKitTransactionSigner()

  const mutation = useMutation({
    mutationKey: ['use-transfer-sol', address],

    mutationFn: async ({ amount, destination }: TransferSolArgs) => {
      if (!signer || !address) {
        throw new Error('Wallet not connected')
      }

      if (amount <= 0n) {
        throw new Error('Transfer amount must be greater than zero')
      }

      const rpc = createSolanaRpc(SVM_RPC_URL)

      const rpcSubscriptions = createSolanaRpcSubscriptions(
        getRpcSubscriptionsUrl(SVM_RPC_URL),
      )

      const { value: latestBlockhash } = await rpc
        .getLatestBlockhash({ commitment: 'confirmed' })
        .send()

      const transferInstruction = getTransferSolInstruction({
        source: signer,
        destination: svmAddress(destination),
        amount: lamports(amount),
      })

      const transactionMessage = pipe(
        createTransactionMessage({ version: 0 }),
        (tx) => setTransactionMessageFeePayerSigner(signer, tx),
        (tx) =>
          setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
        (tx) => appendTransactionMessageInstructions([transferInstruction], tx),
      )

      const signedTransaction =
        await signTransactionMessageWithSigners(transactionMessage)

      assertIsTransactionWithBlockhashLifetime(signedTransaction)

      await sendAndConfirmTransactionFactory({
        rpc,
        rpcSubscriptions,
      })(signedTransaction, {
        commitment: 'confirmed',
      })

      return getSignatureFromTransaction(signedTransaction)
    },

    onMutate: (data) => {
      const rawAmount = data.amount
      const formattedAmount = new Amount(
        SvmNative.fromChainId(SvmChainId.SOLANA),
        rawAmount.toString(),
      ).toSignificant(6)
      const ts = Date.now()

      createInfoToast({
        summary: `Transferring ${formattedAmount} SOL`,
        account: address,
        chainId: SvmChainId.SOLANA,
        type: 'send',
        timestamp: ts,
        groupTimestamp: ts,
        autoClose: 1000,
        variant: 'perps',
      })

      return { ts, formattedAmount }
    },

    onSuccess: (signature, _vars, ctx) => {
      if (!address || !ctx) return
      params?.onSuccess?.(signature)

      createSuccessToast({
        summary: `Transferred ${ctx.formattedAmount} SOL successfully`,
        account: address,
        chainId: SvmChainId.SOLANA,
        type: 'send',
        timestamp: ctx.ts,
        groupTimestamp: ctx.ts,
        autoClose: 1000,
        variant: 'perps',
      })
    },

    onError: (error, _vars, ctx) => {
      const timestamp = ctx?.ts ?? Date.now()
      console.log(error)
      createFailedToast({
        summary:
          error instanceof Error
            ? error.message
            : `Failed to transfer ${ctx?.formattedAmount ?? ''} SOL`,
        account: address,
        chainId: SvmChainId.SOLANA,
        type: 'send',
        timestamp,
        groupTimestamp: timestamp,
        autoClose: 1000,
        variant: 'perps',
      })
    },
  })

  return {
    transferSolAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
  }
}
