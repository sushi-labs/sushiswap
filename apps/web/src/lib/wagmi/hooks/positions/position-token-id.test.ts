import { describe, expect, it } from 'vitest'
import { parsePositionTokenId } from './position-token-id'

describe('parsePositionTokenId', () => {
  it('parses positive decimal uint256 values', () => {
    expect(parsePositionTokenId('1')).toBe(1n)
    expect(parsePositionTokenId(42)).toBe(42n)
    expect(parsePositionTokenId((2n ** 256n - 1n).toString())).toBe(
      2n ** 256n - 1n,
    )
  })

  it.each(['', '0', '-1', '1.5', '0x01', 'not-a-number'])(
    'rejects invalid route value %s',
    (value) => {
      expect(parsePositionTokenId(value)).toBeUndefined()
    },
  )

  it('rejects unsafe numbers and uint256 overflow', () => {
    expect(parsePositionTokenId(Number.MAX_SAFE_INTEGER + 1)).toBeUndefined()
    expect(parsePositionTokenId((2n ** 256n).toString())).toBeUndefined()
  })
})
