import { DEFAULT_SLIPPAGE } from 'sushi/evm'

const SLIPPAGE_PATTERN = /^(?:\d+|\d*\.\d{1,2})$/
const MAX_SLIPPAGE_BASIS_POINTS = 5_000

export function getSlippageToleranceBasisPoints(
  value: unknown,
): number | undefined {
  const candidate = value === 'AUTO' ? DEFAULT_SLIPPAGE : value
  if (typeof candidate !== 'string' && typeof candidate !== 'number') {
    return undefined
  }

  const decimal = String(candidate)
  if (!SLIPPAGE_PATTERN.test(decimal)) return undefined

  const [whole, fraction = ''] = decimal.split('.')
  const basisPoints =
    BigInt(whole || '0') * 100n + BigInt(fraction.padEnd(2, '0'))

  if (basisPoints <= 0n || basisPoints > BigInt(MAX_SLIPPAGE_BASIS_POINTS)) {
    return undefined
  }

  return Number(basisPoints)
}

export function normalizeSlippageTolerance(value: unknown): string | undefined {
  if (value === 'AUTO') return 'AUTO'
  return getSlippageToleranceBasisPoints(value) === undefined
    ? undefined
    : String(value)
}
