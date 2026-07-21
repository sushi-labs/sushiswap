const UINT256_MAX = 2n ** 256n - 1n
const DECIMAL_INTEGER_PATTERN = /^\d+$/

export function parsePositionTokenId(
  value: number | string | undefined,
): bigint | undefined {
  if (value === undefined) return undefined

  if (typeof value === 'number') {
    if (!Number.isSafeInteger(value) || value <= 0) return undefined
  } else if (!DECIMAL_INTEGER_PATTERN.test(value)) {
    return undefined
  }

  const tokenId = BigInt(value)
  return tokenId > 0n && tokenId <= UINT256_MAX ? tokenId : undefined
}
