import * as StellarSdk from '@stellar/stellar-sdk'
import ms from 'ms'
import { NETWORK_PASSPHRASE, RPC_URL } from '../constants'
import { SorobanClient } from './client'
import { VALID_UNTIL_LEDGER_BUMP } from './constants'

/**
 * Shared transaction helpers for submitting and polling Stellar transactions via raw RPC.
 * These functions are used across multiple services (SwapService, PositionService, etc.)
 * to avoid code duplication.
 */

/**
 * Submit transaction via raw RPC
 * Handles both XDR strings and transaction objects
 */
export async function submitViaRawRPC(signedTx: any): Promise<string> {
  let xdr: string
  if (typeof signedTx === 'string') {
    xdr = signedTx
  } else if (signedTx && typeof signedTx.toXDR === 'function') {
    xdr = signedTx.toXDR()
  } else {
    throw new Error('Invalid transaction format')
  }

  const rpcRequest = {
    jsonrpc: '2.0',
    id: Date.now(),
    method: 'sendTransaction',
    params: {
      transaction: xdr,
    },
  }

  const response = await fetch(RPC_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(rpcRequest),
  })

  const result = await response.json()

  if (result.error) {
    console.error('sendTransaction returned error:', result.error)
    throw new Error(result.error.message)
  }

  if (!result.result) {
    console.error('No result in sendTransaction response')
    throw new Error('No result in sendTransaction response')
  }

  // Check if transaction was rejected immediately
  if (result.result.status === 'ERROR') {
    console.error('Transaction submission returned ERROR status')
    console.error('Error details:', result.result)

    // Try to decode the error if available
    if (result.result.errorResultXdr) {
      try {
        // Decode the error XDR to get more details
        const errorResult = StellarSdk.xdr.TransactionResult.fromXDR(
          result.result.errorResultXdr,
          'base64',
        )

        // Get the transaction result code
        const txResult = errorResult.result()
        const txResultSwitch = txResult.switch()

        console.error('Transaction result:', txResultSwitch.name)

        // Try to get the fee charged
        const feeCharged = errorResult.feeCharged()
        if (feeCharged !== undefined) {
          console.error('Fee charged:', feeCharged.toString())
        }

        // Check for operation results
        if (
          txResultSwitch.name === 'txFailed' ||
          txResultSwitch.name === 'txSuccess'
        ) {
          try {
            const opResults = txResult.results()

            if (Array.isArray(opResults)) {
              opResults.forEach((opResult: any, index: number) => {
                const opResultTr = opResult.tr?.()
                if (opResultTr) {
                  const opSwitch = opResultTr.switch?.()
                  if (opSwitch) {
                    console.error(`Operation ${index}: ${opSwitch.name}`)
                  }
                }
              })
            }
          } catch (opError) {
            console.error('Could not extract operation results:', opError)
          }
        }
      } catch (decodeError) {
        console.error('Failed to decode error XDR:', decodeError)
      }
    }

    throw new Error(
      `Transaction submission failed with ERROR status. Check contract parameters and authorization. Error: ${JSON.stringify(result.result)}`,
    )
  }

  return result.result.hash
}

/**
 * Wait for transaction confirmation
 * Polls the transaction status for up to 60 seconds (30 attempts, 2s interval)
 * @param txHash - Transaction hash to poll for
 * @returns Object with success status and optional data/error
 */
export async function waitForTransaction(
  txHash: string,
): Promise<{ success: boolean; data?: any; error?: any }> {
  const maxAttempts = 30
  const intervalMs = ms('2s')

  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((resolve) => setTimeout(resolve, intervalMs))

    const statusRequest = {
      jsonrpc: '2.0',
      id: Date.now(),
      method: 'getTransaction',
      params: { hash: txHash },
    }

    const response = await fetch(RPC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(statusRequest),
    })

    const result = await response.json()

    if (result.result) {
      const status = result.result.status

      if (status === 'SUCCESS') {
        return { success: true, data: result.result }
      } else if (status === 'FAILED') {
        console.error('Transaction failed:', result.result)
        return { success: false, error: result.result }
      }
    } else if (result.error) {
      console.error('RPC error:', result.error)
    }
  }

  throw new Error('Transaction timeout after 60 seconds')
}

// Type for assembled transaction from contract client
export interface AssembledTransactionLike {
  simulation?: StellarSdk.rpc.Api.SimulateTransactionSuccessResponse
  built?: StellarSdk.Transaction
  toXDR: () => string
}

/**
 * Signs authorization entries for nested contract calls.
 * This is needed when the user is not the direct invoker (e.g., Position Manager calls Pool).
 *
 * @param assembledTransaction - The assembled transaction from contract client
 * @param sourceAccount - The user's public key
 * @param signAuthEntry - Wallet function to sign auth entry preimages
 * @returns The transaction XDR with signed auth entries
 */
export async function signAuthEntriesAndGetXdr(
  assembledTransaction: AssembledTransactionLike,
  sourceAccount: string,
  signAuthEntry: (entryPreimageXdr: string) => Promise<string>,
): Promise<string> {
  const simulation = assembledTransaction.simulation
  if (!simulation || StellarSdk.rpc.Api.isSimulationError(simulation)) {
    return assembledTransaction.toXDR()
  }

  const authEntries = simulation.result?.auth
  if (!authEntries || authEntries.length === 0) {
    return assembledTransaction.toXDR()
  }

  // Check if there are any auth entries that need signing for the user's address
  // Auth entries with sorobanCredentialsSourceAccount don't need signing (invoker auth)
  // Only sorobanCredentialsAddress entries for the user's address need signing
  const hasEntriesNeedingSigning = authEntries.some(
    (entry: StellarSdk.xdr.SorobanAuthorizationEntry) => {
      const credentials = entry.credentials()
      if (
        credentials.switch() !==
        StellarSdk.xdr.SorobanCredentialsType.sorobanCredentialsAddress()
      ) {
        return false
      }
      const entryAddress = StellarSdk.Address.fromScAddress(
        credentials.address().address(),
      ).toString()
      return entryAddress === sourceAccount
    },
  )

  // If no entries need signing for this user, return the XDR as-is
  if (!hasEntriesNeedingSigning) {
    return assembledTransaction.toXDR()
  }

  // Prefer the SDK helper if present on the assembled transaction
  const assembledWithHelper = assembledTransaction as unknown as {
    signAuthEntries?: (args?: {
      expiration?: number | Promise<number>
      address?: string
      signAuthEntry?: (
        preimage: StellarSdk.xdr.HashIdPreimageSorobanAuthorization,
      ) => Promise<Buffer>
    }) => Promise<void>
  }

  const latestLedger = await SorobanClient.getLatestLedger()
  const validUntilLedger = latestLedger.sequence + VALID_UNTIL_LEDGER_BUMP

  if (typeof assembledWithHelper.signAuthEntries === 'function') {
    await assembledWithHelper.signAuthEntries({
      expiration: validUntilLedger,
      address: sourceAccount,
      signAuthEntry: async (preimage) => {
        const preimageXdr = preimage.toXDR('base64')
        const signedPreimage = await signAuthEntry(preimageXdr)
        return Buffer.from(signedPreimage, 'base64')
      },
    })
    return assembledTransaction.toXDR()
  }

  // Fallback: manually sign only the user's address-based auth entries
  const signedAuthEntries = await Promise.all(
    authEntries.map(async (entry: StellarSdk.xdr.SorobanAuthorizationEntry) => {
      const credentials = entry.credentials()

      if (
        credentials.switch() !==
        StellarSdk.xdr.SorobanCredentialsType.sorobanCredentialsAddress()
      ) {
        return entry
      }

      const entryAddress = StellarSdk.Address.fromScAddress(
        credentials.address().address(),
      ).toString()
      if (entryAddress !== sourceAccount) {
        return entry
      }

      return StellarSdk.authorizeEntry(
        entry,
        async (preimage) => {
          const preimageXdr = preimage.toXDR('base64')
          const signedPreimage = await signAuthEntry(preimageXdr)
          return Buffer.from(signedPreimage, 'base64')
        },
        validUntilLedger,
        NETWORK_PASSPHRASE,
      )
    }),
  )

  const updatedSimulation = {
    ...simulation,
    result: {
      ...simulation.result,
      auth: signedAuthEntries,
    },
  } as StellarSdk.rpc.Api.SimulateTransactionSuccessResponse

  const builtTx = assembledTransaction.built
  if (!builtTx) {
    return assembledTransaction.toXDR()
  }

  const reassembled = StellarSdk.rpc.assembleTransaction(
    builtTx,
    updatedSimulation,
  )

  return reassembled.build().toXDR()
}
