import { EvmChainId } from 'sushi/evm'
import { describe, expect, it } from 'vitest'
import { getCurrentBlockTimestampReadConfig } from './use-current-block-timestamp'

describe('getCurrentBlockTimestampReadConfig', () => {
  it('binds the read to the requested chain', () => {
    expect(getCurrentBlockTimestampReadConfig(EvmChainId.POLYGON).chainId).toBe(
      EvmChainId.POLYGON,
    )
  })
})
