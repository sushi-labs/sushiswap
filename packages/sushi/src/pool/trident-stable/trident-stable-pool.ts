import invariant from 'tiny-invariant'
import {
  TRIDENT_STABLE_POOL_FACTORY_ADDRESS,
  TridentChainId,
} from '../../config/index.js'
import { Amount, Price, Share, Token } from '../../currency/index.js'
import {
  Fee,
  InsufficientInputAmountError,
  InsufficientReservesError,
  Pool,
} from '../../dex/index.js'
import { ZERO, sqrt } from '../../math/index.js'
import { computeTridentStablePoolAddress } from './compute-trident-stable-pool-address.js'
import { SerializedStablePool, tridentStablePoolSchema } from './zod.js'

export interface Rebase {
  elastic: bigint
  base: bigint
}

export class TridentStablePool implements Pool {
  public readonly liquidityToken: Token
  public readonly swapGasCost = 60000n
  public readonly minLiquidity = 1000n
  public readonly fee: Fee
  public readonly total0: Rebase
  public readonly total1: Rebase
  private readonly tokenAmounts: [Amount<Token>, Amount<Token>]
  private readonly decimals0: bigint
  private readonly decimals1: bigint
  private readonly MAX_FEE = 10000n

  public static getAddress(tokenA: Token, tokenB: Token, fee: Fee): string {
    return computeTridentStablePoolAddress({
      factoryAddress:
        TRIDENT_STABLE_POOL_FACTORY_ADDRESS[tokenA.chainId as TridentChainId],
      tokenA,
      tokenB,
      fee,
    })
  }

  public constructor(
    amountA: Amount<Token>,
    amountB: Amount<Token>,
    fee: Fee,
    total0: Rebase,
    total1: Rebase,
  ) {
    const tokenAmounts = (
      amountA.currency.sortsBefore(amountB.currency) // does safety checks
        ? [amountA, amountB]
        : [amountB, amountA]
    ) as [Amount<Token>, Amount<Token>]
    this.liquidityToken = new Token({
      chainId: tokenAmounts[0].currency.chainId,
      address: TridentStablePool.getAddress(
        tokenAmounts[0].currency,
        tokenAmounts[1].currency,
        fee,
      ),
      decimals: 18,
      symbol: 'SSLP',
      name: 'Sushi Stable LP Token',
    })
    this.fee = fee
    this.tokenAmounts = tokenAmounts as [Amount<Token>, Amount<Token>]

    // decimals0 = uint256(10)**(ERC20(_token0).decimals());
    // decimals1 = uint256(10)**(ERC20(_token1).decimals());

    this.decimals0 = 10n ** BigInt(this.tokenAmounts[0].currency.decimals)
    this.decimals1 = 10n ** BigInt(this.tokenAmounts[1].currency.decimals)

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
    return new Price(
      this.token0,
      this.token1,
      result.denominator,
      result.numerator,
    )
  }

  /**
   * Returns the current mid price of the pair in terms of token1, i.e. the ratio of reserve0 to reserve1
   */
  public get token1Price(): Price<Token, Token> {
    const result = this.tokenAmounts[0].divide(this.tokenAmounts[1])
    return new Price(
      this.token1,
      this.token0,
      result.denominator,
      result.numerator,
    )
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

  public get kLast(): bigint {
    return this.computeLiquidity(this.reserve0.quotient, this.reserve1.quotient)
  }

  public reserveOf(token: Token): Amount<Token> {
    invariant(this.involvesToken(token), 'TOKEN')
    return token.equals(this.token0) ? this.reserve0 : this.reserve1
  }

  private _f(x0: bigint, y: bigint) {
    // (x0 * ((((y * y) / 1e12) * y) / 1e12)) / 1e12
    // +
    // (((((x0 * x0) / 1e12) * x0) / 1e12) * y) / 1e12

    return (
      (x0 * ((((y * y) / BigInt(1e12)) * y) / BigInt(1e12))) / BigInt(1e12) +
      (((((x0 * x0) / BigInt(1e12)) * x0) / BigInt(1e12)) * y) / BigInt(1e12)
    )
  }

  private _d(x0: bigint, y: bigint) {
    // (3 * x0 * ((y * y) / 1e12)) / 1e12
    // +
    // ((((x0 * x0) / 1e12) * x0) / 1e12)

    return (
      (3n * x0 * ((y * y) / BigInt(1e12))) / BigInt(1e12) +
      (((x0 * x0) / BigInt(1e12)) * x0) / BigInt(1e12)
    )
  }

  private _get_y(x0: bigint, xy: bigint, y: bigint): bigint {
    for (let i = 0; i < 255; i++) {
      const yPrev = y
      const k = this._f(x0, y)
      if (k < xy) {
        const dy = ((xy - k) * BigInt(1e12)) / this._d(x0, y)
        y = y + dy
      } else {
        const dy = ((k - xy) * BigInt(1e12)) / this._d(x0, y)
        y = y - dy
      }
      if (y > yPrev) {
        if (y - yPrev <= 1n) {
          return y
        }
      } else {
        if (yPrev - y <= 1n) {
          return y
        }
      }
    }
    return y
  }

  private _getOutputAmount(
    inputAmount: Amount<Token>,
    reserve0: bigint,
    reserve1: bigint,
  ) {
    const adjustedReserve0 = (reserve0 * BigInt(1e12)) / this.decimals0
    const adjustedReserve1 = (reserve1 * BigInt(1e12)) / this.decimals1
    const feeDeductedAmountIn =
      inputAmount.quotient - inputAmount.quotient * BigInt(this.fee)
    const xy = this._k(adjustedReserve0, adjustedReserve1)

    // Input is using token0
    if (inputAmount.currency.equals(this.token0)) {
      // uint256 x0 = adjustedReserve0 + ((feeDeductedAmountIn * 1e12) / decimals0);
      // uint256 y = _get_y(x0, xy, adjustedReserve1);
      // dy = adjustedReserve1 - y;
      // dy = (dy * decimals1) / 1e12;
      const x0 =
        adjustedReserve0 + (feeDeductedAmountIn * BigInt(1e12)) / this.decimals0
      const y = this._get_y(x0, xy, adjustedReserve1)
      const dy = adjustedReserve1 - y
      return (dy * this.decimals1) / BigInt(1e12)
    } else {
      // uint256 x0 = adjustedReserve1 + ((feeDeductedAmountIn * 1e12) / decimals1);
      // uint256 y = _get_y(x0, xy, adjustedReserve0);
      // dy = adjustedReserve0 - y;
      // dy = (dy * decimals0) / 1e12;
      const x0 =
        adjustedReserve1 + (feeDeductedAmountIn * BigInt(1e12)) / this.decimals1
      const y = this._get_y(x0, xy, adjustedReserve0)
      const dy = adjustedReserve0 - y
      return (dy * this.decimals0) / BigInt(1e12)
    }
  }

  public getOutputAmount(
    inputShare: Share<Token>,
    inputRebase: Rebase,
    // outputRebase: Rebase
  ): [Amount<Token>, TridentStablePool] {
    invariant(this.involvesToken(inputShare.currency), 'TOKEN')
    if (this.reserve0.quotient === ZERO || this.reserve1.quotient === ZERO) {
      throw new InsufficientReservesError()
    }

    const inputAmount = inputShare.toAmount(inputRebase, false)
    const outputCurrency = inputAmount.currency.equals(this.token0)
      ? this.token1
      : this.token0

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
      this._getOutputAmount(
        inputAmount,
        inputReserve.quotient,
        outputReserve.quotient,
      ),
    )

    if (outputAmount.quotient === ZERO) {
      throw new InsufficientInputAmountError()
    }

    return [
      outputAmount,
      new TridentStablePool(
        inputReserve.add(inputAmount),
        outputReserve.subtract(outputAmount),
        this.fee,
        this.total0,
        this.total1,
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

  public getNonOptimalMintFee(
    amount0: bigint,
    amount1: bigint,
    reserve0: bigint,
    reserve1: bigint,
  ): [bigint, bigint] {
    if (reserve0 === ZERO || reserve1 === ZERO) {
      return [ZERO, ZERO]
    }
    const amount1Optimal = (amount0 * reserve1) / reserve0

    if (amount1Optimal <= amount1) {
      return [
        ZERO,
        (BigInt(this.fee) * (amount1 - amount1Optimal)) / (2n * 10000n),
      ]
    } else {
      const amount0Optimal = (amount1 * reserve0) / reserve1
      return [
        (BigInt(this.fee) * (amount0 - amount0Optimal)) / (2n * 10000n),
        ZERO,
      ]
    }
  }

  //   function _k(uint256 x, uint256 y) internal pure returns (uint256) {
  //     uint256 _a = (x * y) / 1e12;
  //     uint256 _b = ((x * x) / 1e12 + (y * y) / 1e12);
  //     return ((_a * _b) / 1e12); // x3y+y3x >= k
  // }

  private _k(x: bigint, y: bigint): bigint {
    const a = (x * y) / BigInt(1e12)
    const b = (x * x) / BigInt(1e12) + (y * y) / BigInt(1e12)
    return (a * b) / BigInt(1e12)
  }

  private computeLiquidityFromAdjustedBalances(x: bigint, y: bigint): bigint {
    return sqrt(sqrt(this._k(x, y)))
  }

  private computeLiquidity(reserve0: bigint, reserve1: bigint): bigint {
    const adjustedReserve0 = (reserve0 * BigInt(1e12)) / this.decimals0
    const adjustedReserve1 = (reserve1 * BigInt(1e12)) / this.decimals1

    return this.computeLiquidityFromAdjustedBalances(
      adjustedReserve0,
      adjustedReserve1,
    )
  }

  public getMintFee(
    reserve0: bigint,
    reserve1: bigint,
    totalSupply: bigint,
  ): bigint {
    if (this.kLast !== ZERO) {
      const computed = this.computeLiquidity(reserve0, reserve1)
      if (computed > this.kLast) {
        const liquidity =
          (totalSupply * (computed - this.kLast) * 5n) / computed / 10000n
        if (liquidity !== ZERO) {
          return liquidity
        }
      }
    }

    return ZERO
  }

  public getLiquidityMinted(
    totalSupply: Amount<Token>,
    tokenAmountA: Amount<Token> | Share<Token>,
    tokenAmountB: Amount<Token> | Share<Token>,
  ): Amount<Token> {
    invariant(totalSupply.currency.equals(this.liquidityToken), 'LIQUIDITY')
    const tokenAmounts = (
      tokenAmountA.currency.sortsBefore(tokenAmountB.currency) // does safety checks
        ? [tokenAmountA, tokenAmountB]
        : [tokenAmountB, tokenAmountA]
    ) as [Amount<Token>, Amount<Token>]
    invariant(
      tokenAmounts[0].currency.equals(this.token0) &&
        tokenAmounts[1].currency.equals(this.token1),
      'TOKEN',
    )

    let liquidity: bigint

    // Expected balances after minting
    const balance0 = tokenAmounts[0].quotient + this.reserve0.quotient
    const balance1 = tokenAmounts[1].quotient + this.reserve1.quotient

    const computed = this.computeLiquidity(balance0, balance1)

    if (totalSupply.quotient === ZERO) {
      liquidity = computed - this.minLiquidity
    } else {
      const [fee0, fee1] = this.getNonOptimalMintFee(
        tokenAmounts[0].quotient,
        tokenAmounts[1].quotient,
        this.reserve0.quotient,
        this.reserve1.quotient,
      )

      const reserve0 = this.reserve0.quotient + fee0
      const reserve1 = this.reserve1.quotient + fee1

      const k = this.computeLiquidity(reserve0, reserve1)

      const mintFee = this.getMintFee(reserve0, reserve1, totalSupply.quotient)

      liquidity = ((computed - k) * (totalSupply.quotient + mintFee)) / k
    }

    if (liquidity <= ZERO) {
      throw new InsufficientInputAmountError()
    }

    return Amount.fromRawAmount(this.liquidityToken, liquidity)
  }

  public getLiquidityValue(
    token: Token,
    totalSupply: Amount<Token>,
    liquidity: Amount<Token>,
  ): Amount<Token> {
    invariant(this.involvesToken(token), 'TOKEN')
    invariant(totalSupply.currency.equals(this.liquidityToken), 'TOTAL_SUPPLY')
    invariant(liquidity.currency.equals(this.liquidityToken), 'LIQUIDITY')
    invariant(liquidity.quotient <= totalSupply.quotient, 'LIQUIDITY')
    return Amount.fromRawAmount(
      token,
      (liquidity.quotient * this.reserveOf(token).quotient) /
        totalSupply.quotient,
    )
  }

  // TODO: unsure if this should change... I guess not.
  public getAmountOut(
    amountIn: bigint,
    reserveAmountIn: bigint,
    reserveAmountOut: bigint,
  ): bigint {
    const amountInWithFee = amountIn * (this.MAX_FEE - BigInt(this.fee))
    return (
      (amountInWithFee * reserveAmountOut) /
      (reserveAmountIn * this.MAX_FEE + amountInWithFee)
    )
  }

  public getLiquidityValueSingleToken(
    token: Token,
    totalSupply: Amount<Token>,
    liquidity: Amount<Token>,
  ): Amount<Token> {
    invariant(this.involvesToken(token), 'TOKEN')
    invariant(totalSupply.currency.equals(this.liquidityToken), 'TOTAL_SUPPLY')
    invariant(liquidity.currency.equals(this.liquidityToken), 'LIQUIDITY')
    invariant(liquidity.quotient <= totalSupply.quotient, 'LIQUIDITY')

    const _totalSupply =
      totalSupply.quotient +
      this.getMintFee(
        this.reserve0.quotient,
        this.reserve1.quotient,
        totalSupply.quotient,
      )
    const amount0 = (liquidity.quotient * this.reserve0.quotient) / _totalSupply
    const amount1 = (liquidity.quotient * this.reserve1.quotient) / _totalSupply

    if (token === this.token1) {
      return Amount.fromRawAmount(
        token,
        amount1 +
          this.getAmountOut(
            amount0,
            this.reserve0.quotient - amount0,
            this.reserve1.quotient - amount1,
          ),
      )
    }

    return Amount.fromRawAmount(
      token,
      amount0 +
        this.getAmountOut(
          amount1,
          this.reserve1.quotient - amount1,
          this.reserve0.quotient - amount0,
        ),
    )
  }

  public serialize(): SerializedStablePool {
    return tridentStablePoolSchema.parse({
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

  public static deserialize(pool: SerializedStablePool): TridentStablePool {
    const rebase0: Rebase = {
      base: BigInt(pool.total0.base),
      elastic: BigInt(pool.total0.elastic),
    }

    const rebase1: Rebase = {
      base: BigInt(pool.total1.base),
      elastic: BigInt(pool.total1.elastic),
    }

    return new TridentStablePool(
      Amount.deserialize(pool.reserve0),
      Amount.deserialize(pool.reserve1),
      pool.fee,
      rebase0,
      rebase1,
    )
  }
}
