import { describe, expect, it } from 'vitest'

import { Native } from './Native.js'
import { Token } from './Token.js'

describe('Currency', () => {
  const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000'
  const ADDRESS_ONE = '0x0000000000000000000000000000000000000001'

  const t0 = new Token({ chainId: 1, address: ADDRESS_ZERO, decimals: 18 })
  const t1 = new Token({ chainId: 1, address: ADDRESS_ONE, decimals: 18 })

  describe('#equals', () => {
    it('ether on same chains is ether', () => {
      expect(Native.onChain(1).equals(Native.onChain(1)))
    })
    it('ether is not token0', () => {
      expect(Native.onChain(1).equals(t0)).toStrictEqual(false)
    })
    it('token1 is not token0', () => {
      expect(t1.equals(t0)).toStrictEqual(false)
    })
    it('token0 is token0', () => {
      expect(t0.equals(t0)).toStrictEqual(true)
    })
    it('token0 is equal to another token0', () => {
      expect(
        t0.equals(
          new Token({
            chainId: 1,
            address: ADDRESS_ZERO,
            decimals: 18,
            symbol: 'symbol',
            name: 'name',
          }),
        ),
      ).toStrictEqual(true)
    })
    it('throws if chain id is not known', () => {
      expect(() => Native.onChain(Number.MAX_SAFE_INTEGER)).toThrow(
        'NATIVE_CURRENCY',
      )
    })
  })
})
