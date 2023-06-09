import { Amount, Price, Share, Token } from '@sushiswap/currency'
import { JSBI, sqrt, ZERO } from '@sushiswap/math'
import { stablePoolFactoryAddress, StablePoolFactoryChainId } from '@sushiswap/trident-core'
import invariant from 'tiny-invariant'

import { InsufficientInputAmountError, InsufficientReservesError } from '../errors'
import { Fee } from '../Fee'
import { Pool } from '../Pool'
import { computeStablePoolAddress } from './computeStablePoolAddress'
import { SerializedStablePool, stablePoolSchema } from './zod'

interface Rebase {
  elastic: JSBI
  base: JSBI
}

export class StablePool implements Pool {
  public readonly liquidityToken: Token
  public readonly swapGasCost = JSBI.BigInt(60000)
  public readonly minLiquidity = JSBI.BigInt(1000)
  public readonly fee: Fee
  public readonly total0: Rebase
  public readonly total1: Rebase
  private readonly tokenAmounts: [Amount<Token>, Amount<Token>]
  private readonly decimals0: JSBI
  private readonly decimals1: JSBI
  private readonly MAX_FEE = JSBI.BigInt(10000)

  public static getAddress(tokenA: Token, tokenB: Token, fee: Fee): string {
    return computeStablePoolAddress({
      factoryAddress: stablePoolFactoryAddress[tokenA.chainId as StablePoolFactoryChainId],
      tokenA,
      tokenB,
      fee,
    })
  }

  public constructor(amountA: Amount<Token>, amountB: Amount<Token>, fee: Fee, total0: Rebase, total1: Rebase) {
    const tokenAmounts = amountA.currency.sortsBefore(amountB.currency) // does safety checks
      ? [amountA, amountB]
      : [amountB, amountA]
    this.liquidityToken = new Token({
      chainId: tokenAmounts[0].currency.chainId,
      address: StablePool.getAddress(tokenAmounts[0].currency, tokenAmounts[1].currency, fee),
      decimals: 18,
      symbol: 'SSLP',
      name: 'Sushi Stable LP Token',
    })
    this.fee = fee
    this.tokenAmounts = tokenAmounts as [Amount<Token>, Amount<Token>]

    // decimals0 = uint256(10)**(ERC20(_token0).decimals());
    // decimals1 = uint256(10)**(ERC20(_token1).decimals());

    this.decimals0 = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(this.tokenAmounts[0].currency.decimals))
    this.decimals1 = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(this.tokenAmounts[1].currency.decimals))

    this.total0 = total0
    this.total1 = total1
  }

  /**
   * Returns true if the token is either token0 or token1
   * @param token to check
   */
  public involvesToken(token: Token): boolean {
    return token.equals(this.token0) || token.equals(this.token1)
  }

  /**
   * Returns the current mid price of the pair in terms of token0, i.e. the ratio of reserve1 to reserve0
   */
  public get token0Price(): Price<Token, Token> {
    const result = this.tokenAmounts[1].divide(this.tokenAmounts[0])
    return new Price(this.token0, this.token1, result.denominator, result.numerator)
  }

  /**
   * Returns the current mid price of the pair in terms of token1, i.e. the ratio of reserve0 to reserve1
   */
  public get token1Price(): Price<Token, Token> {
    const result = this.tokenAmounts[0].divide(this.tokenAmounts[1])
    return new Price(this.token1, this.token0, result.denominator, result.numerator)
  }

  /**
   * Return the price of the given token in terms of the other token in the pair.
   * @param token token to return price of
   */
  public priceOf(token: Token): Price<Token, Token> {
    invariant(this.involvesToken(token), 'TOKEN')
    return token.equals(this.token0) ? this.token0Price : this.token1Price
  }

  /**
   * Returns the chain ID of the tokens in the pair.
   */
  public get chainId(): number {
    return this.token0.chainId
  }

  public get token0(): Token {
    return this.tokenAmounts[0].currency
  }

  public get token1(): Token {
    return this.tokenAmounts[1].currency
  }

  public get reserve0(): Amount<Token> {
    return this.tokenAmounts[0]
  }

  public get reserve1(): Amount<Token> {
    return this.tokenAmounts[1]
  }

  public get assets(): Token[] {
    return [this.tokenAmounts[0].currency, this.tokenAmounts[1].currency]
  }

  public get reserves(): Amount<Token>[] {
    return [this.reserve0, this.reserve1]
  }

  public get kLast(): JSBI {
    return this.computeLiquidity(this.reserve0.quotient, this.reserve1.quotient)
  }

  public reserveOf(token: Token): Amount<Token> {
    invariant(this.involvesToken(token), 'TOKEN')
    return token.equals(this.token0) ? this.reserve0 : this.reserve1
  }

  private _f(x0: JSBI, y: JSBI) {
    // (x0 * ((((y * y) / 1e12) * y) / 1e12)) / 1e12
    // +
    // (((((x0 * x0) / 1e12) * x0) / 1e12) * y) / 1e12
    return JSBI.add(
      JSBI.divide(
        JSBI.multiply(
          x0,
          JSBI.divide(JSBI.multiply(JSBI.divide(JSBI.multiply(y, y), JSBI.BigInt(1e12)), y), JSBI.BigInt(1e12))
        ),
        JSBI.BigInt(1e12)
      ),
      JSBI.divide(
        JSBI.multiply(
          JSBI.divide(JSBI.multiply(JSBI.divide(JSBI.multiply(x0, x0), JSBI.BigInt(1e12)), x0), JSBI.BigInt(1e12)),
          y
        ),
        JSBI.BigInt(1e12)
      )
    )
  }

  private _d(x0: JSBI, y: JSBI) {
    // (3 * x0 * ((y * y) / 1e12)) / 1e12
    // JSBI.divide(
    //   JSBI.multiply(JSBI.multiply(JSBI.BigInt(3), x0), JSBI.divide(JSBI.multiply(y, y), JSBI.BigInt(1e12))),
    //   JSBI.BigInt(1e12)
    // )

    // +
    // ((((x0 * x0) / 1e12) * x0) / 1e12)
    // JSBI.divide(JSBI.multiply(JSBI.divide(JSBI.multiply(x0, x0), JSBI.BigInt(1e12)), x0), JSBI.BigInt(1e12))

    return JSBI.add(
      JSBI.divide(
        JSBI.multiply(JSBI.multiply(JSBI.BigInt(3), x0), JSBI.divide(JSBI.multiply(y, y), JSBI.BigInt(1e12))),
        JSBI.BigInt(1e12)
      ),
      JSBI.divide(JSBI.multiply(JSBI.divide(JSBI.multiply(x0, x0), JSBI.BigInt(1e12)), x0), JSBI.BigInt(1e12))
    )
  }

  private _get_y(x0: JSBI, xy: JSBI, y: JSBI): JSBI {
    for (let i = 0; i < 255; i++) {
      const yPrev = y
      const k = this._f(x0, y)
      if (JSBI.lessThan(k, xy)) {
        const dy = JSBI.divide(JSBI.multiply(JSBI.subtract(xy, k), JSBI.BigInt(1e12)), this._d(x0, y))
        y = JSBI.add(y, dy)
      } else {
        const dy = JSBI.divide(JSBI.multiply(JSBI.subtract(k, xy), JSBI.BigInt(1e12)), this._d(x0, y))
        y = JSBI.subtract(y, dy)
      }
      if (JSBI.greaterThan(y, yPrev)) {
        if (JSBI.lessThanOrEqual(JSBI.subtract(y, yPrev), JSBI.BigInt(1))) {
          return y
        }
      } else {
        if (JSBI.lessThanOrEqual(JSBI.subtract(yPrev, y), JSBI.BigInt(1))) {
          return y
        }
      }
    }
    return y
  }

  private _getOutputAmount(inputAmount: Amount<Token>, reserve0: JSBI, reserve1: JSBI) {
    const adjustedReserve0 = JSBI.divide(JSBI.multiply(reserve0, JSBI.BigInt(1e12)), this.decimals0)
    const adjustedReserve1 = JSBI.divide(JSBI.multiply(reserve1, JSBI.BigInt(1e12)), this.decimals1)
    const feeDeductedAmountIn = JSBI.subtract(
      inputAmount.quotient,
      JSBI.multiply(inputAmount.quotient, JSBI.BigInt(this.fee))
    )
    const xy = this._k(adjustedReserve0, adjustedReserve1)

    // Input is using token0
    if (inputAmount.currency.equals(this.token0)) {
      // uint256 x0 = adjustedReserve0 + ((feeDeductedAmountIn * 1e12) / decimals0);
      // uint256 y = _get_y(x0, xy, adjustedReserve1);
      // dy = adjustedReserve1 - y;
      // dy = (dy * decimals1) / 1e12;
      const x0 = JSBI.add(
        adjustedReserve0,
        JSBI.divide(JSBI.multiply(feeDeductedAmountIn, JSBI.BigInt(1e12)), this.decimals0)
      )
      const y = this._get_y(x0, xy, adjustedReserve1)
      const dy = JSBI.subtract(adjustedReserve1, y)
      return JSBI.divide(JSBI.multiply(dy, this.decimals1), JSBI.BigInt(1e12))
    } else {
      // uint256 x0 = adjustedReserve1 + ((feeDeductedAmountIn * 1e12) / decimals1);
      // uint256 y = _get_y(x0, xy, adjustedReserve0);
      // dy = adjustedReserve0 - y;
      // dy = (dy * decimals0) / 1e12;
      const x0 = JSBI.add(
        adjustedReserve1,
        JSBI.divide(JSBI.multiply(feeDeductedAmountIn, JSBI.BigInt(1e12)), this.decimals1)
      )
      const y = this._get_y(x0, xy, adjustedReserve0)
      const dy = JSBI.subtract(adjustedReserve0, y)
      return JSBI.divide(JSBI.multiply(dy, this.decimals0), JSBI.BigInt(1e12))
    }
  }

  public getOutputAmount(
    inputShare: Share<Token>,
    inputRebase: Rebase
    // outputRebase: Rebase
  ): [Amount<Token>, StablePool] {
    invariant(this.involvesToken(inputShare.currency), 'TOKEN')
    if (JSBI.equal(this.reserve0.quotient, ZERO) || JSBI.equal(this.reserve1.quotient, ZERO)) {
      throw new InsufficientReservesError()
    }

    const inputAmount = inputShare.toAmount(inputRebase, false)
    const outputCurrency = inputAmount.currency.equals(this.token0) ? this.token1 : this.token0

    const inputReserve = this.reserveOf(inputAmount.currency)
    const outputReserve = this.reserveOf(outputCurrency)

    // uint256 adjustedReserve0 = (_reserve0 * 1e12) / decimals0;
    // uint256 adjustedReserve1 = (_reserve1 * 1e12) / decimals1;
    // uint256 feeDeductedAmountIn = amountIn - (amountIn * swapFee) / MAX_FEE;
    // uint256 xy = _k(adjustedReserve0, adjustedReserve1);
    // if (token0In) {
    //     uint256 x0 = adjustedReserve0 + ((feeDeductedAmountIn * 1e12) / decimals0);
    //     uint256 y = _get_y(x0, xy, adjustedReserve1);
    //     dy = adjustedReserve1 - y;
    //     dy = (dy * decimals1) / 1e12;
    // } else {
    //     uint256 x0 = adjustedReserve1 + ((feeDeductedAmountIn * 1e12) / decimals1);
    //     uint256 y = _get_y(x0, xy, adjustedReserve0);
    //     dy = adjustedReserve0 - y;
    //     dy = (dy * decimals0) / 1e12;
    // }

    // const inputAmountWithFee = JSBI.multiply(inputAmount.quotient, JSBI.subtract(this.MAX_FEE, JSBI.BigInt(this.fee)))
    // const numerator = JSBI.multiply(inputAmountWithFee, outputReserve.quotient)
    // const denominator = JSBI.add(JSBI.multiply(inputReserve.quotient, this.MAX_FEE), inputAmountWithFee)
    // const outputAmount = Amount.fromRawAmount(
    //   inputAmount.currency.equals(this.token0) ? this.token1 : this.token0,
    //   JSBI.divide(numerator, denominator)
    // )

    // TODO: Incomplete...
    const outputAmount = Amount.fromRawAmount(
      outputCurrency,
      this._getOutputAmount(inputAmount, inputReserve.quotient, outputReserve.quotient)
    )

    if (JSBI.equal(outputAmount.quotient, ZERO)) {
      throw new InsufficientInputAmountError()
    }

    return [
      outputAmount,
      new StablePool(
        inputReserve.add(inputAmount),
        outputReserve.subtract(outputAmount),
        this.fee,
        this.total0,
        this.total1
      ),
    ]
  }

  // public getInputAmount(outputAmount: Amount<Token>): [Amount<Token>, StablePool] {
  //   invariant(this.involvesToken(outputAmount.currency), 'TOKEN')
  //   if (
  //     JSBI.equal(this.reserve0.quotient, ZERO) ||
  //     JSBI.equal(this.reserve1.quotient, ZERO) ||
  //     JSBI.greaterThanOrEqual(outputAmount.quotient, this.reserveOf(outputAmount.currency).quotient)
  //   ) {
  //     throw new InsufficientReservesError()
  //   }

  //   const outputReserve = this.reserveOf(outputAmount.currency)
  //   const inputReserve = this.reserveOf(outputAmount.currency.equals(this.token0) ? this.token1 : this.token0)
  //   const numerator = JSBI.multiply(JSBI.multiply(inputReserve.quotient, outputAmount.quotient), this.MAX_FEE)
  //   const denominator = JSBI.multiply(
  //     JSBI.subtract(outputReserve.quotient, outputAmount.quotient),
  //     JSBI.subtract(this.MAX_FEE, JSBI.BigInt(this.fee))
  //   )
  //   const inputAmount = Amount.fromRawAmount(
  //     outputAmount.currency.equals(this.token0) ? this.token1 : this.token0,
  //     JSBI.add(JSBI.divide(numerator, denominator), ONE)
  //   )
  //   return [inputAmount, new StablePool(inputReserve.add(inputAmount), outputReserve.subtract(outputAmount), this.fee)]
  // }

  public getNonOptimalMintFee(amount0: JSBI, amount1: JSBI, reserve0: JSBI, reserve1: JSBI): [JSBI, JSBI] {
    if (JSBI.equal(reserve0, ZERO) || JSBI.equal(reserve1, ZERO)) {
      return [ZERO, ZERO]
    }
    const amount1Optimal = JSBI.divide(JSBI.multiply(amount0, reserve1), reserve0)

    if (JSBI.lessThanOrEqual(amount1Optimal, amount1)) {
      return [
        ZERO,
        JSBI.divide(
          JSBI.multiply(JSBI.BigInt(this.fee), JSBI.subtract(amount1, amount1Optimal)),
          JSBI.multiply(JSBI.BigInt(2), JSBI.BigInt(10000))
        ),
      ]
    } else {
      const amount0Optimal = JSBI.divide(JSBI.multiply(amount1, reserve0), reserve1)
      return [
        JSBI.divide(
          JSBI.multiply(JSBI.BigInt(this.fee), JSBI.subtract(amount0, amount0Optimal)),
          JSBI.multiply(JSBI.BigInt(2), JSBI.BigInt(10000))
        ),
        ZERO,
      ]
    }
  }

  //   function _k(uint256 x, uint256 y) internal pure returns (uint256) {
  //     uint256 _a = (x * y) / 1e12;
  //     uint256 _b = ((x * x) / 1e12 + (y * y) / 1e12);
  //     return ((_a * _b) / 1e12); // x3y+y3x >= k
  // }

  private _k(x: JSBI, y: JSBI): JSBI {
    const a = JSBI.divide(JSBI.multiply(x, y), JSBI.BigInt(1e12))
    const b = JSBI.add(
      JSBI.divide(JSBI.multiply(x, x), JSBI.BigInt(1e12)),
      JSBI.divide(JSBI.multiply(y, y), JSBI.BigInt(1e12))
    )
    return JSBI.divide(JSBI.multiply(a, b), JSBI.BigInt(1e12))
  }

  private computeLiquidityFromAdjustedBalances(x: JSBI, y: JSBI): JSBI {
    return sqrt(sqrt(this._k(x, y)))
  }

  private computeLiquidity(reserve0: JSBI, reserve1: JSBI): JSBI {
    const adjustedReserve0 = JSBI.divide(JSBI.multiply(reserve0, JSBI.BigInt(1e12)), this.decimals0)
    const adjustedReserve1 = JSBI.divide(JSBI.multiply(reserve1, JSBI.BigInt(1e12)), this.decimals1)

    return this.computeLiquidityFromAdjustedBalances(adjustedReserve0, adjustedReserve1)
  }

  public getMintFee(reserve0: JSBI, reserve1: JSBI, totalSupply: JSBI): JSBI {
    if (JSBI.notEqual(this.kLast, ZERO)) {
      const computed = this.computeLiquidity(reserve0, reserve1)
      if (JSBI.greaterThan(computed, this.kLast)) {
        const liquidity = JSBI.divide(
          JSBI.divide(
            JSBI.multiply(JSBI.multiply(totalSupply, JSBI.subtract(computed, this.kLast)), JSBI.BigInt(5)),
            computed
          ),
          JSBI.BigInt(10000)
        )
        if (JSBI.notEqual(liquidity, ZERO)) {
          return liquidity
        }
      }
    }

    return ZERO
  }

  public getLiquidityMinted(
    totalSupply: Amount<Token>,
    tokenAmountA: Amount<Token> | Share<Token>,
    tokenAmountB: Amount<Token> | Share<Token>
  ): Amount<Token> {
    invariant(totalSupply.currency.equals(this.liquidityToken), 'LIQUIDITY')
    const tokenAmounts = tokenAmountA.currency.sortsBefore(tokenAmountB.currency) // does safety checks
      ? [tokenAmountA, tokenAmountB]
      : [tokenAmountB, tokenAmountA]
    invariant(tokenAmounts[0].currency.equals(this.token0) && tokenAmounts[1].currency.equals(this.token1), 'TOKEN')

    let liquidity: JSBI

    // Expected balances after minting
    const balance0 = JSBI.add(tokenAmounts[0].quotient, this.reserve0.quotient)
    const balance1 = JSBI.add(tokenAmounts[1].quotient, this.reserve1.quotient)

    const computed = this.computeLiquidity(balance0, balance1)

    if (JSBI.equal(totalSupply.quotient, ZERO)) {
      liquidity = JSBI.subtract(computed, this.minLiquidity)
    } else {
      const [fee0, fee1] = this.getNonOptimalMintFee(
        tokenAmounts[0].quotient,
        tokenAmounts[1].quotient,
        this.reserve0.quotient,
        this.reserve1.quotient
      )

      const reserve0 = JSBI.add(this.reserve0.quotient, fee0)
      const reserve1 = JSBI.add(this.reserve1.quotient, fee1)

      const k = this.computeLiquidity(reserve0, reserve1)

      const mintFee = this.getMintFee(reserve0, reserve1, totalSupply.quotient)

      liquidity = JSBI.divide(JSBI.multiply(JSBI.subtract(computed, k), JSBI.add(totalSupply.quotient, mintFee)), k)
    }

    if (!JSBI.greaterThan(liquidity, ZERO)) {
      throw new InsufficientInputAmountError()
    }

    return Amount.fromRawAmount(this.liquidityToken, liquidity)
  }

  public getLiquidityValue(token: Token, totalSupply: Amount<Token>, liquidity: Amount<Token>): Amount<Token> {
    invariant(this.involvesToken(token), 'TOKEN')
    invariant(totalSupply.currency.equals(this.liquidityToken), 'TOTAL_SUPPLY')
    invariant(liquidity.currency.equals(this.liquidityToken), 'LIQUIDITY')
    invariant(JSBI.lessThanOrEqual(liquidity.quotient, totalSupply.quotient), 'LIQUIDITY')
    return Amount.fromRawAmount(
      token,
      JSBI.divide(JSBI.multiply(liquidity.quotient, this.reserveOf(token).quotient), totalSupply.quotient)
    )
  }

  // TODO: unsure if this should change... I guess not.
  public getAmountOut(amountIn: JSBI, reserveAmountIn: JSBI, reserveAmountOut: JSBI): JSBI {
    const amountInWithFee = JSBI.multiply(amountIn, JSBI.subtract(this.MAX_FEE, JSBI.BigInt(this.fee)))
    return JSBI.divide(
      JSBI.multiply(amountInWithFee, reserveAmountOut),
      JSBI.add(JSBI.multiply(reserveAmountIn, this.MAX_FEE), amountInWithFee)
    )
  }

  public getLiquidityValueSingleToken(
    token: Token,
    totalSupply: Amount<Token>,
    liquidity: Amount<Token>
  ): Amount<Token> {
    invariant(this.involvesToken(token), 'TOKEN')
    invariant(totalSupply.currency.equals(this.liquidityToken), 'TOTAL_SUPPLY')
    invariant(liquidity.currency.equals(this.liquidityToken), 'LIQUIDITY')
    invariant(JSBI.lessThanOrEqual(liquidity.quotient, totalSupply.quotient), 'LIQUIDITY')

    const _totalSupply = JSBI.add(
      totalSupply.quotient,
      this.getMintFee(this.reserve0.quotient, this.reserve1.quotient, totalSupply.quotient)
    )
    const amount0 = JSBI.divide(JSBI.multiply(liquidity.quotient, this.reserve0.quotient), _totalSupply)
    const amount1 = JSBI.divide(JSBI.multiply(liquidity.quotient, this.reserve1.quotient), _totalSupply)

    if (token === this.token1) {
      return Amount.fromRawAmount(
        token,
        JSBI.add(
          amount1,
          this.getAmountOut(
            amount0,
            JSBI.subtract(this.reserve0.quotient, amount0),
            JSBI.subtract(this.reserve1.quotient, amount1)
          )
        )
      )
    }

    return Amount.fromRawAmount(
      token,
      JSBI.add(
        amount0,
        this.getAmountOut(
          amount1,
          JSBI.subtract(this.reserve1.quotient, amount1),
          JSBI.subtract(this.reserve0.quotient, amount0)
        )
      )
    )
  }

  public serialize(): SerializedStablePool {
    return stablePoolSchema.parse({
      reserve0: this.tokenAmounts[0].serialize(),
      reserve1: this.tokenAmounts[1].serialize(),
      fee: this.fee,
      total0: {
        base: this.total0.base.toString(),
        elastic: this.total0.base.toString(),
      },
      total1: {
        base: this.total1.base.toString(),
        elastic: this.total1.base.toString(),
      },
    })
  }

  public static deserialize(pool: SerializedStablePool): StablePool {
    const rebase0: Rebase = {
      base: JSBI.BigInt(pool.total0.base),
      elastic: JSBI.BigInt(pool.total0.elastic),
    }

    const rebase1: Rebase = {
      base: JSBI.BigInt(pool.total1.base),
      elastic: JSBI.BigInt(pool.total1.elastic),
    }

    return new StablePool(
      Amount.deserialize(pool.reserve0),
      Amount.deserialize(pool.reserve1),
      pool.fee,
      rebase0,
      rebase1
    )
  }
}
