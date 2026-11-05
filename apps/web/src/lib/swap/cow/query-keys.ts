import type { EvmAddress } from 'sushi/evm'
import type { CowLimitChainId } from './chains'
import type { CowOrder } from './schema'

// Everything derived from an account's orders shares this prefix, so one
// invalidation refreshes the list and the approval sizing together.
export function getCowOrdersQueryKey(
  chainId: CowLimitChainId,
  owner: EvmAddress | undefined,
): readonly unknown[] {
  return ['cow-orders', chainId, owner?.toLowerCase()]
}

export function getCowOpenSellAmountQueryKey({
  chainId,
  owner,
  sellToken,
  replacedUid,
}: {
  chainId: CowLimitChainId
  owner: EvmAddress | undefined
  sellToken: EvmAddress | undefined
  replacedUid: string | undefined
}): readonly unknown[] {
  return [
    ...getCowOrdersQueryKey(chainId, owner),
    'open-sell-amount',
    sellToken,
    replacedUid,
  ]
}

export function getCowQuoteQueryKey({
  chainId,
  owner,
  sellToken,
  buyToken,
  sellAmount,
}: {
  chainId: CowLimitChainId
  owner: EvmAddress | undefined
  sellToken: EvmAddress | undefined
  buyToken: EvmAddress | undefined
  sellAmount: string | undefined
}): readonly unknown[] {
  return ['cow-quote', chainId, owner, sellToken, buyToken, sellAmount]
}

// Keyed by status so the final fills load once an order closes.
export function getCowFillsQueryKey(
  chainId: CowLimitChainId,
  order: Pick<CowOrder, 'uid' | 'status'>,
): readonly unknown[] {
  return ['cow-fills', chainId, order.uid, order.status]
}
