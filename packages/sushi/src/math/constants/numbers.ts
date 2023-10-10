import Percent from '../Percent.js'

export const ZERO = 0n
export const ONE = 1n
export const TWO = 2n
export const THREE = 3n
export const FIVE = 5n
export const TEN = 10n

export const _100 = 100n
export const _997 = 997n
export const _1000 = 1000n
export const _9994 = 9994n
export const _9995 = 9995n
export const _10000 = 10000n

export const _1e18 = 10n ** 18n
export const _1e12 = 10n ** 12n
export const _1e9 = 10n ** 9n
export const _1e6 = 10n ** 6n

export const MAX_SAFE_INTEGER = BigInt(Number.MAX_SAFE_INTEGER)
export const MAX_UINT256 = BigInt(
  '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
)

// 2^128 - 1
export const MAX_UINT128 = 2n ** 128n - 1n

export const ZERO_PERCENT = new Percent(0)
