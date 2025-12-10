import { Account, StrKey } from '@stellar/stellar-sdk'

export const ZERO_ADDRESS =
  'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF'

// Create a dummy account for simulation
export const SIMULATION_ACCOUNT = new Account(ZERO_ADDRESS, '0')

export const DEFAULT_TIMEOUT = 180

/**
 * Uniswap V3 style sqrt price ratio bounds
 * These are the standard bounds for sqrt(price) * 2^96 representation
 *
 * MIN_SQRT_RATIO corresponds to tick -887272 (minimum valid tick)
 * MAX_SQRT_RATIO corresponds to tick 887272 (maximum valid tick)
 */
export const MIN_SQRT_RATIO = 4295128739n
export const MAX_SQRT_RATIO = 1461446703485210103287273052203988822378723970342n

/**
 * Compare two Stellar contract addresses by their decoded bytes.
 *
 * IMPORTANT: Stellar pools order tokens by the raw bytes of their addresses,
 * NOT by string comparison of the base32-encoded addresses. Base32 encoding
 * does not preserve byte ordering, so we must decode and compare the raw bytes.
 *
 * @param addressA - First contract address (C... format)
 * @param addressB - Second contract address (C... format)
 * @returns negative if A < B, positive if A > B, 0 if equal
 */
export function compareContractAddresses(
  addressA: string,
  addressB: string,
): number {
  // Decode the base32 contract addresses to raw bytes
  const bytesA = StrKey.decodeContract(addressA)
  const bytesB = StrKey.decodeContract(addressB)

  // Compare byte by byte
  const minLength = Math.min(bytesA.length, bytesB.length)
  for (let i = 0; i < minLength; i++) {
    if (bytesA[i] !== bytesB[i]) {
      return bytesA[i] - bytesB[i]
    }
  }

  // If all compared bytes are equal, shorter array comes first
  return bytesA.length - bytesB.length
}

/**
 * Check if addressA is the "lower" address (token0) in pool ordering.
 * Pools order tokens by decoded bytes, not string comparison.
 *
 * @param addressA - First contract address
 * @param addressB - Second contract address
 * @returns true if addressA < addressB in byte ordering
 */
export function isAddressLower(addressA: string, addressB: string): boolean {
  return compareContractAddresses(addressA, addressB) < 0
}

/**
 * Get the appropriate sqrt price limit for a swap based on direction.
 *
 * In Uniswap V3 style pools:
 * - When swapping token0 -> token1 (zeroForOne = true), price DECREASES
 *   → Use MIN_SQRT_RATIO + 1 as the lower limit
 * - When swapping token1 -> token0 (zeroForOne = false), price INCREASES
 *   → Use MAX_SQRT_RATIO - 1 as the upper limit
 *
 * @param tokenIn - The address of the token being sold
 * @param tokenOut - The address of the token being bought
 * @returns The appropriate sqrt price limit for the swap direction
 */
export function getSqrtPriceLimitForSwap(
  tokenIn: string,
  tokenOut: string,
): bigint {
  // In pools, token0 < token1 (ordered by decoded bytes, not string comparison)
  // zeroForOne = true when we're selling token0 (the lower address by bytes)
  const zeroForOne = isAddressLower(tokenIn, tokenOut)

  if (zeroForOne) {
    // Selling token0 for token1 → price decreases → use low limit
    return MIN_SQRT_RATIO + 1n
  } else {
    // Selling token1 for token0 → price increases → use high limit
    return MAX_SQRT_RATIO - 1n
  }
}
