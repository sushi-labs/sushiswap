import * as StellarSdk from '@stellar/stellar-sdk'
import { NETWORK_PASSPHRASE } from '../constants'
import { SorobanClient, getPositionManagerContractClient } from './client'
import { DEFAULT_TIMEOUT, VALID_UNTIL_LEDGER_BUMP } from './constants'
import { contractAddresses } from './contracts'
import { getPoolInfoFromContract } from './pool-helpers'
import { submitViaRawRPC, waitForTransaction } from './rpc-transaction-helpers'

// Type for assembled transaction from contract client
interface AssembledTransactionLike {
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

/**
 * Add liquidity using Position Manager's mint method
 * This creates a Position NFT that can be tracked and managed
 */
export async function mintPosition({
  poolAddress,
  recipient,
  tickLower,
  tickUpper,
  amount0Desired,
  amount1Desired,
  amount0Min,
  amount1Min,
  deadline,
  sourceAccount,
  signTransaction,
  signAuthEntry,
}: {
  poolAddress: string
  recipient: string
  tickLower: number
  tickUpper: number
  amount0Desired: bigint
  amount1Desired: bigint
  amount0Min: bigint
  amount1Min: bigint
  deadline: bigint
  sourceAccount: string
  signTransaction: (xdr: string) => Promise<string>
  signAuthEntry: (entryPreimageXdr: string) => Promise<string>
}): Promise<{
  hash: string
  tokenId: number
  liquidity: bigint
  amount0: bigint
  amount1: bigint
}> {
  try {
    // Get pool configuration by querying pool contract
    const poolConfig = await getPoolInfoFromContract(poolAddress)

    // At this point, poolConfig is guaranteed to be non-null
    if (!poolConfig) {
      throw new Error(
        `Pool configuration not found for ${poolAddress} and failed to query contract`,
      )
    }

    // Use poolConfig directly since we've verified it's not null
    const config = poolConfig

    const positionManagerClient = getPositionManagerContractClient({
      contractId: contractAddresses.POSITION_MANAGER,
      publicKey: sourceAccount,
    })

    const mintParams = {
      token0: config.token0.address,
      token1: config.token1.address,
      fee: config.fee,
      recipient,
      tick_lower: tickLower,
      tick_upper: tickUpper,
      amount0_desired: amount0Desired,
      amount1_desired: amount1Desired,
      amount0_min: amount0Min,
      amount1_min: amount1Min,
      deadline,
      sender: sourceAccount,
    }

    let assembledTransaction
    try {
      assembledTransaction = await positionManagerClient.mint(
        {
          params: mintParams,
        },
        {
          timeoutInSeconds: DEFAULT_TIMEOUT,
          fee: 100000,
        },
      )
    } catch (simulationError) {
      console.error('Transaction simulation failed:', simulationError)
      throw new Error(
        `Transaction simulation failed: ${simulationError instanceof Error ? simulationError.message : String(simulationError)}`,
      )
    }

    // Sign auth entries for nested authorization (PM -> Pool -> Token transfers)
    // This is required because the user is not the direct invoker of pool.mint
    const transactionXdr = await signAuthEntriesAndGetXdr(
      assembledTransaction as unknown as AssembledTransactionLike,
      sourceAccount,
      signAuthEntry,
    )

    // Sign the transaction envelope
    const signedXdr = await signTransaction(transactionXdr)

    // Submit the signed XDR directly via raw RPC (same as swap)
    const txHash = await submitViaRawRPC(signedXdr)

    // Wait for confirmation
    const result = await waitForTransaction(txHash)

    if (result.success) {
      // Position was created successfully
      // The position will be queryable via get_user_positions_with_fees
      return {
        hash: txHash,
        tokenId: 0, // Will be available via get_user_positions_with_fees
        liquidity: BigInt(0),
        amount0: BigInt(0),
        amount1: BigInt(0),
      }
    } else {
      console.error('Transaction failed:', result.error)
      throw new Error(`Transaction failed: ${JSON.stringify(result.error)}`)
    }
  } catch (error) {
    console.error('mintPosition failed:', error)
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
      })
    }
    throw error
  }
}

/**
 * Increase liquidity in an existing position
 */
export async function increaseLiquidity({
  tokenId,
  amount0Desired,
  amount1Desired,
  amount0Min,
  amount1Min,
  deadline,
  operator,
  sourceAccount,
  signTransaction,
  signAuthEntry,
}: {
  tokenId: number
  amount0Desired: bigint
  amount1Desired: bigint
  amount0Min: bigint
  amount1Min: bigint
  deadline: bigint
  operator: string
  sourceAccount: string
  signTransaction: (xdr: string) => Promise<string>
  signAuthEntry: (entryPreimageXdr: string) => Promise<string>
}): Promise<{
  hash: string
  liquidity: bigint
  amount0: bigint
  amount1: bigint
}> {
  try {
    const positionManagerClient = getPositionManagerContractClient({
      contractId: contractAddresses.POSITION_MANAGER,
      publicKey: sourceAccount,
    })

    let assembledTransaction
    try {
      assembledTransaction = await positionManagerClient.increase_liquidity(
        {
          params: {
            token_id: tokenId,
            operator,
            amount0_desired: amount0Desired,
            amount1_desired: amount1Desired,
            amount0_min: amount0Min,
            amount1_min: amount1Min,
            deadline,
          },
        },
        {
          timeoutInSeconds: DEFAULT_TIMEOUT,
          fee: 100000,
          simulate: true, // Explicitly enable simulation to ensure footprint is properly set
        },
      )
    } catch (simulationError) {
      console.error('Transaction simulation failed:', simulationError)
      throw new Error(
        `Transaction simulation failed: ${simulationError instanceof Error ? simulationError.message : String(simulationError)}`,
      )
    }

    // Verify simulation succeeded and check for footprint issues
    if (!assembledTransaction.result) {
      console.warn(
        'Transaction simulation returned no result, but proceeding...',
      )
    }

    // Sign auth entries for nested authorization (PM -> Pool -> Token transfers)
    // This is required because the user is not the direct invoker of pool.increase_liquidity
    const transactionXdr = await signAuthEntriesAndGetXdr(
      assembledTransaction as unknown as AssembledTransactionLike,
      sourceAccount,
      signAuthEntry,
    )

    // Sign the transaction envelope
    const signedXdr = await signTransaction(transactionXdr)

    // Submit the signed XDR directly via raw RPC
    const txHash = await submitViaRawRPC(signedXdr)

    // Wait for confirmation
    const result = await waitForTransaction(txHash)

    if (result.success) {
      return {
        hash: txHash,
        liquidity: BigInt(0),
        amount0: BigInt(0),
        amount1: BigInt(0),
      }
    } else {
      console.error('Transaction failed:', result.error)
      throw new Error(`Transaction failed: ${JSON.stringify(result.error)}`)
    }
  } catch (error) {
    console.error('increaseLiquidity failed:', error)
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
      })
    }
    throw error
  }
}

/**
 * Decrease liquidity from an existing position
 */
export async function decreaseLiquidity({
  tokenId,
  liquidity,
  amount0Min,
  amount1Min,
  deadline,
  operator,
  sourceAccount,
  signTransaction,
  signAuthEntry,
}: {
  tokenId: number
  liquidity: bigint
  amount0Min: bigint
  amount1Min: bigint
  deadline: bigint
  operator: string
  sourceAccount: string
  signTransaction: (xdr: string) => Promise<string>
  signAuthEntry: (entryPreimageXdr: string) => Promise<string>
}): Promise<{
  hash: string
  amount0: bigint
  amount1: bigint
}> {
  try {
    const positionManagerClient = getPositionManagerContractClient({
      contractId: contractAddresses.POSITION_MANAGER,
      publicKey: sourceAccount,
    })

    const assembledTransaction = await positionManagerClient.decrease_liquidity(
      {
        params: {
          token_id: tokenId,
          liquidity,
          amount0_min: amount0Min,
          amount1_min: amount1Min,
          deadline,
          operator,
        },
      },
      {
        timeoutInSeconds: DEFAULT_TIMEOUT,
        fee: 100000,
      },
    )

    // Sign auth entries for nested authorization (PM -> Pool)
    const transactionXdr = await signAuthEntriesAndGetXdr(
      assembledTransaction as unknown as AssembledTransactionLike,
      sourceAccount,
      signAuthEntry,
    )

    // Sign the transaction envelope
    const signedXdr = await signTransaction(transactionXdr)

    // Submit the signed XDR directly via raw RPC
    const txHash = await submitViaRawRPC(signedXdr)

    // Wait for confirmation
    const result = await waitForTransaction(txHash)

    if (result.success) {
      return {
        hash: txHash,
        amount0: BigInt(0),
        amount1: BigInt(0),
      }
    } else {
      console.error('Transaction failed:', result.error)
      throw new Error(`Transaction failed: ${JSON.stringify(result.error)}`)
    }
  } catch (error) {
    console.error('decreaseLiquidity failed:', error)
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
      })
    }
    throw error
  }
}

/**
 * Collect fees and/or withdrawn tokens from a position
 */
export async function collectFees({
  tokenId,
  recipient,
  amount0Max,
  amount1Max,
  operator,
  signTransaction,
  signAuthEntry,
}: {
  tokenId: number
  recipient: string
  amount0Max: bigint
  amount1Max: bigint
  operator: string
  signTransaction: (xdr: string) => Promise<string>
  signAuthEntry: (entryPreimageXdr: string) => Promise<string>
}): Promise<{
  txHash: string
  amount0: bigint
  amount1: bigint
}> {
  try {
    const positionManagerClient = getPositionManagerContractClient({
      contractId: contractAddresses.POSITION_MANAGER,
      publicKey: operator,
    })

    const assembledTransaction = await positionManagerClient.collect(
      {
        params: {
          token_id: tokenId,
          recipient,
          amount0_max: amount0Max,
          amount1_max: amount1Max,
          operator,
        },
      },
      {
        timeoutInSeconds: DEFAULT_TIMEOUT,
        fee: 100000,
      },
    )

    // Get the simulated result from the client
    // The client automatically simulates and parses the return value as a tuple [amount0, amount1]
    const simulationResult = assembledTransaction.result

    // Extract amounts from the Ok wrapper's value property
    const resultValue = (
      simulationResult as unknown as { value: readonly [bigint, bigint] }
    ).value as readonly [bigint, bigint]
    const [amount0, amount1] = resultValue

    // Sign auth entries for nested authorization (PM -> Pool -> Token transfers)
    const transactionXdr = await signAuthEntriesAndGetXdr(
      assembledTransaction as unknown as AssembledTransactionLike,
      operator,
      signAuthEntry,
    )

    // Sign the transaction envelope
    const signedXdr = await signTransaction(transactionXdr)

    // Submit the signed XDR directly via raw RPC
    const txHash = await submitViaRawRPC(signedXdr)

    // Wait for confirmation
    const result = await waitForTransaction(txHash)

    if (result.success) {
      return {
        txHash,
        amount0,
        amount1,
      }
    }

    console.error('Transaction failed:', result.error)
    throw new Error(`Transaction failed: ${JSON.stringify(result.error)}`)
  } catch (error) {
    console.error('collectFees failed:', error)
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
      })
    }
    throw error
  }
}
