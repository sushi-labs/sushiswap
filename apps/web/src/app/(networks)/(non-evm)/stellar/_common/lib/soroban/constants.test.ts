import { describe, expect, it } from 'vitest'
import {
  MIN_SQRT_RATIO,
  getSqrtPriceLimitForSwap,
  isAddressLower,
} from './constants'

const USDC = 'CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75'
const USDT0 = 'CBSJZEIO5C7KC2SF3MKSNXXJSW5G3VTNBX4ATMKUI3B2MR4JKM4R26YF'
const MAX_U128 = (1n << 128n) - 1n

describe('getSqrtPriceLimitForSwap', () => {
  it('uses the lower protocol bound for token0 to token1 quotes', () => {
    expect(isAddressLower(USDT0, USDC)).toBe(true)
    expect(getSqrtPriceLimitForSwap(USDT0, USDC)).toBe(MIN_SQRT_RATIO + 1n)
  })

  it('uses an ABI-safe upper bound for USDC to USDT0 quotes', () => {
    expect(getSqrtPriceLimitForSwap(USDC, USDT0)).toBe(MAX_U128)
  })
})
