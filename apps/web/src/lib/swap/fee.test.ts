import { EvmChainId, EvmNative, METH, USDC, USDT, rETH } from 'sushi/evm'
import { describe, expect, it } from 'vitest'
import { getEvmSwapFee } from './fee'

const chainId = EvmChainId.ETHEREUM
const native = EvmNative.fromChainId(chainId)

describe('getEvmSwapFee', () => {
  it.each([
    { fromToken: USDC[chainId], toToken: USDT[chainId] },
    { fromToken: USDT[chainId], toToken: USDC[chainId] },
    { fromToken: METH[chainId], toToken: rETH[chainId] },
    { fromToken: native, toToken: native.wrap() },
    { fromToken: native.wrap(), toToken: native },
  ])('exempts $fromToken.symbol to $toToken.symbol', (tokens) => {
    expect(getEvmSwapFee(tokens)).toBe(0)
  })

  it('preserves configured fees for non-exempt pairs', () => {
    const tokens = { fromToken: native, toToken: USDC[chainId] }
    expect(getEvmSwapFee(tokens)).toBe(0.0035)
    expect(getEvmSwapFee({ ...tokens, fee: 0.001 })).toBe(0.001)
    expect(getEvmSwapFee({ ...tokens, fee: 0 })).toBe(0)
  })
})
