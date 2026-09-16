import { Amount } from 'sushi'
import { EvmChainId, EvmNative, USDC } from 'sushi/evm'
import { describe, expect, it } from 'vitest'
import {
  getLaunchpadSwapCurrency,
  getQuickBuyNativeAmount,
} from './launchpad-swap'

describe('getQuickBuyNativeAmount', () => {
  it('converts a USD preset to its native currency amount', () => {
    expect(getQuickBuyNativeAmount(10, 2_000, 18)).toBe('0.005')
    expect(getQuickBuyNativeAmount(100, 2_500, 18)).toBe('0.04')
  })

  it('limits the amount to the native currency precision', () => {
    expect(getQuickBuyNativeAmount(25, 3_000, 6)).toBe('0.008333')
  })

  it('returns undefined when a usable native price is unavailable', () => {
    expect(getQuickBuyNativeAmount(10, undefined, 18)).toBeUndefined()
    expect(getQuickBuyNativeAmount(10, 0, 18)).toBeUndefined()
    expect(getQuickBuyNativeAmount(10, Number.NaN, 18)).toBeUndefined()
  })
})

it('uses 6-decimal ERC-20 USDC for Arc swaps and quick buys', () => {
  for (const input of [
    USDC[EvmChainId.ARC],
    EvmNative.fromChainId(EvmChainId.ARC),
  ]) {
    const currency = getLaunchpadSwapCurrency(input)
    expect(currency).toEqual(USDC[EvmChainId.ARC])
    expect(Amount.tryFromHuman(currency, '0.1')?.amount).toBe(100_000n)
  }
  const eth = EvmNative.fromChainId(EvmChainId.ROBINHOOD)
  expect(getLaunchpadSwapCurrency(eth.wrap())).toEqual(eth)
})
