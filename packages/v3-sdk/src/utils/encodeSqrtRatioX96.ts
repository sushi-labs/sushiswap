import { BigintIsh, JSBI, sqrt } from '@sushiswap/math'

/**
 * Returns the sqrt ratio as a Q64.96 corresponding to a given ratio of amount1 and amount0
 * @param amount1 The numerator amount i.e., the amount of token1
 * @param amount0 The denominator amount i.e., the amount of token0
 * @returns The sqrt ratio
 */

export function encodeSqrtRatioX96(amount1: BigintIsh, amount0: BigintIsh): JSBI {
  const numerator = JSBI.leftShift(JSBI.BigInt(amount1.toString()), JSBI.BigInt(192))
  const denominator = JSBI.BigInt(amount0.toString())
  const ratioX192 = JSBI.divide(numerator, denominator)
  return sqrt(ratioX192)
}
