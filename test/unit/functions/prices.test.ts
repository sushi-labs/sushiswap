import { ChainId, CurrencyAmount, JSBI, Token, TradeType } from '@sushiswap/core-sdk'
import { Pair, Route, Trade } from '@sushiswap/core-sdk'
import { computeRealizedLPFeeAmount } from 'app/functions/prices'

describe('prices', () => {
  const token1 = new Token(ChainId.ETHEREUM, '0x0000000000000000000000000000000000000001', 18)
  const token2 = new Token(ChainId.ETHEREUM, '0x0000000000000000000000000000000000000002', 18)
  const token3 = new Token(ChainId.ETHEREUM, '0x0000000000000000000000000000000000000003', 18)

  const pair12 = new Pair(
    CurrencyAmount.fromRawAmount(token1, JSBI.BigInt(10000)),
    CurrencyAmount.fromRawAmount(token2, JSBI.BigInt(20000))
  )
  const pair23 = new Pair(
    CurrencyAmount.fromRawAmount(token2, JSBI.BigInt(20000)),
    CurrencyAmount.fromRawAmount(token3, JSBI.BigInt(30000))
  )

  describe('computeRealizedLPFeeAmount', () => {
    it('returns undefined for undefined', () => {
      expect(computeRealizedLPFeeAmount(undefined)).toEqual(undefined)
    })

    it.skip('correct realized lp fee for single hop', () => {
      expect(
        computeRealizedLPFeeAmount(
          new Trade(
            new Route([pair12], token1, token2),
            CurrencyAmount.fromRawAmount(token1, JSBI.BigInt(1000)),
            TradeType.EXACT_INPUT
          )
        )
      ).toEqual(CurrencyAmount.fromRawAmount(token1, JSBI.BigInt(3)))
    })

    it.skip('correct realized lp fee for double hop', () => {
      expect(
        computeRealizedLPFeeAmount(
          new Trade(
            new Route([pair12, pair23], token1, token2),
            CurrencyAmount.fromRawAmount(token1, JSBI.BigInt(1000)),
            TradeType.EXACT_INPUT
          )
        )
      ).toEqual(CurrencyAmount.fromRawAmount(token1, JSBI.BigInt(5)))
    })
  })
})
