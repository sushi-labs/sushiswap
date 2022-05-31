import { BigNumber, BigNumberish } from '@ethersproject/bignumber'

export const ZERO = BigNumber.from('0')

export function e10(exponent: BigNumber | number | string): BigNumber {
  return BigNumber.from('10').pow(BigNumber.from(exponent))
}

export function minimum(...values: BigNumberish[]): BigNumber {
  let lowest = BigNumber.from(values[0])
  for (let i = 1; i < values.length; i++) {
    const value = BigNumber.from(values[i])
    if (value.lt(lowest)) {
      lowest = value
    }
  }
  return lowest
}

export function maximum(...values: BigNumberish[]): BigNumber {
  let highest = BigNumber.from(values[0])
  for (let i = 1; i < values.length; i++) {
    const value = BigNumber.from(values[i])
    if (value.gt(highest)) {
      highest = value
    }
  }
  return highest
}
