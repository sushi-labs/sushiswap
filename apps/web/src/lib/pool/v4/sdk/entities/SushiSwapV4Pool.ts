import { Amount, Price, type Type } from 'sushi/currency'
import type { BigintIsh } from 'sushi/math'
import {
  LiquidityMath,
  NoTickDataProvider,
  SwapMath,
  type Tick,
  type TickConstructorArgs,
  type TickDataProvider,
  TickListDataProvider,
  TickMath,
} from 'sushi/pool'
import invariant from 'tiny-invariant'
import { type Hex, isAddress, zeroAddress } from 'viem'
import {
  SUSHISWAP_V4_CL_POOL_MANAGER,
  type SushiSwapV4ChainId,
} from '../../config'
import { DYNAMIC_FEE_FLAG } from '../constants'
import { Q192 } from '../constants/internalConstants'
import type { HookData, PoolKey, PoolType } from '../types'
import { getPoolId, getPoolKey, sortCurrencies } from '../utils'

interface StepComputations {
  sqrtPriceStartX96: bigint
  tickNext: number
  initialized: boolean
  sqrtPriceNextX96: bigint
  amountIn: bigint
  amountOut: bigint
  feeAmount: bigint
}

/**
 * By default, pools will not allow operations that require ticks.
 */
const NO_TICK_DATA_PROVIDER_DEFAULT = new NoTickDataProvider()

/**
 * Represents a SushiSwapV4 pool
 */
export class SushiSwapV4Pool {
  public readonly id: Hex

  public readonly poolKey: PoolKey

  public readonly currency0: Type

  public readonly currency1: Type

  public readonly fee: number

  public sqrtRatioX96: bigint

  public readonly hooks?: HookData

  public liquidity: bigint

  public tickCurrent: number

  public readonly tickDataProvider: TickDataProvider

  public readonly dynamic?: boolean

  public feeProtocol?: number

  public readonly poolType: PoolType

  public readonly tickSpacing: number

  private _currency0Price?: Price<Type, Type>

  private _currency1Price?: Price<Type, Type>

  public static getPoolKey(
    chainId: SushiSwapV4ChainId,
    currency0: Type,
    currency1: Type,
    feeAmount: number,
    tickSpacing: number,
    hooks?: HookData,
  ) {
    return {
      currency0: currency0.isNative ? zeroAddress : currency0.wrapped.address,
      currency1: currency1.isNative ? zeroAddress : currency1.wrapped.address,
      hooks: hooks?.address ?? zeroAddress,
      poolManager: SUSHISWAP_V4_CL_POOL_MANAGER[chainId],
      fee: feeAmount,
      parameters: {
        tickSpacing,
        hooksRegistration: hooks?.hooksRegistration,
      },
    } satisfies PoolKey
  }

  /**
   * Construct a pool
   * @param tokenA One of the tokens in the pool
   * @param tokenB The other token in the pool
   * @param fee The fee in hundredths of a bips of the input amount of every swap that is collected by the pool
   * @param sqrtRatioX96 The sqrt of the current ratio of amounts of token1 to token0
   * @param liquidity The current value of in range liquidity
   * @param tickCurrent The current tick of the pool
   * @param ticks The current state of the pool ticks or a data provider that can return tick data
   */
  public constructor({
    poolType = 'CL',
    currencyA,
    currencyB,
    fee,
    sqrtRatioX96,
    liquidity,
    tickCurrent,
    ticks = NO_TICK_DATA_PROVIDER_DEFAULT,
    tickSpacing,
    hooks,
  }: {
    poolType?: PoolType
    currencyA: Type
    currencyB: Type
    fee: number
    sqrtRatioX96: BigintIsh
    liquidity: BigintIsh
    tickCurrent: number
    ticks?: TickDataProvider | (Tick | TickConstructorArgs)[]
    tickSpacing: number
    hooks?: HookData
  }) {
    invariant(
      !hooks || isAddress(hooks.address, { strict: false }),
      'Invalid hook address',
    )
    invariant(
      Number.isInteger(fee) && (fee === DYNAMIC_FEE_FLAG || fee < 1_000_000),
      'FEE',
    )
    ;[this.currency0, this.currency1] = sortCurrencies(currencyA, currencyB)
    this.fee = fee
    this.sqrtRatioX96 = BigInt(sqrtRatioX96)
    this.liquidity = BigInt(liquidity)
    this.tickCurrent = tickCurrent
    this.tickDataProvider = Array.isArray(ticks)
      ? new TickListDataProvider(ticks, tickSpacing)
      : ticks
    this.tickSpacing = tickSpacing
    this.poolType = poolType
    this.dynamic = fee === DYNAMIC_FEE_FLAG
    this.hooks = hooks
    this.poolKey = getPoolKey({
      chainId: this.chainId,
      currency0: this.currency0,
      currency1: this.currency1,
      feeAmount: this.fee,
      tickSpacing: this.tickSpacing,
      hookData: this.hooks,
    })
    this.id = getPoolId(this.poolKey)
  }

  /** backwards compatibility with v2/3 sdks */
  public get token0(): Type {
    return this.currency0
  }
  public get token1(): Type {
    return this.currency1
  }

  /**
   * Returns true if the token is either token0 or token1
   * @param token The token to check
   * @returns True if token is either token0 or token
   */
  public involvesCurrency(currency: Type): boolean {
    if (currency.isNative && this.currency0.isNative) return true
    return currency.equals(this.currency0) || currency.equals(this.currency1)
  }

  /** backwards compatibility with v2/3 sdks */
  public involvesToken(currency: Type): boolean {
    return this.involvesCurrency(currency)
  }

  /**
   * Returns the current mid price of the pool in terms of token0, i.e. the ratio of token1 over token0
   */
  public get currency0Price(): Price<Type, Type> {
    this._currency0Price =
      this._currency0Price ??
      new Price(
        this.currency0,
        this.currency1,
        Q192,
        this.sqrtRatioX96 * this.sqrtRatioX96,
      )
    return this._currency0Price
  }

  /** backwards compatibility with v2/3 sdks */
  public get token0Price(): Price<Type, Type> {
    return this.currency0Price
  }

  /**
   * Returns the current mid price of the pool in terms of token1, i.e. the ratio of token0 over token1
   */
  public get currency1Price(): Price<Type, Type> {
    this._currency1Price =
      this._currency1Price ??
      new Price(
        this.currency1,
        this.currency0,
        this.sqrtRatioX96 * this.sqrtRatioX96,
        Q192,
      )
    return this._currency1Price
  }

  /** backwards compatibility with v2/3 sdks */
  public get token1Price(): Price<Type, Type> {
    return this.currency1Price
  }

  /**
   * Return the price of the given token in terms of the other token in the pool.
   * @param token The token to return price of
   * @returns The price of the given token, in terms of the other.
   */
  public priceOf(currency: Type): Price<Type, Type> {
    invariant(this.involvesCurrency(currency), 'CURRENCY')
    return currency.equals(this.currency0)
      ? this.currency0Price
      : this.currency1Price
  }

  /**
   * Returns the chain ID of the tokens in the pool.
   */
  public get chainId(): SushiSwapV4ChainId {
    return this.currency0.chainId as SushiSwapV4ChainId
  }

  /**
   * Given an input amount of a token, return the computed output amount, and a pool with state updated after the trade
   * @param inputAmount The input amount for which to quote the output amount
   * @param sqrtPriceLimitX96 The Q64.96 sqrt price limit
   * @returns The output amount and the pool with updated state
   */
  public async getOutputAmount(
    inputAmount: Amount<Type>,
    sqrtPriceLimitX96?: bigint,
  ): Promise<[Amount<Type>, SushiSwapV4Pool]> {
    invariant(this.involvesCurrency(inputAmount.currency), 'CURRENCY')

    const zeroForOne = inputAmount.currency.equals(this.currency0)

    const {
      amountCalculated: outputAmount,
      sqrtRatioX96,
      liquidity,
      tickCurrent,
    } = await this.swap(zeroForOne, inputAmount.quotient, sqrtPriceLimitX96)
    const outputToken = zeroForOne ? this.currency1 : this.currency0
    return [
      Amount.fromRawAmount(outputToken, outputAmount * -1n),
      new SushiSwapV4Pool({
        poolType: this.poolType,
        currencyA: this.currency0,
        currencyB: this.currency1,
        fee: this.fee,
        sqrtRatioX96,
        liquidity,
        tickCurrent,
        ticks: this.tickDataProvider,
        tickSpacing: this.tickSpacing,
      }),
    ]
  }

  /**
   * Given a desired output amount of a token, return the computed input amount and a pool with state updated after the trade
   * @param outputAmount the output amount for which to quote the input amount
   * @param sqrtPriceLimitX96 The Q64.96 sqrt price limit. If zero for one, the price cannot be less than this value after the swap. If one for zero, the price cannot be greater than this value after the swap
   * @returns The input amount and the pool with updated state
   */
  public async getInputAmount(
    outputAmount: Amount<Type>,
    sqrtPriceLimitX96?: bigint,
  ): Promise<[Amount<Type>, SushiSwapV4Pool]> {
    invariant(
      outputAmount.currency.isToken &&
        this.involvesCurrency(outputAmount.currency),
      'CURRENCY',
    )

    const zeroForOne = outputAmount.currency.equals(this.currency1)

    const {
      amountCalculated: inputAmount,
      sqrtRatioX96,
      liquidity,
      tickCurrent,
    } = await this.swap(
      zeroForOne,
      outputAmount.quotient * -1n,
      sqrtPriceLimitX96,
    )

    const inputToken = zeroForOne ? this.currency0 : this.currency1
    return [
      Amount.fromRawAmount(inputToken, inputAmount),
      new SushiSwapV4Pool({
        poolType: this.poolType,
        currencyA: this.currency0,
        currencyB: this.currency1,
        fee: this.fee,
        sqrtRatioX96,
        liquidity,
        tickCurrent,
        ticks: this.tickDataProvider,
        tickSpacing: this.tickSpacing,
      }),
    ]
  }

  /**
   * Given a desired output amount of a token, return the computed input amount and a pool with state updated after the trade
   * @param outputAmount the output amount for which to quote the input amount
   * @param sqrtPriceLimitX96 The Q64.96 sqrt price limit. If zero for one, the price cannot be less than this value after the swap. If one for zero, the price cannot be greater than this value after the swap
   * @returns The input amount and the pool with updated state
   */
  public async getInputAmountByExactOut(
    outputAmount: Amount<Type>,
    sqrtPriceLimitX96?: bigint,
  ): Promise<[Amount<Type>, SushiSwapV4Pool]> {
    invariant(
      outputAmount.currency.isToken &&
        this.involvesCurrency(outputAmount.currency),
      'CURRENCY',
    )

    const zeroForOne = outputAmount.currency.equals(this.currency1)

    const {
      amountSpecifiedRemaining,
      amountCalculated: inputAmount,
      sqrtRatioX96,
      liquidity,
      tickCurrent,
    } = await this.swap(
      zeroForOne,
      outputAmount.quotient * -1n,
      sqrtPriceLimitX96,
    )

    invariant(amountSpecifiedRemaining === 0n, 'INSUFFICIENT_LIQUIDITY')

    const inputToken = zeroForOne ? this.currency0 : this.currency1
    return [
      Amount.fromRawAmount(inputToken, inputAmount),
      new SushiSwapV4Pool({
        poolType: this.poolType,
        currencyA: this.currency0,
        currencyB: this.currency1,
        fee: this.fee,
        sqrtRatioX96,
        liquidity,
        tickCurrent,
        ticks: this.tickDataProvider,
        tickSpacing: this.tickSpacing,
      }),
    ]
  }

  /**
   * Executes a swap
   * @param zeroForOne Whether the amount in is token0 or token1
   * @param amountSpecified The amount of the swap, which implicitly configures the swap as exact input (positive), or exact output (negative)
   * @param sqrtPriceLimitX96 The Q64.96 sqrt price limit. If zero for one, the price cannot be less than this value after the swap. If one for zero, the price cannot be greater than this value after the swap
   * @returns amountCalculated
   * @returns sqrtRatioX96
   * @returns liquidity
   * @returns tickCurrent
   */
  private async swap(
    zeroForOne: boolean,
    amountSpecified: bigint,
    _sqrtPriceLimitX96?: bigint,
  ): Promise<{
    amountCalculated: bigint
    sqrtRatioX96: bigint
    liquidity: bigint
    tickCurrent: number
    amountSpecifiedRemaining: bigint
  }> {
    const sqrtPriceLimitX96 =
      _sqrtPriceLimitX96 ??
      (zeroForOne ? TickMath.MIN_SQRT_RATIO + 1n : TickMath.MAX_SQRT_RATIO - 1n)
    if (zeroForOne) {
      invariant(sqrtPriceLimitX96 > TickMath.MIN_SQRT_RATIO, 'RATIO_MIN')
      invariant(sqrtPriceLimitX96 < this.sqrtRatioX96, 'RATIO_CURRENT')
    } else {
      invariant(sqrtPriceLimitX96 < TickMath.MAX_SQRT_RATIO, 'RATIO_MAX')
      invariant(sqrtPriceLimitX96 > this.sqrtRatioX96, 'RATIO_CURRENT')
    }

    const exactInput = amountSpecified >= 0n

    // keep track of swap state

    const state = {
      amountSpecifiedRemaining: amountSpecified,
      amountCalculated: 0n,
      sqrtPriceX96: this.sqrtRatioX96,
      tick: this.tickCurrent,
      liquidity: this.liquidity,
    }

    // start swap while loop
    while (
      state.amountSpecifiedRemaining !== 0n &&
      state.sqrtPriceX96 !== sqrtPriceLimitX96
    ) {
      const step: Partial<StepComputations> = {}
      step.sqrtPriceStartX96 = state.sqrtPriceX96

      // because each iteration of the while loop rounds, we can't optimize this code (relative to the smart contract)
      // by simply traversing to the next available tick, we instead need to exactly replicate
      // tickBitmap.nextInitializedTickWithinOneWord
      ;[step.tickNext, step.initialized] =
        await this.tickDataProvider.nextInitializedTickWithinOneWord(
          state.tick,
          zeroForOne,
          this.tickSpacing,
        )

      if (step.tickNext < TickMath.MIN_TICK) {
        step.tickNext = TickMath.MIN_TICK
      } else if (step.tickNext > TickMath.MAX_TICK) {
        step.tickNext = TickMath.MAX_TICK
      }

      step.sqrtPriceNextX96 = TickMath.getSqrtRatioAtTick(step.tickNext)
      ;[state.sqrtPriceX96, step.amountIn, step.amountOut, step.feeAmount] =
        SwapMath.computeSwapStep(
          state.sqrtPriceX96,
          (
            zeroForOne
              ? step.sqrtPriceNextX96 < sqrtPriceLimitX96
              : step.sqrtPriceNextX96 > sqrtPriceLimitX96
          )
            ? sqrtPriceLimitX96
            : step.sqrtPriceNextX96,
          state.liquidity,
          state.amountSpecifiedRemaining,
          this.fee,
        )

      if (exactInput) {
        state.amountSpecifiedRemaining =
          state.amountSpecifiedRemaining - (step.amountIn! + step.feeAmount!)
        state.amountCalculated = state.amountCalculated! - step.amountOut!
      } else {
        state.amountSpecifiedRemaining =
          state.amountSpecifiedRemaining! + step.amountOut!
        state.amountCalculated =
          state.amountCalculated! + (step.amountIn! + step.feeAmount!)
      }

      // TODO
      if (state.sqrtPriceX96 === step.sqrtPriceNextX96) {
        // if the tick is initialized, run the tick transition
        if (step.initialized) {
          let liquidityNet = BigInt(
            (await this.tickDataProvider.getTick(step.tickNext)).liquidityNet,
          )
          // if we're moving leftward, we interpret liquidityNet as the opposite sign
          // safe because liquidityNet cannot be type(int128).min
          if (zeroForOne) liquidityNet = liquidityNet * -1n

          state.liquidity = LiquidityMath.addDelta(
            state.liquidity,
            liquidityNet,
          )
        }

        state.tick = zeroForOne ? step.tickNext - 1 : step.tickNext
      } else if (state.sqrtPriceX96 !== step.sqrtPriceStartX96) {
        // updated comparison function
        // recompute unless we're on a lower tick boundary (i.e. already transitioned ticks), and haven't moved
        state.tick = TickMath.getTickAtSqrtRatio(state.sqrtPriceX96)
      }
    }

    return {
      amountSpecifiedRemaining: state.amountSpecifiedRemaining,
      amountCalculated: state.amountCalculated,
      sqrtRatioX96: state.sqrtPriceX96,
      liquidity: state.liquidity,
      tickCurrent: state.tick,
    }
  }
}
