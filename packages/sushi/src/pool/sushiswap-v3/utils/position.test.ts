import { describe, expect, it } from 'vitest'
import { PositionLibrary } from './position.js'

describe('PositionLibrary', () => {
  describe('#getTokensOwed', () => {
    it('0', () => {
      const [tokensOwed0, tokensOwed1] = PositionLibrary.getTokensOwed(
        0n,
        0n,
        0n,
        0n,
        0n,
      )
      expect(tokensOwed0).toEqual(0n)
      expect(tokensOwed1).toEqual(0n)
    })

    it('non-0', () => {
      const [tokensOwed0, tokensOwed1] = PositionLibrary.getTokensOwed(
        0n,
        0n,
        1n,
        2n ** 128n,
        2n ** 128n,
      )
      expect(tokensOwed0).toEqual(1n)
      expect(tokensOwed1).toEqual(1n)
    })
  })
})
