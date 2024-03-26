import invariant from 'tiny-invariant'
import { MAX_UINT256 } from '../../../math/index.js'

const POWERS_OF_2 = [128, 64, 32, 16, 8, 4, 2, 1].map(
  (pow: number): [number, bigint] => [pow, 2n ** BigInt(pow)],
)

export function mostSignificantBit(x: bigint): number {
  invariant(x > 0n, 'ZERO')
  invariant(x <= MAX_UINT256, 'MAX')

  let msb = 0
  for (const [power, min] of POWERS_OF_2) {
    if (x >= min) {
      x = x >> BigInt(power)
      msb += power
    }
  }
  return msb
}
