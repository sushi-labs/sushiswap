import { Address } from 'viem'
import { CLTick } from './CLPool.js'
import { RToken } from './RPool.js'
import { UniV3Pool } from './UniV3Pool.js'

const two96 = 2 ** 96

// The same as UniV3Pool, but:
// 1) address is id
// 2) reserves are not set but calculated using liquidity
export class UniV4Pool extends UniV3Pool {
  /// @param address The address of the pool
  /// @param token0 The first token of the pool
  /// @param token1 The secons token of the pool
  /// @param fee Pool's fee in fractions of 1. fee=0.003 means 0.3%
  /// @param tick Currenct pool tick - (await pool.slot0())[1]
  /// @param liquidity Current pool liquidity - await pool.liquidity()
  /// @param sqrtPriceX96 Square root of the current pool price multiplied 2^96 - (await pool.slot0())[0]
  /// @param ticks The list of all initialized ticks, sorted by index from low ho high
  constructor(
    id: string,
    token0: RToken,
    token1: RToken,
    fee: number,
    tick: number,
    liquidity: bigint,
    sqrtPriceX96: bigint,
    ticks: CLTick[],
    nearestTick?: number,
  ) {
    super(
      id as Address,
      token0,
      token1,
      fee,
      0n,
      0n,
      tick,
      liquidity,
      sqrtPriceX96,
      ticks,
      nearestTick,
    )
    const sqrtPrice = Number(this.sqrtPriceX96) / two96
    const reserve0 = Number(liquidity) / sqrtPrice // TODO: Check it !!!!!
    const reserve1 = reserve0 * sqrtPrice * sqrtPrice
    this.reserve0 = BigInt(reserve0)
    this.reserve1 = BigInt(reserve1)
  }

  // don't call this function directly!!!
  override updateReserves() {
    throw new Error("Function UniV4Pool.updateReserves shouldn't be called")
  }

  // don't call this function directly!!!
  override updateState() {
    throw new Error("Function UniV4Pool.updateState shouldn't be called")
  }
}
