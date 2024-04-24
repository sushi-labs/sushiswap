import { describe, expect, it } from 'vitest'
import { Token } from '../../../currency/index.js'
import { Percent } from '../../../math/index.js'
import { Payments } from './Payments.js'

const recipient = '0x0000000000000000000000000000000000000003'
const amount = 123n

const feeOptions = {
  fee: new Percent(1, 1000),
  recipient: '0x0000000000000000000000000000000000000009',
}

const token = new Token({
  chainId: 1,
  address: '0x0000000000000000000000000000000000000001',
  decimals: 18,
  symbol: 't0',
  name: 'token0',
})

describe('Payments', () => {
  describe('#encodeUnwrapWETH9', () => {
    it('works without feeOptions', () => {
      const calldata = Payments.encodeUnwrapWETH9(amount, recipient)
      expect(calldata).toBe(
        '0x49404b7c000000000000000000000000000000000000000000000000000000000000007b0000000000000000000000000000000000000000000000000000000000000003',
      )
    })

    it('works with feeOptions', () => {
      const calldata = Payments.encodeUnwrapWETH9(amount, recipient, feeOptions)
      expect(calldata).toBe(
        '0x9b2c0a37000000000000000000000000000000000000000000000000000000000000007b0000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000009',
      )
    })
  })

  describe('#encodeSweepToken', () => {
    it('works without feeOptions', () => {
      const calldata = Payments.encodeSweepToken(token, amount, recipient)
      expect(calldata).toBe(
        '0xdf2ab5bb0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000007b0000000000000000000000000000000000000000000000000000000000000003',
      )
    })

    it('works with feeOptions', () => {
      const calldata = Payments.encodeSweepToken(
        token,
        amount,
        recipient,
        feeOptions,
      )
      expect(calldata).toBe(
        '0xe0e189a00000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000007b0000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000009',
      )
    })
  })

  it('#encodeRefundETH', () => {
    const calldata = Payments.encodeRefundETH()
    expect(calldata).toBe('0x12210e8a')
  })
})
