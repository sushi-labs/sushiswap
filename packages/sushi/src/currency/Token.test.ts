import { describe, expect, it } from 'vitest'
import { Token } from './Token.js'

describe('Token', () => {
  const ADDRESS_ONE = '0x0000000000000000000000000000000000000001'
  const ADDRESS_TWO = '0x0000000000000000000000000000000000000002'
  const INVALID_ADDRESS = '0xhello00000000000000000000000000000000002'

  describe('#constructor', () => {
    it('fails with invalid address', () => {
      expect(
        () =>
          new Token({ chainId: 3, address: INVALID_ADDRESS, decimals: 18 })
            .address,
      ).toThrow(`${INVALID_ADDRESS} is not a valid address`)
    })
    it('fails with negative decimals', () => {
      expect(
        () =>
          new Token({ chainId: 3, address: ADDRESS_ONE, decimals: -1 }).address,
      ).toThrow('DECIMALS')
    })
    it('fails with 256 decimals', () => {
      expect(
        () =>
          new Token({ chainId: 3, address: ADDRESS_ONE, decimals: 256 })
            .address,
      ).toThrow('DECIMALS')
    })
    it('fails with non-integer decimals', () => {
      expect(
        () =>
          new Token({ chainId: 3, address: ADDRESS_ONE, decimals: 1.5 })
            .address,
      ).toThrow('DECIMALS')
    })
  })

  describe('#equals', () => {
    it('fails if address differs', () => {
      expect(
        new Token({ chainId: 1, address: ADDRESS_ONE, decimals: 18 }).equals(
          new Token({ chainId: 1, address: ADDRESS_TWO, decimals: 18 }),
        ),
      ).toBe(false)
    })

    it('false if chain id differs', () => {
      expect(
        new Token({ chainId: 3, address: ADDRESS_ONE, decimals: 18 }).equals(
          new Token({ chainId: 1, address: ADDRESS_ONE, decimals: 18 }),
        ),
      ).toBe(false)
    })

    it('true if only decimals differs', () => {
      expect(
        new Token({ chainId: 1, address: ADDRESS_ONE, decimals: 9 }).equals(
          new Token({ chainId: 1, address: ADDRESS_ONE, decimals: 18 }),
        ),
      ).toBe(true)
    })

    it('true if address is the same', () => {
      expect(
        new Token({ chainId: 1, address: ADDRESS_ONE, decimals: 18 }).equals(
          new Token({ chainId: 1, address: ADDRESS_ONE, decimals: 18 }),
        ),
      ).toBe(true)
    })

    it('true on reference equality', () => {
      const token = new Token({
        chainId: 1,
        address: ADDRESS_ONE,
        decimals: 18,
      })
      expect(token.equals(token)).toBe(true)
    })

    it('true even if name/symbol/decimals differ', () => {
      const tokenA = new Token({
        chainId: 1,
        address: ADDRESS_ONE,
        decimals: 9,
        symbol: 'abc',
        name: 'def',
      })
      const tokenB = new Token({
        chainId: 1,
        address: ADDRESS_ONE,
        decimals: 18,
        symbol: 'ghi',
        name: 'jkl',
      })
      expect(tokenA.equals(tokenB)).toBe(true)
    })
  })
})
