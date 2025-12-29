import * as StellarSdk from '@stellar/stellar-sdk'
import { Horizon } from '@stellar/stellar-sdk'
import { HORIZON_URL, NETWORK_PASSPHRASE } from '../constants'

const horizonServer = new Horizon.Server(HORIZON_URL)

/**
 * Asset type from Horizon API
 */
export interface HorizonAssetInfo {
  asset_type: 'native' | 'credit_alphanum4' | 'credit_alphanum12'
  asset_code?: string
  asset_issuer?: string
  paging_token: string
}

/**
 * Check if an asset requires a trustline (Classic Assets)
 *
 * Based on Stellar's asset types:
 * - XLM (native): No trustline needed
 * - Classic Assets (credit_alphanum4/12 with G... issuer): Trustline required
 * - Pure Soroban tokens (C... contract only, no issuer): No trustline needed
 * - SAC-wrapped Classic Assets (C... contract WITH G... issuer): Trustline required
 *
 * Important: SAC (Stellar Asset Contracts) that wrap classic assets still require
 * trustlines on the underlying classic asset. The SAC contract is just an interface
 * to the classic asset, but the actual token storage is on the classic ledger.
 *
 * @param tokenAddress - The token contract address
 * @param assetCode - The asset code (e.g., "USDC", "XLM", "HYPE")
 * @param assetIssuer - The asset issuer (for classic assets, G... address)
 * @returns true if asset requires trustline, false otherwise
 */
export function requiresTrustline(
  assetCode?: string,
  assetIssuer?: string,
): boolean {
  // XLM (native) never needs a trustline, regardless of how it's represented
  if (assetCode === 'XLM' || assetCode === 'native') {
    return false
  }

  // If there's an issuer (G... address), it's a classic asset that needs trustline
  // This applies even if the token also has a SAC contract address (C...)
  // SAC-wrapped classic assets still require trustlines on the underlying asset
  if (assetIssuer?.startsWith('G')) {
    return true
  }

  // Pure Soroban tokens (C... contract with no issuer) don't need trustlines
  // These are native Soroban tokens, not wrapped classic assets
  return false
}

/**
 * Query Horizon API to get asset information and determine asset type
 *
 * Following the pattern:
 * - asset_type === "native" → XLM (no trustline needed)
 * - asset_type.includes("credit_alphanum") → Classic asset (trustline required)
 * - Has contract_address → SAC asset (no trustline needed)
 *
 * @param assetCode - The asset code (e.g., "USDC", "XLM")
 * @param assetIssuer - The issuer account (G... address for classic assets)
 */
export async function getAssetInfo(
  assetCode: string,
  assetIssuer?: string,
): Promise<HorizonAssetInfo | null> {
  try {
    if (!assetIssuer) {
      // If no issuer, it's XLM (native)
      return {
        asset_type: 'native',
        paging_token: '',
      }
    }

    // Query Horizon for asset information
    const assets = await horizonServer
      .assets()
      .forCode(assetCode)
      .forIssuer(assetIssuer)
      .call()

    if (assets.records.length > 0) {
      const asset = assets.records[0] as HorizonAssetInfo

      // Validate asset type - native, credit_alphanum4, or credit_alphanum12
      if (
        asset.asset_type === 'native' ||
        asset.asset_type === 'credit_alphanum4' ||
        asset.asset_type === 'credit_alphanum12'
      ) {
        return asset
      }
    }

    return null
  } catch (error) {
    console.error('Error fetching asset info from Horizon:', error)
    return null
  }
}

/**
 * Check if a user has a trustline for a specific classic asset
 *
 * Steps:
 * 1. Get the publicKey of the wallet
 * 2. Fetch account details from Horizon
 * 3. Get balances of connected account
 * 4. Check if asset_code + asset_issuer combination exists in balances
 *
 * Classic assets are uniquely identified by: asset_code + issuer_account
 * Example: USDC:GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN
 *
 * @param userAddress - User's public key (G... address)
 * @param assetCode - Asset code (e.g., "USDC")
 * @param assetIssuer - Issuer account (G... address)
 */
export async function hasTrustline(
  userAddress: string,
  assetCode: string,
  assetIssuer: string,
): Promise<boolean> {
  try {
    // Fetch account details using publicKey
    const account = await horizonServer.loadAccount(userAddress)

    // Get balances and check if asset_code + asset_issuer combination exists
    const balance = account.balances.find(
      (b) =>
        b.asset_type !== 'native' &&
        'asset_code' in b &&
        'asset_issuer' in b &&
        b.asset_code === assetCode &&
        b.asset_issuer === assetIssuer,
    )

    return !!balance
  } catch (error) {
    console.error('Error checking trustline:', error)
    return false
  }
}

/**
 * Create a trustline for a native asset
 * This is required before a user can receive or swap native Stellar assets
 */
export async function createTrustline(
  userAddress: string,
  assetCode: string,
  assetIssuer: string,
  signTransaction: (xdr: string) => Promise<string>,
  limit?: string,
): Promise<{ success: boolean; txHash?: string; error?: string }> {
  try {
    // Load the user's account
    const account = await horizonServer.loadAccount(userAddress)

    // Create the asset
    const asset = new StellarSdk.Asset(assetCode, assetIssuer)

    // Build the change trust operation
    const changeTrustOp = StellarSdk.Operation.changeTrust({
      asset: asset,
      limit: limit || '922337203685.4775807', // Max limit if not specified
    })

    // Build the transaction
    const transaction = new StellarSdk.TransactionBuilder(account, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(changeTrustOp)
      .setTimeout(180)
      .build()

    // Get unsigned XDR
    const unsignedXdr = transaction.toXDR()

    // Sign the transaction
    const signedXdr = await signTransaction(unsignedXdr)

    // Parse signed XDR and submit to network
    const signedTx = StellarSdk.TransactionBuilder.fromXDR(
      signedXdr,
      NETWORK_PASSPHRASE,
    )
    const result = await horizonServer.submitTransaction(signedTx)

    return {
      success: true,
      txHash: result.hash,
    }
  } catch (error) {
    console.error('Error creating trustline:', error)

    // Extract meaningful error message
    let errorMessage = 'Failed to create trustline'
    let operationCode = ''

    if (error instanceof Error) {
      errorMessage = error.message

      // Check for Horizon API error format (BadResponseError from stellar-sdk)
      const errorWithResponse = error as Error & {
        response?: {
          data?: {
            extras?: {
              result_codes?: {
                operations?: string[]
                transaction?: string
              }
            }
          }
        }
      }

      if (errorWithResponse.response?.data?.extras?.result_codes) {
        const resultCodes = errorWithResponse.response.data.extras.result_codes
        if (resultCodes.operations?.[0]) {
          operationCode = resultCodes.operations[0]
        } else if (resultCodes.transaction) {
          operationCode = resultCodes.transaction
        }
      }
    } else if (typeof error === 'object' && error !== null) {
      // Handle non-Error objects
      const errorObj = error as Record<string, unknown>
      if (errorObj.message && typeof errorObj.message === 'string') {
        errorMessage = errorObj.message
      } else {
        // Try to stringify but avoid [object Object]
        try {
          const stringified = JSON.stringify(error)
          if (stringified !== '{}') {
            errorMessage = stringified
          }
        } catch {
          errorMessage = 'Failed to create trustline'
        }
      }
    } else if (typeof error === 'string') {
      errorMessage = error
    }

    // Map common Stellar operation codes to user-friendly messages
    // Reference: https://developers.stellar.org/docs/data/apis/horizon/api-reference/errors/result-codes/operation-specific/change-trust
    if (operationCode) {
      const friendlyMessages: Record<string, string> = {
        // Change Trust errors
        op_low_reserve:
          'Your account lacks sufficient XLM to meet the minimum reserve required when adding a trustline. Each trustline increases your minimum XLM reserve. Please add more XLM to your wallet.',
        op_invalid_limit:
          'The limit is not sufficient to hold the current balance of the trustline and still satisfy its buying liabilities.',
        op_no_issuer: 'The asset issuer account does not exist.',
        op_not_authorized:
          'You are not authorized to hold this asset. The issuer has not authorized your account.',
        op_self_not_allowed:
          'Cannot create a trustline to your own account. The source account attempted to create a trustline for itself.',
        op_line_full: 'Trustline limit would be exceeded.',
        // Transaction-level errors
        tx_insufficient_fee: 'Insufficient fee. Please try again.',
        tx_bad_auth:
          'Transaction authorization failed. Please reconnect your wallet and try again.',
        tx_insufficient_balance:
          'Insufficient XLM balance to complete this transaction.',
      }

      errorMessage =
        friendlyMessages[operationCode] ||
        `Transaction failed: ${operationCode}`
    }

    return {
      success: false,
      error: errorMessage,
    }
  }
}

/**
 * Check and create trustline if needed before a swap
 *
 * Determines if trustline is required based on:
 * - XLM (native): No trustline needed
 * - Pure Soroban tokens (C... contract only): No trustline needed
 * - Classic assets (with G... issuer): Trustline required
 * - SAC-wrapped classic assets (C... contract + G... issuer): Trustline required
 *
 * @returns Object with success status, whether trustline was created, and any error
 */
export async function ensureTrustline(
  userAddress: string,
  assetCode: string,
  assetIssuer: string,
  signTransaction: (xdr: string) => Promise<string>,
): Promise<{ success: boolean; created: boolean; error?: string }> {
  try {
    // Check if this asset requires a trustline (passing assetCode for XLM detection)
    if (!requiresTrustline(assetCode, assetIssuer)) {
      // XLM, pure Soroban token, or no issuer - no trustline needed
      return { success: true, created: false }
    }

    // If no issuer provided, no trustline needed (pure Soroban token)
    if (!assetIssuer || assetIssuer === '') {
      return { success: true, created: false }
    }

    // Check if trustline already exists for this asset_code + issuer combination
    const exists = await hasTrustline(userAddress, assetCode, assetIssuer)

    if (exists) {
      return { success: true, created: false }
    }

    // Create trustline for classic asset (including SAC-wrapped classic assets)
    const result = await createTrustline(
      userAddress,
      assetCode,
      assetIssuer,
      signTransaction,
    )

    if (!result.success) {
      return {
        success: false,
        created: false,
        error: result.error,
      }
    }

    return { success: true, created: true }
  } catch (error) {
    console.error('Error ensuring trustline:', error)
    return {
      success: false,
      created: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

/**
 * Get all trustlines for a user
 */
export async function getUserTrustlines(userAddress: string): Promise<
  Array<{
    assetCode: string
    assetIssuer: string
    balance: string
    limit: string
  }>
> {
  try {
    const account = await horizonServer.loadAccount(userAddress)

    return account.balances
      .filter(
        (b) =>
          b.asset_type !== 'native' && 'asset_code' in b && 'asset_issuer' in b,
      )
      .map((b) => {
        if ('asset_code' in b && 'asset_issuer' in b && 'limit' in b) {
          return {
            assetCode: b.asset_code,
            assetIssuer: b.asset_issuer,
            balance: b.balance,
            limit: b.limit,
          }
        }
        return null
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)
  } catch (error) {
    console.error('Error fetching user trustlines:', error)
    return []
  }
}
