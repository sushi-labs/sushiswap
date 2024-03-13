import { afterEach, describe, expect, it } from 'vitest'
import { HEXer } from './HEXer.js'

let HEXER = new HEXer()

afterEach(() => {
  HEXER = new HEXer()
})

describe('HEXer', () => {
  describe('constructor', () => {
    it('instanciates', () => {
      expect(HEXER).toBeInstanceOf(HEXer)
      expect(HEXER.toString()).toEqual('')
    })
  })
  describe('#toString', () => {
    const address = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
    it('should return the address without a 0x prefix', () => {
      expect(HEXER.address(address).toString()).toEqual(address.slice(2))
    })

    it('should return hexed amount with padding', () => {
      expect(HEXER.uint(1000).toString()).toEqual(
        '00000000000000000000000000000000000000000000000000000000000003e8',
      )
    })

    it('should return hexed value 0 + padding', () => {
      expect(HEXER.bool(false).toString()).toEqual('00')
    })

    it('should return hexed value 1 + padding', () => {
      expect(HEXER.bool(true).toString()).toEqual('01')
    })

    it('should return the address without 0x prefix', () => {
      expect(HEXER.hexData(address).toString()).toEqual(address.slice(2))
    })
  })

  describe('#toHexString', () => {
    it('should return a string with 0x prefix', () => {
      const address = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
      expect(HEXER.address(address).toHexString()).toEqual(address)
    })
  })

  describe('#uint8', () => {
    it('throws when input is greater than 255', () => {
      const amount = 256
      expect(() => HEXER.uint8(amount)).toThrow(`Wrong uint8: ${amount}`)
    })

    it('throws when input is less than 0', () => {
      const amount = -1
      expect(() => HEXER.uint8(amount)).toThrow(`Wrong uint8: ${amount}`)
    })

    it('throws when number is decimal', () => {
      const amount = 1.337
      expect(() => HEXER.uint8(amount)).toThrow(`Wrong uint8: ${amount}`)
    })

    it.each([1, 255])('should not throw with a valid value: %i', (n) => {
      expect(() => HEXER.uint8(n)).not.toThrowError()
    })
  })

  describe('#uint16', () => {
    const maxValue = 256 * 256 - 1
    it(`throws when input is greater than ${maxValue}`, () => {
      const amount = maxValue + 1
      expect(() => HEXER.uint16(amount)).toThrow(`Wrong uint16: ${amount}`)
    })

    it('throws when input is less than 0', () => {
      const amount = -1
      expect(() => HEXER.uint16(amount)).toThrow(`Wrong uint16: ${amount}`)
    })

    it('throws when number is decimal', () => {
      const amount = 1.337
      expect(() => HEXER.uint16(amount)).toThrow(`Wrong uint16: ${amount}`)
    })

    it.each([1, maxValue])('should not throw with a valid value: %i', (n) => {
      expect(() => HEXER.uint16(n)).not.toThrowError()
    })
  })

  describe('#uint32', () => {
    const maxValue = 256 * 256 * 256 * 256 - 1
    it(`throws when input is greater than ${maxValue}`, () => {
      const amount = maxValue + 1
      expect(() => HEXER.uint32(amount)).toThrow(`Wrong uint32: ${amount}`)
    })

    it('throws when input is less than 0', () => {
      const amount = -1
      expect(() => HEXER.uint32(amount)).toThrow(`Wrong uint32: ${amount}`)
    })

    it('throws when number is decimal', () => {
      const amount = 1.337
      expect(() => HEXER.uint32(amount)).toThrow(`Wrong uint32: ${amount}`)
    })

    it.each([1, maxValue])('should not throw with a valid value: %i', (n) => {
      expect(() => HEXER.uint32(n)).not.toThrowError()
    })
  })

  describe('#uint256 and #uint', () => {
    it(`throws when input is greater than ${Number.MAX_SAFE_INTEGER}`, () => {
      const amount = Number.MAX_SAFE_INTEGER + 1
      expect(() => HEXER.uint256(amount)).toThrow(`Wrong uint256: ${amount}`)
      expect(() => HEXER.uint(amount)).toThrow(`Wrong uint256: ${amount}`)
    })

    it('throws when input is less than 0', () => {
      const amount = -1
      expect(() => HEXER.uint256(amount)).toThrow(`Wrong uint256: ${amount}`)
      expect(() => HEXER.uint(amount)).toThrow(`Wrong uint256: ${amount}`)
    })

    it('throws when number is decimal', () => {
      const amount = 1.337
      expect(() => HEXER.uint256(amount)).toThrow(`Wrong uint256: ${amount}`)
      expect(() => HEXER.uint(amount)).toThrow(`Wrong uint256: ${amount}`)
    })

    it.each([1, Number.MAX_SAFE_INTEGER])(
      'should not throw with a valid value: %i',
      (n) => {
        expect(() => HEXER.uint256(n)).not.toThrowError()
        expect(() => HEXER.uint(n)).not.toThrowError()
      },
    )
  })

  describe('#share16', () => {
    const limit = 65535
    const maxValue = (256 * 256) / limit - 1
    it(`throws when input is greater than ${maxValue}`, () => {
      const amount = maxValue + 1
      expect(() => HEXER.share16(amount)).toThrow(
        `Wrong uint16: ${amount * limit}`,
      )
    })

    it('throws when input is less than 0', () => {
      const amount = -1
      expect(() => HEXER.share16(amount)).toThrow(
        `Wrong uint16: ${amount * limit}`,
      )
    })

    it.each([1, maxValue])('should not throw with a valid value: %i', (n) => {
      expect(() => HEXER.share16(n)).not.toThrowError()
    })
  })

  describe('#address', () => {
    it('throws when address is RouteProcessor', () => {
      const address = 'RouteProcessor'
      expect(() => HEXER.address(address)).toThrow(`Wrong address: ${address}`)
    })
    it('throws when address has a length more than 42', () => {
      const address = '0x00000000000000000000000000000000000000000'
      expect(() => HEXER.address(address)).toThrow(`Wrong address: ${address}`)
    })

    // TODO: This should probably throw?
    it.skip('throws when address has a length less than 42', () => {
      const address = '0x000000000000000000000000000000000000000'
      expect(() => HEXER.address(address)).toThrow(`Wrong address: ${address}`)
    })
  })
  describe('#hexData', () => {
    const address = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'

    it('throws when input length is odd', () => {
      const input = '123'
      expect(() => HEXER.hexData(input)).toThrow(
        `Wrong hex data length: ${input.length}`,
      )
    })

    it('slices the 0x prefix', () => {
      expect(HEXER.hexData(address).toString()).toEqual(address.slice(2))
    })
  })

  describe('#bytes', () => {
    const address = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'

    it('throws when input length is odd', () => {
      const input = '123'
      expect(() => HEXER.bytes(input)).toThrow(
        `Wrong bytes length: ${input.length}`,
      )
    })

    it('adds padding and slices the 0x prefix', () => {
      const len = '14' // address length after slicing prefix is 20, 20 in decimal is 14 in hex
      const expected = `00000000000000000000000000000000000000000000000000000000000000${len}${address.slice(
        2,
      )}`
      expect(HEXER.bytes(address).toString()).toEqual(expected)
    })

    it.each(['10', '1010', '101010'])(
      'adds 0 padding and length info of the bytecode',
      (n) => {
        const actual = HEXER.bytes(n).toString()
        const expected = `000000000000000000000000000000000000000000000000000000000000000${
          n.length / 2
        }${n}`
        expect(actual).toEqual(expected)
      },
    )
  })

  describe('#bool', () => {
    it('should return hexed value 0 + padding', () => {
      expect(HEXER.bool(false).toString()).toEqual('00')
    })

    it('should return hexed value 1 + padding', () => {
      expect(HEXER.bool(true).toString()).toEqual('01')
    })
  })
})
