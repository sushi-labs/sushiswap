import { toAmount, toShare } from '@sushiswap/bentobox-sdk'
import {
  Currency,
  CurrencyAmount,
  JSBI,
  maximum,
  minimum,
  Price,
  Rebase,
  toElastic,
  Token,
  ZERO,
} from '@sushiswap/core-sdk'
import { accrue, AccrueInfo, computePairAddress, interestAccrue, takeFee } from '@sushiswap/kashi-sdk'

import { accrueTotalAssetWithFee } from './functions'
import { Oracle } from './oracles'

export class KashiMediumRiskLendingPair {
  public readonly address: string
  public readonly accrueInfo: AccrueInfo
  public readonly collateral: Rebase & { token: Token }
  public readonly asset: Rebase & { token: Token }
  public readonly collateralPrice: Price<Currency, Token>
  public readonly assetPrice: Price<Currency, Token>
  public readonly oracle: Oracle
  public readonly totalCollateralShare: JSBI
  public readonly totalAsset: Rebase
  public readonly totalBorrow: Rebase
  public readonly exchangeRate: JSBI
  public readonly oracleExchangeRate: JSBI
  public readonly spotExchangeRate: JSBI
  public readonly userCollateralShare: JSBI
  public readonly userAssetFraction: JSBI
  public readonly userBorrowPart: JSBI

  public static getAddress(collateral: Token, asset: Token, oracle: string, oracleData: string): string {
    return computePairAddress({
      collateral,
      asset,
      oracle,
      oracleData,
    })
  }

  public constructor({
    accrueInfo,
    collateral,
    asset,
    collateralPrice,
    assetPrice,
    oracle,
    totalCollateralShare,
    totalAsset,
    totalBorrow,
    exchangeRate,
    oracleExchangeRate,
    spotExchangeRate,
    userCollateralShare,
    userAssetFraction,
    userBorrowPart,
  }: {
    accrueInfo: AccrueInfo
    collateral: Rebase & { token: Token }
    asset: Rebase & { token: Token }
    collateralPrice: Price<Currency, Token>
    assetPrice: Price<Currency, Token>
    oracle: Oracle
    totalCollateralShare: JSBI
    totalAsset: Rebase
    totalBorrow: Rebase
    exchangeRate: JSBI
    oracleExchangeRate: JSBI
    spotExchangeRate: JSBI
    userCollateralShare: JSBI
    userAssetFraction: JSBI
    userBorrowPart: JSBI
  }) {
    this.address = KashiMediumRiskLendingPair.getAddress(collateral.token, asset.token, oracle.address, oracle.data)
    this.accrueInfo = accrueInfo
    this.collateral = collateral
    this.asset = asset
    this.collateralPrice = collateralPrice
    this.assetPrice = assetPrice
    this.oracle = oracle
    this.totalCollateralShare = totalCollateralShare
    this.totalAsset = totalAsset
    this.totalBorrow = totalBorrow
    this.exchangeRate = exchangeRate
    this.oracleExchangeRate = oracleExchangeRate
    this.spotExchangeRate = spotExchangeRate
    this.userCollateralShare = userCollateralShare
    this.userAssetFraction = userAssetFraction
    this.userBorrowPart = userBorrowPart
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
    return interestAccrue(this, this.interestPerYear)
  }

  /**
   * The total collateral in the market (collateral is stable, it doesn't accrue)
   */
  public get totalCollateralAmount(): JSBI {
    return toAmount(this.collateral, this.totalCollateralShare)
  }

  /**
   * The total assets unborrowed in the market (stable, doesn't accrue)
   */
  public get totalAssetAmount(): JSBI {
    return toAmount(this.asset, this.totalAsset.elastic)
  }

  public get totalAssetAmountUSD(): CurrencyAmount<Token> {
    return this.assetPrice?.quote(CurrencyAmount.fromRawAmount(this.asset.token, this.totalAssetAmount))
  }

  /**
   * The total assets borrowed in the market right now
   */
  public get currentBorrowAmount(): JSBI {
    return accrue(this, this.totalBorrow.elastic, true)
  }

  public get currentBorrowAmountUSD(): CurrencyAmount<Token> {
    return this.assetPrice?.quote(CurrencyAmount.fromRawAmount(this.asset.token, this.currentBorrowAmount))
  }

  /**
   * The total amount of assets, both borrowed and still available right now
   */
  public get currentAllAssets(): JSBI {
    return JSBI.add(this.totalAssetAmount, this.currentBorrowAmount)
  }

  public get currentAllAssetsUSD(): CurrencyAmount<Token> {
    return this.assetPrice?.quote(CurrencyAmount.fromRawAmount(this.asset.token, this.currentAllAssets))
  }

  /**
   * Current total amount of asset shares
   */
  public get currentAllAssetShares(): JSBI {
    return toShare(this.asset, this.currentAllAssets)
  }

  /**
   * Current totalAsset with the protocol fee accrued
   */
  public get currentTotalAsset(): Rebase {
    return accrueTotalAssetWithFee(this)
  }

  /**
   * The maximum amount of assets available for withdrawal or borrow
   */
  public get maxAssetAvailable(): JSBI {
    return minimum(
      JSBI.greaterThan(this.currentAllAssetShares, ZERO)
        ? JSBI.divide(JSBI.multiply(this.totalAsset.elastic, this.currentAllAssets), this.currentAllAssetShares)
        : ZERO,
      toAmount(
        this.asset,
        toElastic(this.currentTotalAsset, JSBI.subtract(this.totalAsset.base, JSBI.BigInt(1000)), false)
      )
    )
  }

  /**
   * The maximum amount of assets available for withdrawal or borrow in shares
   */
  public get maxAssetAvailableFraction(): JSBI {
    if (JSBI.equal(this.currentAllAssets, ZERO)) return ZERO
    return JSBI.divide(JSBI.multiply(this.maxAssetAvailable, this.currentTotalAsset.base), this.currentAllAssets)
  }

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
  public get marketHealth(): JSBI {
    if (JSBI.equal(this.currentBorrowAmount, ZERO) || JSBI.equal(this.maximumExchangeRate, ZERO)) {
      return ZERO
    }
    return JSBI.divide(
      JSBI.multiply(
        JSBI.divide(JSBI.multiply(this.totalCollateralAmount, JSBI.BigInt(1e18)), this.maximumExchangeRate),
        JSBI.BigInt(1e18)
      ),
      this.currentBorrowAmount
    )
  }

  /**
   * The current utilization in %
   */
  public get utilization(): JSBI {
    if (JSBI.equal(this.currentAllAssets, ZERO)) return ZERO
    return JSBI.divide(JSBI.multiply(JSBI.BigInt(1e18), this.currentBorrowAmount), this.currentAllAssets)
  }

  /**
   * Interest per year received by lenders as of now
   */
  public get supplyAPR(): JSBI {
    return takeFee(JSBI.divide(JSBI.multiply(this.interestPerYear, this.utilization), JSBI.BigInt(1e18)))
  }

  /**
   * Interest per year received by lenders if accrue was called
   */
  public get currentSupplyAPR(): JSBI {
    return takeFee(JSBI.divide(JSBI.multiply(this.currentInterestPerYear, this.utilization), JSBI.BigInt(1e18)))
  }

  /**
   * The user's amount of collateral (stable, doesn't accrue)
   */
  public get userCollateralAmount(): JSBI {
    return toAmount(this.collateral, this.userCollateralShare)
  }

  /**
   * The user's amount of assets (stable, doesn't accrue)
   */
  public get currentUserAssetAmount(): JSBI {
    if (JSBI.equal(this.totalAsset.base, ZERO)) return ZERO
    return JSBI.divide(JSBI.multiply(this.userAssetFraction, this.currentAllAssets), this.totalAsset.base)
  }

  /**
   * The user's amount borrowed right now
   */
  public get currentUserBorrowAmount(): JSBI {
    if (JSBI.equal(this.totalBorrow.base, ZERO)) return ZERO
    return JSBI.divide(JSBI.multiply(this.userBorrowPart, this.currentBorrowAmount), this.totalBorrow.base)
  }

  /**
   * The user's amount of assets that are currently lent
   */
  public get currentUserLentAmount(): JSBI {
    if (JSBI.equal(this.totalAsset.base, ZERO)) return ZERO
    return JSBI.divide(JSBI.multiply(this.userAssetFraction, this.currentBorrowAmount), this.totalAsset.base)
  }

  /**
   * Value of protocol fees
   */
  public get feesEarned(): JSBI {
    if (JSBI.equal(this.totalAsset.base, ZERO)) return ZERO
    return JSBI.divide(JSBI.multiply(this.accrueInfo.feesEarnedFraction, this.currentAllAssets), this.totalAsset.base)
  }

  /**
   * The user's maximum borrowable amount based on the collateral provided, using all three oracle values
   */
  public get maxBorrowable() {
    const max = {
      oracle: JSBI.greaterThan(this.oracleExchangeRate, ZERO)
        ? JSBI.divide(
            JSBI.multiply(this.userCollateralAmount, JSBI.multiply(JSBI.BigInt(1e16), JSBI.BigInt(75))),
            this.oracleExchangeRate
          )
        : ZERO,
      spot: JSBI.greaterThan(this.spotExchangeRate, ZERO)
        ? JSBI.divide(
            JSBI.multiply(this.userCollateralAmount, JSBI.multiply(JSBI.BigInt(1e16), JSBI.BigInt(75))),
            this.spotExchangeRate
          )
        : ZERO,
      stored: JSBI.greaterThan(this.exchangeRate, ZERO)
        ? JSBI.divide(
            JSBI.multiply(this.userCollateralAmount, JSBI.multiply(JSBI.BigInt(1e16), JSBI.BigInt(75))),
            this.exchangeRate
          )
        : ZERO,
    }

    const min = minimum(...Object.values(max))

    const safe = JSBI.subtract(
      JSBI.divide(JSBI.multiply(min, JSBI.BigInt(95)), JSBI.BigInt(100)),
      this.currentUserBorrowAmount
    )

    const possible = minimum(safe, this.maxAssetAvailable)

    return {
      ...max,
      minimum: min,
      safe,
      possible,
    }
  }

  public simulatedMaxBorrowable(borrowAmount: JSBI, collateralAmount: JSBI, updateExchangeRate = true) {
    const max = {
      oracle: JSBI.greaterThan(this.oracleExchangeRate, ZERO)
        ? JSBI.divide(
            JSBI.multiply(collateralAmount, JSBI.multiply(JSBI.BigInt(1e16), JSBI.BigInt(75))),
            this.oracleExchangeRate
          )
        : ZERO,
      spot: JSBI.greaterThan(this.spotExchangeRate, ZERO)
        ? JSBI.divide(
            JSBI.multiply(collateralAmount, JSBI.multiply(JSBI.BigInt(1e16), JSBI.BigInt(75))),
            this.spotExchangeRate
          )
        : ZERO,
      stored: JSBI.greaterThan(this.exchangeRate, ZERO)
        ? JSBI.divide(
            JSBI.multiply(collateralAmount, JSBI.multiply(JSBI.BigInt(1e16), JSBI.BigInt(75))),
            updateExchangeRate ? this.oracleExchangeRate : this.exchangeRate
          )
        : ZERO,
    }

    const min = minimum(...Object.values(max))

    const safe = JSBI.subtract(
      JSBI.divide(JSBI.multiply(min, JSBI.BigInt(95)), JSBI.BigInt(100)),
      this.currentUserBorrowAmount
    )

    const possible = minimum(safe, this.maxAssetAvailable)

    // console.log({
    //   collateralAmount: collateralAmount.toString(),
    //   min: min.toString(),
    //   safe: safe.toString(),
    //   possible: possible.toString(),
    // })

    return {
      ...max,
      minimum: min,
      safe,
      possible,
    }
  }

  /**
   * The user's position's health
   */
  public get health(): JSBI {
    if (JSBI.equal(this.maxBorrowable.minimum, ZERO)) return ZERO
    return JSBI.divide(JSBI.multiply(this.currentUserBorrowAmount, JSBI.BigInt(1e18)), this.maxBorrowable.minimum)
  }

  /**
   * The recomputed health based on new borrow and/or collateral.
   */
  public simulatedHealth(borrowAmount: JSBI = JSBI.BigInt(0), collateralAmount: JSBI = JSBI.BigInt(0)): JSBI {
    const { minimum } = this.simulatedMaxBorrowable(borrowAmount, collateralAmount)

    if (JSBI.equal(minimum, ZERO)) return ZERO

    return JSBI.divide(JSBI.multiply(borrowAmount, JSBI.BigInt(1e18)), minimum)
  }
}

export default KashiMediumRiskLendingPair
