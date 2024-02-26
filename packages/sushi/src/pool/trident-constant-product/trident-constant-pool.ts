import invariant from 'tiny-invariant'
import {
  TRIDENT_CONSTANT_POOL_FACTORY_ADDRESS,
  TridentChainId,
} from '../../config/index.js'
import { Amount, Price, Share, Token } from '../../currency/index.js'
import {
  Fee,
  InsufficientInputAmountError,
  InsufficientReservesError,
  Pool,
} from '../../dex/index.js'
import { ONE, ZERO, sqrt } from '../../math/index.js'
import { computeTridentConstantPoolAddress } from './compute-trident-constant-pool-address.js'
import { SerializedConstantPool, tridentConstantPoolSchema } from './zod.js'

export class TridentConstantPool implements Pool {
  public readonly liquidityToken: Token
  public readonly swapGasCost = 60000n
  public readonly minLiquidity = 1000n
  public readonly fee: Fee
  public readonly twap: boolean
  private readonly tokenAmounts: [Amount<Token>, Amount<Token>]
  private readonly MAX_FEE = 10000n

  public static getAddress(
    tokenA: Token,
    tokenB: Token,
    fee: Fee,
    twap: boolean,
  ): string {
    return computeTridentConstantPoolAddress({
      factoryAddress:
        TRIDENT_CONSTANT_POOL_FACTORY_ADDRESS[tokenA.chainId as TridentChainId],
      tokenA,
      tokenB,
      fee,
      twap,
    })
  }

  public constructor(
    amountA: Amount<Token>,
    amountB: Amount<Token>,
    fee: Fee,
    twap: boolean,
  ) {
    const amounts = (
      amountA.currency.sortsBefore(amountB.currency) // does safety checks
        ? [amountA, amountB]
        : [amountB, amountA]
    ) as [Amount<Token>, Amount<Token>]
    this.liquidityToken = new Token({
      chainId: amounts[0].currency.chainId,
      address: TridentConstantPool.getAddress(
        amounts[0].currency,
        amounts[1].currency,
        fee,
        twap,
      ),
      decimals: 18,
      symbol: 'SCPLP',
      name: 'Sushi Constant Product LP Token',
    })
    this.fee = fee
    this.twap = twap
    this.tokenAmounts = amounts
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
    return sqrt(this.reserve0.multiply(this.reserve1).quotient)
  }

  public reserveOf(token: Token): Amount<Token> {
    invariant(this.involvesToken(token), 'TOKEN')
    return token.equals(this.token0) ? this.reserve0 : this.reserve1
  }

  public getOutputAmount(
    inputAmount: Amount<Token>,
  ): [Amount<Token>, TridentConstantPool] {
    invariant(this.involvesToken(inputAmount.currency), 'TOKEN')
    if (this.reserve0.quotient === ZERO || this.reserve1.quotient === ZERO) {
      throw new InsufficientReservesError()
    }
    const inputReserve = this.reserveOf(inputAmount.currency)
    const outputReserve = this.reserveOf(
      inputAmount.currency.equals(this.token0) ? this.token1 : this.token0,
    )
    const inputAmountWithFee =
      inputAmount.quotient * this.MAX_FEE - BigInt(this.fee)
    const numerator = inputAmountWithFee * outputReserve.quotient
    const denominator =
      inputReserve.quotient * this.MAX_FEE + inputAmountWithFee
    const outputAmount = Amount.fromRawAmount(
      inputAmount.currency.equals(this.token0) ? this.token1 : this.token0,
      numerator / denominator,
    )
    if (outputAmount.quotient === ZERO) {
      throw new InsufficientInputAmountError()
    }
    return [
      outputAmount,
      new TridentConstantPool(
        inputReserve.add(inputAmount),
        outputReserve.subtract(outputAmount),
        this.fee,
        this.twap,
      ),
    ]
  }

  public getInputAmount(
    outputAmount: Amount<Token>,
  ): [Amount<Token>, TridentConstantPool] {
    invariant(this.involvesToken(outputAmount.currency), 'TOKEN')
    if (
      this.reserve0.quotient === ZERO ||
      this.reserve1.quotient === ZERO ||
      outputAmount.quotient >= this.reserveOf(outputAmount.currency).quotient
    ) {
      throw new InsufficientReservesError()
    }

    const outputReserve = this.reserveOf(outputAmount.currency)
    const inputReserve = this.reserveOf(
      outputAmount.currency.equals(this.token0) ? this.token1 : this.token0,
    )
    const numerator =
      inputReserve.quotient * outputAmount.quotient * this.MAX_FEE
    const denominator =
      (outputReserve.quotient - outputAmount.quotient) *
      (this.MAX_FEE - BigInt(this.fee))
    const inputAmount = Amount.fromRawAmount(
      outputAmount.currency.equals(this.token0) ? this.token1 : this.token0,
      numerator / denominator + ONE,
    )
    return [
      inputAmount,
      new TridentConstantPool(
        inputReserve.add(inputAmount),
        outputReserve.subtract(outputAmount),
        this.fee,
        this.twap,
      ),
    ]
  }

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

  public getMintFee(
    reserve0: bigint,
    reserve1: bigint,
    totalSupply: bigint,
  ): bigint {
    if (this.kLast !== ZERO) {
      const computed = sqrt(reserve0 * reserve1)
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

    const computed = sqrt(balance0 * balance1)

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

      const k = sqrt(reserve0 * reserve1)

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

  public serialize(): SerializedConstantPool {
    return tridentConstantPoolSchema.parse({
      reserve0: this.tokenAmounts[0].serialize(),
      reserve1: this.tokenAmounts[1].serialize(),
      fee: this.fee,
      twap: this.twap,
    })
  }

  public static deserialize(pool: SerializedConstantPool): TridentConstantPool {
    return new TridentConstantPool(
      Amount.deserialize(pool.reserve0),
      Amount.deserialize(pool.reserve1),
      pool.fee,
      pool.twap,
    )
  }
}
