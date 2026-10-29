import {
  EvmChainId,
  EvmNative,
  EvmToken,
  WNATIVE,
  tickToPrice,
} from 'sushi/evm'
import { describe, expect, it } from 'vitest'
import { tickToPoolPrice } from './functions'

const native = EvmNative.fromChainId(EvmChainId.ETHEREUM)
const wrappedNative = WNATIVE[EvmChainId.ETHEREUM]
// Sorts below WETH, but above the native `0x0`
const lowToken = new EvmToken({
  chainId: EvmChainId.ETHEREUM,
  address: '0x0000000000000000000000000000000000000001',
  decimals: 18,
  symbol: 'LOW',
  name: 'Low',
})

describe('tickToPoolPrice', () => {
  it('matches tickToPrice for tokens in either order', () => {
    for (const [base, quote] of [
      [lowToken, wrappedNative],
      [wrappedNative, lowToken],
    ]) {
      expect(tickToPoolPrice(base, quote, 10_000).toSignificant(8)).toBe(
        tickToPrice(base, quote, 10_000).toSignificant(8),
      )
    }
  })

  it('treats a native currency as currency0', () => {
    expect(tickToPoolPrice(native, lowToken, 10_000).toSignificant(6)).toBe(
      '2.71815',
    )
    expect(tickToPoolPrice(lowToken, native, 10_000).toSignificant(6)).toBe(
      '0.367898',
    )
  })

  it('prices a native / wrapped native pool', () => {
    expect(tickToPoolPrice(native, wrappedNative, 0).toSignificant(6)).toBe('1')
  })
})
