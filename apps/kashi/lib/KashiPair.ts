import { getAddress } from '@ethersproject/address'
import { Amount, Share, Token } from '@sushiswap/currency'
import { JSBI, maximum, minimum, Percent, ZERO } from '@sushiswap/math'
import { KASHI_ADDRESS } from 'config'

import { computePairAddress } from './computePairAddress'
import { KashiPair as KashiPairDTO } from '.graphclient'

export type StrategyData = {
  strategyStartDate: JSBI
  targetPercentage: JSBI
  balance: JSBI
}

export type Rebase = {
  base: JSBI
  elastic: JSBI
}

export class Strategy {}

export class BentoBox {
  readonly totals: Record<string, Rebase>
  readonly strategy: Record<string, Strategy>
  readonly pendingStrategy: Record<string, Strategy>
  readonly strategyData: Record<string, StrategyData>
}

export class Oracle {
  readonly address: string
  readonly name: string
  readonly symbol: string
  readonly data: string
}

export type AccrueInfo = {
  interestPerSecond: JSBI
  lastAccrued: JSBI
  feesEarnedFraction: JSBI
}

export class KashiMediumRiskLendingPairV1 {
  readonly chainId: keyof typeof KASHI_ADDRESS
  readonly id: string
  readonly address: string
  readonly bentoBox: string
  readonly masterContract: string
  readonly collateral: Token
  readonly asset: Token
  readonly oracle: string
  readonly oracleData: string
  readonly totalCollateralShare: Share<Token>
  readonly totalAsset: Rebase
  readonly totalBorrow: Rebase
  readonly accrueInfo: AccrueInfo
  readonly exchangeRate: JSBI

  readonly symbol: string
  readonly name: string
  readonly decimals: number

  readonly totalSupply: Share<Token>

  readonly oracleExchangeRate: JSBI
  readonly spotExchangeRate: JSBI

  static getAddress(collateral: Token, asset: Token, oracle: string, oracleData: string): string {
    return computePairAddress({
      collateral,
      asset,
      oracle,
      oracleData,
    })
  }

  // Settings for the Medium Risk KashiPair
  private CLOSED_COLLATERIZATION_RATE = JSBI.BigInt(75000) // 75%
  private OPEN_COLLATERIZATION_RATE = JSBI.BigInt(77000) // 77%
  private COLLATERIZATION_RATE_PRECISION = JSBI.BigInt(1e5) // Must be less than EXCHANGE_RATE_PRECISION (due to optimization in math)
  private MINIMUM_TARGET_UTILIZATION = JSBI.BigInt(7e17) // 70%
  private MAXIMUM_TARGET_UTILIZATION = JSBI.BigInt(8e17) // 80%
  private UTILIZATION_PRECISION = JSBI.BigInt(1e18)
  private FULL_UTILIZATION = JSBI.BigInt(1e18)
  private FULL_UTILIZATION_MINUS_MAX = JSBI.subtract(this.FULL_UTILIZATION, this.MAXIMUM_TARGET_UTILIZATION)
  private FACTOR_PRECISION = JSBI.BigInt(1e18)

  private STARTING_INTEREST_PER_SECOND = JSBI.BigInt(317097920) // approx 1% APR
  private MINIMUM_INTEREST_PER_SECOND = JSBI.BigInt(79274480) // approx 0.25% APR
  private MAXIMUM_INTEREST_PER_SECOND = JSBI.BigInt(317097920000) // approx 1000% APR
  private INTEREST_ELASTICITY = JSBI.BigInt(28800e36) // Half or double in 28800 seconds (8 hours) if linear

  private EXCHANGE_RATE_PRECISION = JSBI.BigInt(1e18)

  private LIQUIDATION_MULTIPLIER = JSBI.BigInt(112000) // add 12%
  private LIQUIDATION_MULTIPLIER_PRECISION = JSBI.BigInt(1e5)

  // Fees
  private PROTOCOL_FEE = JSBI.BigInt(10000) // 10%
  private PROTOCOL_FEE_DIVISOR = JSBI.BigInt(1e5)
  private BORROW_OPENING_FEE = JSBI.BigInt(50) // 0.05%
  private BORROW_OPENING_FEE_PRECISION = JSBI.BigInt(1e5)

  // Non contract

  // approx 1% APR
  private STARTING_INTEREST_PER_YEAR = JSBI.multiply(this.STARTING_INTEREST_PER_SECOND, JSBI.BigInt(60 * 60 * 24 * 365))

  // approx 0.25% APR
  private MINIMUM_INTEREST_PER_YEAR = JSBI.multiply(this.MINIMUM_INTEREST_PER_SECOND, JSBI.BigInt(60 * 60 * 24 * 365))

  // approx 1000% APR
  private MAXIMUM_INTEREST_PER_YEAR = JSBI.multiply(this.MAXIMUM_INTEREST_PER_SECOND, JSBI.BigInt(60 * 60 * 24 * 365))

  constructor(pair: KashiPairDTO) {
    console.log('pair address is...', pair.id)
    this.address = getAddress(pair.id)
    this.id = getAddress(pair.id)

    this.chainId = pair.chainId

    // this.bentoBox = getAddress(pair.bentoBox.id)
    this.masterContract = getAddress(pair.masterContract.id)

    this.collateral = new Token({
      chainId: pair.chainId,
      address: getAddress(pair.collateral.id),
      ...pair.collateral,
    })

    this.asset = new Token({
      chainId: pair.chainId,
      address: getAddress(pair.asset.id),
      ...pair.asset,
    })

    this.oracle = getAddress(pair.oracle)
    // TODO: ADD VALIDATION
    this.oracleData = pair.oracleData

    this.totalCollateralShare = Share.fromRawShare(this.collateral, pair.totalCollateralShare)

    this.totalAsset = {
      base: JSBI.BigInt(pair.totalAsset.base),
      elastic: JSBI.BigInt(pair.totalAsset.elastic),
    }

    this.totalBorrow = {
      base: JSBI.BigInt(pair.totalBorrow.base),
      elastic: JSBI.BigInt(pair.totalBorrow.elastic),
    }

    this.exchangeRate = JSBI.BigInt(pair.exchangeRate)

    this.accrueInfo = {
      interestPerSecond: JSBI.BigInt(pair.accrueInfo.interestPerSecond),
      lastAccrued: JSBI.BigInt(pair.accrueInfo.lastAccrued),
      feesEarnedFraction: JSBI.BigInt(pair.accrueInfo.feesEarnedFraction),
    }

    this.symbol = pair.symbol
    this.name = pair.name
    this.decimals = pair.decimals

    this.totalSupply = Share.fromRawShare(this.asset, this.totalAsset.base)
  }

  /**
   * Returns the number of elapsed seconds since the last accrue
   */
  public get elapsedSeconds(): JSBI {
    const currentDate = JSBI.divide(JSBI.BigInt(Date.now()), JSBI.BigInt(1000))
    return JSBI.subtract(currentDate, this.accrueInfo.lastAccrued)
  }

  /**
   * Interest per year for borrowers at last accrue, this will apply during the next accrue
   */
  public get interestPerYear(): JSBI {
    return JSBI.multiply(this.accrueInfo.interestPerSecond, JSBI.BigInt(60 * 60 * 24 * 365))
  }

  /**
   * Interest per year for borrowers if accrued was called
   */
  public get currentInterestPerYear(): JSBI {
    if (JSBI.equal(this.totalBorrow.base, ZERO)) {
      return this.STARTING_INTEREST_PER_YEAR
    }
    if (JSBI.lessThanOrEqual(this.elapsedSeconds, ZERO)) {
      return this.interestPerYear
    }

    let currentInterest = this.interestPerYear

    if (JSBI.lessThan(this.utilization, this.MINIMUM_TARGET_UTILIZATION)) {
      const underFactor = JSBI.greaterThan(this.MINIMUM_TARGET_UTILIZATION, ZERO)
        ? JSBI.divide(
            JSBI.multiply(JSBI.subtract(this.MINIMUM_TARGET_UTILIZATION, this.utilization), this.FACTOR_PRECISION),
            this.MINIMUM_TARGET_UTILIZATION
          )
        : ZERO
      const scale = JSBI.add(
        this.INTEREST_ELASTICITY,
        JSBI.multiply(JSBI.multiply(underFactor, underFactor), this.elapsedSeconds)
      )
      currentInterest = JSBI.divide(JSBI.multiply(currentInterest, this.INTEREST_ELASTICITY), scale)

      if (JSBI.lessThan(currentInterest, this.MINIMUM_INTEREST_PER_YEAR)) {
        currentInterest = this.MINIMUM_INTEREST_PER_YEAR // 0.25% APR minimum
      }
    } else if (JSBI.greaterThan(this.utilization, this.MAXIMUM_TARGET_UTILIZATION)) {
      const overFactor = JSBI.multiply(
        JSBI.subtract(this.utilization, this.MAXIMUM_TARGET_UTILIZATION),
        JSBI.divide(this.FACTOR_PRECISION, this.FULL_UTILIZATION_MINUS_MAX)
      )
      const scale = JSBI.add(
        this.INTEREST_ELASTICITY,
        JSBI.multiply(JSBI.multiply(overFactor, overFactor), this.elapsedSeconds)
      )
      currentInterest = JSBI.divide(JSBI.multiply(currentInterest, scale), this.INTEREST_ELASTICITY)
      if (JSBI.greaterThan(currentInterest, this.MAXIMUM_INTEREST_PER_YEAR)) {
        currentInterest = this.MAXIMUM_INTEREST_PER_YEAR // 1000% APR maximum
      }
    }
    return currentInterest
  }

  /**
   * The total collateral in the market (collateral is stable, it doesn't accrue)
   */
  public get totalCollateralAmount(): Amount<Token> {
    console.log('totalCollateralAmount', this.totalCollateralShare.toFixed())
    return this.totalCollateralShare.toAmount(this.collateral.rebase)
  }

  /**
   * The total assets unborrowed in the market (stable, doesn't accrue)
   */
  public get totalAssetAmount(): Amount<Token> {
    // TODO: Make sure this is correct...
    return Amount.fromRawAmount(this.asset, this.totalAsset.elastic)
  }

  private accrue(amount: JSBI, includePrincipal = false): JSBI {
    return JSBI.add(
      JSBI.divide(
        JSBI.multiply(JSBI.multiply(amount, this.accrueInfo.interestPerSecond), this.elapsedSeconds),
        JSBI.BigInt(1e18)
      ),
      includePrincipal ? amount : ZERO
    )
  }

  /**
   * The total assets borrowed in the market right now
   */
  public get currentBorrowAmount(): Amount<Token> {
    return Amount.fromRawAmount(this.asset, this.accrue(this.totalBorrow.elastic, true))
  }

  /**
   * The total amount of assets, both borrowed and still available right now
   */
  public get currentAllAssets(): Amount<Token> {
    return this.totalAssetAmount.add(this.currentBorrowAmount)
  }

  /**
   * Current total amount of asset shares
   */
  public get currentAllAssetShares(): Share<Token> {
    return this.currentAllAssets.toShare(this.asset.rebase)
  }

  /**
   * Current totalAsset with the protocol fee accrued
   */
  public get currentTotalAsset(): Rebase {
    const extraAmount = JSBI.divide(
      JSBI.multiply(
        JSBI.multiply(this.totalBorrow.elastic, this.accrueInfo.interestPerSecond),
        JSBI.add(this.elapsedSeconds, JSBI.BigInt(3600)) // For some transactions, to succeed in the next hour (and not only this block), some margin has to be added
      ),
      JSBI.BigInt(1e18)
    )
    const feeAmount = JSBI.divide(JSBI.multiply(extraAmount, this.PROTOCOL_FEE), this.PROTOCOL_FEE_DIVISOR) // % of interest paid goes to fee
    const feeFraction = JSBI.divide(JSBI.multiply(feeAmount, this.totalAsset.base), this.currentAllAssets.quotient)
    return {
      elastic: this.totalAsset.elastic,
      base: JSBI.add(this.totalAsset.base, feeFraction),
    }
  }

  // /**
  //  * The current utilization in %
  //  */
  // public get utilization(): Percent {
  //   return new Percent(
  //     JSBI.divide(JSBI.multiply(JSBI.BigInt(1e18), this.currentBorrowAmount.quotient), this.currentAllAssets.quotient)
  //   )
  // }

  /**
   * The current utilization in %
   */
  public get utilization(): JSBI {
    if (this.currentAllAssets.equalTo(ZERO)) return JSBI.BigInt(0)
    return this.currentBorrowAmount.multiply(1e18).divide(this.currentAllAssets).quotient
  }

  private takeFee(amount: JSBI): JSBI {
    return JSBI.subtract(amount, JSBI.divide(JSBI.multiply(amount, this.PROTOCOL_FEE), this.PROTOCOL_FEE_DIVISOR))
  }

  // /**
  //  * Interest per year received by lenders as of now
  //  */
  // public get supplyAPR(): Percent {
  //   return takeFee(JSBI.divide(JSBI.multiply(this.interestPerYear, this.utilization.q), JSBI.BigInt(1e18)))
  //   return new Percent(1, 100)
  // }

  /**
   * The 'mimimum' exchange rate
   */
  public get minimumExchangeRate(): JSBI {
    return minimum(this.exchangeRate, this.spotExchangeRate, this.oracleExchangeRate)
  }

  /**
   * The 'maximum' exchange rate
   */
  public get maximumExchangeRate(): JSBI {
    return maximum(this.exchangeRate, this.spotExchangeRate, this.oracleExchangeRate)
  }

  /**
   * The overall health of the lending pair
   */
  public get marketHealth(): Percent {
    if (JSBI.equal(this.currentBorrowAmount.quotient, ZERO) || JSBI.equal(this.maximumExchangeRate, ZERO)) {
      return new Percent(0)
    }

    return new Percent(
      this.totalCollateralAmount
        .multiply(1e18)
        .divide(this.maximumExchangeRate)
        .multiply(1e18)
        .divide(this.currentBorrowAmount).quotient,
      JSBI.BigInt(1e18)
    )

    //  return JSBI.divide(
    //     JSBI.multiply(
    //       JSBI.divide(JSBI.multiply(this.totalCollateralAmount, JSBI.BigInt(1e18)), this.maximumExchangeRate),
    //       JSBI.BigInt(1e18)
    //     ),
    //     this.currentBorrowAmount
    //   )
    // if (JSBI.equal(this.currentBorrowAmount, ZERO) || JSBI.equal(this.maximumExchangeRate, ZERO)) {
    //   return ZERO
    // }
    // return JSBI.divide(
    //   JSBI.multiply(
    //     JSBI.divide(JSBI.multiply(this.totalCollateralAmount, JSBI.BigInt(1e18)), this.maximumExchangeRate),
    //     JSBI.BigInt(1e18)
    //   ),
    //   this.currentBorrowAmount
    // )
  }

  /**
   * Interest per year received by lenders as of now
   */
  public get supplyAPR(): Percent {
    return new Percent(
      this.takeFee(JSBI.divide(JSBI.multiply(this.interestPerYear, this.utilization), JSBI.BigInt(1e18))),
      JSBI.BigInt(1e18)
    )
  }

  /**
   * Interest per year received by lenders if accrue was called
   */
  public get currentSupplyAPR(): Percent {
    return new Percent(
      this.takeFee(JSBI.divide(JSBI.multiply(this.currentInterestPerYear, this.utilization), JSBI.BigInt(1e18))),
      JSBI.BigInt(1e18)
    )
  }
}
