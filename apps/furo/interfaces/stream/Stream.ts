import { BigNumber } from 'ethers'
import { RawStream, StreamStatus, Token, User } from './types'

export class Stream {
  public readonly id: string
  public readonly status: StreamStatus
  public readonly amount: BigNumber
  public readonly withdrawnAmount: BigNumber
  public readonly startTime: Date
  public readonly endTime: Date
  public readonly modifiedAtTimestamp: Date
  public readonly recipient: User
  public readonly createdBy: User
  public readonly token: Token

  public constructor({ rawStream }: { rawStream: RawStream }) {
    this.id = rawStream.id
    this.status = rawStream.status
    this.amount = BigNumber.from(rawStream.amount)
    this.withdrawnAmount = BigNumber.from(rawStream.withdrawnAmount)
    this.startTime = new Date(parseInt(rawStream.expiresAt) * 1000)
    this.endTime = new Date(parseInt(rawStream.startedAt) * 1000)
    this.modifiedAtTimestamp = new Date(parseInt(rawStream.modifiedAtTimestamp) * 1000)
    this.recipient = rawStream.recipient
    this.createdBy = rawStream.createdBy
    this.token = rawStream.token
  }


  public get remainingTime(): { days: number; hours: number; minutes: number; seconds: number } | undefined {
    if (this.status !== StreamStatus.CANCELLED) {
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



}
