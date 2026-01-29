import { addMinutes } from 'date-fns'
import { getPoolInfoFromContract } from '../soroban/pool-helpers'
import {
  increaseLiquidity,
  mintPosition,
} from '../soroban/position-manager-helpers'
import { positionService } from './position-service'
import type { AddLiquidityParams } from './swap-service'

/**
 * Main service for SushiSwap operations on Stellar
 * This is the primary interface for interacting with the DEX
 */
export class SushiStellarService {
  /**
   * Add liquidity using Position Manager
   * Automatically increases liquidity on existing position or creates new one
   */
  async addLiquidity(
    userAddress: string,
    params: AddLiquidityParams,
    signTransaction: (xdr: string) => Promise<string>,
    signAuthEntry: (entryPreimageXdr: string) => Promise<string>,
  ): Promise<{ txHash: string; tokenId: number; liquidity: bigint }> {
    // Convert string amounts to bigint
    const amount0 = BigInt(
      Math.floor(
        Number.parseFloat(params.token0Amount) * 10 ** params.token0Decimals,
      ),
    )
    const amount1 = BigInt(
      Math.floor(
        Number.parseFloat(params.token1Amount) * 10 ** params.token1Decimals,
      ),
    )

    const deadline = BigInt(
      params.deadline || Math.floor(addMinutes(new Date(), 5).valueOf() / 1000),
    )

    // Always fetch pool info from contract (no more dynamic import needed)
    const poolConfig = await getPoolInfoFromContract(params.poolAddress)
    if (!poolConfig) {
      throw new Error('Pool config not found')
    }

    // Check if user has existing position for this pool with same tick range

    // Fetch user positions
    const positions = await positionService.getUserPositionsWithFees({
      userAddress,
    })

    // Find position with matching pool tokens, tick range, AND fee tier
    const existingPosition = positions.find((pos) => {
      const tokensMatch =
        (pos.token0 === poolConfig.token0.contract &&
          pos.token1 === poolConfig.token1.contract) ||
        (pos.token0 === poolConfig.token1.contract &&
          pos.token1 === poolConfig.token0.contract)

      const ticksMatch =
        pos.tickLower === params.tickLower && pos.tickUpper === params.tickUpper

      const feeMatches = pos.fee === poolConfig.fee

      return tokensMatch && ticksMatch && feeMatches
    })

    if (existingPosition) {
      // Increase liquidity on existing position - NO try/catch here!
      const result = await increaseLiquidity({
        tokenId: existingPosition.tokenId,
        amount0Desired: amount0,
        amount1Desired: amount1,
        amount0Min: BigInt(0),
        amount1Min: BigInt(0),
        deadline,
        operator: userAddress,
        sourceAccount: userAddress,
        signTransaction,
        signAuthEntry,
      })

      return {
        txHash: result.hash,
        tokenId: existingPosition.tokenId,
        liquidity: result.liquidity,
      }
    }

    // No existing position found - mint new one
    const result = await mintPosition({
      poolAddress: params.poolAddress,
      recipient: params.recipient || userAddress,
      tickLower: params.tickLower,
      tickUpper: params.tickUpper,
      amount0Desired: amount0,
      amount1Desired: amount1,
      amount0Min: BigInt(0),
      amount1Min: BigInt(0),
      deadline,
      sourceAccount: userAddress,
      signTransaction,
      signAuthEntry,
    })

    return {
      txHash: result.hash,
      tokenId: result.tokenId,
      liquidity: result.liquidity,
    }
  }
}

/**
 * Create a SushiStellarService instance
 */
export function createSushiStellarService(): SushiStellarService {
  return new SushiStellarService()
}
