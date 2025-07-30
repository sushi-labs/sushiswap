import type { TimeDuration } from '@orbs-network/twap-sdk'
import { type TransactionReceipt, decodeEventLog } from 'viem'
import { twapAbi_orderCreated } from './abi/twapAbi_orderCreated'

export const fillDelayText = (_value?: number | TimeDuration) => {
  if (!_value) {
    return ''
  }

  const value = typeof _value === 'object' ? getTimeDurationMs(_value) : _value

  const secondsTotal = Math.floor(value / 1000)
  const days = Math.floor(secondsTotal / (24 * 60 * 60))
  const hours = Math.floor((secondsTotal % (24 * 60 * 60)) / (60 * 60))
  const minutes = Math.floor((secondsTotal % (60 * 60)) / 60)
  const seconds = secondsTotal % 60

  const arr: string[] = []

  if (days) {
    arr.push(`${days} day${days !== 1 ? 's' : ''}`)
  }
  if (hours) {
    arr.push(`${hours} hour${hours !== 1 ? 's' : ''}`)
  }
  if (minutes) {
    arr.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`)
  }
  if (seconds) {
    arr.push(`${seconds} second${seconds !== 1 ? 's' : ''}`)
  }

  return arr.join(' ')
}

export const getTimeDurationMs = (duration?: TimeDuration) => {
  if (!duration) return 0
  return duration.value * duration.unit
}

export function getOrderIdFromCreateOrderEvent(receipt: TransactionReceipt) {
  try {
    const decodedLog = decodeEventLog({
      abi: twapAbi_orderCreated,
      data: receipt.logs[0].data,
      topics: receipt.logs[0].topics,
      eventName: 'OrderCreated',
    })

    return Number(decodedLog.args.id)
  } catch (_) {
    return undefined
  }
}
