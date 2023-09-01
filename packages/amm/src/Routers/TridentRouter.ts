import { Currency } from '@sushiswap/currency'
import { Percent } from '@sushiswap/math'
import invariant from 'tiny-invariant'

import { Trade, TradeType, Version } from '../Trade'

/**
 * Options for producing the arguments to send call to the router.
 */
export interface TradeOptions {
  /**
   * How much the execution price is allowed to move unfavorably from the trade execution price.
   */
  allowedSlippage: Percent
  /**
   * The account that should receive the output of the swap.
   */
  recipient: string
}

/**
 * The parameters to use in the call to the Uniswap V2 Router to execute a trade.
 */
export interface SwapParameters {
  /**
   * The method to call on the Uniswap V2 Router.
   */
  methodName: string
  /**
   * The arguments to pass to the method, all hex encoded.
   */
  args: (string | string[])[]
  /**
   * The amount of wei to send in hex.
   */
  value: string
}

/**
 * Represents the Trident Router, and has static methods for helping execute trades.
 */
export abstract class TridentRouter {
  /**
   * Cannot be constructed.
   */
  private constructor() {}

  /**
   * Produces the on-chain method name to call and the hex encoded parameters to pass as arguments for a given trade.
   * @param trade to produce call parameters for
   * @param options options for the call parameters
   */
  public static swapCallParameters(
    trade: Trade<Currency, Currency, TradeType, Version.V2>,
    options: TradeOptions
  ): SwapParameters {
    const etherIn = trade.inputAmount.currency.isNative
    const etherOut = trade.outputAmount.currency.isNative
    // the router does not support both ether in and out
    invariant(!(etherIn && etherOut), 'ETHER_IN_OUT')

    let methodName: string
    let args: (string | string[])[]
    let value: string

    if (trade.isSinglePool()) {
      //
    } else if (trade.isSingle()) {
      //
    } else if (trade.isComplex()) {
      //
    }

    return {
      methodName: '',
      args: [],
      value: '0x0',
    }
  }
}
