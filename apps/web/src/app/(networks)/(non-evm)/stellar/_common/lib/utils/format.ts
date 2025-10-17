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
