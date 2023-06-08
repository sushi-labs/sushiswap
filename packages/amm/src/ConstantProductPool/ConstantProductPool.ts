import { Amount, Price, Share, Token } from '@sushiswap/currency'
import { JSBI, ONE, sqrt, ZERO } from '@sushiswap/math'
import { constantProductPoolFactoryAddress, ConstantProductPoolFactoryChainId } from '@sushiswap/trident-core'
import invariant from 'tiny-invariant'

import { InsufficientInputAmountError, InsufficientReservesError } from '../errors'
import { Fee } from '../Fee'
import { Pool } from '../Pool'
import { computeConstantProductPoolAddress } from './computeConstantProductPoolAddress'
import { constantProductPoolSchema, SerializedConstantProductPool } from './zod'

export class ConstantProductPool implements Pool {
  public readonly liquidityToken: Token
  public readonly swapGasCost = JSBI.BigInt(60000)
  public readonly minLiquidity = JSBI.BigInt(1000)
  public readonly fee: Fee
  public readonly twap: boolean
  private readonly tokenAmounts: [Amount<Token>, Amount<Token>]
  private readonly MAX_FEE = JSBI.BigInt(10000)

  public static getAddress(tokenA: Token, tokenB: Token, fee: Fee, twap: boolean): string {
    return computeConstantProductPoolAddress({
      factoryAddress: constantProductPoolFactoryAddress[tokenA.chainId as ConstantProductPoolFactoryChainId],
      tokenA,
      tokenB,
      fee,
      twap,
    })
  }

  public constructor(AmountA: Amount<Token>, AmountB: Amount<Token>, fee: Fee, twap: boolean) {
    const Amounts = AmountA.currency.sortsBefore(AmountB.currency) // does safety checks
      ? [AmountA, AmountB]
      : [AmountB, AmountA]
    this.liquidityToken = new Token({
      chainId: Amounts[0].currency.chainId,
      address: ConstantProductPool.getAddress(Amounts[0].currency, Amounts[1].currency, fee, twap),
      decimals: 18,
      symbol: 'SCPLP',
      name: 'Sushi Constant Product LP Token',
    })
    this.fee = fee
    this.twap = twap
    this.tokenAmounts = Amounts as [Amount<Token>, Amount<Token>]
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
    return sqrt(this.reserve0.multiply(this.reserve1).quotient)
  }

  public reserveOf(token: Token): Amount<Token> {
    invariant(this.involvesToken(token), 'TOKEN')
    return token.equals(this.token0) ? this.reserve0 : this.reserve1
  }

  public getOutputAmount(inputAmount: Amount<Token>): [Amount<Token>, ConstantProductPool] {
    invariant(this.involvesToken(inputAmount.currency), 'TOKEN')
    if (JSBI.equal(this.reserve0.quotient, ZERO) || JSBI.equal(this.reserve1.quotient, ZERO)) {
      throw new InsufficientReservesError()
    }
    const inputReserve = this.reserveOf(inputAmount.currency)
    const outputReserve = this.reserveOf(inputAmount.currency.equals(this.token0) ? this.token1 : this.token0)
    const inputAmountWithFee = JSBI.multiply(inputAmount.quotient, JSBI.subtract(this.MAX_FEE, JSBI.BigInt(this.fee)))
    const numerator = JSBI.multiply(inputAmountWithFee, outputReserve.quotient)
    const denominator = JSBI.add(JSBI.multiply(inputReserve.quotient, this.MAX_FEE), inputAmountWithFee)
    const outputAmount = Amount.fromRawAmount(
      inputAmount.currency.equals(this.token0) ? this.token1 : this.token0,
      JSBI.divide(numerator, denominator)
    )
    if (JSBI.equal(outputAmount.quotient, ZERO)) {
      throw new InsufficientInputAmountError()
    }
    return [
      outputAmount,
      new ConstantProductPool(inputReserve.add(inputAmount), outputReserve.subtract(outputAmount), this.fee, this.twap),
    ]
  }

  public getInputAmount(outputAmount: Amount<Token>): [Amount<Token>, ConstantProductPool] {
    invariant(this.involvesToken(outputAmount.currency), 'TOKEN')
    if (
      JSBI.equal(this.reserve0.quotient, ZERO) ||
      JSBI.equal(this.reserve1.quotient, ZERO) ||
      JSBI.greaterThanOrEqual(outputAmount.quotient, this.reserveOf(outputAmount.currency).quotient)
    ) {
      throw new InsufficientReservesError()
    }

    const outputReserve = this.reserveOf(outputAmount.currency)
    const inputReserve = this.reserveOf(outputAmount.currency.equals(this.token0) ? this.token1 : this.token0)
    const numerator = JSBI.multiply(JSBI.multiply(inputReserve.quotient, outputAmount.quotient), this.MAX_FEE)
    const denominator = JSBI.multiply(
      JSBI.subtract(outputReserve.quotient, outputAmount.quotient),
      JSBI.subtract(this.MAX_FEE, JSBI.BigInt(this.fee))
    )
    const inputAmount = Amount.fromRawAmount(
      outputAmount.currency.equals(this.token0) ? this.token1 : this.token0,
      JSBI.add(JSBI.divide(numerator, denominator), ONE)
    )
    return [
      inputAmount,
      new ConstantProductPool(inputReserve.add(inputAmount), outputReserve.subtract(outputAmount), this.fee, this.twap),
    ]
  }

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

  public getMintFee(reserve0: JSBI, reserve1: JSBI, totalSupply: JSBI): JSBI {
    if (JSBI.notEqual(this.kLast, ZERO)) {
      const computed = sqrt(JSBI.multiply(reserve0, reserve1))
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
    const computed = sqrt(JSBI.multiply(balance0, balance1))

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

      const k = sqrt(JSBI.multiply(reserve0, reserve1))

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

  public serialize(): SerializedConstantProductPool {
    return constantProductPoolSchema.parse({
      reserve0: this.tokenAmounts[0].serialize(),
      reserve1: this.tokenAmounts[1].serialize(),
      fee: this.fee,
      twap: this.twap,
    })
  }

  public static deserialize(pool: SerializedConstantProductPool): ConstantProductPool {
    return new ConstantProductPool(
      Amount.deserialize(pool.reserve0),
      Amount.deserialize(pool.reserve1),
      pool.fee,
      pool.twap
    )
  }
}
