import { ChainId } from 'sushi'
import { describe, expect, it } from 'vitest'
import {
  CROSSMINT_STAGING_TOKEN_SELECTOR_CHAIN_IDS,
  CROSSMINT_TOKEN_SELECTOR_CHAIN_IDS,
  getInitialCrossmintTokenSelectorChainId,
  isCrossmintTokenSelectorChainId,
} from './crossmint-token-selector-config'

describe('Crossmint token selector chains', () => {
  it('supports Sushi EVM, Solana, and Stellar token primitives', () => {
    expect(CROSSMINT_TOKEN_SELECTOR_CHAIN_IDS).toEqual(
      expect.arrayContaining([ChainId.BASE, ChainId.SOLANA, ChainId.STELLAR]),
    )
  })

  it('excludes checkout chains unsupported by the shared web3 selector', () => {
    expect(isCrossmintTokenSelectorChainId(ChainId.APTOS)).toBe(false)
    expect(CROSSMINT_TOKEN_SELECTOR_CHAIN_IDS).not.toContain(ChainId.APTOS)
  })

  it('limits staging selection to configured test-token networks', () => {
    expect(CROSSMINT_STAGING_TOKEN_SELECTOR_CHAIN_IDS).toEqual([
      ChainId.BASE,
      ChainId.SOLANA,
      ChainId.STELLAR,
    ])
  })

  it('prefers the page chain before the fallback token chain', () => {
    expect(
      getInitialCrossmintTokenSelectorChainId({
        chainIds: [ChainId.BASE, ChainId.SOLANA],
        defaultChainId: ChainId.SOLANA,
        fallbackChainId: ChainId.BASE,
      }),
    ).toBe(ChainId.SOLANA)
  })

  it('keeps an existing token selection ahead of the page chain', () => {
    expect(
      getInitialCrossmintTokenSelectorChainId({
        chainIds: [ChainId.BASE, ChainId.SOLANA],
        defaultChainId: ChainId.SOLANA,
        fallbackChainId: ChainId.BASE,
        selectedChainId: ChainId.BASE,
      }),
    ).toBe(ChainId.BASE)
  })
})
