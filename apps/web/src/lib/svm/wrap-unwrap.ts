import {
  getCreateAccountInstruction,
  getTransferSolInstruction,
} from '@solana-program/system'
import {
  TOKEN_PROGRAM_ADDRESS,
  findAssociatedTokenPda,
  getCloseAccountInstruction,
  getCreateAssociatedTokenIdempotentInstruction,
  getInitializeAccountInstruction,
  getSyncNativeInstruction,
  getTransferInstruction,
} from '@solana-program/token'
import {
  type Transaction,
  type TransactionMessageBytes,
  type TransactionMessageBytesBase64,
  type TransactionSigner,
  address,
  appendTransactionMessageInstructions,
  compileTransaction,
  createTransactionMessage,
  generateKeyPairSigner,
  getBase64Decoder,
  getBase64EncodedWireTransaction,
  lamports,
  partiallySignTransaction,
  pipe,
  setTransactionMessageFeePayer,
  setTransactionMessageLifetimeUsingBlockhash,
} from '@solana/kit'
import type { Amount } from 'sushi'
import type { SvmCurrency } from 'sushi/svm'
import { getSvmRpc } from './rpc'

const NATIVE_MINT = address('So11111111111111111111111111111111111111112')

async function getFee(compiledMessage: TransactionMessageBytes) {
  const rpc = getSvmRpc()
  const base64Message = getBase64Decoder().decode(
    compiledMessage,
  ) as TransactionMessageBytesBase64
  const { value } = await rpc.getFeeForMessage(base64Message).send()
  return value
}

async function partiallySignAndGetFee(
  signers: CryptoKeyPair[],
  compiledMessage: Transaction,
) {
  const partiallySignedTx = await partiallySignTransaction(
    signers,
    compiledMessage,
  )
  const fee = await getFee(partiallySignedTx.messageBytes)

  return {
    transaction: getBase64EncodedWireTransaction(partiallySignedTx),
    fee: fee as bigint,
  }
}

export async function wrapSol(
  signer: TransactionSigner,
  amountSol: Amount<SvmCurrency>,
) {
  const rpc = getSvmRpc()

  const [ataAddress] = await findAssociatedTokenPda({
    mint: NATIVE_MINT,
    owner: signer.address,
    tokenProgram: TOKEN_PROGRAM_ADDRESS,
  })

  const { value: latestBlockhash } = await rpc.getLatestBlockhash().send()

  const instructions = [
    getCreateAssociatedTokenIdempotentInstruction({
      payer: signer,
      ata: ataAddress,
      owner: signer.address,
      mint: NATIVE_MINT,
      tokenProgram: TOKEN_PROGRAM_ADDRESS,
    }),
    getTransferSolInstruction({
      source: signer,
      destination: ataAddress,
      amount: lamports(amountSol.amount),
    }),
    getSyncNativeInstruction({
      account: ataAddress,
    }),
  ]

  const compiledTransaction = compileTransaction(
    pipe(
      createTransactionMessage({ version: 0 }),
      (tx) => setTransactionMessageFeePayer(signer.address, tx),
      (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
      (tx) => appendTransactionMessageInstructions(instructions, tx),
    ),
  )

  return partiallySignAndGetFee([], compiledTransaction)
}

export async function unwrapSol(
  signer: TransactionSigner,
  amount: Amount<SvmCurrency>,
  fullUnwrap: boolean,
) {
  const rpc = getSvmRpc()
  const { value: latestBlockhash } = await rpc.getLatestBlockhash().send()

  const [mainAta] = await findAssociatedTokenPda({
    mint: NATIVE_MINT,
    owner: signer.address,
    tokenProgram: TOKEN_PROGRAM_ADDRESS,
  })

  let instructions = []
  const keyPairs: CryptoKeyPair[] = []

  if (fullUnwrap) {
    instructions.push(
      getCloseAccountInstruction({
        account: mainAta,
        destination: signer.address,
        owner: signer,
      }),
    )
  } else {
    const tempAccountSigner = await generateKeyPairSigner()
    const rent = await rpc.getMinimumBalanceForRentExemption(165n).send()

    keyPairs.push(tempAccountSigner.keyPair)

    instructions = [
      getCreateAccountInstruction({
        payer: signer,
        newAccount: tempAccountSigner,
        lamports: rent,
        space: 165n,
        programAddress: TOKEN_PROGRAM_ADDRESS,
      }),
      getInitializeAccountInstruction({
        account: tempAccountSigner.address,
        mint: NATIVE_MINT,
        owner: signer.address,
      }),
      getTransferInstruction({
        source: mainAta,
        destination: tempAccountSigner.address,
        authority: signer,
        amount: amount.amount,
      }),
      getCloseAccountInstruction({
        account: tempAccountSigner.address,
        destination: signer.address,
        owner: signer,
      }),
    ]
  }

  const compiledTransaction = compileTransaction(
    pipe(
      createTransactionMessage({ version: 0 }),
      (tx) => setTransactionMessageFeePayer(signer.address, tx),
      (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
      (tx) => appendTransactionMessageInstructions(instructions, tx),
    ),
  )

  return partiallySignAndGetFee(keyPairs, compiledTransaction)
}
