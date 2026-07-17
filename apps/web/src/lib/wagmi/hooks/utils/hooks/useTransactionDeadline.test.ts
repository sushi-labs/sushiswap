import { EvmChainId } from 'sushi/evm'
import { describe, expect, it } from 'vitest'
import { getTransactionDeadlineQueryKey } from './useTransactionDeadline'

describe('getTransactionDeadlineQueryKey', () => {
  it('isolates equal TTL values by chain', () => {
    expect(getTransactionDeadlineQueryKey(EvmChainId.ETHEREUM, 30)).not.toEqual(
      getTransactionDeadlineQueryKey(EvmChainId.POLYGON, 30),
    )
  })
})
