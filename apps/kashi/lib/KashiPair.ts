import { Token } from '@sushiswap/currency'
import { JSBI } from '@sushiswap/math'

import { computePairAddress } from './computePairAddress'
import { KashiPair as KashiPairDTO } from '.graphclient'

export type StrategyData = {
  strategyStartDate: JSBI
  targetPercentage: JSBI
  balance: JSBI
}

export type Rebase = {
  readonly base: JSBI
  readonly elastic: JSBI
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
  readonly interestPerSecond: JSBI
  readonly lastAccrued: JSBI
  readonly feesEarnedFraction: JSBI
}

export class KashiLendingPairV1 {
  readonly address: string
  readonly accrueInfo: AccrueInfo
  readonly collateral: Token
  readonly asset: Token
  readonly oracle: string
  readonly oracleData: string
  readonly totalAsset: Rebase
  readonly totalBorrow: Rebase
  readonly exchangeRate: JSBI
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
  private CLOSED_COLLATERIZATION_RATE = 75000 // 75%
  private OPEN_COLLATERIZATION_RATE = 77000 // 77%
  private COLLATERIZATION_RATE_PRECISION = 1e5 // Must be less than EXCHANGE_RATE_PRECISION (due to optimization in math)
  private MINIMUM_TARGET_UTILIZATION = 7e17 // 70%
  private MAXIMUM_TARGET_UTILIZATION = 8e17 // 80%
  private UTILIZATION_PRECISION = 1e18
  private FULL_UTILIZATION = 1e18
  private FULL_UTILIZATION_MINUS_MAX = this.FULL_UTILIZATION - this.MAXIMUM_TARGET_UTILIZATION
  private FACTOR_PRECISION = 1e18

  private STARTING_INTEREST_PER_SECOND = 317097920 // approx 1% APR
  private MINIMUM_INTEREST_PER_SECOND = 79274480 // approx 0.25% APR
  private MAXIMUM_INTEREST_PER_SECOND = 317097920000 // approx 1000% APR
  private INTEREST_ELASTICITY = 28800e36 // Half or double in 28800 seconds (8 hours) if linear

  private EXCHANGE_RATE_PRECISION = 1e18

  private LIQUIDATION_MULTIPLIER = 112000 // add 12%
  private LIQUIDATION_MULTIPLIER_PRECISION = 1e5

  // Fees
  private PROTOCOL_FEE = 10000 // 10%
  private PROTOCOL_FEE_DIVISOR = 1e5
  private BORROW_OPENING_FEE = 50 // 0.05%
  private BORROW_OPENING_FEE_PRECISION = 1e5

  constructor(pair: KashiPairDTO) {
    //
  }
}
