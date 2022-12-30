import JSBI from 'jsbi'
import invariant from 'tiny-invariant'

import { MAX_SAFE_INTEGER, ONE, TWO, ZERO } from '..'

/**
 * Computes floor(sqrt(value))
 * @param value the value for which to compute the square root, rounded down
 */
export function sqrt(value: JSBI): JSBI {
  invariant(JSBI.greaterThanOrEqual(value, ZERO), 'NEGATIVE')

  // rely on built in sqrt if possible
  if (JSBI.lessThan(value, MAX_SAFE_INTEGER)) {
    return JSBI.BigInt(Math.floor(Math.sqrt(JSBI.toNumber(value))))
  }

  let z: JSBI
  let x: JSBI
  z = value
  x = JSBI.add(JSBI.divide(value, TWO), ONE)
  while (JSBI.lessThan(x, z)) {
    z = x
    x = JSBI.divide(JSBI.add(JSBI.divide(value, x), x), TWO)
  }
  return z
}
