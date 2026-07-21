import type { EvmAddress, EvmChainId } from 'sushi/evm'

interface EvmSwapReviewInvariants {
  account: EvmAddress | undefined
  activeChainId: number | undefined
  reviewChainId: EvmChainId | undefined
  transactionFrom: EvmAddress | undefined
}

export function isEvmSwapReviewValid({
  account,
  activeChainId,
  reviewChainId,
  transactionFrom,
}: EvmSwapReviewInvariants): boolean {
  return Boolean(
    account &&
      activeChainId === reviewChainId &&
      transactionFrom &&
      account.toLowerCase() === transactionFrom.toLowerCase(),
  )
}
