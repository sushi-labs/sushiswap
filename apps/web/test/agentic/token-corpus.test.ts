import { EvmChainId } from 'sushi/evm'
import { describe, expect, it } from 'vitest'
import { TESTED_CHAINS, TESTED_CHAIN_IDS } from './tested-chains'
import { TOKEN_CORPUS } from './token-corpus'

describe('agentic EVM corpus', () => {
  it('includes Robinhood Chain in the tested chain list', () => {
    expect(TESTED_CHAIN_IDS).toContain(EvmChainId.ROBINHOOD)
    expect(
      TESTED_CHAINS.find(({ chainId }) => chainId === EvmChainId.ROBINHOOD),
    ).toBeDefined()
  })

  it.each(TESTED_CHAIN_IDS)(
    'has smoke and quirk coverage for chain %s',
    (chainId) => {
      const tokens = TOKEN_CORPUS.filter((token) => token.chainId === chainId)

      expect(tokens.some(({ coverage }) => coverage === 'smoke')).toBe(true)
      expect(tokens.some(({ coverage }) => coverage === 'quirk')).toBe(true)
    },
  )

  it('has no duplicate token addresses within a chain', () => {
    const ids = TOKEN_CORPUS.map(
      ({ chainId, address }) => `${chainId}:${address.toLowerCase()}`,
    )

    expect(new Set(ids).size).toBe(ids.length)
  })

  it('keeps discovery candidates out of smoke coverage', () => {
    expect(
      TOKEN_CORPUS.filter(({ confidence }) => confidence === 'candidate').every(
        ({ coverage }) => coverage === 'discovery',
      ),
    ).toBe(true)
  })
})
