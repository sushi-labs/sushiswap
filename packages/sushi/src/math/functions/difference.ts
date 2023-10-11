export function difference(a: bigint, b: bigint): bigint {
  if (a > b) {
    return a - b
  }
  return b - a
}
