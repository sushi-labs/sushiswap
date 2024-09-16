export function getBigInt(value: number): bigint {
  const v = Math.abs(value)
  if (v < Number.MAX_SAFE_INTEGER) return BigInt(Math.round(value))

  const exp = Math.floor(Math.log(v) / Math.LN2)
  console.assert(exp >= 51, 'Internal Error 314')
  const shift = exp - 51
  const mant = Math.round(v / 2 ** shift)
  const res = BigInt(mant) * 2n ** BigInt(shift)
  return value > 0 ? res : res * -1n
}
