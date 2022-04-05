import { BigNumber } from 'ethers'
import { Decimal } from 'math'
import { RawStream, StreamStatus } from '../features/stream/context/types'


export function calculateStreamedPercentage(stream: RawStream): number {
  const start = new Date(parseInt(stream.startedAt)).getTime()

  const end = new Date(parseInt(stream.expiresAt)).getTime()
  const now =
    stream.status !== StreamStatus.CANCELLED
      ? Date.now() / 1000
      : new Date(parseInt(stream.modifiedAtTimestamp)).getTime()

  const total = end - start
  const current = now - start
  return (current / total)
}

export function calculateWithdrawnPercentage(stream: RawStream): number {
  const withdrawn = Decimal(stream.withdrawnAmount)
  const amount =  Decimal(stream.amount)
  return (withdrawn / amount)
}
