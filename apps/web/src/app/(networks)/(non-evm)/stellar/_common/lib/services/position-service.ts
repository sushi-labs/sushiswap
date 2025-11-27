import type { u128 } from '@stellar/stellar-sdk/contract'
import type {
  PositionTuple,
  UserPositionInfo,
} from '@sushiswap/stellar-contract-binding-position-manager'
import {
  getFactoryContractClient,
  getPoolContractClient,
  getPositionManagerContractClient,
} from '../soroban/client'
import { DEFAULT_TIMEOUT } from '../soroban/constants'
import { contractAddresses } from '../soroban/contracts'
import { handleResult } from '../soroban/handle-result'
import {
  submitViaRawRPC,
  waitForTransaction,
} from '../soroban/rpc-transaction-helpers'

export interface PositionInfo {
  tokenId: number
  token0: string
  token1: string
  tickLower: number
  tickUpper: number
  liquidity: bigint
  tokensOwed0: bigint
  tokensOwed1: bigint
  fee: number
}

export interface CollectParams {
  tokenId: number
  recipient: string
  amount0Max: bigint
  amount1Max: bigint
}

export interface CollectResult {
  amount0: bigint
  amount1: bigint
  txHash: string
}

const formatPositionInfo = (
  contractPositionInfo: UserPositionInfo,
): PositionInfo => {
  return {
    tokenId: contractPositionInfo.token_id,
    token0: contractPositionInfo.token0,
    token1: contractPositionInfo.token1,
    tickLower: contractPositionInfo.tick_lower,
    tickUpper: contractPositionInfo.tick_upper,
    liquidity: contractPositionInfo.liquidity,
    tokensOwed0: contractPositionInfo.tokens_owed0,
    tokensOwed1: contractPositionInfo.tokens_owed1,
    fee: contractPositionInfo.fee,
  }
}

const MINIMUM_DUST_LIQUIDITY = 50n

/**
 * Service for managing positions and collecting fees on Stellar
 */
export class PositionService {
  /**
   * Get the number of positions (NFTs) owned by a user
   */
  private async getNumberOfUserPositions(userAddress: string): Promise<number> {
    const positionManagerClient = getPositionManagerContractClient({
      contractId: contractAddresses.POSITION_MANAGER,
      // No publicKey needed for read-only operations that don't require user context
    })
    const result = await positionManagerClient.balance({
      owner: userAddress,
    })
    return result.result || 0
  }

  /**
   * Get all position token IDs owned by a user
   */
  async getUserTokenIds({
    userAddress,
    skip = 0,
    take = Number.POSITIVE_INFINITY,
  }: {
    userAddress: string
    skip?: number
    take?: number
  }): Promise<number[]> {
    const BATCH_SIZE = 20
    const numberOfUserTokenIds =
      await this.getNumberOfUserPositions(userAddress)
    const numberToFetch = Math.min(take, numberOfUserTokenIds - skip)
    const numberOfBatches = Math.ceil(numberToFetch / BATCH_SIZE)
    const positionManagerClient = getPositionManagerContractClient({
      contractId: contractAddresses.POSITION_MANAGER,
      publicKey: userAddress,
    })

    const batchPromises = Array.from(
      { length: numberOfBatches },
      async (_, i) => {
        return await positionManagerClient.get_user_token_ids({
          owner: userAddress,
          skip: skip + i * BATCH_SIZE,
          take: BATCH_SIZE,
        })
      },
    )

    const batchResults = await Promise.all(batchPromises)

    return batchResults.flatMap((result) => result.result || [])
  }

  /**
   * Get a single position by token ID
   * Returns raw position data from the positions() function
   */
  async getPosition(tokenId: number): Promise<PositionInfo | null> {
    const positionManagerClient = getPositionManagerContractClient({
      contractId: contractAddresses.POSITION_MANAGER,
      // No publicKey needed for read-only operations that don't require user context
    })

    try {
      const { result } = await positionManagerClient.positions({
        token_id: tokenId,
      })

      // positions() returns an object: {nonce, token0, token1, fee, tickLower, tickUpper, liquidity, feeGrowthInside0LastX128, feeGrowthInside1LastX128, tokensOwed0, tokensOwed1}
      const {
        nonce: _nonce,
        token0,
        token1,
        fee,
        tickLower,
        tickUpper,
        liquidity,
        feeGrowthInside0LastX128: _feeGrowthInside0LastX128,
        feeGrowthInside1LastX128: _feeGrowthInside1LastX128,
        tokensOwed0,
        tokensOwed1,
      } = handleResult<PositionTuple>(result)

      return {
        tokenId,
        token0,
        token1,
        tickLower,
        tickUpper,
        liquidity,
        tokensOwed0,
        tokensOwed1,
        fee,
      }
    } catch (error) {
      console.error(`Failed to get position ${tokenId}:`, error)
      return null
    }
  }

  /**
   * Get all positions owned by a user
   * Uses the get_user_positions function which returns UserPositionInfo[]
   */
  private async getUserPositions({
    userAddress,
    skip = 0,
    take = Number.POSITIVE_INFINITY,
  }: {
    userAddress: string
    skip?: number
    take?: number
  }): Promise<PositionInfo[]> {
    const BATCH_SIZE = 3
    const numberOfUserPositions =
      await this.getNumberOfUserPositions(userAddress)
    const numberToFetch = Math.min(take, numberOfUserPositions - skip)
    const numberOfBatches = Math.ceil(numberToFetch / BATCH_SIZE)

    const positionManagerClient = getPositionManagerContractClient({
      contractId: contractAddresses.POSITION_MANAGER,
    })

    try {
      const batchPromises = Array.from(
        { length: numberOfBatches },
        async (_, i) => {
          const { result } =
            await positionManagerClient.get_user_positions_with_fees({
              owner: userAddress,
              skip: skip + i * BATCH_SIZE,
              take: BATCH_SIZE,
            })
          return handleResult<UserPositionInfo[]>(result).map(
            formatPositionInfo,
          )
        },
      )

      const batchResults = await Promise.all(batchPromises)

      return batchResults.flat()
    } catch (error) {
      console.error('Failed to get user positions:', error)
      return []
    }
  }

  /**
   * Get all positions owned by a user with live fee calculations
   * This is now an alias for getUserPositions since get_user_positions
   * already returns all position data including fees
   */
  async getUserPositionsWithFees({
    userAddress,
    excludeDust = false,
    skip = 0,
    take = Number.POSITIVE_INFINITY,
  }: {
    userAddress: string
    excludeDust?: boolean
    skip?: number
    take?: number
  }): Promise<PositionInfo[]> {
    // Just call getUserPositions since it already includes all data
    const userPositionsWithFees = await this.getUserPositions({
      userAddress,
      skip,
      take,
    })
    return userPositionsWithFees.filter((position) => {
      return !excludeDust || position.liquidity >= MINIMUM_DUST_LIQUIDITY
    })
  }

  /**
   * Get the principal token amounts for a position
   * This calculates the actual token0 and token1 amounts from liquidity
   */
  async getPositionPrincipal(
    tokenId: number,
  ): Promise<{ amount0: bigint; amount1: bigint }> {
    try {
      // Get position info first
      const position = await this.getPosition(tokenId)
      if (!position) {
        return { amount0: 0n, amount1: 0n }
      }

      // Get pool address from factory
      const factoryClient = getFactoryContractClient({
        contractId: contractAddresses.FACTORY,
      })

      // Order tokens (smaller address first) to match factory's expectations
      const [token0, token1] =
        position.token0 < position.token1
          ? [position.token0, position.token1]
          : [position.token1, position.token0]

      const poolAddress = await factoryClient.get_pool({
        token_a: token0,
        token_b: token1,
        fee: position.fee,
      })

      // Get pool's current price
      const poolClient = getPoolContractClient({
        contractId: poolAddress.result || '',
      })

      const slot0 = await poolClient.slot0()

      // Handle field name confusion: the contract returns sqrt_price_x96 in the fee_protocol field
      let sqrtPriceX96: bigint

      if (
        slot0.result.sqrt_price_x96 &&
        Number(slot0.result.sqrt_price_x96) !== 0
      ) {
        sqrtPriceX96 = BigInt(slot0.result.sqrt_price_x96)
      } else if (
        slot0.result.sqrt_price_x96 &&
        Number(slot0.result.sqrt_price_x96) !== 0
      ) {
        sqrtPriceX96 = BigInt(slot0.result.sqrt_price_x96)
      } else {
        return { amount0: 0n, amount1: 0n }
      }

      const positionManagerClient = getPositionManagerContractClient({
        contractId: contractAddresses.POSITION_MANAGER,
      })

      const result = await positionManagerClient.position_principal({
        token_id: tokenId,
        sqrt_price_x96: sqrtPriceX96,
      })

      const [amount0, amount1] = handleResult<readonly [u128, u128]>(
        result.result,
      )

      return {
        amount0: BigInt(amount0),
        amount1: BigInt(amount1),
      }
    } catch (error) {
      console.error(
        `Failed to get position principal for token ${tokenId}:`,
        error,
      )
      return { amount0: 0n, amount1: 0n }
    }
  }

  /**
   * Get principal amounts for multiple positions in the same pool (more efficient)
   * Fetches slot0 once and reuses it for all positions
   */
  async getPositionsPrincipalBatch({
    tokenIds,
    poolAddress,
  }: {
    tokenIds: number[]
    poolAddress: string
  }): Promise<Map<number, { amount0: bigint; amount1: bigint }>> {
    const results = new Map<number, { amount0: bigint; amount1: bigint }>()

    if (tokenIds.length === 0) {
      return results
    }

    try {
      // Get pool's current price once for all positions
      const poolClient = getPoolContractClient({
        contractId: poolAddress,
        // No publicKey needed for read-only pool queries
      })

      const slot0 = await poolClient.slot0()

      // Handle field name confusion
      let sqrtPriceX96: bigint

      if (
        slot0.result.sqrt_price_x96 &&
        Number(slot0.result.sqrt_price_x96) !== 0
      ) {
        sqrtPriceX96 = BigInt(slot0.result.sqrt_price_x96)
      } else if (
        slot0.result.sqrt_price_x96 &&
        Number(slot0.result.sqrt_price_x96) !== 0
      ) {
        sqrtPriceX96 = BigInt(slot0.result.sqrt_price_x96)
      } else {
        console.warn('Pool sqrt_price_x96 is 0 - cannot calculate principals')
        // Return zeros for all positions
        for (const tokenId of tokenIds) {
          results.set(tokenId, { amount0: 0n, amount1: 0n })
        }
        return results
      }

      // Now calculate principal for each position using the same sqrt price
      const positionManagerClient = getPositionManagerContractClient({
        contractId: contractAddresses.POSITION_MANAGER,
        // No publicKey needed for read-only position queries
      })

      for (const tokenId of tokenIds) {
        try {
          const result = await positionManagerClient.position_principal({
            token_id: tokenId,
            sqrt_price_x96: sqrtPriceX96,
          })

          const [amount0, amount1] = handleResult<readonly [u128, u128]>(
            result.result,
          )

          results.set(tokenId, {
            amount0: BigInt(amount0),
            amount1: BigInt(amount1),
          })
        } catch (error) {
          console.error(
            `Failed to calculate principal for position ${tokenId}:`,
            error,
          )
          results.set(tokenId, { amount0: 0n, amount1: 0n })
        }
      }

      return results
    } catch (error) {
      console.error(
        'Failed to fetch slot0 for batch principal calculation:',
        error,
      )
      // Return zeros for all positions
      for (const tokenId of tokenIds) {
        results.set(tokenId, { amount0: 0n, amount1: 0n })
      }
      return results
    }
  }

  /**
   * Collect fees from a position
   */
  async collectFees(
    params: CollectParams,
    signTransaction: (xdr: string) => Promise<string>,
  ): Promise<CollectResult> {
    const positionManagerClient = getPositionManagerContractClient({
      contractId: contractAddresses.POSITION_MANAGER,
      publicKey: params.recipient,
    })

    const assembledTransaction = await positionManagerClient.collect(
      {
        params: {
          token_id: params.tokenId,
          recipient: params.recipient,
          amount0_max: params.amount0Max,
          amount1_max: params.amount1Max,
          operator: params.recipient,
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
      // TODO: Parse return value when we understand the response structure
      // For now, return placeholder values - fees are collected on-chain

      return {
        amount0: BigInt(0),
        amount1: BigInt(0),
        txHash,
      }
    } else {
      console.error('Transaction failed:', result.error)
      throw new Error(`Fee collection failed: ${JSON.stringify(result.error)}`)
    }
  }

  /**
   * Calculate uncollected fees for a position
   * Uses position_fees which calculates live fees from the pool
   */
  async getUncollectedFees(
    tokenId: number,
  ): Promise<{ fees0: bigint; fees1: bigint } | null> {
    const positionManagerClient = getPositionManagerContractClient({
      contractId: contractAddresses.POSITION_MANAGER,
    })

    try {
      const result = await positionManagerClient.position_fees({
        token_id: tokenId,
      })

      const [fees0, fees1] = handleResult<readonly [u128, u128]>(result.result)
      return {
        fees0: BigInt(fees0),
        fees1: BigInt(fees1),
      }
    } catch (error) {
      console.error(
        `Failed to get uncollected fees for position ${tokenId}:`,
        error,
      )
      return null
    }
  }
}

// Export a singleton instance
export const positionService = new PositionService()
