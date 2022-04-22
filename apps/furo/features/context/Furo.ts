import { BigNumber } from 'ethers'
import { Decimal } from 'math'
import { FuroRepresentation, Status, TokenRepresentation, UserRepresentation } from './representations'

export abstract class Furo {
  public readonly id: string
  public readonly status: Status
  public readonly amount: BigNumber
  public readonly withdrawnAmount: BigNumber
  public readonly startTime: Date
  public readonly endTime: Date
  public readonly modifiedAtTimestamp: Date
  public readonly recipient: UserRepresentation
  public readonly createdBy: UserRepresentation
  public readonly token: TokenRepresentation

  public constructor({ furo }: { furo: FuroRepresentation }) {
    this.id = furo.id
    this.status = Status[furo.status]
    this.amount = BigNumber.from(furo.totalAmount)
    this.withdrawnAmount = BigNumber.from(furo.withdrawnAmount)
    this.startTime = new Date(parseInt(furo.startedAt) * 1000)
    this.endTime = new Date(parseInt(furo.expiresAt) * 1000)
    this.modifiedAtTimestamp = new Date(parseInt(furo.modifiedAtTimestamp) * 1000)
    this.recipient = furo.recipient
    this.createdBy = furo.createdBy
    this.token = furo.token
  }

  public get remainingTime(): { days: number; hours: number; minutes: number; seconds: number } | undefined {
    if (this.status !== Status.CANCELLED) {
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
    if (this.status === Status.ACTIVE) {
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
    const now = this.status !== Status.CANCELLED ? Date.now() : new Date(this.modifiedAtTimestamp).getTime()

    const interval = now - this.startTime.getTime()

    let days = Math.floor(interval / (1000 * 60 * 60 * 24))
    let hours = Math.floor((interval % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    let minutes = Math.floor((interval % (1000 * 60 * 60)) / (1000 * 60))
    let seconds = Math.floor((interval % (1000 * 60)) / 1000)

    return { days, hours, minutes, seconds }
  }

  /**
   * Returns streamed percentage in decimals, e.g. 0.562
   */
  public get streamedPercentage(): number {
    if (!this.isStarted) return 0
    const now = this.status !== Status.CANCELLED ? Date.now() : this.modifiedAtTimestamp.getTime()
    const total = this.endTime.getTime() - this.startTime.getTime()
    const current = now - this.startTime.getTime()
    return current / total
  }

  public get withdrawnPercentage(): number {
    return Decimal(this.withdrawnAmount.toString()) / Decimal(this.amount.toString())
  }

  public get isStarted(): boolean {
    return (this.startTime.getTime() <= Date.now())
  }
}
