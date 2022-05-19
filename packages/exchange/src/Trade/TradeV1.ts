import { Amount, Price, Token, Type as Currency } from '@sushiswap/currency'
import { Fraction, ONE, Percent, ZERO } from '@sushiswap/math'
import invariant from 'tiny-invariant'

import { InsufficientInputAmountError, InsufficientReservesError } from '../errors'
import { Pair } from '../Pair'
import { RouteV1 as Route } from '../Route'
import { computePriceImpact } from './computePriceImpact'
import { sortedInsert } from './sortedInsert'
import { Type } from './Type'

// minimal interface so the input output comparator may be shared across types
interface InputOutput<TInput extends Currency, TOutput extends Currency> {
  readonly inputAmount: Amount<TInput>
  readonly outputAmount: Amount<TOutput>
}

// comparator function that allows sorting trades by their output amounts, in decreasing order, and then input amounts
// in increasing order. i.e. the best trades have the most outputs for the least inputs and are sorted first
export function inputOutputComparator<TInput extends Currency, TOutput extends Currency>(
  a: InputOutput<TInput, TOutput>,
  b: InputOutput<TInput, TOutput>,
): number {
  // must have same input and output token for comparison
  invariant(a.inputAmount.currency.equals(b.inputAmount.currency), 'INPUT_CURRENCY')
  invariant(a.outputAmount.currency.equals(b.outputAmount.currency), 'OUTPUT_CURRENCY')
  if (a.outputAmount.equalTo(b.outputAmount)) {
    if (a.inputAmount.equalTo(b.inputAmount)) {
      return 0
    }
    // trade A requires less input than trade B, so A should come first
    if (a.inputAmount.lessThan(b.inputAmount)) {
      return -1
    } else {
      return 1
    }
  } else {
    // tradeA has less output than trade B, so should come second
    if (a.outputAmount.lessThan(b.outputAmount)) {
      return 1
    } else {
      return -1
    }
  }
}

// extension of the input output comparator that also considers other dimensions of the trade in ranking them
export function tradeComparator<TInput extends Currency, TOutput extends Currency, TType extends Type>(
  a: Trade<TInput, TOutput, TType>,
  b: Trade<TInput, TOutput, TType>,
) {
  const ioComp = inputOutputComparator(a, b)
  if (ioComp !== 0) {
    return ioComp
  }

  // consider lowest slippage next, since these are less likely to fail
  if (a.priceImpact.lessThan(b.priceImpact)) {
    return -1
  } else if (a.priceImpact.greaterThan(b.priceImpact)) {
    return 1
  }

  // finally consider the number of hops since each hop costs gas
  return a.route.path.length - b.route.path.length
}

export interface BestTradeOptions {
  // how many results to return
  maxNumResults?: number
  // the maximum number of hops a trade should contain
  maxHops?: number
}

/**
 * Represents a trade executed against a list of pairs.
 * Does not account for slippage, i.e. trades that front run this trade and move the price.
 */
export class Trade<TInput extends Currency, TOutput extends Currency, TType extends Type> {
  /**
   * The route of the trade, i.e. which pairs the trade goes through and the input/output currencies.
   */
  public readonly route: Route<TInput, TOutput>
  /**
   * The type of the trade, either exact in or exact out.
   */
  public readonly tradeType: TType
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
   * The percent difference between the mid price before the trade and the trade execution price.
   */
  public readonly priceImpact: Percent

  /**
   * Constructs an exact in trade with the given amount in and route
   * @param route route of the exact in trade
   * @param amountIn the amount being passed in
   */
  public static exactIn<TInput extends Currency, TOutput extends Currency>(
    route: Route<TInput, TOutput>,
    amountIn: Amount<TInput>,
  ): Trade<TInput, TOutput, Type.EXACT_INPUT> {
    return new Trade(route, amountIn, Type.EXACT_INPUT)
  }

  /**
   * Constructs an exact out trade with the given amount out and route
   * @param route route of the exact out trade
   * @param amountOut the amount returned by the trade
   */
  public static exactOut<TInput extends Currency, TOutput extends Currency>(
    route: Route<TInput, TOutput>,
    amountOut: Amount<TOutput>,
  ): Trade<TInput, TOutput, Type.EXACT_OUTPUT> {
    return new Trade(route, amountOut, Type.EXACT_OUTPUT)
  }

  public constructor(
    route: Route<TInput, TOutput>,
    amount: TType extends Type.EXACT_INPUT ? Amount<TInput> : Amount<TOutput>,
    tradeType: TType,
  ) {
    this.route = route
    this.tradeType = tradeType

    const tokenAmounts: Amount<Token>[] = new Array(route.path.length)
    if (tradeType === Type.EXACT_INPUT) {
      invariant(amount.currency.equals(route.input), 'INPUT')
      tokenAmounts[0] = amount.wrapped
      for (let i = 0; i < route.path.length - 1; i++) {
        const pair = route.pairs[i]
        const [outputAmount] = pair.getOutputAmount(tokenAmounts[i])
        tokenAmounts[i + 1] = outputAmount
      }
      this.inputAmount = Amount.fromFractionalAmount(route.input, amount.numerator, amount.denominator)
      this.outputAmount = Amount.fromFractionalAmount(
        route.output,
        tokenAmounts[tokenAmounts.length - 1].numerator,
        tokenAmounts[tokenAmounts.length - 1].denominator,
      )
    } else {
      invariant(amount.currency.equals(route.output), 'OUTPUT')
      tokenAmounts[tokenAmounts.length - 1] = amount.wrapped
      for (let i = route.path.length - 1; i > 0; i--) {
        const pair = route.pairs[i - 1]
        const [inputAmount] = pair.getInputAmount(tokenAmounts[i])
        tokenAmounts[i - 1] = inputAmount
      }
      this.inputAmount = Amount.fromFractionalAmount(
        route.input,
        tokenAmounts[0].numerator,
        tokenAmounts[0].denominator,
      )
      this.outputAmount = Amount.fromFractionalAmount(route.output, amount.numerator, amount.denominator)
    }
    this.executionPrice = new Price(
      this.inputAmount.currency,
      this.outputAmount.currency,
      this.inputAmount.quotient,
      this.outputAmount.quotient,
    )
    this.priceImpact = computePriceImpact(route.midPrice, this.inputAmount, this.outputAmount)
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

  /**
   * Given a list of pairs, and a fixed amount in, returns the top `maxNumResults` trades that go from an input token
   * amount to an output token, making at most `maxHops` hops.
   * Note this does not consider aggregation, as routes are linear. It's possible a better route exists by splitting
   * the amount in among multiple routes.
   * @param pairs the pairs to consider in finding the best trade
   * @param nextAmountIn exact amount of input currency to spend
   * @param currencyOut the desired currency out
   * @param maxNumResults maximum number of results to return
   * @param maxHops maximum number of hops a returned trade can make, e.g. 1 hop goes through a single pair
   * @param currentPairs used in recursion; the current list of pairs
   * @param AmountIn used in recursion; the original value of the AmountIn parameter
   * @param bestTrades used in recursion; the current list of best trades
   */
  public static bestTradeExactIn<TInput extends Currency, TOutput extends Currency>(
    pairs: Pair[],
    AmountIn: Amount<TInput>,
    currencyOut: TOutput,
    { maxNumResults = 3, maxHops = 3 }: BestTradeOptions = {},
    // used in recursion.
    currentPairs: Pair[] = [],
    nextAmountIn: Amount<Currency> = AmountIn,
    bestTrades: Trade<TInput, TOutput, Type.EXACT_INPUT>[] = [],
  ): Trade<TInput, TOutput, Type.EXACT_INPUT>[] {
    invariant(pairs.length > 0, 'PAIRS')
    invariant(maxHops > 0, 'MAX_HOPS')
    invariant(AmountIn === nextAmountIn || currentPairs.length > 0, 'INVALID_RECURSION')

    const amountIn = nextAmountIn.wrapped
    const tokenOut = currencyOut.wrapped
    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i]
      // pair irrelevant
      if (!pair.token0.equals(amountIn.currency) && !pair.token1.equals(amountIn.currency)) continue
      if (pair.reserve0.equalTo(ZERO) || pair.reserve1.equalTo(ZERO)) continue

      let amountOut: Amount<Token>
      try {
        ;[amountOut] = pair.getOutputAmount(amountIn)
      } catch (error) {
        // input too low
        if (error instanceof InsufficientInputAmountError && error.isInsufficientInputAmountError) {
          continue
        }
        throw error
      }
      // we have arrived at the output token, so this is the final trade of one of the paths
      if (amountOut.currency.equals(tokenOut)) {
        sortedInsert(
          bestTrades,
          new Trade(new Route([...currentPairs, pair], AmountIn.currency, currencyOut), AmountIn, Type.EXACT_INPUT),
          maxNumResults,
          tradeComparator,
        )
      } else if (maxHops > 1 && pairs.length > 1) {
        const pairsExcludingThisPair = pairs.slice(0, i).concat(pairs.slice(i + 1, pairs.length))

        // otherwise, consider all the other paths that lead from this token as long as we have not exceeded maxHops
        Trade.bestTradeExactIn(
          pairsExcludingThisPair,
          AmountIn,
          currencyOut,
          {
            maxNumResults,
            maxHops: maxHops - 1,
          },
          [...currentPairs, pair],
          amountOut,
          bestTrades,
        )
      }
    }

    return bestTrades
  }

  /**
   * Return the execution price after accounting for slippage tolerance
   * @param slippageTolerance the allowed tolerated slippage
   */
  public worstExecutionPrice(slippageTolerance: Percent): Price<TInput, TOutput> {
    return new Price(
      this.inputAmount.currency,
      this.outputAmount.currency,
      this.maximumAmountIn(slippageTolerance).quotient,
      this.minimumAmountOut(slippageTolerance).quotient,
    )
  }

  /**
   * similar to the above method but instead targets a fixed output amount
   * given a list of pairs, and a fixed amount out, returns the top `maxNumResults` trades that go from an input token
   * to an output token amount, making at most `maxHops` hops
   * note this does not consider aggregation, as routes are linear. it's possible a better route exists by splitting
   * the amount in among multiple routes.
   * @param pairs the pairs to consider in finding the best trade
   * @param currencyIn the currency to spend
   * @param nextAmountOut the exact amount of currency out
   * @param maxNumResults maximum number of results to return
   * @param maxHops maximum number of hops a returned trade can make, e.g. 1 hop goes through a single pair
   * @param currentPairs used in recursion; the current list of pairs
   * @param AmountOut used in recursion; the original value of the AmountOut parameter
   * @param bestTrades used in recursion; the current list of best trades
   */
  public static bestTradeExactOut<TInput extends Currency, TOutput extends Currency>(
    pairs: Pair[],
    currencyIn: TInput,
    AmountOut: Amount<TOutput>,
    { maxNumResults = 3, maxHops = 3 }: BestTradeOptions = {},
    // used in recursion.
    currentPairs: Pair[] = [],
    nextAmountOut: Amount<Currency> = AmountOut,
    bestTrades: Trade<TInput, TOutput, Type.EXACT_OUTPUT>[] = [],
  ): Trade<TInput, TOutput, Type.EXACT_OUTPUT>[] {
    invariant(pairs.length > 0, 'PAIRS')
    invariant(maxHops > 0, 'MAX_HOPS')
    invariant(AmountOut === nextAmountOut || currentPairs.length > 0, 'INVALID_RECURSION')

    const amountOut = nextAmountOut.wrapped
    const tokenIn = currencyIn.wrapped
    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i]
      // pair irrelevant
      if (!pair.token0.equals(amountOut.currency) && !pair.token1.equals(amountOut.currency)) continue
      if (pair.reserve0.equalTo(ZERO) || pair.reserve1.equalTo(ZERO)) continue

      let amountIn: Amount<Token>
      try {
        ;[amountIn] = pair.getInputAmount(amountOut)
      } catch (error) {
        // not enough liquidity in this pair
        if (error instanceof InsufficientReservesError && error.isInsufficientReservesError) {
          continue
        }
        throw error
      }
      // we have arrived at the input token, so this is the first trade of one of the paths
      if (amountIn.currency.equals(tokenIn)) {
        sortedInsert(
          bestTrades,
          new Trade(new Route([pair, ...currentPairs], currencyIn, AmountOut.currency), AmountOut, Type.EXACT_OUTPUT),
          maxNumResults,
          tradeComparator,
        )
      } else if (maxHops > 1 && pairs.length > 1) {
        const pairsExcludingThisPair = pairs.slice(0, i).concat(pairs.slice(i + 1, pairs.length))

        // otherwise, consider all the other paths that arrive at this token as long as we have not exceeded maxHops
        Trade.bestTradeExactOut(
          pairsExcludingThisPair,
          currencyIn,
          AmountOut,
          {
            maxNumResults,
            maxHops: maxHops - 1,
          },
          [pair, ...currentPairs],
          amountIn,
          bestTrades,
        )
      }
    }

    return bestTrades
  }
}
