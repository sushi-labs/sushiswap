// Add 20%
export function gasMargin(value: bigint): bigint {
  return (value * 120n) / 100n
}

// export function gasMargin(value: bigint): bigint {
//   return (value * BigInt(120)) / BigInt(100)
// }
