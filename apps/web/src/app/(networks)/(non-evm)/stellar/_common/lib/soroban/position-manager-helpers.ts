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

    console.log(`💧 Minting position via Position Manager...`)
    console.log(`Pool: ${poolAddress}`)
    console.log(`Token0: ${config.token0.address} (${config.token0.code})`)
    console.log(`Token1: ${config.token1.address} (${config.token1.code})`)
    console.log(`Fee: ${config.fee}`)
    console.log(`Tick range: ${tickLower} to ${tickUpper}`)

    // Ensure pool is initialized before minting position
    console.log(`🔍 Checking if pool needs initialization...`)
    await initializePoolIfNeeded({
      poolAddress,
      sourceAccount,
      signTransaction,
    })
    console.log(`✅ Pool initialization check completed`)

    const positionManagerClient = getPositionManagerContractClient({
      contractId: CONTRACT_ADDRESSES.POSITION_MANAGER,
      publicKey: sourceAccount,
    })

    console.log('Preparing mint transaction...')

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
    }

    console.log('📋 Mint parameters:', {
      token0: mintParams.token0,
      token1: mintParams.token1,
      fee: mintParams.fee,
      recipient: mintParams.recipient,
      tick_lower: mintParams.tick_lower,
      tick_upper: mintParams.tick_upper,
      amount0_desired: mintParams.amount0_desired.toString(),
      amount1_desired: mintParams.amount1_desired.toString(),
      amount0_min: mintParams.amount0_min.toString(),
      amount1_min: mintParams.amount1_min.toString(),
      deadline: mintParams.deadline.toString(),
    })

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
      console.error('❌ Transaction simulation failed:', simulationError)
      throw new Error(
        `Transaction simulation failed: ${simulationError instanceof Error ? simulationError.message : String(simulationError)}`,
      )
    }

    console.log('✅ Transaction assembled successfully')
    console.log('📊 Simulation result:', assembledTransaction.simulation)
    console.log('📊 Built transaction:', assembledTransaction.built)

    // Log the raw transaction to see operations
    if (assembledTransaction.built) {
      console.log(
        '📊 Transaction operations:',
        assembledTransaction.built.operations,
      )
      if (assembledTransaction.built.operations?.length > 0) {
        assembledTransaction.built.operations.forEach((op: any, i: number) => {
          console.log(`📊 Operation ${i}:`, op)
        })
      }
    }

    // Log simulation data
    if (assembledTransaction.simulationData) {
      console.log('📊 Simulation data:', assembledTransaction.simulationData)
      console.log(
        '📊 Simulation transaction data:',
        assembledTransaction.simulationData.transactionData,
      )
      console.log(
        '📊 Simulation result:',
        assembledTransaction.simulationData.result,
      )
    }

    console.log('Transaction prepared. Waiting for wallet signature...')

    // Convert to XDR for signing
    const transactionXdr = assembledTransaction.toXDR()
    console.log('Transaction XDR prepared for signing')

    // Sign the transaction
    const signedXdr = await signTransaction(transactionXdr)
    const signedTx = StellarSdk.TransactionBuilder.fromXDR(
      signedXdr,
      NETWORK_CONFIG.PASSPHRASE,
    )

    console.log('Transaction signed. Submitting to network...')

    // Submit the signed transaction via raw RPC (same as swap)
    const txHash = await submitViaRawRPC(signedTx)

    console.log(`Transaction submitted: ${txHash}`)
    console.log('Waiting for confirmation...')

    // Wait for confirmation
    const result = await waitForTransaction(txHash)

    if (result.success) {
      console.log('✅ Transaction confirmed!')
      console.log('🎉 Position NFT minted!')
      console.log('📊 Full result data:', result.data)
      console.log('📊 Result data keys:', Object.keys(result.data))
      console.log('📊 Return value:', result.data.returnValue)

      // Check various possible locations for the return value
      const possibleReturnValue =
        result.data.returnValue ||
        result.data.result?.returnValue ||
        result.data.resultXdr ||
        result.data.result

      console.log('📊 Possible return value:', possibleReturnValue)

      // For now, just return success without parsing the return value
      // The position was created, we just can't extract the exact values yet
      console.log(
        '⚠️ Position created successfully but could not parse return value',
      )
      console.log(
        '⚠️ Returning with placeholder values - position is tracked on-chain',
      )

      // TODO: Fix return value parsing once we understand the response structure
      // For now, position was created successfully, just can't extract exact values
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
    console.log(`💧 Increasing liquidity for position #${tokenId}...`)

    const positionManagerClient = getPositionManagerContractClient({
      contractId: CONTRACT_ADDRESSES.POSITION_MANAGER,
      publicKey: sourceAccount,
    })

    console.log('Preparing increase_liquidity transaction...')

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

    console.log('Transaction prepared. Waiting for wallet signature...')

    // Convert to XDR for signing
    const transactionXdr = assembledTransaction.toXDR()

    // Sign the transaction
    const signedXdr = await signTransaction(transactionXdr)
    const signedTx = StellarSdk.TransactionBuilder.fromXDR(
      signedXdr,
      NETWORK_CONFIG.PASSPHRASE,
    )

    console.log('Transaction signed. Submitting to network...')

    // Submit the signed transaction via raw RPC
    const txHash = await submitViaRawRPC(signedTx)

    console.log(`Transaction submitted: ${txHash}`)
    console.log('Waiting for confirmation...')

    // Wait for confirmation
    const result = await waitForTransaction(txHash)

    if (result.success) {
      console.log('✅ Transaction confirmed!')
      console.log('🎉 Liquidity increased!')
      console.log('📊 Full result data:', result.data)

      // TODO: Parse return value when we understand the response structure
      // For now, return placeholder values - position is updated on-chain

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
    console.log(
      `💧 Decreasing liquidity for position #${tokenId} by ${liquidity}...`,
    )

    const positionManagerClient = getPositionManagerContractClient({
      contractId: CONTRACT_ADDRESSES.POSITION_MANAGER,
      publicKey: sourceAccount,
    })

    console.log('Preparing decrease_liquidity transaction...')

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

    console.log('Transaction prepared. Waiting for wallet signature...')

    // Convert to XDR for signing
    const transactionXdr = assembledTransaction.toXDR()

    // Sign the transaction
    const signedXdr = await signTransaction(transactionXdr)
    const signedTx = StellarSdk.TransactionBuilder.fromXDR(
      signedXdr,
      NETWORK_CONFIG.PASSPHRASE,
    )

    console.log('Transaction signed. Submitting to network...')

    // Submit the signed transaction via raw RPC
    const txHash = await submitViaRawRPC(signedTx)

    console.log(`Transaction submitted: ${txHash}`)
    console.log('Waiting for confirmation...')

    // Wait for confirmation
    const result = await waitForTransaction(txHash)

    if (result.success) {
      console.log('✅ Transaction confirmed!')
      console.log('🎉 Liquidity decreased!')
      console.log('📊 Full result data:', result.data)

      // TODO: Parse return value when we understand the response structure
      // For now, return placeholder values - position is updated on-chain

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
    console.log(`💰 Collecting from position #${tokenId}...`)
    console.log(`  Max amount0: ${amount0Max}`)
    console.log(`  Max amount1: ${amount1Max}`)

    const positionManagerClient = getPositionManagerContractClient({
      contractId: CONTRACT_ADDRESSES.POSITION_MANAGER,
      publicKey: operator,
    })

    console.log('Preparing collect transaction...')

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
    console.log('📊 Simulation result:', simulationResult)

    // Extract amounts from the Ok wrapper's value property
    const resultValue = (
      simulationResult as unknown as { value: readonly [bigint, bigint] }
    ).value as readonly [bigint, bigint]
    const [amount0, amount1] = resultValue
    console.log(`💰 Simulated collection: ${amount0} token0, ${amount1} token1`)

    console.log('Transaction prepared. Waiting for wallet signature...')

    // Convert to XDR for signing
    const transactionXdr = assembledTransaction.toXDR()

    // Sign the transaction
    const signedXdr = await signTransaction(transactionXdr)
    const signedTx = StellarSdk.TransactionBuilder.fromXDR(
      signedXdr,
      NETWORK_CONFIG.PASSPHRASE,
    )

    console.log('Transaction signed. Submitting to network...')

    // Submit the signed transaction via raw RPC
    const txHash = await submitViaRawRPC(signedTx)

    console.log(`Transaction submitted: ${txHash}`)
    console.log('Waiting for confirmation...')

    // Wait for confirmation
    const result = await waitForTransaction(txHash)

    if (result.success) {
      console.log('✅ Transaction confirmed!')

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
