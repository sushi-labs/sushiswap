import { DEFAULT_DECIMALS_PRECISION } from '~stellar/_common/lib/constants'
import type { Token } from '../types/token.type'

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
 * Formats XLM value from stroops (smallest unit) to human-readable amount
 * @param value The value in stroops (bigint)
 * @param decimals Number of decimal places to show (default: 4)
 * @returns A formatted string
 */
export const formatXLM = (
  value: bigint,
  decimals = DEFAULT_DECIMALS_PRECISION,
) => {
  if (!value) return '0.00'
  // Convert stroops to XLM (1 XLM = 10^7 stroops)
  const xlmValue = Number(value) / 10000000
  return formatDecimal(xlmValue, decimals)
}

/**
 * Formats token value from stroops (smallest unit) to human-readable amount
 * @param value The value in stroops (bigint)
 * @param decimals Number of decimal places to show (default: 4)
 * @returns A formatted string
 */
export const formatTokenBalance = (
  value: bigint,
  token: Token,
  decimals = DEFAULT_DECIMALS_PRECISION,
) => {
  const tokenValue = Number(value) / 10 ** token.decimals
  return formatDecimal(tokenValue, decimals)
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

/**
 * Formats Stellar pool fee from stroops to percentage
 * @param fee The fee value in stroops (bigint, number, or string)
 * @param decimals Number of decimal places to show (default: 2)
 * @returns A formatted percentage string
 */
export const formatPoolFee = (
  fee: bigint | number | string | null,
  decimals = DEFAULT_DECIMALS_PRECISION,
): string => {
  if (!fee) return '0%'

  // Convert to number and divide by 1000000 to get the correct percentage
  // 3000n stroops = 0.3% (3000 / 1000000 * 100 = 0.3%)
  const feeValue = Number(fee) / 1000000

  const options: Intl.NumberFormatOptions = {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }

  return Intl.NumberFormat('en-US', options).format(feeValue)
}

/**
 * Formats token amount from smallest units to human-readable format
 * @param amount The amount in smallest units (bigint)
 * @param decimals Number of decimal places for the token
 * @param displayDecimals Number of decimal places to display (default: 2)
 * @returns A formatted string
 */
export const formatTokenAmount = (
  amount: bigint | number | string | null,
  decimals: number,
  displayDecimals = DEFAULT_DECIMALS_PRECISION,
): string => {
  if (!amount) return '0.00'

  const tokenAmount = Number(amount) / 10 ** decimals

  return tokenAmount.toLocaleString('en-US', {
    minimumFractionDigits: displayDecimals,
    maximumFractionDigits: displayDecimals,
  })
}

/**
 * Formats a number with decimals for display in token lists
 * Used for displaying token balances with appropriate precision
 * @param number The number in smallest units
 * @param decimals The token's decimal places
 * @returns A formatted string with adaptive decimal precision
 */
export const formatNumberWithDecimals = (
  number: number,
  decimals: number,
): string => {
  if (number === 0) return '0'
  let _number = (number / 10 ** decimals).toFixed(decimals)
  if (_number) {
    if (_number.includes('.') && _number.split('.')[1].length > 8) {
      _number = Number(_number).toFixed(8)
    }
    if (_number.includes('.') && Number.parseFloat(_number.split('.')[0]) > 0) {
      _number = Number(_number).toFixed(4)
    }
  } else {
    _number = '0'
  }
  if (Number(_number) < 0.000000001) {
    return '0'
  }
  return _number
}
