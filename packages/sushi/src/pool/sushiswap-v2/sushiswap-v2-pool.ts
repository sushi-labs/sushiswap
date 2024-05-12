import invariant from 'tiny-invariant'
import { chainName } from '../../chain/index.js'
import {
  SUSHISWAP_V2_FACTORY_ADDRESS,
  isSushiSwapV2ChainId,
} from '../../config/index.js'
import { Amount, Price, Token } from '../../currency/index.js'
import {
  InsufficientInputAmountError,
  InsufficientReservesError,
} from '../../dex/index.js'
import {
  BigintIsh,
  FIVE,
  ONE,
  ZERO,
  _997,
  _1000,
  sqrt,
} from '../../math/index.js'
import { computeSushiSwapV2PoolAddress } from './compute-sushiswap-v2-pool-address.js'
import { SerializedSushiSwapV2Pool, sushiSwapV2PoolSchema } from './zod.js'

export class SushiSwapV2Pool {
  public readonly liquidityToken: Token
  public readonly swapGasCost = 60000n
  public readonly minLiquidity = 1000n
  private readonly tokenAmounts: [Amount<Token>, Amount<Token>]

  public static getAddress(tokenA: Token, tokenB: Token): string {
    if (!isSushiSwapV2ChainId(tokenA.chainId)) {
      throw new Error(
        `ChainId Error: SushiSwapV2 is not available on ${
          chainName[tokenA.chainId]
        }`,
      )
    }

    return computeSushiSwapV2PoolAddress({
      factoryAddress: SUSHISWAP_V2_FACTORY_ADDRESS[tokenA.chainId],
      tokenA,
      tokenB,
    })
  }

  public constructor(amountA: Amount<Token>, amountB: Amount<Token>) {
    const amounts = (
      amountA.currency.sortsBefore(amountB.currency) // does safety checks
        ? [amountA, amountB]
        : [amountB, amountA]
    ) as [Amount<Token>, Amount<Token>]
    this.liquidityToken = new Token({
      chainId: amounts[0]!.currency.chainId,
      address: SushiSwapV2Pool.getAddress(
        amounts[0].currency,
        amounts[1].currency,
      ),
      decimals: 18,
      symbol: 'UNI-V2',
      name: 'Uniswap V2',
    })
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

  public reserveOf(token: Token): Amount<Token> {
    invariant(this.involvesToken(token), 'TOKEN')
    return token.equals(this.token0) ? this.reserve0 : this.reserve1
  }

  public getOutputAmount(
    inputAmount: Amount<Token>,
  ): [Amount<Token>, SushiSwapV2Pool] {
    invariant(this.involvesToken(inputAmount.currency), 'TOKEN')
    if (this.reserve0.quotient === ZERO || this.reserve1.quotient === ZERO) {
      throw new InsufficientReservesError()
    }
    const inputReserve = this.reserveOf(inputAmount.currency)
    const outputReserve = this.reserveOf(
      inputAmount.currency.equals(this.token0) ? this.token1 : this.token0,
    )
    const inputAmountWithFee = inputAmount.quotient * _997
    const numerator = inputAmountWithFee * outputReserve.quotient
    const denominator = inputReserve.quotient * _1000 + inputAmountWithFee
    const outputAmount = Amount.fromRawAmount(
      inputAmount.currency.equals(this.token0) ? this.token1 : this.token0,
      numerator / denominator,
    )
    if (outputAmount.quotient === ZERO) {
      throw new InsufficientInputAmountError()
    }
    return [
      outputAmount,
      new SushiSwapV2Pool(
        inputReserve.add(inputAmount),
        outputReserve.subtract(outputAmount),
      ),
    ]
  }

  public getInputAmount(
    outputAmount: Amount<Token>,
  ): [Amount<Token>, SushiSwapV2Pool] {
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
    const numerator = inputReserve.quotient * outputAmount.quotient * _1000
    const denominator = (outputReserve.quotient - outputAmount.quotient) * _997
    const inputAmount = Amount.fromRawAmount(
      outputAmount.currency.equals(this.token0) ? this.token1 : this.token0,
      numerator / denominator + ONE,
    )
    return [
      inputAmount,
      new SushiSwapV2Pool(
        inputReserve.add(inputAmount),
        outputReserve.subtract(outputAmount),
      ),
    ]
  }

  public getLiquidityMinted(
    totalSupply: Amount<Token>,
    tokenAmountA: Amount<Token>,
    tokenAmountB: Amount<Token>,
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
    if (totalSupply.quotient === ZERO) {
      liquidity =
        sqrt(tokenAmounts[0].quotient * tokenAmounts[1].quotient) -
        this.minLiquidity
    } else {
      const amount0 =
        (tokenAmounts[0].quotient * totalSupply.quotient) /
        this.reserve0.quotient
      const amount1 =
        (tokenAmounts[1].quotient * totalSupply.quotient) /
        this.reserve1.quotient
      liquidity = amount0 <= amount1 ? amount0 : amount1
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
    feeOn = false,
    kLast?: BigintIsh,
  ): Amount<Token> {
    invariant(this.involvesToken(token), 'TOKEN')
    invariant(totalSupply.currency.equals(this.liquidityToken), 'TOTAL_SUPPLY')
    invariant(liquidity.currency.equals(this.liquidityToken), 'LIQUIDITY')
    invariant(liquidity.quotient <= totalSupply.quotient, 'LIQUIDITY')

    let totalSupplyAdjusted: Amount<Token>
    if (!feeOn) {
      totalSupplyAdjusted = totalSupply
    } else {
      invariant(!!kLast, 'K_LAST')
      const kLastParsed = BigInt(
        typeof kLast === 'bigint' ? kLast.toString() : kLast,
      )
      if (kLastParsed !== ZERO) {
        const rootK = sqrt(this.reserve0.quotient * this.reserve1.quotient)
        const rootKLast = sqrt(kLastParsed)
        if (rootK > rootKLast) {
          const numerator = totalSupply.quotient * (rootK - rootKLast)
          const denominator = rootK * FIVE + rootKLast
          const feeLiquidity = numerator / denominator
          totalSupplyAdjusted = totalSupply.add(
            Amount.fromRawAmount(this.liquidityToken, feeLiquidity),
          )
        } else {
          totalSupplyAdjusted = totalSupply
        }
      } else {
        totalSupplyAdjusted = totalSupply
      }
    }

    return Amount.fromRawAmount(
      token,
      (liquidity.quotient * this.reserveOf(token).quotient) /
        totalSupplyAdjusted.quotient,
    )
  }

  public serialize(): SerializedSushiSwapV2Pool {
    return sushiSwapV2PoolSchema.parse({
      reserve0: this.tokenAmounts[0].serialize(),
      reserve1: this.tokenAmounts[1].serialize(),
    })
  }

  public static deserialize(pair: SerializedSushiSwapV2Pool): SushiSwapV2Pool {
    return new SushiSwapV2Pool(
      Amount.deserialize(pair.reserve0),
      Amount.deserialize(pair.reserve1),
    )
  }
}
