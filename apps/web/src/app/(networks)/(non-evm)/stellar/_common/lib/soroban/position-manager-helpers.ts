import { getPositionManagerContractClient } from './client'
import { DEFAULT_TIMEOUT } from './constants'
import { contractAddresses } from './contracts'
import { getPoolInfoFromContract } from './pool-helpers'
import {
  type AssembledTransactionLike,
  signAuthEntriesAndGetXdr,
  submitViaRawRPC,
  waitForTransaction,
} from './rpc-transaction-helpers'

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
      token0: config.token0.contract,
      token1: config.token1.contract,
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

    let assembledTransaction: Awaited<
      ReturnType<typeof positionManagerClient.mint>
    >
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
      const [tokenId, liquidity, amount0, amount1] =
        assembledTransaction.result.unwrap()
      return {
        hash: txHash,
        tokenId,
        liquidity,
        amount0,
        amount1,
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

    let assembledTransaction: Awaited<
      ReturnType<typeof positionManagerClient.increase_liquidity>
    >
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

    if (result.success && assembledTransaction.result.isOk()) {
      const [liquidity, amount0, amount1] = assembledTransaction.result.unwrap()
      return {
        hash: txHash,
        liquidity,
        amount0,
        amount1,
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

    if (result.success && assembledTransaction.result.isOk()) {
      const [amount0, amount1] = assembledTransaction.result.unwrap()
      return {
        hash: txHash,
        amount0: amount0,
        amount1: amount1,
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
