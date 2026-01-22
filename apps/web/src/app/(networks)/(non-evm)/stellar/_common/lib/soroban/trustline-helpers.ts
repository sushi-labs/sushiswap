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
 * Cache for asset issuer lookups to avoid repeated API calls
 */
const assetIssuerCache = new Map<string, string | null>()

/**
 * Look up asset info from StellarExpert by contract address
 * This is more reliable than looking up by asset code since it uses the exact contract
 */
async function lookupAssetByContract(
  contractAddress: string,
): Promise<{ code: string; issuer: string } | null> {
  try {
    // StellarExpert has an API to get asset info by contract address
    const response = await fetch(
      `https://api.stellar.expert/explorer/public/contract/${contractAddress}`,
      { headers: { Accept: 'application/json' } },
    )

    if (!response.ok) {
      return null
    }

    const data = await response.json()

    // Check if this contract is a SAC (Stellar Asset Contract)
    // The response should include the underlying asset info
    if (data?.asset) {
      // Asset format is typically "CODE-ISSUER" or just the asset details
      const assetStr = data.asset
      if (typeof assetStr === 'string' && assetStr.includes('-')) {
        const [code, issuer] = assetStr.split('-')
        if (code && issuer?.startsWith('G')) {
          return { code, issuer }
        }
      }
    }

    // Alternative: check if there's issuer info directly
    if (data?.issuer && typeof data.issuer === 'string') {
      return { code: data.code || '', issuer: data.issuer }
    }

    return null
  } catch {
    return null
  }
}

/**
 * Look up asset issuer from Horizon by matching the contract address to a SAC
 * SAC contract addresses are deterministic based on the asset
 */
async function lookupIssuerFromHorizon(
  assetCode: string,
  contractAddress: string,
): Promise<string | null> {
  try {
    // Query Horizon for assets with this code
    const assets = await horizonServer
      .assets()
      .forCode(assetCode)
      .limit(50)
      .call()

    // For each asset, compute what its SAC address would be and compare
    for (const asset of assets.records) {
      if (asset.asset_issuer) {
        try {
          // Create the Stellar Asset object
          const stellarAsset = new StellarSdk.Asset(
            asset.asset_code,
            asset.asset_issuer,
          )

          // Get the SAC contract ID for this asset
          const sacContractId = stellarAsset.contractId(NETWORK_PASSPHRASE)

          // Compare with the contract address we're looking for
          if (sacContractId.toUpperCase() === contractAddress.toUpperCase()) {
            return asset.asset_issuer
          }
        } catch {}
      }
    }

    return null
  } catch {
    return null
  }
}

/**
 * Check if an asset requires a trustline by querying multiple sources
 *
 * This uses a multi-step lookup:
 * 1. If issuer is already known, use it
 * 2. Try StellarExpert API to look up asset by contract address
 * 3. Try Horizon and match SAC contract IDs
 *
 * @param contractAddress - The token contract address (C... format)
 * @param assetCode - The asset code (e.g., "USDC", "AQUA")
 * @param assetIssuer - Optional pre-known issuer (G... address)
 * @returns Object with whether trustline is required and the issuer if found
 */
export async function checkTrustlineRequired(
  contractAddress: string,
  assetCode: string,
  assetIssuer?: string,
): Promise<{ required: boolean; issuer: string | null }> {
  // XLM (native) never needs a trustline
  if (assetCode === 'XLM' || assetCode === 'native') {
    return { required: false, issuer: null }
  }

  // If we already have an issuer, use it
  if (assetIssuer?.startsWith('G')) {
    return { required: true, issuer: assetIssuer }
  }

  // Check cache first
  const cacheKey = contractAddress.toUpperCase()
  const cachedIssuer = assetIssuerCache.get(cacheKey)
  if (cachedIssuer !== undefined) {
    if (cachedIssuer === null) {
      return { required: false, issuer: null }
    }
    return { required: true, issuer: cachedIssuer }
  }

  // Step 1: Try StellarExpert lookup by contract address
  const stellarExpertResult = await lookupAssetByContract(contractAddress)
  if (stellarExpertResult?.issuer) {
    assetIssuerCache.set(cacheKey, stellarExpertResult.issuer)
    return { required: true, issuer: stellarExpertResult.issuer }
  }

  // Step 2: Try Horizon lookup by matching SAC contract IDs
  const horizonIssuer = await lookupIssuerFromHorizon(
    assetCode,
    contractAddress,
  )
  if (horizonIssuer) {
    assetIssuerCache.set(cacheKey, horizonIssuer)
    return { required: true, issuer: horizonIssuer }
  }

  // Cache as null (no trustline needed) for future lookups
  assetIssuerCache.set(cacheKey, null)

  // If we couldn't find the asset, assume it's a pure Soroban token
  // (no trustline needed)
  return { required: false, issuer: null }
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
