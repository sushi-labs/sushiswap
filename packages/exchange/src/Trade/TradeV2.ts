import { Amount, Price, Type as Currency } from '@sushiswap/currency'
import { Fraction, JSBI, ONE, Percent, ZERO } from '@sushiswap/math'
import { MultiRoute, RToken } from '@sushiswap/tines'
import invariant from 'tiny-invariant'

import { Type } from './Type'

/**
 * Represents a trade executed against a list of pools.
 * Does not account for slippage, i.e. trades that front run this trade and move the price.
 */
export class Trade<TInput extends Currency, TOutput extends Currency, TradeType extends Type> {
  /**
   * The route of the trade, i.e. which pools the trade goes through and the input/output currencies.
   */
  public readonly route: MultiRoute

  /**
   * The type of the trade, either exact in or exact out.
   */
  public readonly tradeType: TradeType

  /**
   * The input amount for the trade assuming no slippage.
   */
  public readonly inputAmount: Amount<TInput>
  /**
   * The output amount for the trade assuming no slippage.
   */
  public readonly outputAmount: Amount<TOutput>

  /**
   * The price expressed in terms of output amount/input amount.
   */
  public readonly executionPrice: Price<TInput, TOutput>

  /**
   * Constructs an exact in trade with the given amount in and route
   * @param route route of the exact in trade
   * @param amountIn the amount being passed in
   */
  public static exactIn<TInput extends Currency, TOutput extends Currency>(
    route: MultiRoute
  ): Trade<TInput, TOutput, Type.EXACT_INPUT> {
    return new Trade(route, Type.EXACT_INPUT)
  }

  /**
   * Constructs an exact out trade with the given amount out and route
   * @param route route of the exact out trade
   * @param amountOut the amount returned by the trade
   */
  public static exactOut<TInput extends Currency, TOutput extends Currency>(
    route: MultiRoute
  ): Trade<TInput, TOutput, Type.EXACT_OUTPUT> {
    return new Trade(route, Type.EXACT_OUTPUT)
  }

  /**
   * The percent difference between the mid price before the trade and the trade execution price.
   */
  public readonly priceImpact: Percent

  public constructor(
    route: MultiRoute,
    // amount: TTradeType extends TradeType.EXACT_INPUT ? CurrencyAmount<TInput> : CurrencyAmount<TOutput>,
    tradeType: TradeType
  ) {
    this.route = route
    this.tradeType = tradeType

    const amountIn = Amount.fromRawAmount(route.fromToken as TInput, route.amountInBN.toString())

    const amountOut = Amount.fromRawAmount(route.toToken as TOutput, route.amountOutBN.toString())

    if (tradeType === Type.EXACT_INPUT) {
      this.inputAmount = Amount.fromFractionalAmount(amountIn.currency, amountIn.numerator, amountIn.denominator)
      this.outputAmount = Amount.fromFractionalAmount(amountOut.currency, amountOut.numerator, amountOut.denominator)
    } else {
      this.inputAmount = Amount.fromFractionalAmount(amountIn.currency, amountOut.numerator, amountOut.denominator)
      this.outputAmount = Amount.fromFractionalAmount(amountOut.currency, amountIn.numerator, amountIn.denominator)
    }

    this.executionPrice = new Price(
      this.inputAmount.currency,
      this.outputAmount.currency,
      this.inputAmount.quotient,
      this.outputAmount.quotient
    )

    // this.priceImpact = computePriceImpact(route.midPrice, this.inputAmount, this.outputAmount)

    this.priceImpact = new Percent(JSBI.BigInt(0), JSBI.BigInt(10000))
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
      return Amount.fromRawAmount(this.outputAmount.currency, slippageAdjustedAmountOut)
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
      return Amount.fromRawAmount(this.inputAmount.currency, slippageAdjustedAmountIn)
    }
  }

  public static bestTradeExactIn<TInput extends Currency, TOutput extends Currency>(
    route: MultiRoute,
    currencyAmountIn: Amount<TInput>,
    currencyOut: TOutput
  ): Trade<TInput, TOutput, Type.EXACT_INPUT> {
    return new Trade(
      { ...route, fromToken: currencyAmountIn.currency as RToken, toToken: currencyOut as RToken },
      Type.EXACT_INPUT
    )
  }

  public static bestTradeExactOut<TInput extends Currency, TOutput extends Currency>(
    route: MultiRoute,
    currencyIn: TInput,
    currencyAmountOut: Amount<TOutput>
  ): Trade<TInput, TOutput, Type.EXACT_OUTPUT> {
    return new Trade(
      { ...route, fromToken: currencyIn as RToken, toToken: currencyAmountOut.currency as RToken },
      Type.EXACT_OUTPUT
    )
  }
}
