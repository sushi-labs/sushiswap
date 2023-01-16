import { BigNumber } from 'ethers'

// Add 20%
export function calculateGasMargin(value: BigNumber): BigNumber {
  return value.mul(120).div(100)
}
