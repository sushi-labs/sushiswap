import { Errors as PoolErrors } from '@sushiswap/stellar-contract-binding-pool'
import { Errors as PositionManagerErrors } from '@sushiswap/stellar-contract-binding-position-manager'
import { SwapRouterError } from '@sushiswap/stellar-contract-binding-router'

/**
 * Utility functions for error handling and user-friendly error messages
 */

/**
 * Map contract error codes to user-friendly messages
 * Using error codes from the contract bindings with custom descriptions
 */
const ERROR_MESSAGES: Record<number | string, string> = {
  // SwapRouter errors (based on SwapRouterError)
  ...(SwapRouterError[3] && {
    3: 'Transaction deadline has passed. Please try again.',
  }),
  ...(SwapRouterError[4] && {
    4: 'Insufficient output amount. Try increasing slippage tolerance.',
  }),
  ...(SwapRouterError[5] && { 5: 'Excessive input amount required.' }),
  ...(SwapRouterError[6] && { 6: 'Invalid swap path selected.' }),
  ...(SwapRouterError[9] && {
    9: 'Invalid amount (must be greater than zero).',
  }),
  ...(SwapRouterError[10] && {
    10: 'Insufficient liquidity in pool. Try a smaller amount.',
  }),
  ...(SwapRouterError[11] && {
    11: 'Price limit exceeded. The price moved too much.',
  }),
  ...(SwapRouterError[12] && { 12: 'Not authorized to perform this action.' }),
  ...(SwapRouterError[16] && {
    16: 'Max slippage too low. Try increasing slippage tolerance.',
  }),

  // Position Manager errors (based on PositionManagerErrors)
  ...(PositionManagerErrors[1001] && {
    1001: 'Transaction deadline exceeded. Please try again.',
  }),
  ...(PositionManagerErrors[1005] && { 1005: 'Token does not exist.' }),
  ...(PositionManagerErrors[1006] && {
    1006: 'Not the owner of this position.',
  }),
  ...(PositionManagerErrors[1007] && { 1007: 'Unauthorized operation.' }),

  // Pool errors (based on PoolErrors)
  ...(PoolErrors[43] && { 43: 'Insufficient liquidity available.' }),
  ...(PoolErrors[70] && { 70: 'Insufficient token0 balance.' }),
  ...(PoolErrors[71] && { 71: 'Insufficient token1 balance.' }),
}

/**
 * Extract contract error code from error message
 */
function extractContractErrorCode(errorMessage: string): number | null {
  // Match patterns like "Error(Contract, #3)" or "Error #3"
  const patterns = [
    /Error\(Contract,\s*#(\d+)\)/,
    /Error\s*#(\d+)/,
    /code:\s*(\d+)/i,
    /error_code:\s*(\d+)/i,
  ]

  for (const pattern of patterns) {
    const match = errorMessage.match(pattern)
    if (match?.[1]) {
      return Number.parseInt(match[1], 10)
    }
  }

  return null
}

/**
 * Extract a user-friendly error message from various error types
 */
export function extractErrorMessage(error: unknown): string {
  // If error is already a string, check for error codes
  if (typeof error === 'string') {
    const errorCode = extractContractErrorCode(error)
    if (errorCode && ERROR_MESSAGES[errorCode]) {
      return ERROR_MESSAGES[errorCode]
    }
    return error
  }

  // If error is an Error object
  if (
    error instanceof Error ||
    (typeof error === 'object' && error !== null && 'message' in error)
  ) {
    const errorMessage = error.message
    if (typeof errorMessage === 'string') {
      // Try to extract contract error code
      const errorCode = extractContractErrorCode(errorMessage)
      if (errorCode && ERROR_MESSAGES[errorCode]) {
        return ERROR_MESSAGES[errorCode]
      }

      // Check for specific Stellar/Soroban error patterns
      if (errorMessage.includes('simulation failed')) {
        return 'Transaction simulation failed. Please check your inputs and try again.'
      }
      if (errorMessage.includes('insufficient balance')) {
        return 'Insufficient balance to complete this transaction.'
      }

      // If we have a readable message (not JSON), return it
      if (
        errorMessage &&
        !errorMessage.includes('{') &&
        !errorMessage.includes('[')
      ) {
        return errorMessage
      }
    }
  }

  // Try to parse JSON errors
  try {
    const errorStr = String(error)
    if (errorStr.includes('{') || errorStr.includes('[')) {
      const parsed = JSON.parse(errorStr)

      // Look for error code in parsed object
      if (parsed.code && ERROR_MESSAGES[parsed.code]) {
        return ERROR_MESSAGES[parsed.code]
      }

      // Look for common error fields
      if (parsed.message) return extractErrorMessage(parsed.message)
      if (parsed.error) return extractErrorMessage(parsed.error)
      if (parsed.reason) return parsed.reason
      if (parsed.details) return parsed.details
    }
  } catch {
    // Failed to parse JSON, continue
  }

  // Default fallback
  return 'Transaction failed. Check contract parameters and authorization.'
}

/**
 * Parse slippage tolerance value safely
 */
export function parseSlippageTolerance(
  value: string | number | undefined,
): number {
  if (value === undefined || value === null || value === 'AUTO') {
    return 0.5 // Default 0.5%
  }

  const parsed = typeof value === 'string' ? Number.parseFloat(value) : value

  // Validate the parsed value
  if (Number.isNaN(parsed) || parsed < 0 || parsed > 100) {
    console.warn(
      `Invalid slippage tolerance value: ${value}, using default 0.5%`,
    )
    return 0.5
  }

  return parsed
}

/**
 * Format slippage tolerance for display
 */
export function formatSlippageTolerance(value: string | number): string {
  if (value === 'AUTO') return 'Auto (0.5%)'

  const parsed = parseSlippageTolerance(value)
  return `${parsed}%`
}
