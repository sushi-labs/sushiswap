import { BigNumber } from '@ethersproject/bignumber'

interface Rebase {
  base: BigNumber
  elastic: BigNumber
}

export function rebase(value: BigNumber, from: BigNumber, to: BigNumber): BigNumber {
  return from ? value.mul(to).div(from) : BigNumber.from(0)
}

export function toElastic(total: Rebase, base: BigNumber, roundUp: boolean): BigNumber {
  let elastic: BigNumber
  if (total.base.eq(BigNumber.from(0))) {
    elastic = base
  } else {
    elastic = base.mul(total.elastic).div(total.base)
    if (roundUp && elastic.mul(total.base).div(total.elastic).lt(base)) {
      elastic = elastic.add(1)
    }
  }

  return elastic
}
