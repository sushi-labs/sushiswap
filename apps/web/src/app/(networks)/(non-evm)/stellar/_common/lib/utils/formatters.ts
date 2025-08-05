import { DEFAULT_DECIMALS_PRECISION } from '~stellar/_common/lib/constants'

/**
 * Abbreviates a wallet address to be more compact, showing the first 6 and the last 4 characters. This works with stellar address strings.
 * @param address The wallet address string
 * @returns An obfuscated address GABCD...1234
 */
export const formatAddress = (address: string | undefined | null): string => {
  if (!address) return ''
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
}

/**
 * Formats XLM value from stroops (smallest unit) to human-readable XLM amount
 * @param value The value in stroops (bigint)
 * @param decimals Number of decimal places to show (default: 4)
 * @returns A formatted XLM string
 */
export const formatXLM = (value: bigint, decimals = 2) => {
  // Convert stroops to XLM (1 XLM = 10^7 stroops)
  const xlmValue = Number(value) / 10000000
  return formatDecimal(xlmValue, decimals)
}

/**
 * Formats a number with proper decimal places and optionally in USD
 * @param value The number to format
 * @param decimals Number of decimal places
 * @param displayAsUSD Whether to display the number as USD
 * @returns A formatted string with proper decimal places
 */
export const formatDecimal = (
  value: number | string | null,
  decimals = DEFAULT_DECIMALS_PRECISION,
  displayAsUSD = false,
): string => {
  if (!value) return '-'

  let options: Intl.NumberFormatOptions = {
    style: 'decimal',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }

  if (displayAsUSD) {
    options = {
      ...options,
      style: 'currency',
      currency: 'USD',
      currencyDisplay: 'narrowSymbol',
    }
  }

  return Intl.NumberFormat('en-US', options).format(Number(value)).toLowerCase()
}

/**
 * Formats a number in compact notation and optionally in USD
 * @param value The number to format
 * @param decimals Number of decimal places
 * @param displayAsUSD Whether to display the number as USD
 * @returns A formatted string
 */
export const formatCompact = (
  value: number | string | null,
  decimals = DEFAULT_DECIMALS_PRECISION,
  displayAsUSD = false,
): string => {
  if (!value) return '-'

  let options: Intl.NumberFormatOptions = {
    notation: 'compact',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }

  if (displayAsUSD) {
    options = {
      ...options,
      style: 'currency',
      currency: 'USD',
      currencyDisplay: 'narrowSymbol',
    }
  }

  return Intl.NumberFormat('en-US', options).format(Number(value)).toLowerCase()
}

/**
 * Formats a number as a percentage with specified decimal places
 * @param value The number to format (e.g., 0.42 for 42%)
 * @param decimals Number of decimal places
 * @returns A formatted percentage string
 */
export const formatPercentage = (
  value: number | string | null,
  decimals = DEFAULT_DECIMALS_PRECISION,
): string => {
  if (!value) return '-'

  const options: Intl.NumberFormatOptions = {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }

  return Intl.NumberFormat('en-US', options).format(Number(value))
}
