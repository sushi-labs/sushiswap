import type { SendTransactionModalUIOptions } from '@privy-io/react-auth'
import { getTransferSolInstruction } from '@solana-program/system'
import { useKitTransactionSigner } from '@solana/connector'
import {
  appendTransactionMessageInstructions,
  compileTransaction,
  createTransactionMessage,
  getTransactionEncoder,
  lamports,
  pipe,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
} from '@solana/kit'
import {
  type NotificationVariant,
  createFailedToast,
  createInfoToast,
  createSuccessToast,
} from '@sushiswap/notifications'
import { useMutation } from '@tanstack/react-query'
import { useAccount } from 'src/lib/wallet/hooks/use-account'
import { Amount } from 'sushi'
import { type SvmAddress, SvmChainId, SvmNative, svmAddress } from 'sushi/svm'
import { getSvmRpc } from '../rpc'
import { waitForSvmSignature } from '../wait-for-svm-signature'
import { useSvmSignAndSendTransaction } from './use-svm-sign-and-send-transaction'

type TransferSolArgs = {
  /**

Amount in lamports.
1 SOL = 1_000_000_000 lamports.
*/
  amount: bigint
  destination: SvmAddress
}

export const useTransferSol = (params?: {
  notifications?: boolean
  onSuccess?: (signature: string) => void
  uiOptions?: SendTransactionModalUIOptions
  variant?: NotificationVariant
}) => {
  const address = useAccount('svm')
  const { signer } = useKitTransactionSigner()
  const { signAndSendTransaction } = useSvmSignAndSendTransaction()
  const mutation = useMutation({
    mutationKey: ['use-transfer-sol', address],

    mutationFn: async ({ amount, destination }: TransferSolArgs) => {
      if (!signer || !address) {
        throw new Error('Wallet not connected')
      }

      if (amount <= 0n) {
        throw new Error('Transfer amount must be greater than zero')
      }

      const rpc = getSvmRpc()

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
        (tx) => compileTransaction(tx),
      )
      const encodedTransaction =
        getTransactionEncoder().encode(transactionMessage)

      const { base58TxSig: signature } = await signAndSendTransaction(
        encodedTransaction,
        {
          uiOptions: params?.uiOptions,
        },
      )
      if (!signature) throw new Error('Failed to obtain transaction signature')
      await waitForSvmSignature(signature.toString())

      return signature
    },

    onMutate: (data) => {
      if (params?.notifications === false) return

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
        variant: params?.variant ?? 'perps',
      })

      return { ts, formattedAmount }
    },

    onSuccess: (signature, _vars, ctx) => {
      params?.onSuccess?.(signature)
      if (params?.notifications === false || !address || !ctx) return

      createSuccessToast({
        summary: `Transferred ${ctx.formattedAmount} SOL successfully`,
        account: address,
        chainId: SvmChainId.SOLANA,
        type: 'send',
        timestamp: ctx.ts,
        groupTimestamp: ctx.ts,
        autoClose: 1000,
        variant: params?.variant ?? 'perps',
      })
    },

    onError: (error, _vars, ctx) => {
      if (params?.notifications === false) return

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
        variant: params?.variant ?? 'perps',
      })
    },
  })

  return {
    transferSolAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
  }
}
