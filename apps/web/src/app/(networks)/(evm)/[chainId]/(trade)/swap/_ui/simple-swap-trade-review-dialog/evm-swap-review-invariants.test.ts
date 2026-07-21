import type { EvmAddress, EvmChainId } from 'sushi/evm'
import { describe, expect, it } from 'vitest'
import { isEvmSwapReviewValid } from './evm-swap-review-invariants'

const account = '0x0000000000000000000000000000000000000001' as EvmAddress
const otherAccount = '0x0000000000000000000000000000000000000002' as EvmAddress
const reviewChainId = 1 as EvmChainId

describe('isEvmSwapReviewValid', () => {
  it('accepts the reviewed account and chain', () => {
    expect(
      isEvmSwapReviewValid({
        account,
        activeChainId: reviewChainId,
        reviewChainId,
        transactionFrom: account,
      }),
    ).toBe(true)
  })

  it('invalidates review after an A-to-B chain switch', () => {
    expect(
      isEvmSwapReviewValid({
        account,
        activeChainId: 137,
        reviewChainId,
        transactionFrom: account,
      }),
    ).toBe(false)
  })

  it('invalidates review after an account switch', () => {
    expect(
      isEvmSwapReviewValid({
        account: otherAccount,
        activeChainId: reviewChainId,
        reviewChainId,
        transactionFrom: account,
      }),
    ).toBe(false)
  })
})
