import type { CrossChainSwapWriteReceiptInfo } from './use-cross-chain-swap-trade-review-write-handlers'

export class CrossChainSourceTransactionFailedError extends Error {
  constructor() {
    super('Source transaction failed')
    this.name = 'CrossChainSourceTransactionFailedError'
  }
}

export async function waitForSuccessfulSourceReceipt<TReceipt>(
  receiptPromise: Promise<TReceipt>,
  getReceiptInfo: (receipt: TReceipt) => CrossChainSwapWriteReceiptInfo,
): Promise<TReceipt> {
  const receipt = await receiptPromise
  if (getReceiptInfo(receipt).status !== 'success') {
    throw new CrossChainSourceTransactionFailedError()
  }
  return receipt
}
