import * as StellarSdk from '@stellar/stellar-sdk'
import type { UserPositionInfo } from '@sushiswap/stellar-contract-binding-position-manager'
import {
  getFactoryContractClient,
  getPoolContractClient,
  getPositionManagerContractClient,
} from '../soroban/client'
import { DEFAULT_TIMEOUT } from '../soroban/constants'
import {
  CONTRACT_ADDRESSES,
  NETWORK_CONFIG,
} from '../soroban/contract-addresses'
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

/**
 * Service for managing positions and collecting fees on Stellar
 */
export class PositionService {
  /**
   * Get all position token IDs owned by a user
   */
  async getUserTokenIds(
    userAddress: string,
    skip = 0,
    take = 100,
  ): Promise<number[]> {
    const positionManagerClient = getPositionManagerContractClient({
      contractId: CONTRACT_ADDRESSES.POSITION_MANAGER,
      publicKey: userAddress,
    })

    const result = await positionManagerClient.get_user_token_ids({
      owner: userAddress,
      skip,
      take,
    })

    return result.result || []
  }

  /**
   * Get a single position with live fee calculations
   */
  async getPositionWithFees(tokenId: number): Promise<PositionInfo | null> {
    const positionManagerClient = getPositionManagerContractClient({
      contractId: CONTRACT_ADDRESSES.POSITION_MANAGER,
      // No publicKey needed for read-only operations that don't require user context
    })

    try {
      const { result } = await positionManagerClient.get_position_with_fees({
        token_id: tokenId,
      })

      return formatPositionInfo(result)
    } catch (error) {
      console.error(`Failed to get position ${tokenId}:`, error)
      return null
    }
  }

  /**
   * Get multiple positions with live fee calculations
   */
  async getPositionsWithFees(tokenIds: number[]): Promise<PositionInfo[]> {
    if (tokenIds.length === 0) return []

    const positionManagerClient = getPositionManagerContractClient({
      contractId: CONTRACT_ADDRESSES.POSITION_MANAGER,
    })

    try {
      const { result } = await positionManagerClient.get_positions_with_fees({
        token_ids: tokenIds,
      })

      return result.map(formatPositionInfo)
    } catch (error) {
      console.error('Failed to get positions with fees:', error)
      return []
    }
  }

  /**
   * Get all positions owned by a user with live fee calculations
   * Uses two-step approach to avoid budget exceeded errors:
   * 1. Get token IDs (lightweight)
   * 2. Fetch individual position details
   */
  async getUserPositionsWithFees(
    userAddress: string,
    skip = 0,
    take = 100,
  ): Promise<PositionInfo[]> {
    const positionManagerClient = getPositionManagerContractClient({
      contractId: CONTRACT_ADDRESSES.POSITION_MANAGER,
      // No publicKey needed for read-only position queries
    })

    try {
      // Try the bulk method first
      const { result } =
        await positionManagerClient.get_user_positions_with_fees({
          owner: userAddress,
          skip,
          take,
        })

      const formattedResults = result.map(formatPositionInfo)

      if (result.length > 0) {
      }

      return formattedResults
    } catch (_error) {
      // Fallback: fetch token IDs first, then fetch positions individually
      try {
        const tokenIds = await this.getUserTokenIds(userAddress, skip, take)

        if (tokenIds.length === 0) {
          return []
        }

        // Fetch positions one at a time to avoid budget limits
        const positions: PositionInfo[] = []

        for (const tokenId of tokenIds) {
          try {
            const position = await this.getPositionWithFees(tokenId)
            if (position) {
              positions.push(position)
            }
          } catch (_posError) {
            // Continue with other positions
          }
        }

        return positions
      } catch (fallbackError) {
        console.error(
          '❌ Failed to get user positions with fallback:',
          fallbackError,
        )
        if (fallbackError instanceof Error) {
          console.error('Error message:', fallbackError.message)
        }
        return []
      }
    }
  }

  /**
   * Get the principal token amounts for a position
   * This calculates the actual token0 and token1 amounts from liquidity
   */
  async getPositionPrincipal(
    tokenId: number,
  ): Promise<{ amount0: bigint; amount1: bigint }> {
    try {
      // Get position info first (no publicKey needed for read-only)
      const positionManagerClient = getPositionManagerContractClient({
        contractId: CONTRACT_ADDRESSES.POSITION_MANAGER,
        // No publicKey needed for read-only position queries
      })

      const position = await positionManagerClient.get_position_with_fees({
        token_id: tokenId,
      })

      // Get pool address from factory
      const factoryClient = getFactoryContractClient({
        contractId: CONTRACT_ADDRESSES.FACTORY,
        // No publicKey needed for read-only factory queries
      })

      const poolAddress = await factoryClient.get_pool({
        token_a: position.result.token0,
        token_b: position.result.token1,
        fee: position.result.fee,
      })

      // Get pool's current price
      const poolClient = getPoolContractClient({
        contractId: poolAddress.result || '',
        // No publicKey needed for read-only pool queries
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
        slot0.result.fee_protocol &&
        BigInt(slot0.result.fee_protocol) !== 0n
      ) {
        // The contract has the fields mixed up - sqrt price is in fee_protocol
        sqrtPriceX96 = BigInt(slot0.result.fee_protocol)
      } else {
        return { amount0: 0n, amount1: 0n }
      }

      const result = await positionManagerClient.position_principal({
        token_id: tokenId,
        sqrt_price_x96: sqrtPriceX96,
      })

      return {
        amount0: BigInt(result.result[0]),
        amount1: BigInt(result.result[1]),
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
  async getPositionsPrincipalBatch(
    tokenIds: number[],
    poolAddress: string,
  ): Promise<Map<number, { amount0: bigint; amount1: bigint }>> {
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
        slot0.result.fee_protocol &&
        BigInt(slot0.result.fee_protocol) !== 0n
      ) {
        sqrtPriceX96 = BigInt(slot0.result.fee_protocol)
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
        contractId: CONTRACT_ADDRESSES.POSITION_MANAGER,
        // No publicKey needed for read-only position queries
      })

      for (const tokenId of tokenIds) {
        try {
          const result = await positionManagerClient.position_principal({
            token_id: tokenId,
            sqrt_price_x96: sqrtPriceX96,
          })

          const amount0 = BigInt(result.result[0])
          const amount1 = BigInt(result.result[1])

          results.set(tokenId, {
            amount0,
            amount1,
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
      contractId: CONTRACT_ADDRESSES.POSITION_MANAGER,
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
    const signedTx = StellarSdk.TransactionBuilder.fromXDR(
      signedXdr,
      NETWORK_CONFIG.PASSPHRASE,
    )

    // Submit the signed transaction via raw RPC
    const txHash = await submitViaRawRPC(signedTx)

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
      contractId: CONTRACT_ADDRESSES.POSITION_MANAGER,
    })

    try {
      const result = await positionManagerClient.position_fees({
        token_id: tokenId,
      })

      const fees = result.result
      return {
        fees0: fees[0],
        fees1: fees[1],
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
