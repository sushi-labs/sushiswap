import type { BigNumber } from 'ethers'

// Add 20%
export function calculateGasMargin(value: bigint | BigNumber): bigint | BigNumber {
  if (typeof value === 'bigint') return (value * BigInt(120)) / BigInt(100)
  return value.mul(120).div(100)
}

// export function calculateGasMargin(value: BigNumber): BigNumber {
//   return value.mul(120).div(100)
// }

// export function calculateGasMargin(value: bigint): bigint {
//   return (value * BigInt(120)) / BigInt(100)
// }
