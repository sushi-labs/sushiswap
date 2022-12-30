import JSBI from 'jsbi'

import Percent from '../Percent'

export const ZERO = JSBI.BigInt(0)
export const ONE = JSBI.BigInt(1)
export const TWO = JSBI.BigInt(2)
export const THREE = JSBI.BigInt(3)
export const FIVE = JSBI.BigInt(5)
export const TEN = JSBI.BigInt(10)

export const _100 = JSBI.BigInt(100)
export const _997 = JSBI.BigInt(997)
export const _1000 = JSBI.BigInt(1000)
export const _9994 = JSBI.BigInt(9994)
export const _9995 = JSBI.BigInt(9995)
export const _10000 = JSBI.BigInt(10000)

export const _1e18 = JSBI.BigInt(1e18)
export const _1e12 = JSBI.BigInt(1e12)
export const _1e9 = JSBI.BigInt(1e9)
export const _1e6 = JSBI.BigInt(1e6)

export const MAX_SAFE_INTEGER = JSBI.BigInt(Number.MAX_SAFE_INTEGER)
export const MAX_UINT256 = JSBI.BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')

// 2^128 - 1
export const MAX_UINT128 = JSBI.subtract(JSBI.exponentiate(JSBI.BigInt('2'), JSBI.BigInt(128)), JSBI.BigInt(1))

export const ZERO_PERCENT = new Percent(0)
