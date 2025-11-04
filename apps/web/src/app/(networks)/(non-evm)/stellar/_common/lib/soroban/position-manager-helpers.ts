import * as StellarSdk from '@stellar/stellar-sdk'
import { getPositionManagerContractClient } from './client'
import { DEFAULT_TIMEOUT } from './constants'
import { CONTRACT_ADDRESSES, NETWORK_CONFIG } from './contract-addresses'
import { initializePoolIfNeeded } from './dex-factory-helpers'
import { type PoolConfig, getPoolInfoFromContract } from './pool-helpers'
import { submitViaRawRPC, waitForTransaction } from './rpc-transaction-helpers'

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

    // Ensure pool is initialized before minting position
    await initializePoolIfNeeded({
      poolAddress,
      sourceAccount,
      signTransaction,
    })

    const positionManagerClient = getPositionManagerContractClient({
      contractId: CONTRACT_ADDRESSES.POSITION_MANAGER,
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

    // Convert to XDR for signing
    const transactionXdr = assembledTransaction.toXDR()

    // Sign the transaction
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
}): Promise<{
  hash: string
  liquidity: bigint
  amount0: bigint
  amount1: bigint
}> {
  try {
    const positionManagerClient = getPositionManagerContractClient({
      contractId: CONTRACT_ADDRESSES.POSITION_MANAGER,
      publicKey: sourceAccount,
    })

    const assembledTransaction = await positionManagerClient.increase_liquidity(
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
      },
    )

    // Convert to XDR for signing
    const transactionXdr = assembledTransaction.toXDR()

    // Sign the transaction
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
}: {
  tokenId: number
  liquidity: bigint
  amount0Min: bigint
  amount1Min: bigint
  deadline: bigint
  operator: string
  sourceAccount: string
  signTransaction: (xdr: string) => Promise<string>
}): Promise<{
  hash: string
  amount0: bigint
  amount1: bigint
}> {
  try {
    const positionManagerClient = getPositionManagerContractClient({
      contractId: CONTRACT_ADDRESSES.POSITION_MANAGER,
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

    // Convert to XDR for signing
    const transactionXdr = assembledTransaction.toXDR()

    // Sign the transaction
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
}: {
  tokenId: number
  recipient: string
  amount0Max: bigint
  amount1Max: bigint
  operator: string
  signTransaction: (xdr: string) => Promise<string>
}): Promise<{
  txHash: string
  amount0: bigint
  amount1: bigint
}> {
  try {
    const positionManagerClient = getPositionManagerContractClient({
      contractId: CONTRACT_ADDRESSES.POSITION_MANAGER,
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

    // Convert to XDR for signing
    const transactionXdr = assembledTransaction.toXDR()

    // Sign the transaction
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
