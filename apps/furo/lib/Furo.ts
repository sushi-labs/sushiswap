import { ChainId } from 'sushi/chain'
import { Amount, Token } from 'sushi/currency'

import { type Rebase, streamQuery, vestingQuery } from '../.graphclient'
import { FuroStatus } from './enums'
import { toToken } from './mapper'

export abstract class Furo {
  public _balance: Amount<Token>
  public _withdrawnAmount: Amount<Token>

  public readonly id: string
  public readonly chainId: ChainId
  public readonly type: (
    | NonNullable<streamQuery['stream']>
    | NonNullable<vestingQuery['vesting']>
  )['__typename']
  public readonly status: FuroStatus
  public readonly remainingShares: Amount<Token>
  public readonly _remainingAmount: Amount<Token>
  public readonly initialShares: Amount<Token>
  public readonly inititalAmount: Amount<Token>
  public readonly startTime: Date
  public readonly endTime: Date
  public readonly modifiedAtTimestamp: Date
  public readonly recipient: (
    | NonNullable<streamQuery['stream']>
    | NonNullable<vestingQuery['vesting']>
  )['recipient']
  public readonly createdBy: (
    | NonNullable<streamQuery['stream']>
    | NonNullable<vestingQuery['vesting']>
  )['createdBy']
  public readonly token: Token
  public readonly rebase: Pick<Rebase, 'base' | 'elastic'>
  public readonly txHash: string

  public constructor({
    chainId,
    furo,
    rebase,
  }: {
    chainId: ChainId
    furo:
      | NonNullable<streamQuery['stream']>
      | NonNullable<vestingQuery['vesting']>
    rebase: Pick<Rebase, 'id' | 'base' | 'elastic'>
  }) {
    this.rebase = {
      base: BigInt(Math.round(Math.floor(rebase.base * 1e5))),
      elastic: BigInt(Math.round(Math.floor(rebase.elastic * 1e5))),
    }
    this.id = furo.id
    this.chainId = chainId
    this.type = furo.__typename
    this.token = toToken(furo.token, chainId)
    this.initialShares = Amount.fromRawAmount(
      this.token,
      BigInt(furo.initialShares),
    )
    this.inititalAmount = Amount.fromRawAmount(
      this.token,
      BigInt(furo.initialAmount),
    )
    this.remainingShares = Amount.fromRawAmount(
      this.token,
      BigInt(furo.remainingShares),
    )
    this._remainingAmount = Amount.fromShare(
      this.token,
      BigInt(furo.remainingShares),
      this.rebase,
    )
    this.startTime = new Date(parseInt(furo.startedAt) * 1000)
    this.endTime = new Date(parseInt(furo.expiresAt) * 1000)
    this.modifiedAtTimestamp = new Date(
      parseInt(furo.modifiedAtTimestamp) * 1000,
    )
    this.status = this.setStatus(FuroStatus[furo.status])
    this.recipient = furo.recipient
    this.createdBy = furo.createdBy
    this.txHash = furo.txHash
    this._withdrawnAmount = Amount.fromRawAmount(
      this.token,
      BigInt(furo.withdrawnAmount),
    )
    this._balance = Amount.fromRawAmount(this.token, 0)
  }

  public get withdrawnAmount(): Amount<Token> {
    return this._withdrawnAmount
  }

  public set withdrawnAmount(amount: Amount<Token>) {
    this._withdrawnAmount = amount
  }

  public get balance(): Amount<Token> {
    return this._balance
  }

  public set balance(amount: Amount<Token>) {
    this._balance = amount
  }

  public get remainingTime():
    | { days: number; hours: number; minutes: number; seconds: number }
    | undefined {
    if (this.status !== FuroStatus.CANCELLED) {
      const now = Date.now()
      const interval = this.endTime.getTime() - now

      const days = Math.floor(interval / (1000 * 60 * 60 * 24))
      const hours = Math.floor(
        (interval % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      )
      const minutes = Math.floor((interval % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((interval % (1000 * 60)) / 1000)

      return { days, hours, minutes, seconds }
    }
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  public get startingInTime():
    | { days: number; hours: number; minutes: number; seconds: number }
    | undefined {
    if (
      this.status === FuroStatus.ACTIVE ||
      this.status === FuroStatus.UPCOMING
    ) {
      const now = Date.now()
      const interval = this.startTime.getTime() - now

      const days = Math.floor(interval / (1000 * 60 * 60 * 24))
      const hours = Math.floor(
        (interval % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      )
      const minutes = Math.floor((interval % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((interval % (1000 * 60)) / 1000)

      return { days, hours, minutes, seconds }
    }
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  public get activeTime():
    | { days: number; hours: number; minutes: number; seconds: number }
    | undefined {
    const now =
      this.status !== FuroStatus.CANCELLED
        ? Date.now()
        : new Date(this.modifiedAtTimestamp).getTime()

    const interval = now - this.startTime.getTime()

    const days = Math.floor(interval / (1000 * 60 * 60 * 24))
    const hours = Math.floor(
      (interval % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    )
    const minutes = Math.floor((interval % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((interval % (1000 * 60)) / 1000)

    return { days, hours, minutes, seconds }
  }

  public get remainingAmount(): Amount<Token> {
    if (!this.isStarted) return this._remainingAmount
    if (this.status === FuroStatus.CANCELLED)
      return Amount.fromRawAmount(this.token, 0)
    return this._remainingAmount.subtract(this._balance)
  }

  public get isStarted(): boolean {
    return this.startTime.getTime() <= Date.now()
  }

  public get isCancelled(): boolean {
    return this.status === FuroStatus.CANCELLED
  }
  public get isEnded(): boolean {
    return this.isCancelled || this.endTime.getTime() <= Date.now()
  }

  private setStatus(status: FuroStatus): FuroStatus {
    if (status === FuroStatus.CANCELLED) return status
    if (!this.isStarted) return FuroStatus.UPCOMING
    if (status === FuroStatus.EXTENDED) return status
    if (this.isEnded) return FuroStatus.COMPLETED
    return status
  }

  public canCancel(account: string | undefined): boolean {
    if (this.isCancelled) return false
    if (this.isEnded) return false
    if (!account) return false
    return this.createdBy.id.toLowerCase() === account.toLowerCase()
  }

  public canTransfer(account: string | undefined): boolean {
    if (this.isCancelled) return false
    if (!account) return false
    return this.recipient.id.toLowerCase() === account.toLowerCase()
  }

  public canWithdraw(account: string | undefined): boolean {
    if (this.isCancelled) return false
    if (!account) return false
    return (
      this.recipient.id.toLowerCase() === account.toLowerCase() &&
      this.isStarted
    )
  }

  public canUpdate(account: string | undefined): boolean {
    if (this.isCancelled) return false
    if (!account) return false
    return this.createdBy.id.toLowerCase() === account.toLowerCase()
  }
}
