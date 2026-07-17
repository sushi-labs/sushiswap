import { Partners, getPartnerChains } from '@orbs-network/spot-react'
import { describe, expect, it } from 'vitest'
import { TWAP_SUPPORTED_CHAIN_IDS } from './supported-chain-ids'

describe('TWAP_SUPPORTED_CHAIN_IDS', () => {
  it('matches the Orbs SDK', () => {
    expect(TWAP_SUPPORTED_CHAIN_IDS).toEqual(
      getPartnerChains(Partners.Sushiswap),
    )
  })
})
