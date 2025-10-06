import { withoutScientificNotation } from 'sushi'

export const formatPactDecimal = (value: number): string => {
  if (!Number.isFinite(value)) return '0.0'

  // Get the string representation
  const str = withoutScientificNotation(value.toString())
  if (!str) return '0.0'

  // Figure out how many decimal places exist (if any)
  const decimalIndex = str.indexOf('.')
  const dp = decimalIndex >= 0 ? str.length - decimalIndex - 1 : 0

  // Match the original behavior: at least 1 decimal place
  const places = dp > 0 ? dp : 1

  return value.toFixed(places)
}
