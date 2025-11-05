import * as StellarSdk from '@stellar/stellar-sdk'
import { Horizon } from '@stellar/stellar-sdk'
import { NETWORK_CONFIG } from './contract-addresses'

const horizonServer = new Horizon.Server(NETWORK_CONFIG.HORIZON_URL)

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
 * - SAC Assets (C... contract addresses): No trustline needed
 *
 * @param tokenAddress - The token contract address or issuer
 * @param assetIssuer - The asset issuer (for classic assets)
 * @returns true if asset requires trustline, false otherwise
 */
export function requiresTrustline(
  tokenAddress: string,
  assetIssuer?: string,
): boolean {
  // SAC (Stellar Asset Contract) addresses start with 'C' - no trustline needed
  if (tokenAddress.startsWith('C')) {
    return false
  }

  // If there's an issuer (G... address), it's a classic asset - needs trustline
  // Classic assets are identified by asset_code + issuer account (e.g., USDC:GA5ZS...)
  if (assetIssuer?.startsWith('G')) {
    return true
  }

  // No issuer typically means XLM (native) - no trustline needed
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
    console.log(
      `Creating trustline for ${assetCode}:${assetIssuer} for user ${userAddress}`,
    )

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
      networkPassphrase: NETWORK_CONFIG.PASSPHRASE,
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
      NETWORK_CONFIG.PASSPHRASE,
    )
    const result = await horizonServer.submitTransaction(signedTx)

    console.log('Trustline created successfully:', result.hash)

    return {
      success: true,
      txHash: result.hash,
    }
  } catch (error) {
    console.error('Error creating trustline:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

/**
 * Check and create trustline if needed before a swap
 *
 * Determines if trustline is required based on:
 * - SAC assets (C... addresses): No trustline needed
 * - XLM (native, no issuer): No trustline needed
 * - Classic assets (with issuer): Trustline required
 *
 * @returns Object with success status, whether trustline was created, and any error
 */
export async function ensureTrustline(
  userAddress: string,
  tokenAddress: string,
  assetCode: string,
  assetIssuer: string,
  signTransaction: (xdr: string) => Promise<string>,
): Promise<{ success: boolean; created: boolean; error?: string }> {
  try {
    // Check if this asset requires a trustline
    if (!requiresTrustline(tokenAddress, assetIssuer)) {
      // SAC token or XLM - no trustline needed
      return { success: true, created: false }
    }

    // If no issuer provided, it's XLM (no trustline needed)
    if (!assetIssuer || assetIssuer === '') {
      return { success: true, created: false }
    }

    // Check if trustline already exists for this asset_code + issuer combination
    const exists = await hasTrustline(userAddress, assetCode, assetIssuer)

    if (exists) {
      console.log(
        `✓ Trustline already exists for ${assetCode}:${assetIssuer.slice(0, 8)}...`,
      )
      return { success: true, created: false }
    }

    // Create trustline for classic asset
    console.log(
      `Creating trustline for ${assetCode}:${assetIssuer.slice(0, 8)}...`,
    )
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
