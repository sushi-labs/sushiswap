/**
 * Format token amount with a specific number of decimal places
 */
export function formatTokenAmountWithDecimals(
  amount: bigint,
  decimals: number,
  displayDecimals?: number,
): string {
  const divisor = BigInt(10 ** decimals)
  const wholePart = amount / divisor
  const fractionalPart = amount % divisor

  if (fractionalPart === 0n) {
    return wholePart.toString()
  }

  const fractionalStr = fractionalPart.toString().padStart(decimals, '0')
  const trimmedFractional = displayDecimals
    ? fractionalStr.substring(0, displayDecimals).replace(/0+$/, '')
    : fractionalStr.replace(/0+$/, '')

  if (trimmedFractional === '') {
    return wholePart.toString()
  }

  return `${wholePart}.${trimmedFractional}`
}

/**
 * Format token amount from raw units to display units (shows all decimals)
 */
export function formatTokenAmount(amount: bigint, decimals: number): string {
  return formatTokenAmountWithDecimals(amount, decimals)
}

/**
 * Format token amount for display in toasts/notifications
 * Uses significant figures to avoid showing "0.0000" for small values
 * @param amount The amount in smallest units (bigint)
 * @param decimals Number of decimal places for the token
 * @param significantFigures Number of significant figures to show (default: 6)
 * @returns A formatted string with appropriate precision
 */
export function formatTokenAmountForDisplay(
  amount: bigint,
  decimals: number,
  significantFigures = 6,
): string {
  if (amount === 0n) {
    return '0'
  }

  const divisor = BigInt(10 ** decimals)
  const value = Number(amount) / Number(divisor)

  if (value === 0) {
    return '0'
  }

  // Use toPrecision to get significant figures
  let formatted = value.toPrecision(significantFigures)

  // Handle both regular notation (e.g., "0.000123") and scientific notation (e.g., "1.23e-4")
  if (formatted.includes('e')) {
    // For scientific notation, convert to regular notation first
    // Use toFixed with enough precision to avoid scientific notation
    const num = Number.parseFloat(formatted)
    // Calculate the number of decimal places needed to avoid scientific notation
    const magnitude = Math.floor(Math.log10(Math.abs(num)))
    const decimalsNeeded = Math.max(0, -magnitude + significantFigures)
    formatted = num.toFixed(decimalsNeeded)
  }

  // Remove trailing zeros after decimal point, but keep at least one digit after decimal if there is a decimal point
  formatted = formatted.replace(/(\.\d+?)0+$/, '$1')

  return formatted
}
