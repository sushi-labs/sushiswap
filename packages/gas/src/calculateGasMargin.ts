import { BigNumber } from 'ethers'

export function calculateGasMargin(value: BigNumber): BigNumber {
  return value.mul(120).div(100)
}
