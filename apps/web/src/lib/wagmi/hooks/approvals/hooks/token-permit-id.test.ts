import { type EvmAddress, EvmChainId } from 'sushi/evm'
import { describe, expect, it } from 'vitest'
import { getTokenPermitId, isTokenPermitChainValid } from './token-permit-id'

const token = '0x0000000000000000000000000000000000000001' as EvmAddress

describe('getTokenPermitId', () => {
  it('isolates the same token address by chain', () => {
    expect(getTokenPermitId('remove', EvmChainId.ETHEREUM, token)).not.toBe(
      getTokenPermitId('remove', EvmChainId.POLYGON, token),
    )
  })
})

describe('isTokenPermitChainValid', () => {
  it('accepts a signature only on its target chain', () => {
    expect(
      isTokenPermitChainValid({
        activeChainId: EvmChainId.ETHEREUM,
        signatureChainId: BigInt(EvmChainId.ETHEREUM),
        targetChainId: EvmChainId.ETHEREUM,
      }),
    ).toBe(true)
  })

  it('rejects a chain switch before or after signing', () => {
    expect(
      isTokenPermitChainValid({
        activeChainId: EvmChainId.POLYGON,
        signatureChainId: EvmChainId.ETHEREUM,
        targetChainId: EvmChainId.ETHEREUM,
      }),
    ).toBe(false)
    expect(
      isTokenPermitChainValid({
        activeChainId: EvmChainId.ETHEREUM,
        signatureChainId: EvmChainId.POLYGON,
        targetChainId: EvmChainId.ETHEREUM,
      }),
    ).toBe(false)
  })
})
