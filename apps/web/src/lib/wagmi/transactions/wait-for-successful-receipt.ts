import type { Hash, ReplacementReason } from 'viem'

type ReceiptStatus = 'reverted' | 'success'

interface ReceiptWithStatus {
  readonly status: ReceiptStatus
  readonly transactionHash: Hash
}

interface ReceiptClient {
  waitForTransactionReceipt(parameters: {
    hash: Hash
    onReplaced(replacement: { reason: ReplacementReason }): void
  }): Promise<ReceiptWithStatus>
}

type ReceiptFor<TClient extends ReceiptClient> = Awaited<
  ReturnType<TClient['waitForTransactionReceipt']>
>

export class TransactionReceiptRevertedError extends Error {
  constructor(transactionHash: Hash) {
    super(`Transaction ${transactionHash} reverted`)
    this.name = 'TransactionReceiptRevertedError'
  }
}

export class TransactionReplacedError extends Error {
  constructor(reason: Exclude<ReplacementReason, 'repriced'>) {
    super(
      reason === 'cancelled'
        ? 'Transaction was cancelled'
        : 'Transaction was replaced with a different transaction',
    )
    this.name = 'TransactionReplacedError'
  }
}

export async function waitForSuccessfulReceipt<TClient extends ReceiptClient>(
  client: TClient,
  hash: Hash,
): Promise<ReceiptFor<TClient>> {
  let replacementReason: ReplacementReason | undefined
  const receipt = await client.waitForTransactionReceipt({
    hash,
    onReplaced: ({ reason }) => {
      replacementReason = reason
    },
  })

  if (replacementReason && replacementReason !== 'repriced') {
    throw new TransactionReplacedError(replacementReason)
  }
  if (receipt.status !== 'success') {
    throw new TransactionReceiptRevertedError(receipt.transactionHash)
  }

  return receipt as ReceiptFor<TClient>
}
