// Add 20%
export function gasMargin(value: bigint): bigint {
  return (value * 120n) / 100n
}
