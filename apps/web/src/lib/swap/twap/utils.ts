import type { TimeDuration } from '@orbs-network/twap-sdk'

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
    arr.push(`${days} days`)
  }
  if (hours) {
    arr.push(`${hours} hours`)
  }
  if (minutes) {
    arr.push(`${minutes} minutes`)
  }
  if (seconds) {
    arr.push(`${seconds} seconds`)
  }

  return arr.join(' ')
}

export const getTimeDurationMs = (duration?: TimeDuration) => {
  if (!duration) return 0
  return duration.value * duration.unit
}
