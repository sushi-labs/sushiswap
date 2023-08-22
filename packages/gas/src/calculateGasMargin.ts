// Add 20%
export function calculateGasMargin(value: bigint): bigint {
  return (value * 120n) / 100n
}
