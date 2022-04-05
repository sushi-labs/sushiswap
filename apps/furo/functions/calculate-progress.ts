import { BigNumber } from 'ethers'
import { Decimal } from 'math'
import { Stream, StreamStatus } from '../interfaces/stream'


export function calculateTimePassed(stream: Stream): string {
  const start = new Date(parseInt(stream.startedAt)).getTime()

  const end = new Date(parseInt(stream.expiresAt)).getTime()
  const now =
    stream.status !== StreamStatus.CANCELLED
      ? Date.now() / 1000
      : new Date(parseInt(stream.modifiedAtTimestamp)).getTime()

  const total = end - start
  const current = now - start
  return (current / total).toFixed(4)
}

export function calculateWithdrawnPercentage(stream: Stream): string {
  const withdrawn = Decimal(stream.withdrawnAmount)
  const amount =  Decimal(stream.amount)
  return (withdrawn / amount).toFixed(4)
}
