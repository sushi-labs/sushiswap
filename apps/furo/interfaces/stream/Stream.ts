import { BigNumber } from 'ethers'
import { calculateStreamedPercentage, calculateWithdrawnPercentage } from '../../functions'
import { RawStream, StreamStatus, Token, User } from './types'

export class Stream {
  public readonly id: string
  public readonly status: StreamStatus
  public readonly amount: BigNumber
  public readonly withdrawnAmount: BigNumber
  public readonly startTime: Date
  public readonly endTime: Date
  public readonly modifiedAtTimestamp: Date
  public readonly streamedPercentage: number
  public readonly withdrawnPercentage: number
  public readonly recipient: User
  public readonly createdBy: User
  public readonly token: Token

  public constructor({ stream }: { stream: RawStream }) {
    this.id = stream.id
    this.status = StreamStatus[stream.status]
    this.amount = BigNumber.from(stream.amount)
    this.withdrawnAmount = BigNumber.from(stream.withdrawnAmount)
    this.startTime = new Date(parseInt(stream.startedAt) * 1000)
    this.endTime = new Date(parseInt(stream.expiresAt) * 1000)
    this.modifiedAtTimestamp = new Date(parseInt(stream.modifiedAtTimestamp) * 1000)
    this.streamedPercentage = calculateStreamedPercentage(stream)
    this.withdrawnPercentage = calculateWithdrawnPercentage(stream)
    this.recipient = stream.recipient
    this.createdBy = stream.createdBy
    this.token = stream.token
  }


  public get remainingTime(): { days: number; hours: number; minutes: number; seconds: number } | undefined {
    if (this.status !== StreamStatus.CANCELLED) {
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



}
