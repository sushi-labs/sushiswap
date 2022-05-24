import { ChainId } from '@sushiswap/core-sdk'
import { Amount, Token } from '@sushiswap/currency'
import { JSBI, Percent, ZERO } from '@sushiswap/math'

import { FuroStatus, FuroType } from './enums'
import { toToken } from './mapper'
import { FuroRepresentation, UserRepresentation } from './representations'

export abstract class Furo {
  private _balance: Amount<Token>
  public readonly id: string
  public readonly type: FuroType
  public readonly status: FuroStatus
  public readonly amount: Amount<Token>
  public readonly withdrawnAmount: Amount<Token>
  public readonly startTime: Date
  public readonly endTime: Date
  public readonly modifiedAtTimestamp: Date
  public readonly recipient: UserRepresentation
  public readonly createdBy: UserRepresentation
  public readonly token: Token
  public readonly txHash: string

  public constructor({ furo, chainId }: { furo: FuroRepresentation; chainId: ChainId }) {
    this.id = furo.id
    this.type = furo.__typename
    this.token = toToken(furo.token, chainId)
    this.amount = Amount.fromRawAmount(this.token, JSBI.BigInt(furo.totalAmount))
    this.withdrawnAmount = Amount.fromRawAmount(this.token, JSBI.BigInt(furo.withdrawnAmount))
    this.startTime = new Date(parseInt(furo.startedAt) * 1000)
    this.endTime = new Date(parseInt(furo.expiresAt) * 1000)
    this.modifiedAtTimestamp = new Date(parseInt(furo.modifiedAtTimestamp) * 1000)
    this.status = this.setStatus(FuroStatus[furo.status])
    this.recipient = furo.recipient
    this.createdBy = furo.createdBy
    this.txHash = furo.txHash
    this._balance = Amount.fromRawAmount(this.token, '0')
  }

  public get balance() {
    return this._balance
  }

  public set balance(amount: Amount<Token>) {
    this._balance = amount
  }

  public get remainingTime(): { days: number; hours: number; minutes: number; seconds: number } | undefined {
    if (this.status !== FuroStatus.CANCELLED) {
      const now = Date.now()
      const interval = this.endTime.getTime() - now

      let days = Math.floor(interval / (1000 * 60 * 60 * 24))
      let hours = Math.floor((interval % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      let minutes = Math.floor((interval % (1000 * 60 * 60)) / (1000 * 60))
      let seconds = Math.floor((interval % (1000 * 60)) / 1000)

      return { days, hours, minutes, seconds }
    }
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  public get startingInTime(): { days: number; hours: number; minutes: number; seconds: number } | undefined {
    if (this.status === FuroStatus.ACTIVE || this.status === FuroStatus.UPCOMING) {
      const now = Date.now()
      const interval = this.startTime.getTime() - now

      let days = Math.floor(interval / (1000 * 60 * 60 * 24))
      let hours = Math.floor((interval % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      let minutes = Math.floor((interval % (1000 * 60 * 60)) / (1000 * 60))
      let seconds = Math.floor((interval % (1000 * 60)) / 1000)

      return { days, hours, minutes, seconds }
    }
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  public get activeTime(): { days: number; hours: number; minutes: number; seconds: number } | undefined {
    const now = this.status !== FuroStatus.CANCELLED ? Date.now() : new Date(this.modifiedAtTimestamp).getTime()

    const interval = now - this.startTime.getTime()

    let days = Math.floor(interval / (1000 * 60 * 60 * 24))
    let hours = Math.floor((interval % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    let minutes = Math.floor((interval % (1000 * 60 * 60)) / (1000 * 60))
    let seconds = Math.floor((interval % (1000 * 60)) / 1000)

    return { days, hours, minutes, seconds }
  }

  public get streamedPercentage(): Percent {
    if (!this.isStarted) return new Percent(0, 100)

    // If balance is available calculate streamedPercentage like this
    // to trigger re-renders on balance updates
    if (this.balance?.greaterThan(ZERO)) return new Percent(this.streamedAmount.quotient, this.amount.quotient)

    const now = this.status !== FuroStatus.CANCELLED ? Date.now() : this.modifiedAtTimestamp.getTime()
    const total = this.endTime.getTime() - this.startTime.getTime()
    const current = now - this.startTime.getTime()
    console.log(current, total)

    return new Percent(current, total)
  }

  public get withdrawnPercentage(): Percent {
    if (this.status === FuroStatus.CANCELLED) return new Percent(100, 100)
    if (this.withdrawnAmount.toExact() === '0') return new Percent(0, 100)
    return new Percent(this.withdrawnAmount.quotient, this.amount.quotient)
  }

  public get streamedAmount(): Amount<Token> {
    if (!this.isStarted) return Amount.fromRawAmount(this.token, '0')

    // If balance is available calculate streamedAmount like this
    // to trigger re-renders on balance updates
    if (this.balance?.greaterThan(ZERO)) return this.balance.add(this.withdrawnAmount)

    // Otherwise, use subgraph only
    return this.amount.multiply(this.streamedPercentage)
  }

  public get remainingAmount(): Amount<Token> {
    if (!this.isStarted) return this.amount
    if (this.status === FuroStatus.CANCELLED) return Amount.fromRawAmount(this.token, '0')
    return this.amount.subtract(this.withdrawnAmount).subtract(this.balance)
  }

  public get isStarted(): boolean {
    return this.startTime.getTime() <= Date.now()
  }

  public get isEnded(): boolean {
    return this.status === FuroStatus.CANCELLED || this.endTime.getTime() <= Date.now()
  }

  private setStatus(status: FuroStatus): FuroStatus {
    if (status === FuroStatus.CANCELLED) return status
    if (!this.isStarted) return FuroStatus.UPCOMING
    if (status === FuroStatus.EXTENDED) return status
    if (this.isEnded) return FuroStatus.COMPLETED
    return status
  }

  public canCancel(account: string): boolean {
    return this.createdBy.id.toLowerCase() === account.toLowerCase() && !this.isEnded
  }

  public canTransfer(account: string): boolean {
    return [this.createdBy.id.toLowerCase(), this.recipient.id.toLowerCase()].includes(account.toLowerCase())
  }

  public canWithdraw(account: string): boolean {
    return this.recipient.id.toLowerCase() === account.toLowerCase() && this.isStarted
  }

  public canUpdate(account: string): boolean {
    return this.createdBy.id.toLowerCase() === account.toLowerCase()
  }
}
