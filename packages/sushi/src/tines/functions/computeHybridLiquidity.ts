import { abs } from '../../math/index.js'
import { A_PRECISION } from '../constants/index.js'

export function computeHybridLiquidity(
  r0: bigint,
  r1: bigint,
  a: number,
): bigint {
  if (r0 === 0n && r1 === 0n) {
    return 0n
  }

  const s = r0 + r1

  const nA = BigInt(a * 2)

  let prevD

  let D = s
  for (let i = 0; i < 256; i++) {
    const dP = (((D * D) / r0) * D) / r1 / 4n
    prevD = D
    D =
      (((nA * s) / A_PRECISION + 2n * dP) * D) / ((nA / A_PRECISION - 1n) * D) +
      3n * dP

    if (abs(D - prevD) <= 1) break
  }

  return D
}
