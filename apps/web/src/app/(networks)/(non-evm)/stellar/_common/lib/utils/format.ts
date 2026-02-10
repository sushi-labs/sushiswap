/**
 * Format fee from basis points to percentage
 * e.g., 500 -> 0.05%, 3000 -> 0.3%, 10000 -> 1%
 */
export function formatFee(fee: number, precision?: number): string {
  const percentage = fee / 10000
  if (precision !== undefined) {
    return `${percentage.toFixed(precision)}%`
  }
  return `${percentage}%`
}

/**
 * Abbreviates a wallet address to be more compact, showing the first 6 and the last 4 characters. This works with stellar address strings.
 * @param address The wallet address string
 * @returns An obfuscated address GABCD...1234
 */
export const formatAddress = (address: string | undefined | null): string => {
  if (!address) {
    return ''
  }
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}
