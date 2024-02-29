import { describe, expect, it } from 'vitest'
import { MAX_UINT256 } from '../../../math/index.js'
import { mostSignificantBit } from './mostSignificantBit.js'

describe('mostSignificantBit', () => {
  it('throws for zero', () => {
    expect(() => mostSignificantBit(0n)).toThrow('ZERO')
  })
  it('correct value for every power of 2', () => {
    for (let i = 1; i < 256; i++) {
      const x = 2n ** BigInt(i)
      expect(mostSignificantBit(x)).toEqual(i)
    }
  })
  it('correct value for every power of 2 - 1', () => {
    for (let i = 2; i < 256; i++) {
      const x = 2n ** BigInt(i) - 1n
      expect(mostSignificantBit(x)).toEqual(i - 1)
    }
  })

  it('succeeds for MaxUint256', () => {
    expect(mostSignificantBit(MAX_UINT256)).toEqual(255)
  })

  it('throws for MaxUint256 + 1', () => {
    expect(() => mostSignificantBit(MAX_UINT256 + 1n)).toThrow('MAX')
  })
})
