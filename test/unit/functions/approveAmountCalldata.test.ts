import { AddressZero } from '@ethersproject/constants'
import { ChainId, Currency, CurrencyAmount, Token } from '@sushiswap/core-sdk'
import approveAmountCalldata, { toHex } from 'app/functions/approveAmountCalldata'

describe('approveAmountCalldata functions', () => {
  describe('toHex', () => {
    it('handles null address', () => {
      const input = '0x0000000000000000000000000000000000000000'
      expect(toHex(input)).toEqual('0x00')
    })
  })
  describe('approveAmountCalldata', () => {
    it('must be called with token', () => {
      const tokenAmount = CurrencyAmount.fromRawAmount({ isToken: false, decimals: 0 } as Currency, '100')
      const spender = AddressZero

      expect(() => approveAmountCalldata(tokenAmount, spender)).toThrowError('Must call with an amount of token')
    })

    it('returns data', () => {
      const tokenAmount = CurrencyAmount.fromRawAmount(new Token(ChainId.ETHEREUM, AddressZero, 0), '100')
      const spender = AddressZero

      const res = approveAmountCalldata(tokenAmount, spender)
      expect(res).toEqual({
        to: '0x0000000000000000000000000000000000000000',
        data: '0x095ea7b300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000064',
        value: '0x0',
      })
    })
  })
})
