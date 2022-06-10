import { ChainId } from '@sushiswap/chain'
import { Amount, Token } from '@sushiswap/currency'
import { Incentive as IncentiveDTO } from '@sushiswap/graph-client'
import { JSBI } from '@sushiswap/math'

import { IncentiveStatus, TokenType } from './enums'
import { toToken } from './mapper'

export class Incentive {
  public readonly id: string
  public readonly tokenType: string
  private readonly rewardAmount: Amount<Token>
  public readonly liquidityStaked: Amount<Token>
  public readonly startTime: Date
  public readonly endTime: Date
  public readonly createdBy: string
  public readonly status: IncentiveStatus
  private readonly rewardLastUpdated: Date
  private _tvl?: number
  private _rewardUsdPrice?: number
  private _isSubscribed: boolean

  public constructor({ chainId, incentive }: { chainId: ChainId; incentive: IncentiveDTO }) {
    this.id = incentive.id
    this._isSubscribed = false
    this.rewardAmount = Amount.fromRawAmount(toToken(incentive.rewardToken, chainId), incentive.rewardsRemaining)
    this.liquidityStaked = Amount.fromRawAmount(toToken(incentive.stakeToken, chainId), incentive.liquidityStaked)
    this.tokenType = incentive.stakeToken?.type ? (<any>TokenType)[incentive.stakeToken?.type] : TokenType.UNKNOWN // FIXME: any hack?
    this.startTime = new Date(Number(incentive.startTime) * 1000)
    this.endTime = new Date(Number(incentive.endTime) * 1000)
    this.rewardLastUpdated = new Date(Number(incentive.rewardsUpdatedAtTimestamp) * 1000)
    this.createdBy = incentive.createdBy.id
    this.status = this.initStatus()
  }

  public get remainingTime(): { days: number; hours: number; minutes: number; seconds: number } | undefined {
    const now = Date.now()
    const interval = this.isStarted() ? this.endTime.getTime() - now : this.endTime.getTime() - this.startTime.getTime()

    if (interval > 0) {
      const days = Math.floor(interval / (1000 * 60 * 60 * 24))
      const hours = Math.floor((interval % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((interval % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((interval % (1000 * 60)) / 1000)

      return { days, hours, minutes, seconds }
    }
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  public get rewardsPerDay(): Amount<Token> {
    const now = Date.now()
    const duration = this.isStarted() ? this.endTime.getTime() - now : this.endTime.getTime() - this.startTime.getTime()
    const dayInMs = 1000 * 60 * 60 * 24

    if (duration <= dayInMs) {
      return this.rewardsRemaining
    }
    const days = (duration / dayInMs).toFixed()
    return this.rewardsRemaining.divide(days)
  }

  public get rewardsRemaining(): Amount<Token> {
    const now = Date.now()
    const startTime = JSBI.BigInt(this.rewardLastUpdated.getTime())
    const endTime = JSBI.BigInt(this.endTime.getTime())

    if (this.liquidityStaked.greaterThan(0) && now > this.startTime.getTime()) {
      const duration = JSBI.subtract(endTime, startTime)
      const passed = JSBI.subtract(JSBI.BigInt(now), startTime)
      const rewardsCollected = Amount.fromRawAmount(
        this.rewardAmount.currency,
        JSBI.divide(JSBI.multiply(this.rewardAmount.quotient, passed), duration)
      )
      return this.rewardAmount.subtract(rewardsCollected)
    }
    return this.rewardAmount
  }

  public get rewardToken(): Token {
    return this.rewardAmount.currency
  }

  public get isSubscribed(): boolean {
    return this._isSubscribed
  }
  public set isSubscribed(value: boolean) {
    this._isSubscribed = value
  }

  public get price(): number | undefined {
    return this._rewardUsdPrice
  }

  public set price(value: number | undefined) {
    this._rewardUsdPrice = value
  }

  public get tvl(): number | undefined {
    return this._tvl
  }

  public set tvl(value: number | undefined) {
    this._tvl = value
  }

  public isStarted(): boolean {
    return this.startTime.getTime() < new Date().getTime()
  }

  private initStatus(): IncentiveStatus {
    const now = Date.now()
    if (now > this.endTime.getTime()) {
      return IncentiveStatus.COMPLETED
    }
    if (this.startTime.getTime() <= now) {
      return IncentiveStatus.ACTIVE
    }
    return IncentiveStatus.UPCOMING
  }
}
