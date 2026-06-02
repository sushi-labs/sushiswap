import {
  TOKEN_PROGRAM_ADDRESS,
  findAssociatedTokenPda,
  getCreateAssociatedTokenIdempotentInstruction,
  getTransferCheckedInstruction,
} from '@solana-program/token'
import {
  TOKEN_2022_PROGRAM_ADDRESS,
  getTransferCheckedInstruction as getTransferCheckedToken2022Instruction,
} from '@solana-program/token-2022'
import { useKitTransactionSigner } from '@solana/connector'
import {
  appendTransactionMessageInstructions,
  assertIsTransactionWithBlockhashLifetime,
  createSolanaRpc,
  createSolanaRpcSubscriptions,
  createTransactionMessage,
  getSignatureFromTransaction,
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
import { type SvmAddress, SvmChainId, type SvmToken } from 'sushi/svm'
import { SVM_RPC_URL } from '../config'
import { getRpcSubscriptionsUrl } from '../utils'

type TransferSplTokenArgs = {
  /**
   * Amount in the token's smallest base unit.
   *
   * For a token with 6 decimals:
   * 1 token = 1_000_000n
   */
  amount: bigint

  /**
   * Wallet address receiving the token.
   * Do not pass the recipient token account.
   */
  destination: SvmAddress

  tokenToSend: SvmToken
}

export const useTransferSplToken = (params?: {
  onSuccess?: (signature: string) => void
}) => {
  const address = useAccount('svm')
  const { signer } = useKitTransactionSigner()

  const mutation = useMutation({
    mutationKey: ['use-transfer-spl-token', address],

    mutationFn: async ({
      amount,
      destination,
      tokenToSend,
    }: TransferSplTokenArgs) => {
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

      const mintAddress = tokenToSend.address

      const { value: mintAccount } = await rpc
        .getAccountInfo(mintAddress, {
          commitment: 'confirmed',
          encoding: 'base64',
        })
        .send()

      if (!mintAccount) {
        throw new Error('Token mint account not found')
      }

      const tokenProgramAddress = mintAccount.owner

      const isTokenProgram = tokenProgramAddress === TOKEN_PROGRAM_ADDRESS

      const isToken2022Program =
        tokenProgramAddress === TOKEN_2022_PROGRAM_ADDRESS

      if (!isTokenProgram && !isToken2022Program) {
        throw new Error('Mint is not owned by a supported SPL Token Program')
      }

      const [derivedSourceTokenAccount] = await findAssociatedTokenPda({
        mint: mintAddress,
        owner: signer.address,
        tokenProgram: tokenProgramAddress,
      })

      const [destinationTokenAccount] = await findAssociatedTokenPda({
        mint: mintAddress,
        owner: destination,
        tokenProgram: tokenProgramAddress,
      })

      const createDestinationAtaInstruction =
        getCreateAssociatedTokenIdempotentInstruction({
          payer: signer,
          ata: destinationTokenAccount,
          owner: destination,
          mint: mintAddress,
          tokenProgram: tokenProgramAddress,
        })

      const transferArgs = {
        source: derivedSourceTokenAccount,
        mint: mintAddress,
        destination: destinationTokenAccount,
        authority: signer,
        amount,
        decimals: tokenToSend.decimals,
      }

      const transferInstruction = isToken2022Program
        ? getTransferCheckedToken2022Instruction(transferArgs)
        : getTransferCheckedInstruction(transferArgs)

      const { value: latestBlockhash } = await rpc
        .getLatestBlockhash({ commitment: 'confirmed' })
        .send()

      const transactionMessage = pipe(
        createTransactionMessage({ version: 0 }),
        (tx) => setTransactionMessageFeePayerSigner(signer, tx),
        (tx) =>
          setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
        (tx) =>
          appendTransactionMessageInstructions(
            [createDestinationAtaInstruction, transferInstruction],
            tx,
          ),
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

    onMutate: ({ amount, tokenToSend }) => {
      const formattedAmount = new Amount(tokenToSend, amount).toSignificant(6)
      const formattedSymbol = tokenToSend.symbol ?? ''
      const ts = Date.now()

      createInfoToast({
        summary: `Transferring ${formattedAmount} ${formattedSymbol}`,
        account: address,
        chainId: SvmChainId.SOLANA,
        type: 'send',
        timestamp: ts,
        groupTimestamp: ts,
        autoClose: 1000,
        variant: 'perps',
      })

      return {
        ts,
        formattedAmount,
        formattedSymbol,
      }
    },

    onSuccess: (signature, _vars, ctx) => {
      if (!address || !ctx) return
      params?.onSuccess?.(signature)

      createSuccessToast({
        summary: `Transferred ${ctx.formattedAmount} ${ctx.formattedSymbol} successfully`,
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

      console.error(error)

      createFailedToast({
        summary:
          error instanceof Error
            ? error.message
            : `Failed to transfer ${ctx?.formattedAmount ?? ''} ${
                ctx?.formattedSymbol ?? 'token'
              }`,
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
    transferSplTokenAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
  }
}
