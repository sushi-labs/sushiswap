import { MultiRoute, RToken } from '@sushiswap/tines'
import { Amount, Price, Type as Currency } from 'sushi/currency'
import { TradeType as Type, Version } from 'sushi/dex'
import { Fraction, ONE, Percent, ZERO } from 'sushi/math'
import invariant from 'tiny-invariant'

/**
 * Represents a trade executed against a list of pools.
 * Does not account for slippage, i.e. trades that front run this trade and move the price.
 */
export class Trade<
  TInput extends Currency,
  TOutput extends Currency,
  TradeType extends Type,
  TradeVersion extends Version,
> {
  /**
   * The route of the trade, i.e. which pools the trade goes through and the input/output currencies.
   */
  public readonly route: MultiRoute

  /**
   * The type of the trade, either exact in or exact out.
   */
  public readonly tradeType: TradeType

  /**
   * The version of the trade, either v1 or v2.
   */
  public readonly tradeVersion: TradeVersion

  /**
   * The input amount for the trade assuming no slippage.
   */
  public readonly inputAmount: Amount<TInput>
  /**
   * The output amount for the trade assuming no slippage.
   */
  public readonly outputAmount: Amount<TOutput>

  /**
   * The input share for the trade assuming no slippage.
   */
  // public readonly inputShare: Share<TInput>
  /**
   * The output share for the trade assuming no slippage.
   */
  // public readonly outputShare: Share<TOutput>

  /**
   * The price expressed in terms of output amount/input amount.
   */
  public readonly executionPrice: Price<TInput, TOutput>

  /**
   * The percent difference between the mid price before the trade and the trade execution price.
   */
  public readonly priceImpact: Percent = new Percent(0n, 10000n)

  public readonly currencyInRebase = {
    base: 0n,
    elastic: 0n,
  }
  public readonly currencyOutRebase = {
    base: 0n,
    elastic: 0n,
  }

  /**
   * Constructs an exact in trade with the given amount in and route
   * @param route route of the exact in trade
   * @param amountIn the amount being passed in
   * @param currencyOut the output currency
   */
  public static exactIn<
    TInput extends Currency,
    TOutput extends Currency,
    TVersion extends Version,
  >(
    route: MultiRoute,
    amountIn: Amount<TInput>,
    currencyOut: TOutput,
    version: TVersion,
    currencyInRebase = { base: 0n, elastic: 0n },
    currencyOutRebase = { base: 0n, elastic: 0n },
  ): Trade<TInput, TOutput, Type.EXACT_INPUT, TVersion> {
    return new Trade(
      {
        ...route,
        fromToken: amountIn.currency as RToken,
        toToken: currencyOut as RToken,
      },
      Type.EXACT_INPUT,
      version,
      currencyInRebase,
      currencyOutRebase,
    )
  }

  /**
   * Constructs an exact out trade with the given amount out and route
   * @param route route of the exact out trade
   * @param amountOut the amount returned by the trade
   * @param currencyIn the output currency
   */
  public static exactOut<
    TInput extends Currency,
    TOutput extends Currency,
    TVersion extends Version,
  >(
    route: MultiRoute,
    currencyIn: TInput,
    amountOut: Amount<TOutput>,
    version: TVersion,
    currencyInRebase = { base: 0n, elastic: 0n },
    currencyOutRebase = { base: 0n, elastic: 0n },
  ): Trade<TInput, TOutput, Type.EXACT_OUTPUT, TVersion> {
    return new Trade(
      {
        ...route,
        fromToken: currencyIn as RToken,
        toToken: amountOut.currency as RToken,
      },
      Type.EXACT_OUTPUT,
      version,
      currencyInRebase,
      currencyOutRebase,
    )
  }

  public constructor(
    route: MultiRoute,
    tradeType: TradeType,
    tradeVersion: TradeVersion,
    currencyInRebase = { base: 0n, elastic: 0n },
    currencyOutRebase = { base: 0n, elastic: 0n },
  ) {
    this.route = route
    this.tradeType = tradeType
    this.tradeVersion = tradeVersion
    this.currencyInRebase = currencyInRebase
    this.currencyOutRebase = currencyOutRebase

    const amountIn = Amount.fromShare(
      route.fromToken as TInput,
      route.amountInBI.toString(),
      currencyInRebase,
      tradeVersion === Version.V2,
    )

    const amountOut = Amount.fromShare(
      route.toToken as TOutput,
      route.amountOutBI.toString(),
      currencyOutRebase,
      tradeVersion === Version.V2,
    )

    if (tradeType === Type.EXACT_INPUT) {
      this.inputAmount = Amount.fromFractionalAmount(
        amountIn.currency,
        amountIn.numerator,
        amountIn.denominator,
      )
      this.outputAmount = Amount.fromFractionalAmount(
        amountOut.currency,
        amountOut.numerator,
        amountOut.denominator,
      )
    } else {
      this.inputAmount = Amount.fromFractionalAmount(
        amountIn.currency,
        amountOut.numerator,
        amountOut.denominator,
      )
      this.outputAmount = Amount.fromFractionalAmount(
        amountOut.currency,
        amountIn.numerator,
        amountIn.denominator,
      )
    }

    this.executionPrice = new Price(
      this.inputAmount.currency,
      this.outputAmount.currency,
      this.inputAmount.quotient,
      this.outputAmount.quotient,
    )

    // Shouldn't really have to check this, but tines makes us
    if (this.route.priceImpact) {
      this.priceImpact = new Percent(
        BigInt(Math.round(this.route.priceImpact * 10000)),
        10000n,
      )
    }
  }

  /**
   * Get the minimum amount that must be received from this trade for the given slippage tolerance
   * @param slippageTolerance tolerance of unfavorable slippage from the execution price of this trade
   */
  public minimumAmountOut(slippageTolerance: Percent): Amount<TOutput> {
    invariant(!slippageTolerance.lessThan(ZERO), 'SLIPPAGE_TOLERANCE')

    if (this.tradeType === Type.EXACT_OUTPUT) {
      return this.outputAmount
    } else {
      const slippageAdjustedAmountOut = new Fraction(ONE)
        .add(slippageTolerance)
        .invert()
        .multiply(this.outputAmount.quotient).quotient
      return Amount.fromRawAmount(
        this.outputAmount.currency,
        slippageAdjustedAmountOut,
      )
    }
  }

  /**
   * Get the maximum amount in that can be spent via this trade for the given slippage tolerance
   * @param slippageTolerance tolerance of unfavorable slippage from the execution price of this trade
   */
  public maximumAmountIn(slippageTolerance: Percent): Amount<TInput> {
    invariant(!slippageTolerance.lessThan(ZERO), 'SLIPPAGE_TOLERANCE')
    if (this.tradeType === Type.EXACT_INPUT) {
      return this.inputAmount
    } else {
      const slippageAdjustedAmountIn = new Fraction(ONE)
        .add(slippageTolerance)
        .multiply(this.inputAmount.quotient).quotient
      return Amount.fromRawAmount(
        this.inputAmount.currency,
        slippageAdjustedAmountIn,
      )
    }
  }

  /**
   * Return the execution price after accounting for slippage tolerance
   * @param slippageTolerance the allowed tolerated slippage
   */
  public worstExecutionPrice(
    slippageTolerance: Percent,
  ): Price<TInput, TOutput> {
    return new Price(
      this.inputAmount.currency,
      this.outputAmount.currency,
      this.maximumAmountIn(slippageTolerance).quotient,
      this.minimumAmountOut(slippageTolerance).quotient,
    )
  }

  public isV1(): boolean {
    return this.tradeVersion === Version.V1
  }

  public isV2(): boolean {
    return this.tradeVersion === Version.V2
  }

  public routeType():
    | 'Single Pool'
    | 'Single Path'
    | 'Complex Path'
    | 'Not Found' {
    if (this.isComplex()) return 'Complex Path'
    if (this.isSingle()) return 'Single Path'
    if (this.isSinglePool()) return 'Single Pool'
    return 'Not Found'
  }

  public isNotFound(): boolean {
    return !this.route.legs.length
  }

  public isComplex(): boolean {
    return (
      new Set(this.route.legs.map((leg) => leg.tokenFrom.address)).size !==
      this.route.legs.length
    )
  }

  public isSinglePool(): boolean {
    return this.route.legs.length === 1
  }

  public isSingle(): boolean {
    return (
      new Set(this.route.legs.map((leg) => leg.tokenFrom.address)).size ===
      this.route.legs.length
    )
  }
}
