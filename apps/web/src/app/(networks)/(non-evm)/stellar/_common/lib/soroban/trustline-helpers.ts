import * as StellarSdk from '@stellar/stellar-sdk'
import { Horizon } from '@stellar/stellar-sdk'
import { isStellarAccountAddress } from 'sushi/stellar'
import type {
  StellarAccountAddress,
  StellarContractAddress,
} from 'sushi/stellar'
import { HORIZON_URL, NETWORK_PASSPHRASE } from '../constants'
import { SorobanClient, getTokenContractClient } from './client'

const horizonServer = new Horizon.Server(HORIZON_URL)

const assetIssuerCache = new Map<string, StellarAccountAddress | null>()

/** Resolve trustlines from the contract itself; indexer absence is not proof of a custom token. */
export async function checkTrustlineRequired(
  contractAddress: StellarContractAddress,
  assetCode: string,
  assetIssuer?: StellarAccountAddress | '',
): Promise<{ required: boolean; issuer: StellarAccountAddress | null }> {
  if (
    contractAddress === StellarSdk.Asset.native().contractId(NETWORK_PASSPHRASE)
  ) {
    return { required: false, issuer: null }
  }
  const cacheKey = `${contractAddress}:${assetCode}`
  if (assetIssuerCache.has(cacheKey)) {
    const issuer = assetIssuerCache.get(cacheKey) ?? null
    return { required: issuer !== null, issuer }
  }
  // https://developers.stellar.org/docs/tokens/stellar-asset-contract
  const entry = await SorobanClient.getContractData(
    contractAddress,
    StellarSdk.xdr.ScVal.scvLedgerKeyContractInstance(),
  )
  const executable = entry.val
    .contractData()
    .val()
    .instance()
    .executable()
    .switch().name
  if (executable === 'contractExecutableWasm') {
    assetIssuerCache.set(cacheKey, null)
    return { required: false, issuer: null }
  }
  if (executable !== 'contractExecutableStellarAsset')
    throw new Error('Unable to identify the token contract')
  let issuer = assetIssuer
  if (!issuer) {
    const { result: name } = await getTokenContractClient({
      contractId: contractAddress,
    }).name()
    const [code, resolvedIssuer] = name.split(':')
    if (
      code !== assetCode ||
      !resolvedIssuer ||
      !isStellarAccountAddress(resolvedIssuer)
    ) {
      throw new Error('Unable to resolve the asset issuer')
    }
    issuer = resolvedIssuer
  }
  if (
    new StellarSdk.Asset(assetCode, issuer).contractId(NETWORK_PASSPHRASE) !==
    contractAddress
  ) {
    throw new Error('Asset metadata does not match the token contract')
  }
  assetIssuerCache.set(cacheKey, issuer)
  return { required: true, issuer }
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
  userAddress: StellarAccountAddress,
  assetCode: string,
  assetIssuer: StellarAccountAddress,
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
    throw error
  }
}

/**
 * Create a trustline for a native asset
 * This is required before a user can receive or swap native Stellar assets
 */
export async function createTrustline(
  userAddress: StellarAccountAddress,
  assetCode: string,
  assetIssuer: StellarAccountAddress,
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
