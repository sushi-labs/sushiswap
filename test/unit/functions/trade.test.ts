import { BigNumber } from '@ethersproject/bignumber'
import { AddressZero } from '@ethersproject/constants'
import { ChainId, CurrencyAmount, Percent, Token } from '@sushiswap/core-sdk'
import { calculateGasMargin, calculateSlippageAmount } from 'app/functions/trade'

describe('#calculateSlippageAmount', () => {
  it('bounds are correct', () => {
    const tokenAmount = CurrencyAmount.fromRawAmount(new Token(ChainId.ETHEREUM, AddressZero, 0), '100')
    expect(() => calculateSlippageAmount(tokenAmount, new Percent(-1, 1))).toThrow()
    expect(calculateSlippageAmount(tokenAmount, new Percent(0)).map((bound) => bound.toString())).toEqual([
      '100',
      '100',
    ])
    expect(calculateSlippageAmount(tokenAmount, new Percent(1, 100)).map((bound) => bound.toString())).toEqual([
      '99',
      '101',
    ])
    expect(calculateSlippageAmount(tokenAmount, new Percent(2, 100)).map((bound) => bound.toString())).toEqual([
      '98',
      '102',
    ])
    expect(calculateSlippageAmount(tokenAmount, new Percent(1, 1)).map((bound) => bound.toString())).toEqual([
      '0',
      '200',
    ])
    expect(() => calculateSlippageAmount(tokenAmount, new Percent(11, 10))).toThrow()
  })
})

describe('#calculateGasMargin', () => {
  it('adds 10%', () => {
    expect(calculateGasMargin(BigNumber.from(1000)).toString()).toEqual('1200')
    expect(calculateGasMargin(BigNumber.from(50)).toString()).toEqual('60')
  })
})
