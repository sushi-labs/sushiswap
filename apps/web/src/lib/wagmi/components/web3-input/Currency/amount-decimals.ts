import { formatUnits, parseUnits } from 'viem'

const DECIMAL_AMOUNT_PATTERN = /^\d*\.?\d+$/

export function truncateAmountToDecimals(
  value: string,
  decimals: number,
): string | undefined {
  if (!DECIMAL_AMOUNT_PATTERN.test(value)) return undefined

  const [whole = '', fraction] = value.split('.')
  if (fraction === undefined || fraction.length <= decimals) return value

  const truncated =
    decimals === 0
      ? whole || '0'
      : `${whole || '0'}.${fraction.slice(0, decimals)}`

  return formatUnits(parseUnits(truncated, decimals), decimals)
}
