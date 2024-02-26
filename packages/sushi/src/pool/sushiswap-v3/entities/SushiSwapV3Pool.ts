import invariant from 'tiny-invariant'
import {
  SUSHISWAP_V3_FACTORY_ADDRESS,
  SushiSwapV3ChainId,
  SushiSwapV3FeeAmount,
  TICK_SPACINGS,
} from '../../../config/index.js'
import {
  Amount as CurrencyAmount,
  Price,
  Token,
} from '../../../currency/index.js'
import { BigintIsh } from '../../../math/index.js'
import { Q192 } from '../internalConstants.js'
import { computeSushiSwapV3PoolAddress } from '../utils/computePoolAddress.js'
import { LiquidityMath } from '../utils/liquidityMath.js'
import { SwapMath } from '../utils/swapMath.js'
import { TickMath } from '../utils/tickMath.js'
import { Tick, TickConstructorArgs } from './Tick.js'
import { NoTickDataProvider, TickDataProvider } from './TickDataProvider.js'
import { TickListDataProvider } from './TickListDataProvider.js'

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
 * Represents a V3 pool
 */
export class SushiSwapV3Pool {
  public readonly token0: Token
  public readonly token1: Token
  public readonly fee: SushiSwapV3FeeAmount
  public readonly sqrtRatioX96: bigint
  public readonly liquidity: bigint
  public readonly tickCurrent: number
  public readonly tickDataProvider: TickDataProvider

  private _token0Price?: Price<Token, Token>
  private _token1Price?: Price<Token, Token>

  public static getAddress(
    tokenA: Token,
    tokenB: Token,
    fee: SushiSwapV3FeeAmount,
    initCodeHashManualOverride?: string,
    factoryAddressOverride?: string,
  ): string {
    return computeSushiSwapV3PoolAddress({
      factoryAddress:
        factoryAddressOverride ??
        SUSHISWAP_V3_FACTORY_ADDRESS[tokenA.chainId as SushiSwapV3ChainId],
      fee,
      tokenA,
      tokenB,
      initCodeHashManualOverride,
    })
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
  public constructor(
    tokenA: Token,
    tokenB: Token,
    fee: SushiSwapV3FeeAmount,
    sqrtRatioX96: BigintIsh,
    liquidity: BigintIsh,
    tickCurrent: number,
    ticks:
      | TickDataProvider
      | (Tick | TickConstructorArgs)[] = NO_TICK_DATA_PROVIDER_DEFAULT,
  ) {
    invariant(Number.isInteger(fee) && fee < 1_000_000, 'FEE')

    const tickCurrentSqrtRatioX96 = TickMath.getSqrtRatioAtTick(tickCurrent)
    const nextTickSqrtRatioX96 = TickMath.getSqrtRatioAtTick(tickCurrent + 1)
    invariant(
      BigInt(sqrtRatioX96.toString()) >= tickCurrentSqrtRatioX96 &&
        BigInt(sqrtRatioX96.toString()) <= nextTickSqrtRatioX96,
      'PRICE_BOUNDS',
    )
    // always create a copy of the list since we want the pool's tick list to be immutable
    ;[this.token0, this.token1] = tokenA.sortsBefore(tokenB)
      ? [tokenA, tokenB]
      : [tokenB, tokenA]
    this.fee = fee
    this.sqrtRatioX96 = BigInt(sqrtRatioX96.toString())
    this.liquidity = BigInt(liquidity.toString())
    this.tickCurrent = tickCurrent
    this.tickDataProvider = Array.isArray(ticks)
      ? new TickListDataProvider(ticks, TICK_SPACINGS[fee])
      : ticks
  }

  /**
   * Returns true if the token is either token0 or token1
   * @param token The token to check
   * @returns True if token is either token0 or token
   */
  public involvesToken(token: Token): boolean {
    return token.equals(this.token0) || token.equals(this.token1)
  }

  /**
   * Returns the current mid price of the pool in terms of token0, i.e. the ratio of token1 over token0
   */
  public get token0Price(): Price<Token, Token> {
    if (!this._token0Price) {
      this._token0Price = new Price(
        this.token0,
        this.token1,
        Q192,
        this.sqrtRatioX96 * this.sqrtRatioX96,
      )
    }

    return this._token0Price
  }

  /**
   * Returns the current mid price of the pool in terms of token1, i.e. the ratio of token0 over token1
   */
  public get token1Price(): Price<Token, Token> {
    if (!this._token1Price) {
      this._token1Price = new Price(
        this.token1,
        this.token0,
        this.sqrtRatioX96 * this.sqrtRatioX96,
        Q192,
      )
    }

    return this._token1Price
  }

  /**
   * Return the price of the given token in terms of the other token in the pool.
   * @param token The token to return price of
   * @returns The price of the given token, in terms of the other.
   */
  public priceOf(token: Token): Price<Token, Token> {
    invariant(this.involvesToken(token), 'TOKEN')
    return token.equals(this.token0) ? this.token0Price : this.token1Price
  }

  /**
   * Returns the chain ID of the tokens in the pool.
   */
  public get chainId(): SushiSwapV3ChainId {
    return this.token0.chainId as SushiSwapV3ChainId
  }

  /**
   * Given an input amount of a token, return the computed output amount, and a pool with state updated after the trade
   * @param inputAmount The input amount for which to quote the output amount
   * @param sqrtPriceLimitX96 The Q64.96 sqrt price limit
   * @returns The output amount and the pool with updated state
   */
  public async getOutputAmount(
    inputAmount: CurrencyAmount<Token>,
    sqrtPriceLimitX96?: bigint,
  ): Promise<[CurrencyAmount<Token>, SushiSwapV3Pool]> {
    invariant(this.involvesToken(inputAmount.currency), 'TOKEN')

    const zeroForOne = inputAmount.currency.equals(this.token0)

    const {
      amountCalculated: outputAmount,
      sqrtRatioX96,
      liquidity,
      tickCurrent,
    } = await this.swap(zeroForOne, inputAmount.quotient, sqrtPriceLimitX96)
    const outputToken = zeroForOne ? this.token1 : this.token0
    return [
      CurrencyAmount.fromRawAmount(outputToken, outputAmount * -1n),
      new SushiSwapV3Pool(
        this.token0,
        this.token1,
        this.fee,
        sqrtRatioX96,
        liquidity,
        tickCurrent,
        this.tickDataProvider,
      ),
    ]
  }

  /**
   * Given a desired output amount of a token, return the computed input amount and a pool with state updated after the trade
   * @param outputAmount the output amount for which to quote the input amount
   * @param sqrtPriceLimitX96 The Q64.96 sqrt price limit. If zero for one, the price cannot be less than this value after the swap. If one for zero, the price cannot be greater than this value after the swap
   * @returns The input amount and the pool with updated state
   */
  public async getInputAmount(
    outputAmount: CurrencyAmount<Token>,
    sqrtPriceLimitX96?: bigint,
  ): Promise<[CurrencyAmount<Token>, SushiSwapV3Pool]> {
    invariant(
      outputAmount.currency.isToken &&
        this.involvesToken(outputAmount.currency),
      'TOKEN',
    )

    const zeroForOne = outputAmount.currency.equals(this.token1)

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
    const inputToken = zeroForOne ? this.token0 : this.token1
    return [
      CurrencyAmount.fromRawAmount(inputToken, inputAmount),
      new SushiSwapV3Pool(
        this.token0,
        this.token1,
        this.fee,
        sqrtRatioX96,
        liquidity,
        tickCurrent,
        this.tickDataProvider,
      ),
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
    sqrtPriceLimitX96?: bigint,
  ): Promise<{
    amountCalculated: bigint
    sqrtRatioX96: bigint
    liquidity: bigint
    tickCurrent: number
  }> {
    if (!sqrtPriceLimitX96)
      sqrtPriceLimitX96 = zeroForOne
        ? TickMath.MIN_SQRT_RATIO + 1n
        : TickMath.MAX_SQRT_RATIO - 1n

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
          state.amountSpecifiedRemaining - (step.amountIn + step.feeAmount)
        state.amountCalculated = state.amountCalculated - step.amountOut
      } else {
        state.amountSpecifiedRemaining =
          state.amountSpecifiedRemaining + step.amountOut
        state.amountCalculated =
          state.amountCalculated + (step.amountIn + step.feeAmount)
      }

      // TODO
      if (state.sqrtPriceX96 === step.sqrtPriceNextX96) {
        // if the tick is initialized, run the tick transition
        if (step.initialized) {
          let liquidityNet = BigInt(
            (
              await this.tickDataProvider.getTick(step.tickNext)
            ).liquidityNet.toString(),
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
      amountCalculated: state.amountCalculated,
      sqrtRatioX96: state.sqrtPriceX96,
      liquidity: state.liquidity,
      tickCurrent: state.tick,
    }
  }

  public get tickSpacing(): number {
    return TICK_SPACINGS[this.fee]
  }
}
