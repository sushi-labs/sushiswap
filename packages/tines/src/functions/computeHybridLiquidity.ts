import { A_PRECISION } from '../constants'
import { BigNumber } from '@ethersproject/bignumber'

export function computeHybridLiquidity(r0: BigNumber, r1: BigNumber, a: number): BigNumber {
  if (r0.isZero() && r1.isZero()) {
    return BigNumber.from(0)
  }

  const s = r0.add(r1)

  const nA = BigNumber.from(a * 2)

  let prevD

  let D = s
  for (let i = 0; i < 256; i++) {
    const dP = D.mul(D).div(r0).mul(D).div(r1).div(4)
    prevD = D
    D = nA
      .mul(s)
      .div(A_PRECISION)
      .add(dP.mul(2))
      .mul(D)
      .div(nA.div(A_PRECISION).sub(1).mul(D).add(dP.mul(3)))
    if (D.sub(prevD).abs().lte(1)) {
      break
    }
  }

  return D
}
