import { BigNumber } from '@ethersproject/bignumber'

export const ZERO = BigNumber.from('0')

export function e10(exponent: BigNumber | number | string): BigNumber {
  return BigNumber.from('10').pow(BigNumber.from(exponent))
}

